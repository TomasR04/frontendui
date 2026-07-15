import { Table as BaseTable } from "../../../../_template/src/Base/Components/Table" 

export const Table = ({ data, table_def = null }) => {
    return (
        <BaseTable data={data} table_def={table_def} />
    )
}