import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"



const LinkFragmentStr = `
fragment Link on ProgramGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  nameEn
  guarantors {
    
    name
    memberships {
      user {
        fullname
      }
    }

  }

  subjects {
    id
    name
  }
  students {   
  id
    user {
    fullname
    }
  }
  type{
    __typename
    id
    lastchange
    name
    nameEn
    levelType{
      name
      length
    }
    titleType{
      name
    }
    formType{
      name
    }

  }              
  
  
}
`

const LinkFragmentTypeStr = `
fragment Link on ProgramTypeGQLModel {
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
`

const MediumFragmentStr = `
fragment Medium on ProgramGQLModel {
  ...Link
  rbacobject {
    ...RBRoles
  }
}
`

const LargeFragmentStr = `
fragment Large on ProgramGQLModel {
  ...Medium
  
}
`

const MediumFragmentTypeStr = `
fragment Medium on ProgramTypeGQLModel {
  ...Link
  rbacobject {
    ...RBRoles
  }
}
`

const LargeFragmentTypeStr = `
fragment Large on ProgramTypeGQLModel {
  ...Medium
  
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

export const LinkFragmentType = createQueryStrLazy(`${LinkFragmentTypeStr}`)
export const MediumFragmentType = createQueryStrLazy(`${MediumFragmentTypeStr}`, LinkFragmentType, RBACFragment)
export const LargeFragmentType = createQueryStrLazy(`${LargeFragmentTypeStr}`, MediumFragmentType)
  