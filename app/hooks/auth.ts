import { useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token');
      // TODO why checking NODE_ENV?
      if (!token && process.env.NODE_ENV === 'production') {
        window.location.href = '/login';
      } else {
      }
    }
  }, []);
};

export default useAuth;
