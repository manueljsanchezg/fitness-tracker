export const getPaginate = (query: any) => {
    const limit = Math.min( Math.max( Number(query.limit) || 10, 1), 100)
    const skip = Math.max( Number(query.skip) || 0, 0)

    return { limit, skip }
}