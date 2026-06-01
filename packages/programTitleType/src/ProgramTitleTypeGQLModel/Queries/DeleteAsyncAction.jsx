import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation programTitleTypeDelete(
	$id: UUID! # null, 
	$lastchange: DateTime! # null
) {
  result: programTitleTypeDelete(
	programTitleType: {
	id: $id, 
	lastchange: $lastchange}
  ) {
        ...ProgramTitleTypeGQLModelDeleteError
    }
}

fragment ProgramTitleTypeGQLModelDeleteError on ProgramTitleTypeGQLModelDeleteError {
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