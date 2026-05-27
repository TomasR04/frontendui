import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const ProgramTypeLinkFragment = createQueryStrLazy(`
fragment ProgramTypeLinkFragment on ProgramTypeGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  nameEn
  levelId
  titleId
  languageId
  formId
}
`);

export const ProgramTypeMediumFragment = createQueryStrLazy(`
fragment ProgramTypeMediumFragment on ProgramTypeGQLModel {
  ...ProgramTypeLinkFragment
  createdby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    givenname
    middlename
    email
    firstname
    surname
    valid
    startdate
    enddate
    typeId
    isThisMe
    gdpr
    fullname
  }
  changedby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    givenname
    middlename
    email
    firstname
    surname
    valid
    startdate
    enddate
    typeId
    isThisMe
    gdpr
    fullname
  }
  rbacobject {
    __typename
    id
  }
  levelType {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
    length
    priority
  }
  titleType {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
  }
  languageType {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
  }
  formType {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
  }
}
`, ProgramTypeLinkFragment);

export const ProgramTypeLargeFragment = createQueryStrLazy(`
fragment ProgramTypeLargeFragment on ProgramTypeGQLModel {
  ...ProgramTypeMediumFragment
}
`, ProgramTypeMediumFragment);
