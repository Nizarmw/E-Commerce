export const isAuthenticated = async () => {
  try {
    // Cek status autentikasi dengan memanggil endpoint yang dilindungi
    await api.get("/auth/status"); // Buat endpoint ini di backend jika belum ada
    return true;
  } catch (error) {
    return false;
  }
};

export const setAuthData = (userData) => {
  // Hanya simpan data user, token dikelola oleh cookies
  localStorage.setItem('user', JSON.stringify(userData));
};

export const clearAuthData = () => {
  localStorage.removeItem('user');
  // Hapus cookie dengan memanggil endpoint logout
  return api.post('/auth/logout');
};