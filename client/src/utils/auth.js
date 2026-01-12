// Token ve user bilgilerini localStorage'dan al
export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Token ve user bilgilerini localStorage'a kaydet
export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Token ve user bilgilerini temizle
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Kullanıcı giriş yapmış mı kontrol et
export const isAuthenticated = () => {
  return !!getToken();
};

