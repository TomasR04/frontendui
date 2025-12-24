import { PermissionGate } from "../../../../dynamic/src/Hooks/useRoles"
import { LinkURI, MediumEditableContent } from "../Components"
import { useState } from "react"
import { ReadItemURI } from "../Pages/PageReadItem"
import { useCreateSession } from "../../../../dynamic/src/Hooks/useCreateSession"
import { InsertAsyncAction } from "../Queries"
import { AsyncStateIndicator } from "../../Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../Base/FormControls/Dialog"
import { ProxyLink } from "../../Base/Components/ProxyLink"
import { makeMutationURI } from "./helpers"


export const CreateURI = makeMutationURI(LinkURI, "create", { withId: false });

export const CreateLink = (props) => (
    <PermissionGate oneOfRoles={["superadmin"]} mode={"absolute"}>
        <ProxyLink to={CreateURI} {...props}>Create</ProxyLink>
    </PermissionGate>
);

export const CreateButton = ({ children, ...props }) => {
    const [visible, setVisible] = useState(false)
    const handleClick = () => {
        setVisible(prev => !prev)
    }

    return (
        <PermissionGate oneOfRoles={["superadmin"]} mode={"absolute"} >
            <button {...props} onClick={handleClick}>{children || "Vytvořit nový"}</button>
            {visible && (
                <CreateDialog
                    onOk={handleClick}
                    onCancel={handleClick}
                />
            )}
        </PermissionGate>
    )
}

export const CreateDialog = ({
    title = "Nový typ",
    oklabel = "Ok",
    cancellabel = "Zrušit",
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    children,
    ...props
}) => {
    const session = useCreateSession({
        readUri: ReadItemURI,
        mutationAsyncAction,
        onAfterConfirm: async (result) => {
            if (onOk) onOk(result);
        },
        onAfterCancel: async () => {
            if (onCancel) onCancel();
        },
    });

    return (
        <Dialog
            title={title}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onCancel={session.handleCancel}
            onOk={session.handleConfirm}
            {...props}
        >
            <AsyncStateIndicator error={session.error} loading={session.saving} />
            <MediumEditableContent item={session.draft} onChange={session.onChange} onBlur={session.onBlur}>
                {children}
            </MediumEditableContent>
        </Dialog>
    );
};

export const CreateBody = ({
    children,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    ...props
}) => {
    const session = useCreateSession({
        readUri: ReadItemURI,
        mutationAsyncAction,
        onAfterConfirm: async (result, draft) => {
            if (onOk) return onOk(result, draft);
            // když onOk není, session udělá default navigaci
        },
        onAfterCancel: async () => {
            if (onCancel) return onCancel();
            // když onCancel není, session udělá default navigate(-1)
        }
    });

    return (
        <MediumEditableContent
            item={session.draft}
            onChange={session.onChange}
            onBlur={session.onBlur}
            {...props}
        >
            <AsyncStateIndicator error={session.error} loading={session.saving} />
            {children}

            <button
                className="btn btn-warning form-control"
                onClick={session.handleCancel}
            // disabled={!session.dirty || session.saving}
            >
                Zrušit změny
            </button>

            <button
                className="btn btn-primary form-control"
                onClick={session.handleConfirm}
            // disabled={!session.dirty || session.saving}
            >
                Uložit změny
            </button>
        </MediumEditableContent>
    );
};

