import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation programTitleTypeInsert(
	$id: UUID # null, 
	$name: String! # null, 
) {
  result: programTitleTypeInsert(
	programTitleType: {
	id: $id, 
	name: $name, 
	}
  ) {
    ... on ProgramTitleTypeGQLModelInsertError { ...Error }
    ... on ProgramTitleTypeGQLModel { ...Large }
  }
}


fragment Error on ProgramTitleTypeGQLModelInsertError {
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