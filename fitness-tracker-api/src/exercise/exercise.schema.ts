import S from "fluent-json-schema"

const createExerciseBody = S.object()
    .prop('name', S.string())
    .prop('muscles_involved', S.array().items(S.string()))
    .prop('password', S.string())

export const createExerciseSchema = {
    body: createExerciseBody
}