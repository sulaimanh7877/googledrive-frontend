export const setToken = (token) => {
  // Store token in cookie as requested
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
};

export const getToken = () => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
};

export const removeToken = () => {
  document.cookie = 'token=; path=/; max-age=0;';
};