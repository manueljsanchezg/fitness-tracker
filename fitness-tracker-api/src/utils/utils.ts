export const getPaginate = (query: any) => {
    let limit = null
    let skip = null

    if (query.limit !== undefined && query.skip !== undefined) {
        limit = Math.min(Math.max(Number(query.limit) || 1, 1), 100)
        skip = Math.max(Number(query.skip) || 0, 0)
    }

    return { limit, skip }
}
