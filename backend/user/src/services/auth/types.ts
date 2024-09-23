import type { IServiceResponse } from '@/types';

//=============================================================================
// /auth/login
//=============================================================================

export type ILoginPayload = {
  username: string;
  password: string;
};

export type ILoginResponse = IServiceResponse<{
  cookie: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}>;

//=============================================================================
// /auth/logout
//=============================================================================
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ILogoutPayload = {};

//=============================================================================
// /auth/register (TBC)
//=============================================================================
export type IRegisterPayload = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
};

export type IRegisterResponse = IServiceResponse<{
  user: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}>;
// export type IRegisterResponse = Awaited<ReturnType<>>

//=============================================================================
// /auth/username-valid
//=============================================================================
export type IUsernameValidPayload = {
  username: string;
};

export type IUsernameValidResponse = IServiceResponse<{
  valid: boolean;
}>;

//=============================================================================
// /auth/email-valid
//=============================================================================
export type IEmailValidPayload = {
  email: string;
};

export type IEmailValidResponse = IServiceResponse<{
  valid: boolean;
}>;
