export interface UserInterviewMetadata {
  completedThisWeek: {
    interviewCount: number;
    dateRangeStart: Date;
    dateRangeEnd: Date;
  };
  latestInterview: {
    latestInterviewPartnerName: string;
    timeTakenFormatted: string; // Formatting to be done in backend
  };
}
