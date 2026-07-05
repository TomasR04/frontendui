import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { SubjectDeleteAsyncAction } from "./SubjectDeleteAsyncAction";

const DeleteMutationStr = `
mutation programDelete(
    $id: UUID!,
    $lastchange: DateTime!
) {
  result: programDelete(
    program: {
    id: $id,
    lastchange: $lastchange}
  ) {
        ...ProgramGQLModelDeleteError
    }
}

fragment ProgramGQLModelDeleteError on ProgramGQLModelDeleteError {
  __typename
  Entity {
    id
    name
  }
  msg
  code
  failed
  location
  input
}
`
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`)
const BaseDeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)

export const collectSubjectDeleteVariables = (item = {}) => {
    const subjects = Array.isArray(item?.subjects) ? item.subjects : [];

    return subjects
        .filter((subject) => subject?.id)
        .map(({ id, lastchange }) => ({ id, lastchange }));
};

export const DeleteAsyncAction = (vars, gqlClient) => async (dispatch, getState, next = (jsonResult) => jsonResult) => {
    const subjectDeleteVariables = collectSubjectDeleteVariables(vars);

    for (const subjectVars of subjectDeleteVariables) {
        await dispatch(SubjectDeleteAsyncAction(subjectVars, gqlClient));
    }

    return BaseDeleteAsyncAction(vars, gqlClient)(dispatch, getState, next);
};