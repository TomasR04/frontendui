import { Input } from "@hrbolek/uoisfrontend-shared"

/**
 * A component that displays medium-level content for an programtype entity.
 *
 * This component renders a label "ProgramTypeMediumContent" followed by a serialized representation of the `programtype` object
 * and any additional child content. It is designed to handle and display information about an programtype entity object.
 *
 * @component
 * @param {Object} props - The properties for the ProgramTypeMediumContent component.
 * @param {Object} props.programtype - The object representing the programtype entity.
 * @param {string|number} props.programtype.id - The unique identifier for the programtype entity.
 * @param {string} props.programtype.name - The name or label of the programtype entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `programtype` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const programtypeEntity = { id: 123, name: "Sample Entity" };
 * 
 * <ProgramTypeMediumContent programtype={programtypeEntity}>
 *   <p>Additional information about the entity.</p>
 * </ProgramTypeMediumContent>
 */
export const ProgramTypeMediumEditableContent = ({programtype, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
            <Input id={"name"} label={"Název"} className="form-control" value={programtype?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"name_en"} label={"Anglický název"} className="form-control" value={programtype?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}
