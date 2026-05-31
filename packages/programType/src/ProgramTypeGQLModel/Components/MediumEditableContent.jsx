import { Input } from "../../../../_template/src/Base/FormControls/Input"
import {EntityLookup} from "../../../../_template/src/Base/FormControls/EntityLookup"
import {Select} from "../../../../_template/src/Base/FormControls/Select"
import { ProgramTypeMediumEditableContent } from "../../../../all/src/ProgramTypeGQLModel/Components/ProgramTypeMediumEditableContent"
import { Options } from "../../../../shared/src/Components/Options"
import { ProgramTypeReadPageAsyncAction } from "../../../../all/src/ProgramTypeGQLModel/Queries/ProgramTypeReadPageAsyncAction"
import { SearchAsyncAction } from "../Queries/SearchAsyncAction"
import { SearchLevelAsyncAction } from "../Queries/SearchAsyncAction"
import { SearchTitleAsyncAction } from "../Queries/SearchAsyncAction"
import { SearchLanguageAsyncAction } from "../Queries/SearchAsyncAction"
import { SearchFormAsyncAction } from "../Queries/SearchAsyncAction"

/**
 * A component that displays medium-level content for an template entity.
 *
 * This component renders a label "TemplateMediumContent" followed by a serialized representation of the `template` object
 * and any additional child content. It is designed to handle and display information about an template entity object.
 *
 * @component
 * @param {Object} props - The properties for the TemplateMediumContent component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `template` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateMediumContent template={templateEntity}>
 *   <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
 */
export const MediumEditableContent = ({ item, onChange=(e)=>null, onBlur=(e)=>null, showEntityLookups = true, children}) => {
    return (
        <>
        {/* defaultValue={item?.name|| "Název"}  */}
            <Input id={"name"} label={"Jméno"} className="form-control" value={item?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"nameEn"} label={"Anglický název"} className="form-control" value={item?.nameEn|| "Anglický název"} onChange={onChange} onBlur={onBlur} />    
                
            {showEntityLookups && (
                <>
                    <EntityLookup
                        id={"levelId"}
                        label={"Level programu"}
                        className="form-control"
                        asyncAction={SearchLevelAsyncAction}
                        value={item?.levelType}
                        onChange={onChange}
                        onSelect={(group) => {
                            if (group) {
                                onChange({ target: { id: "levelType", value: group } });
                            }
                            return { clear: true };
                        }}
                        onBlur={onBlur}
                    />
                    <EntityLookup
                        id={"titleId"}
                        label={"Tituly programu"}
                        className="form-control"
                        asyncAction={SearchTitleAsyncAction}
                        value={item?.titleType}
                        onChange={onChange}
                        onSelect={(group) => {
                            if (group) {
                                onChange({ target: { id: "titleType", value: group } });
                            }
                            return { clear: true };
                        }}
                        onBlur={onBlur}
                    />
                    <EntityLookup
                        id={"languageId"}
                        label={"Jazyk programu"}
                        className="form-control"
                        asyncAction={SearchLanguageAsyncAction}
                        value={item?.languageType}
                        onChange={onChange}
                        onSelect={(group) => {
                            if (group) {
                                onChange({ target: { id: "languageType", value: group } });
                            }
                            return { clear: true };
                        }}
                        onBlur={onBlur}
                    />
                    <EntityLookup
                        id={"formId"}
                        label={"Forma programu"}
                        className="form-control"
                        asyncAction={SearchFormAsyncAction}
                        value={item?.formType}
                        onChange={onChange}
                        onSelect={(group) => {
                            if (group) {
                                onChange({ target: { id: "formType", value: group } });
                            }
                            return { clear: true };
                        }}
                        onBlur={onBlur}
                    />
                </>
            )}
            {children}
        </>
    )
    
}

