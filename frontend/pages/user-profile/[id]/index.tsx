import { useTheme } from "next-themes";
import { useState } from "react";
import { useRouter } from "next/router";

import NavigationColumn from "@/components/users/NavigationColumn";
import UserProfileForm from "@/components/forms/UserProfileForm";
import DefaultLayout from "@/layouts/default";
import { useUser } from "@/hooks/users";
import { User, UserProfile } from "@/types/user";
import { useUpdateUser } from "@/hooks/api/users";

const UserProfilePage = () => {
  const { user, setUser } = useUser();
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = router.query;

  let colourTheme = "";

  if (theme === "light") {
    colourTheme =
      "flex h-full rounded-3xl bg-slate-100 divide-[#11181c]/25 divide-x ";
  } else {
    colourTheme =
      "flex h-full rounded-3xl bg-zinc-800 divide-[#ecedee]/25 divide-x ";
  }

  const [userProfileFormData, setUserProfileFormData] = useState<UserProfile>({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const { mutate: updateUser, isError, error } = useUpdateUser();

  const handleOnSubmit = (userProfileData: UserProfile) => {
    updateUser(
      { user: userProfileData, userId: id as string },
      {
        onSuccess: (data) => {
          const newUser: User = {
            id: data.id,
            username: data.username,
            email: data.email,
            isAdmin: data.isAdmin,
          };

          setUser(newUser);
          alert("Profile updated!");
        },
      },
    );
  };

  return (
    <>
      <DefaultLayout isLoggedIn={true}>
        <div className={colourTheme}>
          <div className="flex-1">
            <NavigationColumn />
          </div>
          <div className="flex-3 flex-[3]">
            <UserProfileForm
              formData={userProfileFormData}
              setFormData={setUserProfileFormData}
              onSubmit={handleOnSubmit}
            />
            {isError && (
              <p className="text-red-500 mt-4 text-center">{`${error?.message}. Please try again later.`}</p>
            )}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default UserProfilePage;
