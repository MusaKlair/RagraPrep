import { User } from './User';

export interface ResourceTagData {
  id: string;
  name: string;
}

export interface ResourceCategoryData {
  id: string;
  name: string;
  description: string | null;
}

export class Resource {
  public id: string;
  public title: string;
  public description: string | null;
  public semester: string | null;
  public subject: string | null;
  public resourceType: string;
  public mimeType: string;
  public fileUrl: string;
  public filePath: string;
  public fileSize: number;
  public uploadedById: string;
  public uploadedBy: User;
  public category: ResourceCategoryData | null;
  public tags: ResourceTagData[];
  public processingStatus: string;
  public extractedText: string | null;
  public sourceHash: string | null;
  public metadata: Record<string, unknown> | null;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    title: string,
    description: string | null,
    semester: string | null,
    subject: string | null,
    resourceType: string,
    mimeType: string,
    fileUrl: string,
    filePath: string,
    fileSize: number,
    uploadedById: string,
    uploadedBy: User,
    category: ResourceCategoryData | null,
    tags: ResourceTagData[],
    processingStatus: string,
    extractedText: string | null,
    sourceHash: string | null,
    metadata: Record<string, unknown> | null,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.semester = semester;
    this.subject = subject;
    this.resourceType = resourceType;
    this.mimeType = mimeType;
    this.fileUrl = fileUrl;
    this.filePath = filePath;
    this.fileSize = fileSize;
    this.uploadedById = uploadedById;
    this.uploadedBy = uploadedBy;
    this.category = category;
    this.tags = tags;
    this.processingStatus = processingStatus;
    this.extractedText = extractedText;
    this.sourceHash = sourceHash;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public belongsTo(userId: string): boolean {
    return this.uploadedById === userId;
  }

  public isPdf(): boolean {
    return this.resourceType === 'PDF';
  }

  public isPptx(): boolean {
    return this.resourceType === 'PPTX';
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      semester: this.semester,
      subject: this.subject,
      resourceType: this.resourceType,
      mimeType: this.mimeType,
      fileUrl: this.fileUrl,
      filePath: this.filePath,
      fileSize: this.fileSize,
      uploadedById: this.uploadedById,
      uploadedBy: this.uploadedBy.toJSON(),
      category: this.category,
      tags: this.tags,
      processingStatus: this.processingStatus,
      extractedText: this.extractedText,
      sourceHash: this.sourceHash,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
