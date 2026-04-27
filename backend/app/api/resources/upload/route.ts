import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/utils/ResponseBuilder';
import { ResourceService } from '@/lib/services/ResourceService';

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (!raw) return [];

  const value = String(raw).trim();
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((tag) => String(tag).trim()).filter(Boolean);
    }
  } catch {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return ResponseBuilder.unauthorized('Unauthorized');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return ResponseBuilder.badRequest('File is required');
    }

    const metadataRaw = formData.get('metadata');
    let metadata: Record<string, unknown> | undefined;

    if (metadataRaw) {
      try {
        metadata = JSON.parse(String(metadataRaw)) as Record<string, unknown>;
      } catch {
        return ResponseBuilder.badRequest('Invalid metadata format');
      }
    }

    const service = new ResourceService();
    const resource = await service.uploadResource({
      file,
      title: String(formData.get('title') || '').trim(),
      description: String(formData.get('description') || '').trim() || undefined,
      semester: String(formData.get('semester') || '').trim() || undefined,
      subject: String(formData.get('subject') || '').trim() || undefined,
      category: String(formData.get('category') || '').trim() || undefined,
      tags: parseTags(formData.get('tags')),
      metadata,
      uploadedById: user.id,
    });

    return ResponseBuilder.created({
      resource: resource.toJSON(),
      message: 'Resource uploaded successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload resource';
    console.error('Error uploading resource:', error);
    return ResponseBuilder.error(message, 500);
  }
}
