import { Input } from "../../../../_template/src/Base/FormControls/Input"
import {EntityLookup} from "../../../../_template/src/Base/FormControls/EntityLookup"
import {Select} from "../../../../_template/src/Base/FormControls/Select"
import { ProgramTypeMediumEditableContent } from "../../../../all/src/ProgramTypeGQLModel/Components/ProgramTypeMediumEditableContent"
import { Options } from "@hrbolek/uoisfrontend-shared/Components/Options"
import { ProgramTypeReadPageAsyncAction } from "../../../../all/src/ProgramTypeGQLModel/Queries/ProgramTypeReadPageAsyncAction"
import { SearchAsyncAction as SearchGroupAsyncAction } from "../../../../_template/src/GroupGQLModel/Queries/SearchAsyncAction"
import { useState } from "react";
import {SearchSubjectAsyncAction} from "../Queries/SearchAsyncAction"

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
export const CreateContent = ({
    item,
    onChange = (e) => null,
    onBlur = (e) => null,
    showEntityLookups = true,
    children
}) => {
    const [subjects, setSubjects] = useState([]);

    const normalizeSubjectInput = (subject) => {
        if (!subject || typeof subject !== "object") return null;
        if (!subject.name) return null;
        const result = {
            name: subject.name,
            programId: item?.id ?? subject.programId,
        };
        if (subject.nameEn !== undefined) result.nameEn = subject.nameEn;
        if (subject.description !== undefined) result.description = subject.description;
        if (subject.descriptionEn !== undefined) result.descriptionEn = subject.descriptionEn;
        if (subject.groupId !== undefined) result.groupId = subject.groupId;
        return result;
    };

    const handleAddSubject = () => {
        setSubjects(prev => [
            ...prev,
            { id: crypto.randomUUID(), subject: null }
        ]);
    };

    const handleSelectSubject = (index) => (selectedSubject) => {
        setSubjects(prev => {
            const next = prev.map((rowItem, idx) =>
                idx === index ? { ...rowItem, subject: selectedSubject } : rowItem
            );
            onChange({
                target: {
                    id: "subjects",
                    value: next
                        .map(rowItem => normalizeSubjectInput(rowItem.subject))
                        .filter(Boolean)
                }
            });
            return next;
        });
    };

    return (
        <>
            <Input id={"name"} label={"Jméno"} className="form-control" value={item?.name || "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"nameEn"} label={"Anglický název"} className="form-control" value={item?.nameEn || "Anglický název"} onChange={onChange} onBlur={onBlur} />

            <Select id={"typeId"} label={"Typ programu"} className="form-control" value={item?.type?.id || ""} onChange={onChange} onBlur={onBlur}>
                <Options asyncAction={ProgramTypeReadPageAsyncAction} params={{ limit: 200 }} valueSelector={(opt) => (opt?.name)} />
            </Select>

            {showEntityLookups && (
                <>
                    <EntityLookup
                        id={"licencedGroupId"}
                        label={"Licencovaná skupina"}
                        className="form-control"
                        asyncAction={SearchGroupAsyncAction}
                        value={item?.licencedGroup}
                        onChange={onChange}
                        onSelect={(group) => {
                            if (group) {
                                onChange({ target: { id: "licencedGroup", value: group } });
                            }
                            return { clear: true };
                        }}
                        onBlur={onBlur}
                    />
                    <EntityLookup
                        id={"guarantorsGroupId"}
                        label={"Garanti programu"}
                        className="form-control"
                        asyncAction={SearchGroupAsyncAction}
                        value={item?.guarantors}
                        onChange={onChange}
                        onSelect={(group) => {
                            if (group) {
                                onChange({ target: { id: "guarantors", value: group } });
                            }
                            return { clear: true };
                        }}
                        onBlur={onBlur}
                    />
                </>
            )}

            {/* <div className="subjects-section">
                <h3 className="border-bottom">Předměty</h3>
                <div className="subjects">
                    {subjects.map((subject, index) => (
                        <div key={subject.id} className="subject-item border border-round p-2">
                            <EntityLookup
                                id={`subjectId-${subject.id}`}
                                label={"Předmět"}
                                className="form-control"
                                asyncAction={SearchSubjectAsyncAction}
                                value={subject.subject}
                                onSelect={handleSelectSubject(index)}
                            />
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary" type="button" onClick={handleAddSubject}>
                    Přidat předmět
                </button>
            </div>*/}

            {children}
        </>
    );
};

export const MediumEditableTypeContent = ({ item, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
        {/* defaultValue={item?.name|| "Název"}  */}      
            <Input id={"name"} label={"Typ programu"} className="form-control" value={item?.type?.name|| "Typ programu"} onChange={onChange} onBlur={onBlur} />
           
            {children}
        </>
    )
    
}

