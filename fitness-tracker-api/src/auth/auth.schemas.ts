import S from "fluent-json-schema"

const ROLES = {
  admin: 'admin',
  user: 'user',
}

const registerUserBody = S.object()
    .prop('name', S.string().required())
    .prop('surname', S.string().required())
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
    .prop('password', S.string().required())
    .prop('role', S.string().required().enum(Object.values(ROLES)))

export const registerUserSchema = {
    body: registerUserBody
}

const loginUserBody = S.object()
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
    .prop('password', S.string().required())

export const loginUserSchema = {
    body: loginUserBody
}