import { ReadPageAsyncAction } from "../Queries"
import { useInfiniteScroll } from "../../../../dynamic/src/Hooks/useInfiniteScroll"
import { PageBase } from "./PageBase"
import { Table } from "../Components/Table"
import { Filter } from "../Components/Filter"
import { FilterButton, ResetFilterButton } from "../../../../_template/src/Base/FormControls/Filter"
import { useSearchParams } from "react-router"
import { useEffect } from "react"
import { useMemo } from "react"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { Collapsible } from "../../../../_template/src/Base/FormControls/Collapsible"
import { buildTableDef } from "../../../../_template/src/Base/Components/Table"

function safeParseWhere(sp, paramName = "where") {
    const raw = sp.get(paramName);
    if (!raw) return null;
    try {
        const obj = JSON.parse(raw);
        return obj && typeof obj === "object" ? obj : null;
    } catch {
        return null;
    }
}

// The URL currently uses the `gr_where` parameter for vector page filtering.
// We parse it as JSON so the filter can be passed to the GraphQL query as an object.
const filterParameterName = "gr_where"
export const PageVector = ({ children, queryAsyncAction = ReadPageAsyncAction }) => {

    const [sp] = useSearchParams();

    const whereFromUrl = useMemo(() => safeParseWhere(sp, filterParameterName), [sp.toString()]);

    const { items, loading, error, hasMore, sentinelRef, loadMore, restart } = useInfiniteScroll(
        {
            asyncAction: queryAsyncAction,
            actionParams: { skip: 0, limit: 25, where: whereFromUrl },
            // reset: whereFromUrl
        }
    )

    useEffect(() => {
        const params = { skip: 0, limit: 25, where: whereFromUrl }
        restart(params)
    }, [whereFromUrl]);

    // `buildTableDef` introspects the first item row to build columns automatically.
    // We then remove known metadata fields so the table shows only user-facing columns.
    // If you add a GraphQL field that should remain hidden, add it to `hiddenColumns`.
    const table_def = useMemo(() => {
        if (!items?.length) return null;

        const hiddenColumns = new Set(["created", "lastchange", "createdbyId", "changedbyId", "rbacobjectId"]);
        const baseDef = buildTableDef(items);

        return Object.fromEntries(
            Object.entries(baseDef).filter(([name]) => !hiddenColumns.has(name))
        );
    }, [items]);

    return (
        <PageBase>
            <Collapsible
                className="form-control btn btn-outline-primary"
                buttonLabelCollapsed="Zobrazit filtr"
                buttonLabelExpanded="Skrýt filtr"
            >
                <Filter>
                    <FilterButton
                        className="form-control btn btn-outline-success"
                        paramName={filterParameterName}
                    >
                        Filtrovat
                    </FilterButton>
                    <ResetFilterButton
                        className="form-control btn btn-warning"
                        paramName={filterParameterName}
                    >
                        Vymazat filtr
                    </ResetFilterButton>
                </Filter>
            </Collapsible>

            {/* Pass filtered table_def into Table so hidden metadata columns are not rendered. */}
            <Table data={items} table_def={table_def} />

            <AsyncStateIndicator error={error} loading={loading} text="Nahrávám další..." />

            {hasMore && <div ref={sentinelRef} style={{ height: 80, backgroundColor: "lightgray" }} />}
            {hasMore && <button className="btn btn-success form-control" onClick={() => loadMore()}>Více</button>}
        </PageBase>
    )
}

