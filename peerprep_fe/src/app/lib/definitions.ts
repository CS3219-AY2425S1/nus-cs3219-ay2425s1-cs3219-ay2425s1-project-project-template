export type FormState =
  | {
      errors?: {
        name?: string;
        email?: string;
        password?: string;
        errorMessage?: string;
      };
      message?: string;
    }
  | undefined;
