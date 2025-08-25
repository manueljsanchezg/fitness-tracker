import S from "fluent-json-schema"

const exerciseSchema = S.object()
    .id('#exercise')
    .prop('exercise', S.string().required()) 
    .prop('sets', S.number().required())
    .prop('reps', S.number().required())
    .prop('duration', S.number())

const createRoutineBody = S.object()
    .prop('name', S.string().required())
    .prop('exercises', S.array().items(S.ref('#exercise')).required())
    .definition('exercise', exerciseSchema)


export const createRoutineSchema = {
    body: createRoutineBody
}