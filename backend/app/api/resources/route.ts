import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/utils/ResponseBuilder';
import { ResourceService } from '@/lib/services/ResourceService';

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return ResponseBuilder.unauthorized('Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '12');

    const service = new ResourceService();
    const data = await service.listResources(user.id, {
      page,
      pageSize,
      search: searchParams.get('search') || undefined,
      semester: searchParams.get('semester') || undefined,
      subject: searchParams.get('subject') || undefined,
      resourceType: searchParams.get('resourceType') || undefined,
      tags: parseTags(searchParams.get('tags')),
    });

    return ResponseBuilder.success(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error listing resources:', error);
    return ResponseBuilder.error('Failed to fetch resources', 500, message);
  }
}
