"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { updateUser } from "@/lib/update-user";
import { useAuth } from "@/app/auth/auth-context";
import { useToast } from "@/components/hooks/use-toast";
import { Switch } from "../ui/switch";

interface AdminEditUserModalProps extends React.HTMLProps<HTMLDivElement> {
  showModal?: boolean;
  setShowModal: (show: boolean) => void;
  user: { id: string; username: string; email: string, isAdmin: boolean } | undefined;
  onUserUpdate: () => void;
}

const AdminEditUserModal: React.FC<AdminEditUserModalProps> = ({
  ...props
}) => {
  const auth = useAuth();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<
    | {
        id?: string;
        username?: string;
        email?: string;
        isAdmin?: boolean;
      }
    | undefined
  >();

  useEffect(() => {
    setEditingUser(props?.user);
  }, [props.user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    updateUserInfo().then(() => updateUserPrivilege());

    // Remove old states, update UI and close modal
    setEditingUser(undefined);
    props.onUserUpdate();
    props.setShowModal(false);
  };

  const updateUserInfo = async () => {
    if (!auth?.token) {
      // Will not reach this point as button is disabled
      // when token is missing
      toast({
        title: "Access denied",
        description: "No authentication token found",
      });
      return;
    }

    if (!editingUser?.id) {
      // Will not reach this point as button is disabled
      // when editing user's id is missing
      toast({
        title: "Invalid selection",
        description: "No user selected",
      });
      return;
    }

    const response = await updateUser(
      auth.token,
      editingUser.id,
      editingUser?.username,
      editingUser?.email
    );
    if (!response.ok) {
      toast({
        title: "Unknown Error",
        description: "An unexpected error has occurred",
      });
    }
    switch (response.status) {
      case 200:
        toast({
          title: "Success",
          description: "User updated successfully!",
        });
        break;
      case 400:
        // In theory, they should never be able to send out a request
        // with missing fields due to disabled submission button
        toast({
          title: "Missing Fields",
          description: "Please fill in at least 1 field",
        });
        return;
      case 401:
        toast({
          title: "Access denied",
          description: "Invalid session",
        });
        return;
      case 403:
        toast({
          title: "Access denied",
          description: "Only admins can update other user",
        });
        return;
      case 404:
        toast({
          title: "User not found",
          description: "User with specified ID not found",
        });
        return;
      case 409:
        toast({
          title: "Duplicated Username or Email",
          description: "The username or email you entered is already in use",
        });
        return;
      case 500:
        toast({
          title: "Server Error",
          description: "The server encountered an error",
        });
        return;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occured",
        });
        return;
    }
  };

  const updateUserPrivilege = async () => {

  };

  return (
    <>
      {props.showModal && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit user</DialogTitle>
            </DialogHeader>
            <form>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="username">Username</Label>
                </div>
                <Input
                  id="username"
                  placeholder={props.user?.username}
                  value={editingUser?.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2 mt-5">
                <div className="flex items-center">
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder={props.user?.email}
                  value={editingUser?.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2 mt-5">
              <div className="flex items-center">
                <Label htmlFor="email">Admin</Label>
                </div>
                <Switch
                  checked={editingUser?.isAdmin}
                  onCheckedChange={(e) => setEditingUser({ ...editingUser, isAdmin: e })}
                  required
                />
              </div>
            </form>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={
                  !auth?.token ||
                  !editingUser?.id ||
                  (!editingUser?.email && !editingUser?.username)
                }
              >
                Save changes
              </Button>
              <Button onClick={() => props.setShowModal(false)}>Exit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminEditUserModal;
