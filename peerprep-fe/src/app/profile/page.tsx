'use client';

import React, { FormEvent } from 'react';
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
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/state/useAuthStore';
import { axiosClient } from '@/network/axiosClient';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add form state
  const [formData, setFormData] = useState({
    username: user?.username,
    email: user?.email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Add form handlers
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    try {
      const result = await axiosClient.patch(`/users/${user.id}`, {
        email: formData.email,
        username: formData.username,
      });

      if (result.status === 200) {
        console.log('Profile update:', formData);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // You may want to add error state and display this to the user
      console.error('New password and confirm password do not match');
      return;
    }

    try {
      const result = await axiosClient.patch(`/users/${user.id}`, {
        password: passwordData.newPassword,
      });

      if (result.status === 200) {
        // You may want to add success state and display this to the user
        console.log('Password updated successfully');
        // Clear the password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      // You may want to add error state and display this to the user
      console.error('Failed to update password:', error);
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
              >
                Save Changes
              </Button>
            </form>
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
                <Input
                  id="current-password"
                  type="password"
                  className="border-slate-700 bg-slate-900 text-slate-200"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-slate-200">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className="border-slate-700 bg-slate-900 text-slate-200"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-200">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="border-slate-700 bg-slate-900 text-slate-200"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                type="submit"
                className="bg-[#4ADE80] text-slate-900 hover:bg-[#4ADE80]/90"
              >
                Update Password
              </Button>
            </form>
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
