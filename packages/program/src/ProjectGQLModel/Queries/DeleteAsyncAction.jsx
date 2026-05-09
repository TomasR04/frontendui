import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation programDelete(
	$id: UUID! # null, 
	$lastchange: DateTime! # null
) {
  result: programDelete(
	program: {
	id: $id, 
	lastchange: $lastchange}
  ) {
        ...ProgramGQLModelDeleteError
    }
}

fragment ProgramGQLModelDeleteError on ProgramGQLModelDeleteError {
  __typename
  Entity {
    ...Large
  }
  msg
  code
  failed
  location
  input
}
`
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment)
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation)