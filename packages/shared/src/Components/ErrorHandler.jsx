import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Modal } from "react-bootstrap";
import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";
import { DeleteButton } from './DeleteButton';

export const ErrorHandler = ({ errors = "DEMO ERROR", show = true }) => {
    const [visible, setVisible] = useState(show)
    let parsedErrors;
    const onClose = () => {
        setVisible(prev => false)
    }
    console.log("ErrorHandler", errors)
    
    if (Array.isArray(errors)) {
        parsedErrors = errors
    } else if (typeof errors === "string") {
        try {
            parsedErrors = JSON.parse(errors)
        } catch {
            parsedErrors = [{ message: "Unparsable error", raw: errors }]
        }
    } else if (errors && typeof errors === "object") {
        parsedErrors = [errors]
    } else {
        parsedErrors = [{ message: "Unparsable error", raw: errors }]
    }

    if (!visible) return null
    if (errors?.details?.[0]?.status === 302) {
        return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static" // Prevent closing the modal by clicking outside
            size="xl" // Adjust size as needed
            aria-labelledby="error-handler-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="error-handler-title">Chyba</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errors?.details[0]?.status === 302 && <span>Nejste přihlášeni</span>}<br />
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={onClose}>
                    Zavřít
                </button>
            </Modal.Footer>
        </Modal>            
        )
    }
    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop="static" // Prevent closing the modal by clicking outside
            size="xl" // Adjust size as needed
            aria-labelledby="error-handler-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="error-handler-title">Chyba</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(errors?.name === "GQLMutationError") &&
                    <GQLMutationErrorDetails error={errors} onClose={onClose} />
                }
                {(errors?.name !== "GQLMutationError") &&
                    <ErrorDisplay errors={parsedErrors} onClose={onClose} />
                }
                <pre>{JSON.stringify(errors, null, 4)}</pre>
                {errors?.details?.[0]?.status === 302 && <span>Nejste přihlášeni</span>}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={onClose}>
                    Zavřít
                </button>
            </Modal.Footer>
        </Modal>
    );
};

const GQLMutationErrorDetails = ({error, onClose}) => {
    const {
        jsonResponse,
        graphQLQuery,
        graphQLParameters
    } = error
    
    // Extract the single key-value pair from jsonResponse.data
    const jsonDataKey = Object.keys(jsonResponse?.data || {})[0];
    const jsonDataValue = jsonResponse?.data?.[jsonDataKey];
    const input = jsonDataValue?.input || {}
    const entity = jsonDataValue?.Entity || {}

    // Extract the matching keys and values from graphQLParameters
    const extractedInputParameters = {};
    const extractedOutputParameters = {};
    const createdFields = {};
    if (input && typeof input === 'object') {
        Object.keys(input).forEach((key) => {
            if (graphQLParameters?.hasOwnProperty(key)) {
                extractedInputParameters[key] = graphQLParameters[key];
            }
            if (entity?.hasOwnProperty(key)) {
                extractedOutputParameters[key] = entity[key];
            }
        });
    }
    Object.keys(entity).forEach((key) => {
        if (key.startsWith('created')) {
            // extractedInputParameters[key] = entity[key];
            // extractedOutputParameters[key] = entity[key];
            createdFields[key] = entity[key]
        }
        if (key.startsWith('changed')) {
            createdFields[key] = entity[key]
        }
    })

    if (error.name !== "GQLMutationError") return null;
    if (!extractedInputParameters.lastchange) return (
        <ErrorSimple 
            error={error} 
            messageToDisplay={"Chybí časové razítko, toto je chyba v programu."}
            onClose={onClose}
        >
            <p><strong>Query:</strong></p>
            <pre>{graphQLQuery}</pre>
        </ErrorSimple>
    )
    if (extractedInputParameters.lastchange !== extractedOutputParameters.lastchange) return (
        <ErrorLastChange 
            error={error} 
            extractedInputParameters={extractedInputParameters}
            extractedOutputParameters={extractedOutputParameters}
            createdFields={createdFields}
            onClose={onClose}
        />
    )
    return (
        <div>
            <h5>GraphQL Mutation Error</h5>
            <p><strong>Query:</strong></p>
            <pre>{JSON.stringify(extractedInputParameters, null, 2)}</pre>
            <pre>{JSON.stringify(extractedOutputParameters, null, 2)}</pre>
            <p><strong>Parameters:</strong></p>
            <pre>{JSON.stringify(error.graphQLParameters, null, 2)}</pre>
            <p><strong>Response:</strong></p>
            <pre>{JSON.stringify(error.jsonResponse, null, 2)}</pre>
        </div>
    );
};

