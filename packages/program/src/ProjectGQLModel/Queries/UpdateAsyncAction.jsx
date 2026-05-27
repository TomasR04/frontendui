import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { LargeFragmentType } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation programUpdate(
	$id: UUID! # null, 
	$lastchange: DateTime! # null, 
	$name: String # null, 
	$nameEn: String # null,
	$typeId: UUID # null
) {
  result: programUpdate(
	program: {
	id: $id, 
	lastchange: $lastchange, 
	name: $name, 
	nameEn: $nameEn,
	typeId: $typeId}
  ) {
    ... on ProgramGQLModel { ...Large }
    ... on ProgramGQLModelUpdateError { ...Error }
  }
}

fragment Error on ProgramGQLModelUpdateError {
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
const UpdateMutationTypeStr = `
mutation programTypeUpdate(
  $id: UUID! # null,
  $lastchange: DateTime! # null, 
  $name: String # null, 
  $nameEn: String # null
) {
  result: programTypeUpdate(
  programType: {
  id: $id, 
  lastchange: $lastchange, 
  name: $name, 
  nameEn: $nameEn}
  ) {
    ... on ProgramTypeGQLModel { ...Large }
    ... on ProgramTypeGQLModelUpdateError { ...Error }
  }
}

fragment Error on ProgramTypeGQLModelUpdateError {
    __typename
    Entity {
  ...Large
}
    msg
    failed
    code
    location
    input
  }
`
const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
const UpdateMutationType = createQueryStrLazy(`${UpdateMutationTypeStr}`, LargeFragmentType)

const RawUpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation,
  updateItemsFromGraphQLResult, reduceToFirstEntity)

const RawUpdateTypeAsyncAction = createAsyncGraphQLAction2(UpdateMutationType,
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
    typeId: normalizeNullableString(vars?.typeId),
  };
};

const toUpdateVariablesType = (vars = {}) => {
  
  const lastchange = vars?.lastchange;
  return {
    id: vars?.id,
    lastchange: lastchange instanceof Date ? lastchange.toISOString() : lastchange,
    name: normalizeNullableString(vars?.name),
    nameEn: normalizeNullableString(vars?.nameEn),
  };
};

export const UpdateAsyncAction = (vars, gqlClient) => {
  
  const cleanVars = toUpdateVariables(vars);
  
  return RawUpdateAsyncAction(cleanVars, gqlClient);
};

export const UpdateTypeAsyncAction = (vars, gqlClient) => {
  
  
  const cleanVarsType = toUpdateVariablesType(vars.type);
  return RawUpdateTypeAsyncAction(cleanVarsType, gqlClient);
};

UpdateAsyncAction.__metadata = RawUpdateAsyncAction.__metadata;