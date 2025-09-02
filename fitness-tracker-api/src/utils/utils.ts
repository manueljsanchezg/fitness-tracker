export const getPaginate = (query: any) => {
  if (!query.limit || !query.skip) {
    return null
  }

  const limit = Math.min(Math.max(Number(query.limit) || 1, 1), 100)
  const skip = Math.max(Number(query.skip) || 0, 0)

  return { limit, skip }
}
