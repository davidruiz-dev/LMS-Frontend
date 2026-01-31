export const authUtils = {
  getToken: (): string | null => {
    return localStorage.getItem('access_token')
  },

  setToken: (token: string): void => {
    localStorage.setItem('access_token', token)
  },

  removeToken: (): void => {
    localStorage.removeItem('access_token')
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken()
  }
}