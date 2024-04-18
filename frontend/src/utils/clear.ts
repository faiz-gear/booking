export const clearToken = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
