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
    const query = (searchParams.get('query') || '').trim();

    if (!query) {
      return ResponseBuilder.badRequest('Search query is required');
    }

    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '12');

    const service = new ResourceService();
    const data = await service.listResources(user.id, {
      page,
      pageSize,
      search: query,
      semester: searchParams.get('semester') || undefined,
      subject: searchParams.get('subject') || undefined,
      resourceType: searchParams.get('resourceType') || undefined,
      tags: parseTags(searchParams.get('tags')),
    });

    return ResponseBuilder.success({
      ...data,
      query,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error searching resources:', error);
    return ResponseBuilder.error('Failed to search resources', 500, message);
  }
}
