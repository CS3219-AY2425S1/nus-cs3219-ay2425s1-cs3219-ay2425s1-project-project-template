import type { QuestionAttempt } from "./QuestionAttempt";

export type UserProfile = {
    displayName?: string;
    email?: string;
    photoUrl?: string;
    attemptHistory?: QuestionAttempt[];
}