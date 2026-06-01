import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation programLevelTypeInsert(
	$id: UUID # null, 
	$name: String! # null,
) {
  result: programLevelTypeInsert(
	programLevelType: {
	id: $id, 
	name: $name,
	}
  ) {
    ... on ProgramLevelTypeGQLModelInsertError { ...Error }
    ... on ProgramLevelTypeGQLModel { ...Large }
  }
}


fragment Error on ProgramLevelTypeGQLModelInsertError {
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