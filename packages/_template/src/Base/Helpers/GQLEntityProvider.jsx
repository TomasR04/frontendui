import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { generateQuery } from "./generateQuery";
import { useEffect } from "react";
import { Row } from "./Row";
import { Col } from "./Col";
import { CardCapsule } from "../Components/CardCapsule";

const GQLEntityContext = createContext(null);
export const useGQLEntityContext = () => useContext(GQLEntityContext)

const firstItem = {
    __typename: "UserGQLModel",
    id: "51d101a0-81f1-44ca-8366-6cf51432e8d6",
    user: {
        __typename: "UserGQLModel",
        id: "9af964f0-778c-4e07-aa4a-9fe4f36b9ac2"
    },
    group: {
        __typename: "GroupGQLModel",
        id: "f2f2d33c-38ee-4f31-9426-f364bc488032"
    },
    program: {
        __typename: "ProgramGQLModel",
        id: "0ac1761b-0ec7-4fc2-b4d7-127e79a316eb"
    }
}


async function copyToClipboard(text) {
    if (typeof text !== "string") text = String(text ?? "");

    // Modern API (vyžaduje secure context: https nebo localhost)
    if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
}

function CopyButton({ text, children = "Copy", className = "" }) {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const onClick = async () => {
        setError(null);
        try {
            await copyToClipboard(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch (e) {
            setError(e);
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={className}
            title={copied ? "Zkopírováno" : "Zkopírovat do schránky"}
        >
            {copied ? "✓" : children}
            {error ? " (nelze kopírovat)" : null}
        </button>
    );
}

export const GQLURI = "/api/gql";

export const GQLEntityProvider = ({ children, introspection, entity }) => {
    const { id, __typename} = entity
    const [data, setData] = useState(firstItem || {});
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [usedVariables, setUsedVariables] = useState({})

    const goToHome = () => {
        setData(() => firstItem)
    }

    const run = async (entity_) => {
        console.log("loading data for", entity_)
        if (!introspection) {
            console.warn("Introspection not ready", introspection);
            setError("Introspection not ready");
            return null;
        }
        const typename = entity_?.["__typename"]
        const gqlQuery = generateQuery(introspection, typename); // využívá generateQueryExample
        const variables = entity_

        // const gqlQuery = generateEntityQuery(typeName)
        // const variables = {
        //     "representations": [
        //         {
        //             "__typename": typeName,
        //             "id": id
        //         }
        //     ]
        // }
        setUsedVariables(() => entity_)
        if (!gqlQuery) {
            setError("No matching query for type: " + typename);
            return null;
        }
        setQuery(() => gqlQuery)
        try {
            const res = await fetch(GQLURI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: gqlQuery, variables: variables }),
            });
            // console.log("fetch", res, variables, gqlQuery )
            const json = await res.json();
            if (json.errors) {
                setError(json.errors[0]?.message || "GraphQL error");
                return null;
            }

            const data = json.data;
            let value = data[Object.keys(data)[0]];
            if (Array.isArray(value) && value.length !== 0) {
                value = value[0]
            }

            setData(() => value);
            return value;
        } catch (err) {
            console.error("Fetch failed", err);
            setError(err.message);
            return null;
        }
    };

    useEffect(() => {
        run(entity)
    }, [entity])

    return (
        <GQLEntityContext.Provider value={{ fetch: run, goToHome, query, usedVariables, data, error }}>
            {children}
            <Row>
                <Col>
                    <CardCapsule 
                        header={<>Použitý dotaz <CopyButton className="btn btn-success btn-sm" text={query} /></>}
                    >
                        <pre>{query}</pre>
                    </CardCapsule>
                </Col>
                <Col>
                    <CardCapsule header={"Použité proměnné"}>
                        <pre>
                            {JSON.stringify(usedVariables, null, 2)}
                        </pre>
                    </CardCapsule>

                </Col>
                <Col>
                    <CardCapsule header={"Odpověď"}>
                        <pre>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </CardCapsule>

                </Col>
            </Row>
        </GQLEntityContext.Provider>
    );
};