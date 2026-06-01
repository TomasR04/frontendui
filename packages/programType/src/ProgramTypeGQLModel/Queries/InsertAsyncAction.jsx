import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation programTypeInsert(
	$id: UUID # null, 
	$name: String # null, 
	$nameEn: String # null,
	$levelId: UUID # null,
	$titleId: UUID # null,
	$languageId: UUID # null,
	$formId: UUID # null
) {
  result: programTypeInsert(
	programType: {
	id: $id, 
	name: $name, 
	nameEn: $nameEn,
	levelId: $levelId,
	titleId: $titleId,
	languageId: $languageId,
	formId: $formId
	}
  ) {
    ... on ProgramTypeGQLModelInsertError { ...Error }
    ... on ProgramTypeGQLModel { ...Large }
  }
}


fragment Error on ProgramTypeGQLModelInsertError {
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