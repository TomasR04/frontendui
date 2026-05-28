import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation programInsert(
	$id: UUID # null, 
	$name: String # null, 
	$nameEn: String # null,
	$typeId: UUID # null,
	$licencedGroupId: UUID! # null,
	$guarantorsGroupId: UUID! # null
) {
  result: programInsert(
	program: {
	id: $id, 
	name: $name, 
	nameEn: $nameEn,
	typeId: $typeId,
	licencedGroupId: $licencedGroupId,
	guarantorsGroupId: $guarantorsGroupId}
  ) {
    ... on ProgramGQLModelInsertError { ...Error }
    ... on ProgramGQLModel { ...Large }
  }
}


fragment Error on ProgramGQLModelInsertError {
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