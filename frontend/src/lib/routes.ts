export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
};

const TITLES: Record<string, string> = {
  HOME: '',
  LOGIN: 'Start Interviewing Today',
  SIGNUP: 'Create an Account',
  FORGOT_PASSWORD: 'Forgot Password',
};

export const getPageTitle = (path: string) => {
  const title = TITLES[path];
  return title !== undefined
    ? ['Peerprep', title].filter((v) => v.length > 0).join(' - ')
    : 'Peerprep';
};
