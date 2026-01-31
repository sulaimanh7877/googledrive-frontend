export const setToken = (token) => {
  // Store token in cookie as requested
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
};

export const getToken = () => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
};

export const removeToken = () => {
  // Remove auth token cookie
  document.cookie = 'token=; path=/; max-age=0;';

  // Force navigation to login on token expiry
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};