import { useParams } from "react-router"

import { useGQLType } from "../../../../dynamic/src/Hooks/useGQLType"

import { LargeCard } from "../Components/LargeCard"
import { CardCapsule } from "../Components/CardCapsule"
import { MediumCardScalars } from "../Scalars/ScalarAttribute"
import { MediumCardVectors } from "../Vectors/VectorAttribute"
import { useGQLEntityContext, AsyncActionProvider } from "../Helpers/GQLEntityProvider"
import { Row } from "../Components/Row"
import { Col } from "../Components/Col"




/**
 * Vnitřní „skeleton“ stránky pro práci s jednou entitou z `GQLEntityContext`.
 *
 * Komponenta očekává, že někde výše ve stromu už existuje provider (např. `AsyncActionProvider`),
 * který naplní `useGQLEntityContext()` hodnotou `item`.
 *
 * Co dělá:
 * - vezme `item` z `useGQLEntityContext()`
 * - pokud `item` není k dispozici, vrací `null` (typicky loading / nenalezeno)
 * - vykreslí navbar (default `PageNavbar`) s propem `item`
 * - obalí obsah layout komponentou (default `LargeCard`) s propem `item`
 * - uvnitř layoutu vykreslí „subpage“ komponentu (default `GeneratedContentBase`) s propem `item`
 * - `children` vloží dovnitř `SubPage` (slot pro rozšíření obsahu stránky)
 *
 * Díky parametrům `PageNavbar`, `ItemLayout` a `SubPage` lze stejnou strukturu znovu použít
 * pro různé stránky nad jednou entitou (jiné rozložení, jiný generovaný obsah, jiné menu).
 *
 * @component
 * @param {object} props
 * @param {import("react").ComponentType<{item:any}>} [props.PageNavbar=PageNavbar]
 *   Komponenta navigace/hlavičky stránky. Dostane prop `item`.
 * @param {import("react").ComponentType<{item:any, children?:import("react").ReactNode}>} [props.ItemLayout=LargeCard]
 *   Obalová layout komponenta pro zobrazení entity (např. karta). Dostane `item` a obvykle renderuje `children`.
 * @param {import("react").ComponentType<{item:any, children?:import("react").ReactNode}>} [props.SubPage=GeneratedContentBase]
 *   Vnitřní obsah stránky (např. generované sekce, detail, taby). Dostane `item` a renderuje `children`.
 * @param {import("react").ReactNode} [props.children]
 *   Dodatečný obsah vložený do `SubPage` (např. extra sekce, akční tlačítka, custom bloky).
 *
 * @returns {import("react").JSX.Element|null}
 *   Struktura stránky (navbar + layout + subpage) nebo `null`, pokud `item` není dostupný.
 */
const PageItemInnerStructure = ({
    PageNavbar=null,
    ItemLayout=LargeCard,
    SubPage=GeneratedContentBase,
    children
}) => {
    const { item } = useGQLEntityContext()
    if (!item) return <>Položka nenalezena</>
    return (
        <>
            {PageNavbar && <PageNavbar item={item} />}
            <ItemLayout item={item} >
                {SubPage && <SubPage item={item}>
                    {children}
                </SubPage>}
            </ItemLayout>        
        </>
    )    
}


/**
 * Base wrapper pro stránky pracující s jedním entity itemem podle `:id` z routy.
 *
 * Komponenta:
 * - načte `id` z URL přes `useParams()`
 * - sestaví minimální `item` objekt `{ id }`
 * - poskytne jej přes `AsyncActionProvider`, který zajistí načtení entity pomocí `queryAsyncAction`
 * - vloží do stránky navbar přes `PlaceChild Component={PageNavbar}`
 * - vyrenderuje `children` uvnitř provideru (tj. až v kontextu načtené entity)
 *
 * Typické použití je jako obálka routy typu `/.../:id`, kde vnořené komponenty
 * (detail, editace, akce) používají kontext z `AsyncActionProvider`.
 *
 * @component
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 *   Obsah stránky, který se má vyrenderovat uvnitř `AsyncActionProvider`.
 * @param {Function} [props.queryAsyncAction=ReadAsyncAction]
 *   Async action (např. thunk) použitá pro načtení entity z GraphQL endpointu.
 *   Dostane `item` s `id` (a případně další parametry podle implementace provideru).
 *
 * @returns {import("react").JSX.Element}
 *   Provider s navigací (`PageNavbar`) a obsahem stránky (`children`).
 */
export const PageItemBase = ({ 
    queryAsyncAction=ReadAsyncAction,
    PageNavbar=null,
    ItemLayout=LargeCard,
    SubPage=GeneratedContentBase,
}) => {
    const {id} = useParams()
    const item = {id}
    return (
        <AsyncActionProvider item={item} queryAsyncAction={queryAsyncAction}>
            <PageItemInnerStructure 
                PageNavbar={PageNavbar}
                ItemLayout={ItemLayout}
                SubPage={SubPage}
            />
        </AsyncActionProvider>
    )
}





export const PageContent = ({children}) => {
     const gqlContext= useGQLEntityContext()
     const { item } = gqlContext || {}
    if (!item) return (<div>Položka nenalezena<pre>{JSON.stringify(gqlContext)}</pre></div>)
    return (
        <LargeCard item={item} >
            {children?children:<>
                <MediumCardScalars item={item} />
                <MediumCardVectors item={item} />
            </>}
        </LargeCard>
    )
}

export const Page = ({ children }) => {
    const {id, typename} = useParams()
    // const id = "51d101a0-81f1-44ca-8366-6cf51432e8d6";
    const item = {id}
    const { ByIdAsyncAction, queryById } = useGQLType(typename || "RoleGQLModel")    
    return (
        // <div>Hello</div>
        <>{ByIdAsyncAction&&
            <AsyncActionProvider item={item} queryAsyncAction={ByIdAsyncAction}>
                <PageContent>
                    {children}
                </PageContent>
            </AsyncActionProvider>
        }
        {!ByIdAsyncAction&&
            <div>No ByIdAsyncAction for type {typename}</div>
        }
        <Row>
            <Col>
                <CardCapsule header="QueryById">
                    <pre>{queryById}</pre>
                </CardCapsule>
            </Col>
            <Col>
                <CardCapsule header="Parametry">
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                </CardCapsule>
            </Col>
        </Row>
        </>
    )
}