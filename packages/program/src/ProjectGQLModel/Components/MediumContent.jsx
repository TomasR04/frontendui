import { Col } from "../../../../_template/src/Base/Components/Col"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { useCallback, useEffect, useState } from "react"
import { Dialog } from "../../../../_template/src/Base/FormControls/Dialog"
import { Input } from "../../../../_template/src/Base/FormControls/Input"
import { EntityLookup } from "../../../../_template/src/Base/FormControls/EntityLookup"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { ReadAsyncAction as ReadGroupAsyncAction } from "../../../../_template/src/GroupGQLModel/Queries/ReadAsyncAction"
import { InsertAsyncAction as InsertRoleAsyncAction } from "../../../../_template/src/RoleGQLModel/Queries"
import { SearchAsyncAction as SearchUserAsyncAction } from "../../../../_template/src/UserGQLModel/Queries/SearchAsyncAction"
import { SearchAsyncAction as SearchRoleTypeAsyncAction } from "../../../../_template/src/RoleTypeGQLModel/Queries/SearchAsyncAction"
import { Link } from "./Link"
import { RBACObject } from "../../../../_template/src/RoleGQLModel/Components/RBACObject"
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


import { MediumContent as MediumContent_} from "../../../../_template/src/Base/Components/MediumContent"
import {Attribute, formatDateTime} from "../../../../_template/src/Base/Components"

//export { MediumContent } from "../../../../_template/src/Base/Components/MediumContent"

export const MediumContent = ({ item, children}) => {
    
    return (
        <>
            {item?.name && (
                <Attribute label="Název">
                    <Link item={item} />
                </Attribute>
            )}
            {item?.nameEn && (
                <Attribute label="Anglický název">
                    {item.nameEn}
                </Attribute>
            )}
            {item?.guarantors && (
                <Attribute label="Garanti">
                    <Link item={item.guarantors} />
                </Attribute>
            )}
            {item?.licencedGroup && (
                <Attribute label="Licencovaná skupina">
                    <Link item={item.licencedGroup} />
                </Attribute>
            )}
            {item?.type && (
                <Attribute label="Typ">
                    {item.type.name}
                </Attribute>
            )}
            

            {item?.rbacobject?.currentUserRoles?.length > 0 && (
                <Attribute label="Moje role">
                    {item.rbacobject.currentUserRoles.map(role => (
                        <span key={role.id} className="badge bg-secondary me-1">
                    {role.roletype?.name}
                </span>
                    ))}
                </Attribute>
            )}
            <hr />
            {item?.createdby?.fullname && (
                <Attribute label="Vytvořil">
                    {item.createdby.fullname}
                </Attribute>
            )}
            {item?.created && (
                <Attribute label="Vytvořeno">
                    {formatDateTime(item.created)}
                </Attribute>
            )}
            {item?.lastchange && (
                <Attribute label="Změněno">
                    {formatDateTime(item.lastchange)}
                </Attribute>
            )}
            {item?.changedby?.fullname && (
                <Attribute label="Změnil">
                    {item.changedby.fullname}
                </Attribute>
            )}
            {children}
        </>
    )
}

/*export const MediumContent = ({ item, children }) => {
    

    return (
        <>
            
            
            
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                //if (attribute_name !== "id") return null
                if (attribute_name === "_version") return null
                if (attribute_name === "_updatedAt") return null
                if (attribute_name === "created") return null
                if (attribute_name === "changedbyId") return null
                if (attribute_name === "rbacobjectId") return null
                if (attribute_name === "__typename") return null
                if (attribute_name === "createdbyId") return null
                if (Array.isArray(attribute_value)) return null
                if (typeof attribute_value === "object" && attribute_value !== null) return null
                let attribute_value_result = attribute_value
                // Attribute value is null, display "bez záznamu" instead of "null" for better user experience
                if (attribute_value_result === "null"){
                    attribute_value_result = "Bez záznamu"
                }
                
                // let attribute_value_result = attribute_value
                if (Array.isArray(attribute_value))
                    // attribute_value_result = <CardCapsule><Table data={attribute_value} /></CardCapsule>
                    return null
                else if (typeof attribute_value === "object" && attribute_value !== null)
                    // attribute_value_result = <MediumCard item={attribute_value} />
                    return null
                else if (attribute_name === "__typename") {
                    
                }
                if (attribute_name === "id")
                    attribute_value_result = <Link item={item}>{item?.id || "Data error"}</Link>
                if (attribute_name === "name"){
                    attribute_name = "Název"
                    attribute_value_result = <Link item={item} />
                }
                    
                // else return null
                if (attribute_value)
                    return (
                        <Row key={attribute_name}>
                            <Col className="col-4"><b>{attribute_name}</b></Col>
                            <Col className="col-8">{attribute_value_result}</Col>
                        </Row>
                    )
                else return null
            })}
            
        </>
    )
}*/

//export { MediumContent } from "../../../../_template/src/Base/Components/MediumContent"