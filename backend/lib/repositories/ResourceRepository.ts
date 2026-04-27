import { BaseRepository } from './BaseRepository';
import { IRepository } from '../interfaces/IRepository';
import { Resource } from '../models/Resource';
import { User } from '../models/User';
import { Prisma } from '@prisma/client';

export interface ResourceQueryOptions {
  page: number;
  pageSize: number;
  search?: string;
  semester?: string;
  subject?: string;
  resourceType?: string;
  tags?: string[];
  uploadedById: string;
}

export interface ResourceCreateInput {
  title: string;
  description?: string;
  semester?: string;
  subject?: string;
  resourceType: Prisma.ResourceType;
  mimeType: string;
  fileUrl: string;
  filePath: string;
  fileSize: number;
  uploadedById: string;
  categoryName?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  sourceHash?: string;
}

export class ResourceRepository extends BaseRepository<Resource> implements IRepository<Resource> {
  private toModel(
    resource: Prisma.ResourceGetPayload<{
      include: {
        uploadedBy: {
          select: {
            id: true;
            name: true;
            email: true;
            role: true;
            createdAt: true;
            updatedAt: true;
          };
        };
        category: true;
        tags: true;
      };
    }>
  ): Resource {
    const user = new User(
      resource.uploadedBy.id,
      resource.uploadedBy.email,
      resource.uploadedBy.name,
      resource.uploadedBy.role as 'STUDENT' | 'ADMIN',
      resource.uploadedBy.createdAt,
      resource.uploadedBy.updatedAt
    );

    return new Resource(
      resource.id,
      resource.title,
      resource.description,
      resource.semester,
      resource.subject,
      resource.resourceType,
      resource.mimeType,
      resource.fileUrl,
      resource.filePath,
      resource.fileSize,
      resource.uploadedById,
      user,
      resource.category
        ? {
            id: resource.category.id,
            name: resource.category.name,
            description: resource.category.description,
          }
        : null,
      (resource.tags || []).map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      resource.processingStatus,
      resource.extractedText,
      resource.sourceHash,
      (resource.metadata as Record<string, unknown> | null) || null,
      resource.createdAt,
      resource.updatedAt
    );
  }

  private buildWhere(options: Omit<ResourceQueryOptions, 'page' | 'pageSize'>): Prisma.ResourceWhereInput {
    const normalizedTags = (options.tags || [])
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    return {
      uploadedById: options.uploadedById,
      ...(options.semester
        ? {
            semester: {
              contains: options.semester,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(options.subject
        ? {
            subject: {
              contains: options.subject,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(options.resourceType ? { resourceType: options.resourceType as Prisma.ResourceType } : {}),
      ...(normalizedTags.length > 0
        ? {
            tags: {
              some: {
                name: {
                  in: normalizedTags,
                },
              },
            },
          }
        : {}),
      ...(options.search
        ? {
            OR: [
              { title: { contains: options.search, mode: 'insensitive' } },
              { description: { contains: options.search, mode: 'insensitive' } },
              { subject: { contains: options.search, mode: 'insensitive' } },
              {
                tags: {
                  some: {
                    name: { contains: options.search, mode: 'insensitive' },
                  },
                },
              },
            ],
          }
        : {}),
    };
  }

  async findById(id: string): Promise<Resource | null> {
    await this.initialize();
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    if (!resource) {
      return null;
    }

    return this.toModel(resource);
  }

  async findAll(): Promise<Resource[]> {
    await this.initialize();
    const resources = await this.prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return resources.map((resource) => this.toModel(resource));
  }

  async create(data: Partial<Resource>): Promise<Resource> {
    await this.initialize();

    const input = data as unknown as ResourceCreateInput;
    const normalizedTags = (input.tags || [])
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    let categoryId: string | null = null;
    if (input.categoryName?.trim()) {
      const categoryName = input.categoryName.trim();
      const category = await this.prisma.resourceCategory.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName },
        select: { id: true },
      });
      categoryId = category.id;
    }

    const resource = await this.prisma.resource.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        semester: input.semester?.trim() || null,
        subject: input.subject?.trim() || null,
        resourceType: input.resourceType,
        mimeType: input.mimeType,
        fileUrl: input.fileUrl,
        filePath: input.filePath,
        fileSize: input.fileSize,
        uploadedById: input.uploadedById,
        sourceHash: input.sourceHash || null,
        metadata: (input.metadata as Prisma.InputJsonValue | undefined) || undefined,
        ...(categoryId ? { categoryId } : {}),
        ...(normalizedTags.length > 0
          ? {
              tags: {
                connectOrCreate: normalizedTags.map((tag) => ({
                  where: { name: tag },
                  create: { name: tag },
                })),
              },
            }
          : {}),
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return this.toModel(resource);
  }

  async update(id: string, data: Partial<Resource>): Promise<Resource> {
    await this.initialize();

    const resource = await this.prisma.resource.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.semester !== undefined ? { semester: data.semester } : {}),
        ...(data.subject !== undefined ? { subject: data.subject } : {}),
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return this.toModel(resource);
  }

  async delete(id: string): Promise<void> {
    await this.initialize();
    await this.prisma.resource.delete({ where: { id } });
  }

  async listWithFilters(options: ResourceQueryOptions): Promise<{ resources: Resource[]; total: number }> {
    await this.initialize();

    const where = this.buildWhere({
      uploadedById: options.uploadedById,
      search: options.search,
      semester: options.semester,
      subject: options.subject,
      resourceType: options.resourceType,
      tags: options.tags,
    });

    const skip = (options.page - 1) * options.pageSize;

    const [resources, total] = await Promise.all([
      this.prisma.resource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: options.pageSize,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          category: true,
          tags: true,
        },
      }),
      this.prisma.resource.count({ where }),
    ]);

    return {
      resources: resources.map((resource) => this.toModel(resource)),
      total,
    };
  }

  async getDistinctValues(
    field: 'semester' | 'subject',
    uploadedById: string,
    query: string = ''
  ): Promise<(string | null)[]> {
    await this.initialize();

    const resources = await this.prisma.resource.findMany({
      where: {
        uploadedById,
        ...(query
          ? {
              [field]: {
                contains: query,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        [field]: true,
      },
      distinct: [field as 'semester' | 'subject'],
      orderBy: {
        [field]: 'asc',
      },
      take: 20,
    });

    return resources.map((r) => r[field as 'semester' | 'subject']).filter((v) => v) as (string | null)[];
  }
}
