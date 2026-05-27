import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { ProgramTypeLargeFragment } from "./ProgramTypeFragments";

const ProgramTypeUpdateMutationStr = `
mutation ProgramTypeUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $nameEn: String) {
  result: programTypeUpdate(
    programType: {id: $id, lastchange: $lastchange, name: $name, nameEn: $nameEn}
  ) {
    ... on ProgramTypeGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...ProgramTypeLargeFragment
      }      
    }
    ...ProgramTypeLargeFragment
  }
}
`

const ProgramTypeUpdateMutation = createQueryStrLazy(`${ProgramTypeUpdateMutationStr}`, ProgramTypeLargeFragment)
export const ProgramTypeUpdateAsyncAction = createAsyncGraphQLAction(ProgramTypeUpdateMutation)