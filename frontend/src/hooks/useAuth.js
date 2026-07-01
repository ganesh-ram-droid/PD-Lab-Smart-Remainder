import { useEffect } from 'react';

import { useAuthStore } from '../store/authStore';

const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const initializing = useAuthStore((state) => state.initializing);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  return {
    user,
    initializing,
    loading,
    error,
    isAuthenticated: Boolean(user)
  };
};

export default useAuth;
