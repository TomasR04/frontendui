import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"
import { reduceToFirstEntity } from "../../../../dynamic/src/Store"
import { LargeFragment, LargeLevelFragment, LargeTitleFragment, LargeLanguageFragment, LargeFormFragment} from "./Fragments"

const SearchQueryStr = `
query SearchQuery($skip: Int, $limit: Int, $pattern: String) {
  result: programTypePage(skip: $skip, limit: $limit, where: {name: {_ilike: $pattern}}) {
    ...Large
  }
}
`
const SearchLevelQueryStr = `
query SearchLevelQuery($skip: Int, $limit: Int, $pattern: String) {
  result: programLevelPage(skip: $skip, limit: $limit, where: {name: {_ilike: $pattern}}) {
    ...LargeLevel
  }
}
`

const SearchTitleQueryStr = `
query SearchTitleQuery($skip: Int, $limit: Int, $pattern: String) {
  result: programTitlePage(skip: $skip, limit: $limit, where: {name: {_ilike: $pattern}}) {
    ...LargeTitle
  }
}
`
const SearchLanguageQueryStr = `
query SearchLanguageQuery($skip: Int, $limit: Int, $pattern: String) {
  result: programLanguagePage(skip: $skip, limit: $limit, where: {name: {_ilike: $pattern}}) {
    ...LargeLanguage
  }
}
`
const SearchFormQueryStr = `
query SearchFormQuery($skip: Int, $limit: Int, $pattern: String) {
  result: programFormPage(skip: $skip, limit: $limit, where: {name: {_ilike: $pattern}}) {
    ...LargeForm
  }
}
`


export const SearchAsyncActionQuery = createQueryStrLazy(`${SearchQueryStr}`, LargeFragment)
export const SearchAsyncAction = createAsyncGraphQLAction2(SearchAsyncActionQuery, reduceToFirstEntity("result"))

export const SearchLevelAsyncActionQuery = createQueryStrLazy(`${SearchLevelQueryStr}`, LargeLevelFragment)
export const SearchLevelAsyncAction = createAsyncGraphQLAction2(SearchLevelAsyncActionQuery, reduceToFirstEntity("result"))

export const SearchTitleAsyncActionQuery = createQueryStrLazy(`${SearchTitleQueryStr}`, LargeTitleFragment)
export const SearchTitleAsyncAction = createAsyncGraphQLAction2(SearchTitleAsyncActionQuery, reduceToFirstEntity("result"))

export const SearchLanguageAsyncActionQuery = createQueryStrLazy(`${SearchLanguageQueryStr}`, LargeLanguageFragment)
export const SearchLanguageAsyncAction = createAsyncGraphQLAction2(SearchLanguageAsyncActionQuery, reduceToFirstEntity("result"))

export const SearchFormAsyncActionQuery = createQueryStrLazy(`${SearchFormQueryStr}`, LargeFormFragment)
export const SearchFormAsyncAction = createAsyncGraphQLAction2(SearchFormAsyncActionQuery, reduceToFirstEntity("result"))