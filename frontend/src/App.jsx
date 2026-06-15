import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import AppRoutes from './routes/AppRoutes';
import { fetchCurrentUser } from './store/slices/authSlice';
import './utils/i18n';

// Inner component to access dispatch safely
const AppShell = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return <AppRoutes />;
};

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
