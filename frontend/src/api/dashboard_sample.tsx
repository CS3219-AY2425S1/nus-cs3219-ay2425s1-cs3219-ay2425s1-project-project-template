import { UserInterviewMetadata } from "@/types/dashboard";

export const DashboardUserInterviewMetadataExample: UserInterviewMetadata = {
  completedThisWeek: {
    dateRangeStart: new Date(2024, 9, 16),
    dateRangeEnd: new Date(2024, 9, 22),
    interviewCount: 69,
  },
  latestInterview: {
    latestInterviewPartnerName: "Mai Ting",
    timeTakenFormatted: "3h 15 min", // Formatting to be done in backend
  },
};
