'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardNav from '@/components/DashboardNav';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      if (data.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;

    if (!window.confirm('WARNING: Initiate password reset protocol? Authentication link will be dispatched.')) {
      return;
    }

    setResettingPassword(true);
    try {
      const { data } = await axios.post('/api/auth/forgot-password', {
        email: user.email,
      });

      if (data.success) {
        toast.success('Protocol Initiated: Check secure inbox');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to dispatch reset protocol');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All parameters required for key exchange');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Key strength insufficient: Minimum 6 chars');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Key mismatch detected');
      return;
    }

    setChangingPassword(true);
    try {
      const { data } = await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (data.success) {
        toast.success('Authentication key updated');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Key exchange failed');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 animate-pulse">Accessing Node Configuration...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
      <DashboardNav />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12 border-b border-neutral-200 pb-6">
          <div className="font-mono text-[9px] text-emerald-600 uppercase tracking-[0.2em] font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Node Configuration
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-neutral-900 mb-2">
            System Settings
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 max-w-2xl">
            Manage local node authentication and operational parameters.
          </p>
        </div>

        <div className="space-y-8 bg-white border border-neutral-300 shadow-xl p-8 max-w-2xl">

          {/* Account Information Panel */}
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 pb-4">
              <div className="w-2 h-2 bg-[#111111]" />
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-900">Identity Parameters</h2>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12">
                <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 w-32">
                  Node Email
                </label>
                <p className="font-mono text-sm text-neutral-900">{user.email}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12">
                <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 w-32">
                  Operator Name
                </label>
                <p className="font-mono text-sm text-neutral-900">{user.name || 'UNALLOCATED'}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12">
                <label className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 w-32">
                  Clearance Level
                </label>
                <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 ${user.role === 'ADMIN'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  }`}>
                  [{user.role}]
                </span>
              </div>
            </div>
          </div>

          {/* Authentication Security Panel */}
          <div className="pt-8 border-t border-neutral-200">
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 pb-4">
              <div className="w-2 h-2 bg-[#111111]" />
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-900">Security Protocols</h2>
            </div>

            <div className="space-y-8">

              {/* Change Password Block */}
              <div className="flex flex-col items-start gap-4 p-6 border border-neutral-200 bg-[#FAFAFA]">
                <div>
                  <h3 className="font-serif text-lg text-neutral-900 mb-1">Update Encryption Key</h3>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Rotate your local access credentials manually.</p>
                </div>

                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-6 py-2.5 bg-[#111111] text-white font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors border border-[#111111]"
                  >
                    Initiate Key Exchange
                  </button>
                ) : (
                  <form onSubmit={handleChangePassword} className="w-full space-y-4 mt-2 pt-4 border-t border-neutral-200">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-600 mb-2">
                        Current Key
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white border border-neutral-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-600 mb-2">
                          New Key
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full px-4 py-3 bg-white border border-neutral-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-600 mb-2">
                          Verify Key
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full px-4 py-3 bg-white border border-neutral-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="flex-1 px-4 py-2.5 bg-white text-neutral-600 font-mono text-[10px] uppercase tracking-widest hover:text-neutral-900 hover:bg-[#FAFAFA] transition-colors border border-neutral-300"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="flex-[2] px-4 py-2.5 bg-[#111111] text-white font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors disabled:opacity-50 border border-[#111111] flex items-center justify-center gap-2"
                      >
                        {changingPassword ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Processing...
                          </>
                        ) : (
                          'Confirm Key Exchange'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Emergency Reset Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-neutral-200">
                <div>
                  <h3 className="font-serif text-lg text-neutral-900 mb-1">Emergency Reset Protocol</h3>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Dispatch a secure key-reset link to registered email.</p>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={resettingPassword}
                  className="px-6 py-2.5 bg-white text-neutral-900 font-mono text-[10px] uppercase tracking-widest hover:bg-neutral-50 transition-colors border border-neutral-300 disabled:opacity-50"
                >
                  {resettingPassword ? 'Dispatching...' : 'Dispatch Protocol'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
