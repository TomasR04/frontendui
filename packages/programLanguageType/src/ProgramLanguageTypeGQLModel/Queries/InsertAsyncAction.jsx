import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
  mutation ProgramLanguageTypeInsertMutation(
	  $name: String! # null, 
    $id: UUID # null, 
	  $nameEn: String # null,
    ) {
  result: programLanguageTypeInsert(
    programLanguageType: {
      name: $name, 
    id: $id, 
    nameEn: $nameEn
    }
  ) {
    ... on ProgramLanguageTypeGQLModelInsertError { ...Error }
    ... on ProgramLanguageTypeGQLModel { ...Large }
  }
}

fragment Error on ProgramLanguageTypeGQLModelInsertError {
  __typename
  msg
  failed
  code
  location
  input
}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)