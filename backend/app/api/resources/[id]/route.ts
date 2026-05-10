import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ResponseBuilder } from '@/lib/utils/ResponseBuilder';
import { ResourceService } from '@/lib/services/ResourceService';

function toStatus(message: string): number {
  if (message === 'Resource not found') return 404;
  if (message === 'Forbidden') return 403;
  return 500;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return ResponseBuilder.unauthorized('Unauthorized');
    }

    const { id } = await params;
    const service = new ResourceService();
    const resource = await service.getResourceById(id, user.id);

    return ResponseBuilder.success({ resource: resource.toJSON() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch resource';
    console.error('Error getting resource:', error);
    return ResponseBuilder.error(message, toStatus(message));
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return ResponseBuilder.unauthorized('Unauthorized');
    }

    const { id } = await params;
    const service = new ResourceService();
    await service.deleteResource(id, user.id);

    return ResponseBuilder.success({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete resource';
    console.error('Error deleting resource:', error);
    return ResponseBuilder.error(message, toStatus(message));
  }
}
