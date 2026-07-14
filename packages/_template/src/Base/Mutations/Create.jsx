import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { LinkURI, MediumEditableContent } from "../Components"
import { useState } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { useCreateSession } from "../../../../dynamic/src/Hooks/useCreateSession"
import { InsertAsyncAction } from "../Queries"
import { ProgramTypeReadPageAsyncAction } from "../../../../all/src/ProgramTypeGQLModel/Queries/ProgramTypeReadPageAsyncAction"
import { GroupReadPageAsyncAction } from "../../../../all/src/GroupGQLModel/Queries/GroupReadPageAsyncAction"
import { GENERATE_AMOUNT, makeRandomProgramName, resolveRandomProgramIds } from "../../../../program/src/ProjectGQLModel/Utils/randomProgramGeneration"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../../../_template/src/Base/FormControls/Dialog"
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink"
import { makeMutationURI } from "./helpers"
import { Lock } from "react-bootstrap-icons"
import { GeneralButton, GeneralDialog, GeneralLink } from "./General"


export const CreateURI = makeMutationURI(LinkURI, "create", { withId: false });
const ReadItemURI = `${LinkURI}:id`

export const CreateLink = ({
    uriPattern = CreateURI,
    children,
    ...props
}) => (
    <GeneralLink uriPattern={uriPattern} {...props}>
        {children}
    </GeneralLink>
);


const DefaultContent = MediumEditableContent

const BulkGenerateToolbar = ({ item, mutationAsyncAction }) => {
    const [message, setMessage] = useState("")
    const [working, setWorking] = useState(false)

    const { run } = useAsyncThunkAction(mutationAsyncAction, item, { deferred: true })
    const { run: runProgramTypes } = useAsyncThunkAction(ProgramTypeReadPageAsyncAction, {}, { deferred: true })
    const { run: runGroups } = useAsyncThunkAction(GroupReadPageAsyncAction, {}, { deferred: true })

    const handleGenerate = async () => {
        if (working) return

        setWorking(true)
        setMessage("")

        try {
            // The helper returns shuffled pools, so every generated program can take the next value.
            const pools = await resolveRandomProgramIds({
                runProgramTypes,
                runGroups,
            })

            if (!pools) {
                setMessage("Nepodařilo se najít výchozí typ nebo skupiny pro generování.")
                return
            }

            for (let index = 0; index < GENERATE_AMOUNT; index += 1) {
                const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()
                await run({
                    id: crypto.randomUUID(),
                    name: makeRandomProgramName(index),
                    nameEn: `Random Program ${index + 1} ${suffix}`,
                    // Cycle through the shuffled pools so the batch does not keep repeating the same values.
                    typeId: pools.typePool[index % pools.typePool.length],
                    licencedGroupId: pools.licencedPool[index % pools.licencedPool.length],
                    guarantorsGroupId: pools.guarantorsPool[index % pools.guarantorsPool.length],
                })
            }

            setMessage(`Vygenerováno ${GENERATE_AMOUNT} programů.`)
        } catch (error) {
            setMessage(`Nepodařilo se generovat programy: ${error?.message ?? error}`)
        } finally {
            setWorking(false)
        }
    }

    return (
        <>
            <button
                type="button"
                className="btn btn-outline-primary form-control"
                onClick={handleGenerate}
                disabled={working}
            >
                {working ? `Generuji ${GENERATE_AMOUNT} programů...` : `Vygenerovat ${GENERATE_AMOUNT} náhodných programů`}
            </button>
            {message && <div className="small text-muted mt-2">{message}</div>}
        </>
    )
}

export const CreateDialog = ({
    title = "Nové oprávnění",
    oklabel = "Ok",
    cancellabel = "Zrušit",
    DefaultContent: DefaultContent_ = DefaultContent,
    item,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    children,
    ...props
}) => (
    <GeneralDialog
        title={title}
        oklabel={oklabel}
        cancellabel={cancellabel}
        DefaultContent={DefaultContent_}
        item={item}
        onOk={onOk}
        onCancel={onCancel}
        mutationAsyncAction={mutationAsyncAction}
        {...props}
    >
        {({ item: liveItem }) => (
            <>
                <BulkGenerateToolbar item={liveItem} mutationAsyncAction={mutationAsyncAction} />
                {children}
            </>
        )}
    </GeneralDialog>
);
export const CreateButton = ({
    mutationAsyncAction = InsertAsyncAction,
    CreateDialog: CreateDialog_ = CreateDialog,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI = ReadItemURI,
    uriPattern,          // pokud chceš allow override
    children,
    ...props
}) => (
    <GeneralButton
        mutationAsyncAction={mutationAsyncAction}
        Dialog={CreateDialog_}
        DefaultContent={DefaultContent_}
        uriPattern={uriPattern ?? readItemURI}
        {...props}
    >
        {children}
    </GeneralButton>
);

export const CreateBody = ({
    children,
    rbacitem,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    toolbar,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI = ReadItemURI,
    oneOfRoles = ["superadmin"],
    mode = "absolute",
    ...props
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={rbacitem}>
            <CreateBodyBody
                children={children}
                mutationAsyncAction={mutationAsyncAction}
                onOk={onOk} 
                onCancel={onCancel}
                toolbar={toolbar}
                DefaultContent={DefaultContent_}
                readItemURI={readItemURI}
                {...props}
            />
        </PermissionGate>
    );
};

const CreateBodyBody = ({
    children,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    toolbar,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI = ReadItemURI,
    ...props
}) => {
    const session = useCreateSession({
        readUri: readItemURI,
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
        <>
            <DefaultContent_
                item={session.draft}
                onChange={session.onChange}
                onBlur={session.onBlur}
                {...props}
            >
                <AsyncStateIndicator error={session.error} loading={session.saving} />
                {typeof toolbar === "function" ? toolbar(session) : toolbar}
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
            </DefaultContent_>
        </>
    );
};
