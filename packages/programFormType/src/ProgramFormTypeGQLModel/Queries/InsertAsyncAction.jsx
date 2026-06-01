import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation programFormTypeInsert(
	$id: UUID # null, 
	$name: String! # null, 
	$nameEn: String! # null
) {
  result: programFormTypeInsert(
	programFormType: {
	id: $id, 
	name: $name, 
	nameEn: $nameEn,
	}
  ) {
    ... on ProgramFormTypeGQLModelInsertError { ...Error }
    ... on ProgramFormTypeGQLModel { ...Large }
  }
}


fragment Error on ProgramFormTypeGQLModelInsertError {
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