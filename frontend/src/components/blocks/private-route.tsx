import { FC, PropsWithChildren, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  // const navigate = useNavigate();

  useEffect(() => {
    // const ensureLoggedIn = async () => {
    //   await axios
    //     .get(import.meta.env.VITE_USER_SERVICE + '/auth-check/is-authed', { withCredentials: true })
    //     .catch((err) => {
    //       console.log(err);
    //       navigate('/login');
    //     });
    //   ensureLoggedIn();
    // };
  }, []);
  return children;
};
