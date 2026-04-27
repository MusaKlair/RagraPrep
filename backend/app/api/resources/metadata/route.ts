import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/utils/ResponseBuilder';
import { ResourceService } from '@/lib/services/ResourceService';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return ResponseBuilder.unauthorized('Unauthorized');
    }

    const { searchParams } = new URL(request.url);
    const semesterQuery = searchParams.get('semester') || '';
    const subjectQuery = searchParams.get('subject') || '';

    const service = new ResourceService();
    const metadata = await service.getResourceMetadata(user.id, {
      semesterQuery,
      subjectQuery,
    });

    return ResponseBuilder.success(metadata);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching resource metadata:', error);
    return ResponseBuilder.error('Failed to fetch metadata', 500, message);
  }
}
