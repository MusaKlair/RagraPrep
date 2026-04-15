'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

interface UserManagementClientProps {
  userId: string;
  userRole: 'STUDENT' | 'ADMIN';
  currentUserId: string;
}

export default function UserManagementClient({
  userId,
  userRole,
  currentUserId,
}: UserManagementClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!confirm('Are you sure you want to make this user an admin?')) {
      return;
    }

    setIsUpdatingRole(true);
    try {
      await axios.put(`/api/users/${userId}`, { role: 'ADMIN' });
      toast.success('User role updated to Admin');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user role');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const isCurrentUser = userId === currentUserId;

  return (
    <div className="flex items-center justify-end gap-4">
      {userRole === 'STUDENT' && (
        <button
          onClick={handleMakeAdmin}
          disabled={isUpdatingRole || isCurrentUser}
          className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Elevate privileges"
        >
          {isUpdatingRole ? 'UPDATING...' : '[MAKE_ADMIN]'}
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isDeleting || isCurrentUser}
        className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Purge user"
      >
        {isDeleting ? 'PURGING...' : '[PURGE]'}
      </button>
    </div>
  );
}

