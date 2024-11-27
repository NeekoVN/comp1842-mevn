// Decode the JWT and check if it's expired
export function isTokenExpired(token) {
  if (!token) return true

  const payload = JSON.parse(atob(token.split('.')[1])) // Decode the JWT payload
  const expirationTime = payload.exp * 1000 // Convert expiration time to milliseconds
  return Date.now() > expirationTime
}
