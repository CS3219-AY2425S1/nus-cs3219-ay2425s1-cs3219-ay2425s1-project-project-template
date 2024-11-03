import { z } from "zod";
import { ProficiencyEnum } from "./Proficiency";
import { LanguageEnum } from "./Languages";
import { RoleEnum } from "./Role";
import { createResponseSchema } from "./Response";

const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  roles: z.array(RoleEnum),
  proficiency: ProficiencyEnum,
  languages: z.array(LanguageEnum),
  isOnboarded: z.boolean(),
  //profilePictureUrl: z.string(),
});

const UserProfilesSchema = z.array(UserProfileSchema);

const UpdateUserProfileSchema = UserProfileSchema.omit({
  id: true,
  email: true,
  roles: true,
});

const UserProfileResponseSchema = createResponseSchema(UserProfileSchema);

type UserProfile = z.infer<typeof UserProfileSchema>;
type UserProfiles = z.infer<typeof UserProfilesSchema>;
type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

export {
  UserProfileSchema,
  UserProfilesSchema,
  UserProfileResponseSchema,
  UpdateUserProfileSchema,
  type UserProfile,
  type UserProfiles,
  type UserProfileResponse,
  type UpdateUserProfile,
};
