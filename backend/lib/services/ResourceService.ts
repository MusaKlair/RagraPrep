import { createHash, randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { ResourceType } from '@prisma/client';
import { ResourceRepository, ResourceQueryOptions } from '../repositories/ResourceRepository';
import { Resource } from '../models/Resource';
import { supabase } from '../supabase';

const DEFAULT_MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_MIME_TYPES: Record<string, ResourceType> = {
  'application/pdf': ResourceType.PDF,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ResourceType.PPTX,
};

const MIME_EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};

const LOCAL_RESOURCE_ROUTE = '/resource-files';
const LOCAL_RESOURCE_ROOT = path.join(process.cwd(), 'public', 'resource-files');

export interface ResourceListFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  semester?: string;
  subject?: string;
  resourceType?: string;
  tags?: string[];
}

export interface ResourceUploadInput {
  title: string;
  description?: string;
  semester?: string;
  subject?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  file: File;
  uploadedById: string;
}

export class ResourceService {
  private readonly repository: ResourceRepository;

  constructor(repository?: ResourceRepository) {
    this.repository = repository || new ResourceRepository();
  }

  private parsePositiveNumber(value: number | undefined, fallback: number): number {
    if (!value || Number.isNaN(value)) {
      return fallback;
    }

    return value > 0 ? value : fallback;
  }

  private resolveResourceType(mimeType: string): ResourceType {
    const type = ALLOWED_MIME_TYPES[mimeType];
    if (!type) {
      throw new Error('Unsupported file type. Only PDF and PPTX are allowed.');
    }
    return type;
  }

  private ensureFile(file: File): void {
    if (!file) {
      throw new Error('File is required.');
    }

    if (!file.size) {
      throw new Error('Empty file uploads are not allowed.');
    }

    if (file.size > DEFAULT_MAX_FILE_SIZE) {
      throw new Error('File exceeds size limit of 25MB.');
    }

    this.resolveResourceType(file.type);
  }

  private buildSafeStoragePath(uploadedById: string, mimeType: string): string {
    const ext = MIME_EXTENSIONS[mimeType] || 'bin';
    const now = new Date();
    const dateFolder = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

    return `resources/${uploadedById}/${dateFolder}/${Date.now()}-${randomUUID()}.${ext}`;
  }

  private normalizeTags(tags?: string[]): string[] {
    return (tags || [])
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 20);
  }

  private getPublicBaseUrl(): string {
    return process.env.BACKEND_PUBLIC_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  }

  private getLocalResourceUrl(filePath: string): string {
    return `${this.getPublicBaseUrl()}${LOCAL_RESOURCE_ROUTE}/${filePath}`;
  }

  private async saveLocalResource(filePath: string, buffer: Buffer): Promise<string> {
    const absolutePath = path.join(LOCAL_RESOURCE_ROOT, filePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, buffer);
    return absolutePath;
  }

  private async removeLocalResource(filePath: string): Promise<void> {
    const absolutePath = path.join(LOCAL_RESOURCE_ROOT, filePath);
    try {
      await unlink(absolutePath);
    } catch {
      // Ignore missing local files so deletes stay idempotent.
    }
  }

  async listResources(userId: string, filters: ResourceListFilters): Promise<{
    resources: Record<string, unknown>[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = this.parsePositiveNumber(filters.page, 1);
    const pageSize = Math.min(this.parsePositiveNumber(filters.pageSize, 12), 50);

    const options: ResourceQueryOptions = {
      page,
      pageSize,
      uploadedById: userId,
      search: filters.search?.trim() || undefined,
      semester: filters.semester?.trim() || undefined,
      subject: filters.subject?.trim() || undefined,
      resourceType: filters.resourceType?.trim() || undefined,
      tags: this.normalizeTags(filters.tags),
    };

    const { resources, total } = await this.repository.listWithFilters(options);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      resources: resources.map((resource) => resource.toJSON()),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async getResourceById(id: string, userId: string): Promise<Resource> {
    const resource = await this.repository.findById(id);

    if (!resource) {
      throw new Error('Resource not found');
    }

    if (!resource.belongsTo(userId)) {
      throw new Error('Forbidden');
    }

    return resource;
  }

  async uploadResource(input: ResourceUploadInput): Promise<Resource> {
    this.ensureFile(input.file);

    if (!input.title || !input.title.trim()) {
      throw new Error('Title is required.');
    }

    const resourceType = this.resolveResourceType(input.file.type);
    const filePath = this.buildSafeStoragePath(input.uploadedById, input.file.type);

    const buffer = Buffer.from(await input.file.arrayBuffer());
    const sourceHash = createHash('sha256').update(buffer).digest('hex');

    const bucketName = process.env.BUCKET_NAME || 'musa-bucket';
    const baseMetadata = {
      ...(input.metadata || {}),
    };

    let fileUrl: string;
    let storageProvider: 'supabase' | 'local' = 'supabase';

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, buffer, {
      contentType: input.file.type,
      upsert: false,
    });

    if (uploadError) {
      console.warn(`Supabase upload failed for ${filePath}, falling back to local storage: ${uploadError.message}`);
      await this.saveLocalResource(filePath, buffer);
      fileUrl = this.getLocalResourceUrl(filePath);
      storageProvider = 'local';
    } else {
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      fileUrl = publicUrl;
    }

    return this.repository.create({
      title: input.title.trim(),
      description: input.description?.trim(),
      semester: input.semester?.trim(),
      subject: input.subject?.trim(),
      resourceType,
      mimeType: input.file.type,
      fileUrl,
      filePath,
      fileSize: input.file.size,
      uploadedById: input.uploadedById,
      categoryName: input.category?.trim(),
      tags: this.normalizeTags(input.tags),
      metadata: {
        ...baseMetadata,
        storageProvider,
        publicUrl: fileUrl,
      },
      sourceHash,
    } as Partial<Resource>);
  }

  async deleteResource(id: string, userId: string): Promise<void> {
    const resource = await this.getResourceById(id, userId);

    const metadata = resource.metadata && typeof resource.metadata === 'object' ? resource.metadata : null;
    const storageProvider = metadata && 'storageProvider' in metadata ? String(metadata.storageProvider) : 'supabase';

    if (storageProvider === 'local') {
      await this.removeLocalResource(resource.filePath);
    } else {
      const bucketName = process.env.BUCKET_NAME || 'musa-bucket';
      const { error: removeError } = await supabase.storage.from(bucketName).remove([resource.filePath]);

      if (removeError) {
        throw new Error(`Failed to remove file from storage: ${removeError.message}`);
      }
    }

    await this.repository.delete(id);
  }

  async getResourceMetadata(
    userId: string,
    query: {
      semesterQuery?: string;
      subjectQuery?: string;
    }
  ): Promise<{
    semesters: string[];
    subjects: string[];
  }> {
    const { semesterQuery = '', subjectQuery = '' } = query;

    const semesters = await this.repository.getDistinctValues('semester', userId, semesterQuery);
    const subjects = await this.repository.getDistinctValues('subject', userId, subjectQuery);

    return {
      semesters: semesters.filter(Boolean) as string[],
      subjects: subjects.filter(Boolean) as string[],
    };
  }
}
