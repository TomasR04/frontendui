import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { UpdateAsyncAction } from "../Queries";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";
import { AsyncAcionProvider, useGQLEntityContext } from "../Utils/GQLEntityProvider";
import { MediumEditableContent } from "./MediumEditableContent";

/**
 * TemplateLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `template` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `TemplateMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`template`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.template - Objekt reprezentující editovanou šablonu (template entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=TemplateUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <TemplateLiveEdit template={templateEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <TemplateLiveEdit template={templateEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </TemplateLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const LiveEdit = ({ children, asyncAction=UpdateAsyncAction}) => {
    const { onChange, onBlur, item } = useGQLEntityContext()
    return (
        <AsyncAcionProvider 
            item={item} 
            queryAsyncAction={asyncAction}
            options={{deferred: true, network: true}}
            onChange={onChange}
            onBlur={onBlur}
        >
            <LiveEditWrapper item={item}>
                {children}
                <hr />
                <pre>{JSON.stringify(item, null, 2)}</pre>
            </LiveEditWrapper>
        </AsyncAcionProvider>
    )
}

const LiveEditWrapper = ({ item, children }) => {
    const { run , error, loading, entity, data, onChange, onBlur } = useGQLEntityContext()
    const localOnChange = async (e) => {
        const newItem = { ...item, [e.target.id]: e.target.value }
        const newEvent = { target: { value: newItem } }
        // console.log("LiveEditWrapper localOnChange start e", e, '=>', newEvent)
        const result = await onChange(newEvent)
        // console.log("LiveEditWrapper localOnChange end e", e, '=>', newItem, '=>', result)
        return result
    }
    return (
        <MediumEditableContent item={item} onChange={localOnChange} onBlur={onBlur} >
            {children}
            <hr />
            <pre>{JSON.stringify(item, null, 2)}</pre>
        </MediumEditableContent>
    )
}