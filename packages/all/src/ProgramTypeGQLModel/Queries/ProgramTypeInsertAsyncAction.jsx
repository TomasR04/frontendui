import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { ProgramTypeLargeFragment } from "./ProgramTypeFragments";


const ProgramTypeInsertMutationStr = `
mutation ProgramTypeInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: programtypeInsert(
    programtype: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...ProgramTypeLargeFragment
  }
}
`

const ProgramTypeInsertMutation = createQueryStrLazy(`${ProgramTypeInsertMutationStr}`, ProgramTypeLargeFragment)
export const ProgramTypeInsertAsyncAction = createAsyncGraphQLAction(ProgramTypeInsertMutation)