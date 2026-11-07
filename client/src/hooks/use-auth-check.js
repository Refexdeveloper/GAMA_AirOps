import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/context/AuthContext';

const useAuthCheck = () => {
  const { isAuthenticated, remember, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the token is not permanent and expired, logout the user
    if (!isAuthenticated || (!remember && tokenExpired())) {
      logout();
      router.push('/login');
    }
  }, [isAuthenticated, remember, router, logout]);

  const tokenExpired = () => {
    // Implement logic to check if the 1-day token has expired.
    const storedAuthState = JSON.parse(sessionStorage.getItem('authState'));
    if (storedAuthState && storedAuthState.loginTime) {
      const currentTime = new Date();
      const loginTime = new Date(storedAuthState.loginTime);
      const diffInHours = (currentTime - loginTime) / 1000 / 60 / 60;
      return diffInHours >= 24;
    }
    return false;
  };
};

export default useAuthCheck;
