import { ReadAsyncAction } from "../Queries"
import { useState } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { CreateBody } from "../Mutations/Create"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { PageItemBase } from "./PageBase"
import { ProgramTypeReadPageAsyncAction } from "../../../../all/src/ProgramTypeGQLModel/Queries/ProgramTypeReadPageAsyncAction"
import { GroupReadPageAsyncAction } from "../../../../all/src/GroupGQLModel/Queries/GroupReadPageAsyncAction"
import { GENERATE_AMOUNT, makeRandomProgramName, resolveRandomProgramIds } from "../Utils/randomProgramGeneration"

// Toolbar for bulk generating random programs
const BulkGenerateToolbar = ({ session }) => {
    const [message, setMessage] = useState("")
    const [working, setWorking] = useState(false)
    const { run: runProgramTypes } = useAsyncThunkAction(ProgramTypeReadPageAsyncAction, {}, { deferred: true })
    const { run: runGroups } = useAsyncThunkAction(GroupReadPageAsyncAction, {}, { deferred: true })

    const canGenerate = Boolean(session?.commitNow)

    const handleGenerate = async () => {
        if (!canGenerate || working) return

        setWorking(true)
        setMessage("")

        try {
            const baseDraft = session?.draft ?? {}
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
                await session.commitNow({
                    ...baseDraft,
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
                disabled={!canGenerate || working}
            >
                {working ? `Generuji ${GENERATE_AMOUNT} programů...` : `Vygenerovat ${GENERATE_AMOUNT} náhodných programů`}
            </button>
            {message && <div className="small text-muted mt-2">{message}</div>}
            {!canGenerate && (
                <div className="small text-muted mt-2">
                    Pro generování vyplň typ programu, licencovanou skupinu a garanty programu.
                </div>
            )}
        </>
    )
}

const PageBody = ({...props}) => (
    <Row>
        <LeftColumn />
        <MiddleColumn>
            <CreateBody
                {...props}
                toolbar={(session) => <BulkGenerateToolbar session={session} />}
            />
        </MiddleColumn>
    </Row>
)

export const PageCreateItem = ({ 
    SubPage=PageBody,
    ...props
}) => {
    return (
        <PageItemBase 
            SubPage={SubPage}
            {...props}
        />
    )
}
