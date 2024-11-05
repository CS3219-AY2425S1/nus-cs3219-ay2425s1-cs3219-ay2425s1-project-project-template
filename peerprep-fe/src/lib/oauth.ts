import { axiosClient } from '@/network/axiosClient';
import { login } from '@/lib/auth';
import { User } from '@/types/types';

export type OAuthProvider = 'github';

// Extend for other providers
export const oAuthConfig = {
  github: {
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    scope: 'user:email',
  },
};

export const initiateOAuth = (provider: OAuthProvider) => {
  const config = oAuthConfig[provider];
  const authUrl =
    `${config.authorizeUrl}?` +
    new URLSearchParams({
      client_id: config.clientId,
      scope: config.scope,
    }).toString();
  window.location.href = authUrl;
};

export const handleOAuthCallback = async (
  provider: OAuthProvider,
  code: string,
  setAuth: (isAuth: boolean, token: string | null, user: User | null) => void,
): Promise<boolean> => {
  try {
    const { data } = await axiosClient.get(
      `auth/${provider}/callback?code=${code}`,
    );

    const res = await login(data.data.accessToken);
    if (!res) return false;

    setAuth(true, data.data.accessToken, data.data);
    return true;
  } catch {
    return false;
  }
};
