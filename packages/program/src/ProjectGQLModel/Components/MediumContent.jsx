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
const ProgramRBACEdit = ({ item }) => {
    const { id = "" } = item || {};
    const { entity, loading, error, run } = useAsyncThunkAction(ReadGroupAsyncAction, { id }, { deferred: true });
    const { loading: saving, error: updateError, run: save } = useAsyncThunkAction(InsertRoleAsyncAction, { id }, { deferred: true });
    const [roles, setRoles] = useState((entity || {})?.roles || []);

    useEffect(() => {
        if (!id) return;
        run({ id }).catch(() => null);
    }, [id, run]);

    useEffect(() => {
        setRoles((entity || {})?.roles || []);
    }, [entity]);

    const [role, setRole] = useState({
        id: crypto.randomUUID(),
        groupId: entity?.id ?? id,
    });

    const handleChangeOrBlur = useCallback((e) => {
        const fieldId = e?.target?.id;
        const value = e?.target?.value;
        if (!fieldId) return;
        setRole((prev) => ({ ...prev, [fieldId]: value }));
    }, []);

    const handleConfirm = useCallback(async () => {
        await save(role);
        await run({ id });
        setRole((prev) => ({
            ...prev,
            id: crypto.randomUUID(),
            userId: null,
            user: null,
        }));
    }, [id, role, run, save]);

    return (<>
        <AsyncStateIndicator error={error} loading={loading} text={"Nahrávám"} />
        <AsyncStateIndicator error={updateError} loading={saving} text={"Ukládám"} />
        <table className="table table-stripped">
            <thead>
                <tr>
                    <th>Typ role</th>
                    <th>Osoba</th>
                    <th>Počátek</th>
                    <th>Konec</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {roles.map((existingRole) => (
                    <tr key={existingRole?.id}>
                        <td>{existingRole?.roletype?.name || "-"}</td>
                        <td>{existingRole?.user?.fullname || existingRole?.user?.name || "-"}</td>
                        <td>{existingRole?.startdate || "-"}</td>
                        <td>{existingRole?.enddate || "-"}</td>
                        <td />
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <EntityLookup
                            id="roletypeId"
                            className="form-control"
                            asyncAction={SearchRoleTypeAsyncAction}
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.roletype}
                        />
                    </td>
                    <td>
                        <EntityLookup
                            id="userId"
                            className="form-control"
                            asyncAction={SearchUserAsyncAction}
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.user}
                        />
                    </td>
                    <td>
                        <Input
                            id="startdate"
                            type="datetime-local"
                            className="form-control"
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.startdate}
                        />
                    </td>
                    <td>
                        <Input
                            id="enddate"
                            type="datetime-local"
                            className="form-control"
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.enddate}
                        />
                    </td>
                    <td>
                        <button
                            className="btn btn-outline-primary form-control"
                            onClick={handleConfirm}
                            disabled={!(role?.userId && role?.startdate && role?.roletypeId)}
                        >
                            Ok
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </>);
};

export const MediumContent = ({ item, children }) => {
    const programRBACObject = item?.rbacobject;
    const [rolesVisible, setRolesVisible] = useState(false)
    const canManageProgramRoles = !!programRBACObject?.id

    const handleShowRoles = useCallback(() => setRolesVisible(true), [])
    const handleHideRoles = useCallback(() => setRolesVisible(false), [])

    return (
        <>
            <RBACObject item={item} />
            <div className="mb-3">
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleShowRoles}
                    disabled={!canManageProgramRoles}
                >
                    Oprávnění programu
                </button>
            </div>
            {rolesVisible && canManageProgramRoles && (
                <Dialog
                    title="Oprávnění programu"
                    onCancel={handleHideRoles}
                    onOk={handleHideRoles}
                >
                    <ProgramRBACEdit item={programRBACObject} />
                </Dialog>
            )}
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                // if (attribute_name !== "id") return null
                if (Array.isArray(attribute_value)) return null
                if (typeof attribute_value === "object" && attribute_value !== null) return null
                let attribute_value_result = attribute_value
                // Attribute value is null, display "bez záznamu" instead of "null" for better user experience
                if (attribute_value_result === "null"){
                    attribute_value_result = "bez záznamu"
                }
                
                // let attribute_value_result = attribute_value
                if (Array.isArray(attribute_value))
                    // attribute_value_result = <CardCapsule><Table data={attribute_value} /></CardCapsule>
                    return null
                else if (typeof attribute_value === "object" && attribute_value !== null)
                    // attribute_value_result = <MediumCard item={attribute_value} />
                    return null
                else if (attribute_name === "__typename") {
                    /*attribute_value_result = <Link item={attribute_value} />*/
                    // console.log("else1", attribute_name, attribute_value)
                }
                if (attribute_name === "id")
                    attribute_value_result = <Link item={item}>{item?.id || "Data error"}</Link>
                if (attribute_name === "name")
                    attribute_value_result = <Link item={item} />
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
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (attribute_value !== null) return null
                let attribute_value_result = JSON.stringify(attribute_value)

                // Attribute value is null, display "bez záznamu" instead of "null" for better user experience
                if (attribute_value_result === "null"){
                    attribute_value_result = "bez záznamu"
                }
                if (Array.isArray(attribute_value))
                    // attribute_value_result = <CardCapsule><Table data={attribute_value} /></CardCapsule>
                    return null
                else if (typeof attribute_value === "object" && attribute_value !== null)
                    // attribute_value_result = <MediumCard item={attribute_value} />
                    return null
                else if (attribute_name === "__typename") {
                    /*attribute_value_result = <Link item={attribute_value} />*/
                    console.log("else2", attribute_name, attribute_value)
                }
                if (attribute_value)
                    return null
                else
                    return (
                        <Row key={attribute_name}>
                            <Col className="col-4"><b>{attribute_name}</b></Col>
                            <Col className="col-8">{attribute_value_result}</Col>
                        </Row>
                    )
            })}
            {children}
        </>
    )
}

//export { MediumContent } from "../../../../_template/src/Base/Components/MediumContent"