const ErrorSimple = ({error, messageToDisplay, children}) => {
    return (
        <div>
            <h5>Chyba</h5>
            <p><strong>{messageToDisplay}</strong></p>
            {children}
        </div>
    );
}

const ErrorLastChange = ({
    error, 
    extractedInputParameters, 
    extractedOutputParameters,
    createdFields
}) => {
    const dispatch = useDispatch()
    const changedby = createdFields?.changedby
    const rewriteInput = {
        ...extractedInputParameters,
        lastchange: extractedOutputParameters.lastchange
    }
    const asyncAction = createAsyncGraphQLAction(
        error.graphQLQuery
    )
    let rewriteError;
    const handleForceWrite = async() => {
        try {
            await dispatch(asyncAction(rewriteInput))
            rewriteError = ""
        } catch (error) {
            rewriteError = JSON.stringify(error, null, 2)
        }
    }

    return (
        <div>
            <h5>Chyba časového razítka</h5>
            <p>
                Odeslané časové razítko 
                neodpovídá časovému razítku na serveru.
                Toto nastává v případě, když někdo jiný data změnil.
            </p>
            {!changedby && <p>
                Není dostupná informace o tom, kdo změnu provedl, toto je chyba.
                Poznamenejte si, jak jste k této chybě dospěli a nahlaste ji.
            </p>}
            {changedby && <div>
                Změnu provedl uživatel &nbsp;
                <span className='btn btn-sm btn-outline-secondary'>
                    {/* <UserLink user={changedby} target="_blank" rel="noopener noreferrer">{changedby?.email}</UserLink> */}
                    <a href={`email:${changedby?.email}`}>{changedby?.email}</a>
                </span> (link do jiné záložky)
            </div>}
            <hr />
            <p><strong>Odeslaná data:</strong></p>
            <pre>{JSON.stringify(extractedInputParameters, null, 2)}</pre>
            <p><strong>Data na serveru:</strong></p>
            <pre>{JSON.stringify(extractedOutputParameters, null, 2)}</pre>
            <hr />
            {!rewriteError &&
                <DeleteButton onClick={handleForceWrite}>
                    Přepsat data na serveru hrubou silou
                </DeleteButton>
            }
            {rewriteError === "" &&
                <p>Přepsání se povedlo</p>
            }
            {rewriteError && rewriteError !== "" &&
                <p>Při přepisu nastala další chyba 
                   <pre>{rewriteError}</pre>
                </p>
            }
            <hr />
            {/* <p><strong>Parameters:</strong></p>
            <pre>{JSON.stringify(error.graphQLParameters, null, 2)}</pre>
            <p><strong>Response:</strong></p>
            <pre>{JSON.stringify(error.jsonResponse, null, 2)}</pre> */}
        </div>
    )
}

const ErrorExtensionsDisplay = ({ extensions }) => {
    if (!extensions) {
        return null;
    }

    return (
        <div style={{ marginTop: "10px", padding: "10px", border: "1px solid lightgray", background: "#f9f9f9" }}>
            {extensions.serviceName && (
                <p><strong>Service:</strong> {extensions.serviceName}</p>
            )}
            {extensions.code && (
                <p><strong>Code:</strong> {extensions.code}</p>
            )}
            {extensions.exception?.msg && (
                <div>
                    <strong>Exception Message:</strong>
                    <pre>{extensions.exception.msg}</pre>
                </div>
            )}
            {extensions.msg_e && (
                <div>
                    <strong>Details:</strong>
                    <pre>{extensions.msg_e.join("\n")}</pre>
                </div>
            )}
            {extensions.stacktrace && (
                <details>
                    <summary><strong>Stacktrace</strong></summary>
                    <pre>{extensions.stacktrace.join("\n")}</pre>
                </details>
            )}
        </div>
    );
};

const ErrorDisplay = ({ errors }) => {
    if (!Array.isArray(errors)) {
        return <p>No errors to display.</p>;
    }

    return (
        <div>
            A"{JSON.stringify(errors)}"Z<br />
            A"{JSON.stringify(errors[0].raw)}"Z
            {errors.map((error, index) => (
                <div key={index} style={{ border: "1px solid red", marginBottom: "10px", padding: "10px" }}>
                    <h4>Error {index + 1}</h4>
                    <p><strong>Message:</strong> {error.message}</p>
                    {error.path && (
                        <p><strong>Path:</strong> {error.path.join(" > ")}</p>
                    )}
                    <ErrorExtensionsDisplay extensions={error.extensions} />
                    {error?.raw && JSON.stringify(error.raw)}
                    {JSON.stringify(error)}
                    {error?.raw?.toString && JSON.stringify(error.raw.toString())}
                    {/* {error?.raw?.toString && JSON.stringify(error.toString())} */}
                </div>
            ))}
        </div>
    );
};