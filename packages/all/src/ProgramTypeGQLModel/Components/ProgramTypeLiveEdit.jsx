import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared";
import { ProgramTypeUpdateAsyncAction } from "../Queries";
import { ProgramTypeMediumEditableContent } from "./ProgramTypeMediumEditableContent";
import { useState } from "react";
import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared";

/**
 * ProgramTypeLiveEdit Component
 *
 * Interaktivní React komponenta pro live editaci entity `programtype` s podporou optimistického fetchování a debounce delaye.
 *
 * - Používá `useAsyncAction` k načítání a update entit (např. GraphQL mutation).
 * - Pokud se hodnota pole změní, spustí se update po krátkém zpoždění (`delayer`) — uživatelské změny nejsou ihned posílány, ale až po pauze.
 * - Zobrazuje loading a error stav pomocí komponent `LoadingSpinner` a `ErrorHandler`.
 * - Předává editované hodnoty do komponenty `ProgramTypeMediumEditableContent`, která zajišťuje zobrazení a editaci jednotlivých polí šablony (`programtype`).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {Object} props.programtype - Objekt reprezentující editovanou šablonu (programtype entity).
 * @param {React.ReactNode} [props.children] - Libovolné children, které se vloží pod editační komponentu.
 * @param {Function} [props.asyncAction=ProgramTypeUpdateAsyncAction] - Asynchronní akce pro update (`useAsyncAction`), typicky GraphQL update mutation.
 *
 * @example
 * // Standardní použití
 * <ProgramTypeLiveEdit programtype={programtypeEntity} />
 *
 * @example
 * // S vlastním asyncAction a doplňkovým obsahem
 * <ProgramTypeLiveEdit programtype={programtypeEntity} asyncAction={myUpdateAction}>
 *   <div>Extra obsah nebo poznámka</div>
 * </ProgramTypeLiveEdit>
 *
 * @returns {JSX.Element}
 *   Interaktivní komponenta pro live editaci šablony, včetně spinneru a error handleru.
 */
export const ProgramTypeLiveEdit = ({programtype, children, asyncAction=ProgramTypeUpdateAsyncAction}) => {
    const { loading, error, entity, fetch } = useAsyncAction(asyncAction, programtype, { deferred: true });
    const [delayer] = useState(() => CreateDelayer());
    const onChange_ = async (e) => {
        const { value, id } = e.target;
        if (value) {
            if (entity) {
                console.log(entity[id] === value, entity[id], value)
                if (entity[id] === value) return;
            } else {
                console.log(programtype[id] === value, programtype[id], value)
                if (programtype[id] === value) return;
            }
            await delayer(() => fetch({ 
                id: programtype.id, 
                lastchange: (entity?.lastchange || programtype?.lastchange), 
                [id]: value 
            }));
        }
    }
    
    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {programtype && (
            <ProgramTypeMediumEditableContent programtype={entity || programtype} onChange={onChange_} onBlur={onChange_} />
        )}
        {children}
    </>)
}