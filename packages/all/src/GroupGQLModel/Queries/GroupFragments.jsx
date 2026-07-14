import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const GroupLinkFragment = createQueryStrLazy(`
fragment GroupLinkFragment on GroupGQLModel {
  __typename
  id
  name
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  startdate
  enddate
  grouptypeId
  mastergroupId
}
`);

export const GroupMediumFragment = createQueryStrLazy(`
fragment GroupMediumFragment on GroupGQLModel {
  ...GroupLinkFragment
  createdby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    startdate
    enddate
    typeId
  }
  changedby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    startdate
    enddate
    typeId
  }
  rbacobject {
    __typename
    id
  }
  grouptype {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
  }
  mastergroup {
    __typename
    id
    name
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    startdate
    enddate
    grouptypeId
    mastergroupId
  }
}
`, GroupLinkFragment);

export const GroupLargeFragment = createQueryStrLazy(`
fragment GroupLargeFragment on GroupGQLModel {
  ...GroupMediumFragment
  subgroups {
    __typename
    id
    name
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    startdate
    enddate
    grouptypeId
    mastergroupId
  }
  memberships {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    userId
    user { id fullname email }
    groupId
    startdate
    enddate
  }
  r: roles {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    startdate
    enddate
    roletypeId
    userId
    groupId
  }
  mastergroups {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    startdate
    enddate
    grouptypeId
    mastergroupId
  }
  rOn: rolesOn {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    startdate
    enddate
    roletypeId
    userId
    groupId
  }
}
`, GroupMediumFragment);
