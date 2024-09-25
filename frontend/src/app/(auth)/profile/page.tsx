"use client";

import { useAuth } from "@/components/auth/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1>Profile</h1>
      <p>{user?.access_token}</p>
    </div>
  );
}

export default ProfilePage;