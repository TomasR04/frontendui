import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation programLevelTypeUpdate(
	$id: UUID! # null, 
	$lastchange: DateTime! # null, 
	$name: String # null, 
	$nameEn: String # null,
  
) {
  result: programLevelTypeUpdate(
	programLevelType: {
	id: $id, 
	lastchange: $lastchange, 
	name: $name, 
	nameEn: $nameEn,
	}
  ) {
    ... on ProgramLevelTypeGQLModel { ...Large }
    ... on ProgramLevelTypeGQLModelUpdateError { ...Error }
  }
}

fragment Error on ProgramLevelTypeGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
  msg
  failed
  code
  location
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)


const RawUpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation,
  updateItemsFromGraphQLResult, reduceToFirstEntity)



const normalizeNullableString = (value) => {
  if (value === undefined) return null;
  return value;
};

const toUpdateVariables = (vars = {}) => {
  const lastchange = vars?.lastchange;
  return {
    id: vars?.id,
    lastchange: lastchange instanceof Date ? lastchange.toISOString() : lastchange,
    name: normalizeNullableString(vars?.name),
    nameEn: normalizeNullableString(vars?.nameEn),
    levelId: normalizeNullableString(vars?.levelId),
    titleId: normalizeNullableString(vars?.titleId),
    languageId: normalizeNullableString(vars?.languageId),
    formId: normalizeNullableString(vars?.formId)
  };
};



export const UpdateAsyncAction = (vars, gqlClient) => {
  
  const cleanVars = toUpdateVariables(vars);
  
  return RawUpdateAsyncAction(cleanVars, gqlClient);
};



UpdateAsyncAction.__metadata = RawUpdateAsyncAction.__metadata;