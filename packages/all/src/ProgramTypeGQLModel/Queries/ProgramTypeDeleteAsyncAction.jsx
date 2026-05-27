import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { ProgramTypeLargeFragment } from "./ProgramTypeFragments";

const ProgramTypeDeleteMutationStr = `
mutation ProgramTypeDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: programtypeDelete(
    programtype: {id: $id, lastchange: $lastchange}
  ) {
    ... on ProgramTypeGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...ProgramTypeLargeFragment
      }
    }
  }
}
`
const ProgramTypeDeleteMutation = createQueryStrLazy(`${ProgramTypeDeleteMutationStr}`, ProgramTypeLargeFragment)
export const ProgramTypeDeleteAsyncAction = createAsyncGraphQLAction(ProgramTypeDeleteMutation)