-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('PDF', 'PPTX', 'DOCX', 'IMAGE', 'HANDWRITTEN', 'OTHER');

-- CreateEnum
CREATE TYPE "ResourceProcessingStatus" AS ENUM ('UPLOADED', 'PARSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "resource_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "semester" TEXT,
    "subject" TEXT,
    "resourceType" "ResourceType" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "categoryId" TEXT,
    "processingStatus" "ResourceProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "extractedText" TEXT,
    "sourceHash" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResourceToResourceTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResourceToResourceTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "resource_categories_name_key" ON "resource_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "resource_tags_name_key" ON "resource_tags"("name");

-- CreateIndex
CREATE INDEX "resources_uploadedById_idx" ON "resources"("uploadedById");

-- CreateIndex
CREATE INDEX "resources_semester_idx" ON "resources"("semester");

-- CreateIndex
CREATE INDEX "resources_subject_idx" ON "resources"("subject");

-- CreateIndex
CREATE INDEX "resources_resourceType_idx" ON "resources"("resourceType");

-- CreateIndex
CREATE INDEX "resources_processingStatus_idx" ON "resources"("processingStatus");

-- CreateIndex
CREATE INDEX "resources_title_idx" ON "resources"("title");

-- CreateIndex
CREATE INDEX "_ResourceToResourceTag_B_index" ON "_ResourceToResourceTag"("B");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "resource_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToResourceTag" ADD CONSTRAINT "_ResourceToResourceTag_A_fkey" FOREIGN KEY ("A") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToResourceTag" ADD CONSTRAINT "_ResourceToResourceTag_B_fkey" FOREIGN KEY ("B") REFERENCES "resource_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
