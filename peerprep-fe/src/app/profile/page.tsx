'use client';

import React, { FormEvent, useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/state/useAuthStore';
import { axiosClient } from '@/network/axiosClient';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user, setUser, clearAuth } = useAuthStore();
  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  // Ensure that the data is updated when user is fetched from store
  useEffect(() => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update error state to handle both error and success
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Add state for password visibility
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Add function to check if form data has changed
  const hasProfileChanges = () => {
    return (
      formData.username !== user?.username || formData.email !== user?.email
    );
  };

  // Add form handlers
  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!user) return;

    try {
      const result = await axiosClient.patch(`/users/${user.id}`, {
        email: formData.email,
        username: formData.username,
      });

      if (result.status === 200) {
        setProfileMessage({
          type: 'success',
          text: 'Profile updated successfully',
        });
        setUser({
          ...user,
          email: formData.email ?? user.email,
          username: formData.username ?? user.username,
        });

        // Clear message after 5 seconds
        setTimeout(() => {
          setProfileMessage(null);
        }, 5000);
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to update profile';
      setProfileMessage({ type: 'error', text: message });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: 'New password and confirm password do not match',
      });
      return;
    }

    try {
      const verifyResult = await axiosClient.post(
        `/auth/verify-password/${user.id}`,
        {
          password: passwordData.currentPassword,
        },
      );

      if (verifyResult.status !== 200) {
        throw new Error(verifyResult.data.message);
      }

      const result = await axiosClient.patch(`/users/${user.id}`, {
        password: passwordData.newPassword,
      });

      // throw error if result is not 200
      if (result.status !== 200) {
        throw new Error(result.data.message);
      }

      // Sucess state
      setPasswordMessage({
        type: 'success',
        text: 'Password updated successfully',
      });

      // reset the fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Clear message after 5 seconds
      setTimeout(() => {
        setPasswordMessage(null);
      }, 5000);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to update password';
      setPasswordMessage({ type: 'error', text: message });
    }
  };

  const handleDeleteAccount = async () => {
    const res = await axiosClient.delete(`/users/${user?.id}`);
    if (res.status === 200) {
      const res = await logout();

      if (res) {
        clearAuth();
        router.push('/');
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24 text-gray-100">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>

        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-200">
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  className="border-slate-700 bg-slate-900 text-slate-200"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className="border-slate-700 bg-slate-900 text-slate-200"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <Button
                type="submit"
                className="bg-[#4ADE80] text-slate-900 hover:bg-[#4ADE80]/90"
                disabled={!hasProfileChanges()}
              >
                Save Changes
              </Button>
            </form>
            {profileMessage && (
              <div
                className={`mt-2 text-sm ${profileMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}
              >
                {profileMessage.text}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-200">Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-slate-200">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    className="border-slate-700 bg-slate-900 text-slate-200"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        currentPassword: !prev.currentPassword,
                      }))
                    }
                  >
                    {showPasswords.currentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-slate-200">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    className="border-slate-700 bg-slate-900 text-slate-200"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        newPassword: !prev.newPassword,
                      }))
                    }
                  >
                    {showPasswords.newPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-200">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    className="border-slate-700 bg-slate-900 text-slate-200"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="bg-[#4ADE80] text-slate-900 hover:bg-[#4ADE80]/90"
              >
                Update Password
              </Button>
            </form>
            {passwordMessage && (
              <div
                className={`mt-2 text-sm ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}
              >
                {passwordMessage.text}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-900/10 bg-red-950/10">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-slate-400">
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-2 text-red-400">
                  <AlertCircle className="mt-0.5 h-5 w-5" />
                  <div className="text-sm">
                    This action cannot be undone. This will permanently delete
                    your account and remove all associated data from our
                    servers.
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteAccount}
                  >
                    Yes, delete my account
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-slate-100"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
