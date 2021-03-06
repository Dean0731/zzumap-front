import Cookies from 'js-cookie'
const TokenKey = 'token'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  // eslint-disable-next-line no-empty
  if (token !== null || token !== '') {
    return Cookies.set(TokenKey, token)
  }
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
