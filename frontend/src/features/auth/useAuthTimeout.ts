import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../auth/authSlice';
import type { RootState } from '../../app/store';

const useAuthTimeout = (timeoutMinutes: number = 20) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const token = useSelector((state: RootState) => state.auth.token);

  const logoutUser = useCallback(() => {
    dispatch(logout());
    navigate('/login');
    console.log('Sessão expirada por inatividade');
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!token) return;

    const timeoutMs = timeoutMinutes * 60 * 1000;
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      inactivityTimer = setTimeout(() => {
        logoutUser();
      }, timeoutMs);
    };

    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 
      'touchstart', 'click', 'keydown', 'wheel'
    ];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    resetTimer();

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [token, logoutUser, timeoutMinutes]);

  return null;
};

export default useAuthTimeout;