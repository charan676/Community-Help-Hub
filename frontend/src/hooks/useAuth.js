import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout as logoutAction } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutAction());

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    loading,
    error,
    login,
    register,
    logout
  };
};

export default useAuth;
