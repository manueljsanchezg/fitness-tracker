import S from "fluent-json-schema"

const getMyWorkOutLogQuery = S.object()
    .prop('limit', S.string().pattern("^\\d+$").required())
    .prop('skip', S.string().pattern("^\\d+$").required())

const createWorkOutLogBody = S.object()
    .prop('exerciseId', S.string().required())
    .prop('sets', S.number().required())
    .prop('reps', S.number().required())
    .prop('weight', S.number().required())
    .prop('date', S.string().format('date-time').required())

const updateWorkOutLogBody = S.object()
    .prop('sets', S.number())
    .prop('reps', S.number())
    .prop('weight', S.number())
    .prop('date', S.string().format('date-time'))

const updateWorkOutLogParams = S.object()
    .prop('workOutLogId', S.string().required())

export const getMyWorkOutLogsSchema = {
    querystring: getMyWorkOutLogQuery
}

export const createWorkOutLogSchema = {
    body: createWorkOutLogBody
}

export const updateWorkOutLogSchema = {
    body: updateWorkOutLogBody,
    params: updateWorkOutLogParams
}

export const deleteWorkOutLogSchema = {
    params: updateWorkOutLogParams
}
