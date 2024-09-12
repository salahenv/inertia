import { useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      if (!token) {
        window.location.href = '/login';
      } else {
      }
    }
  }, []);
};

export default useAuth;
