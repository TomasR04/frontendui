import { PermissionGate } from "../../../../dynamic/src/Hooks/useRoles"
import { UpdateAsyncAction } from "../Queries"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction"
import { useState } from "react"
import { LinkURI, LiveEdit, MediumEditableContent } from "../Components"
import { useCallback } from "react"
import { useGQLEntityContext } from "../../Base/Helpers/GQLEntityProvider"
import { useMemo } from "react"
import { ProxyLink } from "../../Base/Components/ProxyLink"
import { AsyncStateIndicator } from "../../Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../Base/FormControls/Dialog"
import { makeMutationURI } from "./helpers"

export const UpdateURI = makeMutationURI(LinkURI, "edit", { withId: true });

export const UpdateLink = ({ item, preserveHash = true, preserveSearch = true, ...props }) => {
    const to = useMemo(() => {
        const id = item?.id ?? "";
        return UpdateURI.replace(":id", String(id));
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

export const UpdateButton = ({ children, ...props }) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => setVisible(v => !v);
    const hide = () => setVisible(v => false)
    return (
        <PermissionGate oneOfRoles={["superadmin"]} mode={"absolute"}>
            <button {...props} onClick={toggle}>{children || "Editovat"}</button>
            {visible && <UpdateDialog onOk={hide} onCancel={hide} />}
        </PermissionGate>
    )
}

const dummyFunc = () => null
export const UpdateDialog = ({
    title = "Editace",
    oklabel = "Ok",
    cancellabel = "Zrušit",
    onOk: handleOk = dummyFunc,
    onCancel: handleCancel = dummyFunc,
}) => {
    const { item, onChange: contextOnChange } = useGQLEntityContext()
    const {
        draft,
        onChange,
        onBlur,
        onCancel,
        onConfirm,
        error,
        loading: saving
    } = useEditAction(UpdateAsyncAction, item, { mode: "confirm" })

    const handleCancel_ = useCallback(async () => {
        onCancel()
        handleCancel()
    }, [onCancel, handleCancel])

    const handleConfirm = useCallback(async () => {
        const result = await onConfirm();
        // console.log("ConfirmEdit handleConfirm result", result, "draft", draft)
        if (result) {
            const event = { target: { value: result } };
            // důležité: použij params z kontextu (provider si je drží jako "poslední vars")
            await contextOnChange(event);
        }
        handleOk()
        return result;
    }, [onConfirm, handleOk, contextOnChange]);

    return (
        <Dialog
            title={title}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onCancel={handleCancel_}
            onOk={handleConfirm}
        >
            <AsyncStateIndicator error={error} loading={saving} text={"Ukládám"} />
            <MediumEditableContent item={item} onChange={onChange} onBlur={onBlur} />
        </Dialog>
    )
}


export const UpdateBody = ({ mutationAsyncAction = UpdateAsyncAction }) => {
    const { item } = useGQLEntityContext()
    // const { can, roleNames } = useRolePermission(item, ["administrátor"])

    if (!item) return null

    return (

        <PermissionGate oneOfRoles={["superadmin"]} mode={"absolute"}>
            <LiveEdit item={item} mutationAsyncAction={mutationAsyncAction} />
        </PermissionGate>

    )
}

const onDone_ = () => null;

export const UpdateItemConfirm = ({ onDone = onDone_, children }) => {
    const { item, onChange: contextOnChange } = useGQLEntityContext()

    const {
        draft,
        dirty,
        onChange,
        onBlur,
        onCancel,
        onConfirm,
        error,
        loading: saving
    } = useEditAction(UpdateAsyncAction, item, { mode: "confirm" })

    const handleCancel = useCallback(async () => {
        onCancel()
        onDone()
    }, [onDone, onCancel])

    const handleConfirm = useCallback(async () => {
        const result = await onConfirm();
        // console.log("ConfirmEdit handleConfirm result", result, "draft", draft)
        if (result) {
            const event = { target: { value: result } };
            // důležité: použij params z kontextu (provider si je drží jako "poslední vars")
            await contextOnChange(event);
        }
        onDone()
        return result;
    }, [onDone, onConfirm, contextOnChange]);


    return (<>
        <AsyncStateIndicator error={error} loading={saving} text="Ukládám" />
        <MediumEditableContent item={item} onChange={onChange} onBlur={onBlur} >
            {children}
            <hr />
            {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
            <button
                className="btn btn-warning form-control"
                onClick={handleCancel}
                disabled={!dirty || saving}
            >
                Zrušit změny
            </button>
            <button
                className="btn btn-primary form-control"
                onClick={handleConfirm}
                disabled={!dirty || saving}
            >
                Uložit změny
            </button>
        </MediumEditableContent>
    </>
    )
}