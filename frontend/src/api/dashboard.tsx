import { DashboardUserInterviewMetadataExample } from "@/api/dashboard_sample";
import { UserInterviewMetadata } from "@/types/dashboard";

export const getUserInterviewMetadata = (): UserInterviewMetadata => {
  return DashboardUserInterviewMetadataExample;
};
