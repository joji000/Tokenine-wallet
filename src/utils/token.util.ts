export const extractBearerToken = (
  authHeader?: string | null
): string | null => {
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

export const getAuthHeader = (headers: Headers): string | null =>
  headers.get('authorization') || null
