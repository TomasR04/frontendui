import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation subjectDelete(
    $id: UUID!,
    $lastchange: DateTime!
) {
  result: subjectDelete(
    subject: {
    id: $id,
    lastchange: $lastchange}
  ) {
        ...SubjectGQLModelDeleteError
    }
}

fragment SubjectGQLModelDeleteError on SubjectGQLModelDeleteError {
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
export const SubjectDeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)
export const DeleteAsyncAction = SubjectDeleteAsyncAction