import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const DeleteMutationStr = `
mutation programFormTypeDelete(
	$id: UUID! # null, 
	$lastchange: DateTime! # null
) {
  result: programFormTypeDelete(
	programFormType: {
	id: $id, 
	lastchange: $lastchange}
  ) {
        ...ProgramFormTypeGQLModelDeleteError
    }
}

fragment ProgramFormTypeGQLModelDeleteError on ProgramFormTypeGQLModelDeleteError {
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