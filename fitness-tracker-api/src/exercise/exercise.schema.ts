import S from "fluent-json-schema"

const createExerciseBody = S.object()
    .prop('name', S.string())
    .prop('muscles_involved', S.array().items(S.string()))
    .prop('password', S.string())

const updateExerciseParams = S.object()
    .prop('exerciseId', S.string().required())

export const createExerciseSchema = {
    body: createExerciseBody
}

export const updateExerciseSchema = {
    params: updateExerciseParams,
    body: createExerciseBody
}

export const deleteExerciseSchema = {
    params: updateExerciseParams
}