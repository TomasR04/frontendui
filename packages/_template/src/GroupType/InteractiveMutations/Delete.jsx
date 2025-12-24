import { useNavigate } from "react-router-dom";
import { useGQLEntityContext } from "../../Base/Helpers/GQLEntityProvider";
import { PermissionGate, usePermissionRoles } from "../../../../dynamic/src/Hooks/useRoles"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction";
import { LinkURI, MediumEditableContent } from "../Components";
import { Row } from "../../Base/Components/Row";
import { Col } from "../../Base/Components/Col";
import { DeleteAsyncAction } from "../Queries";
import { AsyncStateIndicator } from "../../Base/Helpers/AsyncStateIndicator";
import { useState } from "react";
import { useCallback } from "react";
import { VectorItemsURI } from "../Pages";
import { ProxyLink, useLink } from "../../Base/Components/ProxyLink";
import { useMemo } from "react";
import { Dialog } from "../../Base/FormControls/Dialog";
import { makeMutationURI } from "./helpers";


export const DeleteURI = makeMutationURI(LinkURI, "delete", { withId: true });

export const DeleteLink = ({ item, preserveHash = true, preserveSearch = true, ...props }) => {
    const to = useMemo(() => {
        const id = item?.id ?? "";
        return DeleteURI.replace(":id", String(id));
    }, [item?.id]);

    return (
        <PermissionGate oneOfRoles={["superadmin"]} mode={"absolute"}>
            <ProxyLink
                to={to}
                preserveHash={preserveHash}
                preserveSearch={preserveSearch}
                {...props}
            />
        </PermissionGate>
    );
};

export const DeleteBody = ({ children, mutationAsyncAction = DeleteAsyncAction }) => {
    const navigate = useNavigate();
    const { item } = useGQLEntityContext()

    const {
        draft,
        dirty,
        loading: saving,
        error: savingError,
        onChange,
        onBlur,
        commitNow
    } = useEditAction(mutationAsyncAction, item, {
        mode: "confirm",
        // onCommit: contextOnChange
    })

    const handleConfirm = async () => {
        const result = await commitNow(draft)
        console.log("handleConfirm", result)
        if (result && navigate) {
            navigate(VectorItemsURI, { replace: true })
        }
    }

    const handleCancel = () => {
        navigate(-1)
    }

    if (!item) return null

    return (
        <PermissionGate mode="absolute" oneOfRoles={["superadmin"]}>
            <Row>
                <Col></Col>
                <Col>
                    <MediumEditableContent item={draft} onChange={onChange} onBlur={onBlur} >
                        <AsyncStateIndicator error={savingError} loading={saving} text={"Ukládám"} />
                        {children}
                        <button
                            className="btn btn-warning form-control"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Zrušit
                        </button>
                        <button
                            className="btn btn-primary form-control"
                            onClick={handleConfirm}
                            disabled={saving}
                        >
                            Smazat
                        </button>

                    </MediumEditableContent>
                </Col>
                <Col></Col>
            </Row>
        </PermissionGate>
    )
}

export const DeleteButton = ({ children, ...props }) => {
    // const { can, roleNames } = useRoles(item, ["superadmin"])
    const { follow } = useLink({ to: VectorItemsURI })
    const [visible, setVisible] = useState(false)
    const togleVisible = () => setVisible(prev => !prev)
    const handleOkClick = () => {
        setVisible(false)
        follow()
    }
    const handleCancelClick = () => {
        setVisible(false)
    }

    return (
        <PermissionGate oneOfRoles={["superadmin"]} mode={"absolute"}>
            <button {...props} onClick={togleVisible}>{children || "Odstranit"}</button>
            {visible && <DeleteDialog onOk={handleOkClick} onCancel={handleCancelClick} />}
            {/* {JSON.stringify(visible)} */}
        </PermissionGate>
    )
}

const dummyFunc = () => null
export const DeleteDialog = ({
    title = "Odstranit",

    oklabel = "Odstranit",
    cancellabel = "Zrušit",
    onOk: handleOk = dummyFunc,
    onCancel: handleCancel = dummyFunc,
}) => {
    const {
        item,
        // onChange: contextOnChange 
    } = useGQLEntityContext()
    const {
        draft,
        onCancel,
        commitNow,
        error,
        loading: saving
    } = useEditAction(DeleteAsyncAction, item, { mode: "confirm" })

    const handleConfirm = useCallback(async () => {
        const result = await commitNow(draft);
        handleOk(result);

        return result;
    }, [commitNow, handleOk, draft]);

    const handleCancel_ = useCallback(async () => {
        onCancel();
        handleCancel();
    }, [onCancel, handleCancel]);

    return (
        <Dialog
            title={title}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onCancel={handleCancel_}
            onOk={handleConfirm}
        >
            <AsyncStateIndicator error={error} loading={saving} text={"Odstraňuji"} />
            {/* <MediumEditableContent item={item} onChange={contextOnChange} onBlur={contextOnChange} /> */}
        </Dialog>
    )
}