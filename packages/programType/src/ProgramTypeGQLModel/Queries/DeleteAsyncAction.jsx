import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation programTypeDelete(
	$id: UUID! # null, 
	$lastchange: DateTime! # null
) {
  result: programTypeDelete(
	programType: {
	id: $id, 
	lastchange: $lastchange}
  ) {
        ...ProgramTypeGQLModelDeleteError
    }
}

fragment ProgramTypeGQLModelDeleteError on ProgramTypeGQLModelDeleteError {
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