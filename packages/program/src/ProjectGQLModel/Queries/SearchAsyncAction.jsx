import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { LargeFragment } from "./Fragments"
import { reduceToFirstEntity } from "../../../../dynamic/src/Store"
import { LargeSubjectFragment } from "./Fragments"

const SearchQueryStr = `
query SearchQuery($skip: Int, $limit: Int, $pattern: String) {
  result: userPage(skip: $skip, limit: $limit, where: {email: {_ilike: $pattern}}) {
    ...Large
  }
}
`

const SearchSubjectQueryStr = `
query SearchSubjectQuery($skip: Int, $limit: Int, $pattern: String) {
  result: subjectPage(skip: $skip, limit: $limit, where: {name: {_ilike: $pattern}}) {
    ...LargeSubject
  }
}
`


export const SearchAsyncActionQuery = createQueryStrLazy(`${SearchQueryStr}`, LargeFragment)
export const SearchAsyncAction = createAsyncGraphQLAction2(SearchAsyncActionQuery)

export const SearchSubjectAsyncActionQuery = createQueryStrLazy(`${SearchSubjectQueryStr}`, LargeSubjectFragment)
export const SearchSubjectAsyncAction = createAsyncGraphQLAction2(SearchSubjectAsyncActionQuery, reduceToFirstEntity)