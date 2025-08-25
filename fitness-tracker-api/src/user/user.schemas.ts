import S from "fluent-json-schema"

const updateUserBody = S.object()
    .prop('name', S.string())
    .prop('surname', S.string())
    .prop('password', S.string())

export const updateProfileSchema = {
    body: updateUserBody
}