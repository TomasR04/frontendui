import { LinkURI } from "../Components"
import { makeMutationURI } from "../Mutations/helpers"
import { ReadAsyncAction } from "../Queries"
import { GroupRoles } from "../Vectors/GroupRoles"
import { GroupRolesOn } from "../Vectors/GroupRolesOn"
import { GroupSubgroups } from "../Vectors/GroupSubgroups"
import { PageReadItem } from "./PageReadItem"

export const ReadItemURI = `${LinkURI}:id`

export const RolesOnURI = makeMutationURI(LinkURI, "roleson", { withId: true })
export const RolesURI = makeMutationURI(LinkURI, "roles", { withId: true })
export const SubgroupsURI = makeMutationURI(LinkURI, "subgroups", { withId: true })

/**
 * Základní obálka pro „read“ stránku entity podle `:id` z routy.
 *
 * Využívá `PageItemBase`, který zajistí:
 * - získání `id` z URL (`useParams`)
 * - načtení entity přes `AsyncActionProvider` pomocí `queryAsyncAction`
 * - vložení navigace (`PageNavbar`)
 *
 * Uvnitř provideru vykreslí `ReadWithComponent`, který si vezme načtený `item`
 * z `useGQLEntityContext()` a zobrazí ho v zadané komponentě (defaultně `LargeCard`).
 *
 * @component
 * @param {object} props
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 *   Async action (např. thunk) pro načtení entity z backendu/GraphQL dle `id`.
 * @param {Object<string, any>} [props]
 *   Další props předané do `ReadWithComponent` (např. `Component`, layout props).
 *
 * @returns {import("react").JSX.Element}
 */
export const PageReadItemRolesOn = ({ queryAsyncAction=ReadAsyncAction}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={GroupRolesOn}/>
)

// export const PageReadItemRoles = ({ queryAsyncAction=ReadAsyncAction}) => (
//     <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={GroupRoles}/>
// )

const CombinedRoles = ({ item }) => <>
    <GroupRoles item={item} />
    <GroupRolesOn item={item} />
</>

export const PageReadItemRoles = ({ queryAsyncAction=ReadAsyncAction}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={CombinedRoles}/>
)

export const PageReadItemSubgroups = ({ queryAsyncAction=ReadAsyncAction}) => (
    <PageReadItem queryAsyncAction={queryAsyncAction} SubPage={GroupSubgroups}/>
)

