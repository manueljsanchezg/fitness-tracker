import S from "fluent-json-schema"

const getUsersQuery = S.object()
    .prop('limit', S.string().pattern("^\\d+$").required())
    .prop('skip', S.string().pattern("^\\d+$").required())

const updateUserBody = S.object()
    .prop('name', S.string())
    .prop('surname', S.string())
    .prop('password', S.string())

export const getUsersSchema = {
    querystring: getUsersQuery
}

export const updateProfileSchema = {
    body: updateUserBody
}