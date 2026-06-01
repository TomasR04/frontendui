import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"



const LinkFragmentStr = `
fragment Link on ProgramLevelTypeGQLModel {
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
`



const MediumFragmentStr = `
fragment Medium on ProgramLevelTypeGQLModel {
  ...Link
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
    ...RBRoles
  }
}
`

const LargeFragmentStr = `
fragment Large on ProgramLevelTypeGQLModel {
  ...Medium
  
}
`

const LinkLevelFragmentStr = `
fragment LinkLevel on ProgramLevelTypeGQLModel {
  __typename
  id
  lastchange
  created
  name
  nameEn
}
`

const MediumLevelFragmentStr = `
fragment MediumLevel on ProgramLevelTypeGQLModel {
  ...LinkLevel
  rbacobject {
    ...RBRoles
  }
}
`

const LargeLevelFragmentStr = `
fragment LargeLevel on ProgramLevelTypeGQLModel {
  ...MediumLevel
}
`

const LinkTitleFragmentStr = `
fragment LinkTitle on ProgramTitleTypeGQLModel {
  __typename
  id
  lastchange
  created
  name
  nameEn
}
`

const MediumTitleFragmentStr = `
fragment MediumTitle on ProgramTitleTypeGQLModel {
  ...LinkTitle
  rbacobject {
    ...RBRoles
  }
}
`

const LargeTitleFragmentStr = `
fragment LargeTitle on ProgramTitleTypeGQLModel {
  ...MediumTitle
}
`

const LinkLanguageFragmentStr = `
fragment LinkLanguage on ProgramLanguageTypeGQLModel {
  __typename
  id
  lastchange
  created
  name
  nameEn
}
`

const MediumLanguageFragmentStr = `
fragment MediumLanguage on ProgramLanguageTypeGQLModel {
  ...LinkLanguage
  rbacobject {
    ...RBRoles
  }
}
`

const LargeLanguageFragmentStr = `
fragment LargeLanguage on ProgramLanguageTypeGQLModel {
  ...MediumLanguage
}
` 

const LinkFormFragmentStr = `
fragment LinkForm on ProgramFormTypeGQLModel {
  __typename
  id
  lastchange
  created
  name
  nameEn
}
`

const MediumFormFragmentStr = `
fragment MediumForm on ProgramFormTypeGQLModel {
  ...LinkForm
  rbacobject {
    ...RBRoles
  }
}
`

const LargeFormFragmentStr = `
fragment LargeForm on ProgramFormTypeGQLModel {
  ...MediumForm
}
`





const RoleFragmentStr = `
fragment Role on RoleGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { id __typename }
    changedby { id __typename }
    rbacobject { id __typename }
    valid
    deputy
    startdate
    enddate
    roletypeId
    userId
    groupId
    roletype { __typename id }
    user { __typename id fullname }
    group { __typename id name }
  }
`

const RBACFragmentStr = `
fragment RBRoles on RBACObjectGQLModel {
  __typename
  id
  currentUserRoles {
    __typename
    id
    lastchange
    valid
    startdate
    enddate
    roletype {
      __typename
      id
      name
    }
    group {
      __typename
      id
      name
      grouptype {
        __typename
        id
        name
      }
    }
  }
}`



export const RoleFragment = createQueryStrLazy(`${RoleFragmentStr}`)
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)

export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)


export const LinkLevelFragment = createQueryStrLazy(`${LinkLevelFragmentStr}`)
export const MediumLevelFragment = createQueryStrLazy(`${MediumLevelFragmentStr}`, LinkLevelFragment, RBACFragment)
export const LargeLevelFragment = createQueryStrLazy(`${LargeLevelFragmentStr}`, MediumLevelFragment)

export const LinkTitleFragment = createQueryStrLazy(`${LinkTitleFragmentStr}`)
export const MediumTitleFragment = createQueryStrLazy(`${MediumTitleFragmentStr}`, LinkTitleFragment, RBACFragment)
export const LargeTitleFragment = createQueryStrLazy(`${LargeTitleFragmentStr}`, MediumTitleFragment)

export const LinkLanguageFragment = createQueryStrLazy(`${LinkLanguageFragmentStr}`)
export const MediumLanguageFragment = createQueryStrLazy(`${MediumLanguageFragmentStr}`, LinkLanguageFragment, RBACFragment)
export const LargeLanguageFragment = createQueryStrLazy(`${LargeLanguageFragmentStr}`, MediumLanguageFragment)

export const LinkFormFragment = createQueryStrLazy(`${LinkFormFragmentStr}`)
export const MediumFormFragment = createQueryStrLazy(`${MediumFormFragmentStr}`, LinkFormFragment, RBACFragment)
export const LargeFormFragment = createQueryStrLazy(`${LargeFormFragmentStr}`, MediumFormFragment)
  