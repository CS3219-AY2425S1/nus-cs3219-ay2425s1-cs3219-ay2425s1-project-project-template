'use client';

import { ChangePasswordDto, changePasswordSchema } from '@repo/dtos/users';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useZodForm } from '@/lib/form';

interface ChangePasswordModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: ChangePasswordDto) => void;
  userId: string;
}

export default function ChangePasswordModal({
  open,
  setOpen,
  onSubmit,
  userId,
}: ChangePasswordModalProps) {
  const form = useZodForm({
    schema: changePasswordSchema,
    defaultValues: {
      id: userId,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleSubmit = (data: ChangePasswordDto) => {
    const updatedData: ChangePasswordDto = {
      ...data,
      id: userId,
    };
    onSubmit(updatedData);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        id: userId,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      form.reset();
      form.clearErrors();
    }
  }, [open, form, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Old Password Field */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Old Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter old password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">New password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">
                    Confirm new password
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new password again" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={Object.keys(form.formState.errors).length !== 0}
              >
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
