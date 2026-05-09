import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation programInsert(
	$id: UUID # null, 
	$name: String # null, 
	$nameEn: String # null
) {
  result: programInsert(
	program: {
	id: $id, 
	name: $name, 
	nameEn: $nameEn}
  ) {
    ... on InsertError { ...InsertError }
    ... on ProgramGQLModel { ...Large }
  }
}


fragment InsertError on InsertError {
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