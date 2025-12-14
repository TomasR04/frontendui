import { Link } from "./Link";

export const Table = ({ data }) => {
    if (data.length == 0) {
        return null
    }
    const row = data[0] || {}
    const priority_attributes = ["__typename", "id", "name"];
    const attribute_names = Object.keys(row).filter(attribute_name => {
        const attribute_value = row[attribute_name]
        if (Array.isArray(attribute_value)) return false;
        if (typeof attribute_value === "object" && attribute_value !== null) return false
        return true
    })
    const sorted_attributes = [
        // nejdřív položky podle priority (ve správném pořadí)
        ...priority_attributes.filter(attr => attribute_names.includes(attr)),
        // pak ostatní, které v prioritách nejsou
        ...attribute_names.filter(attr => !priority_attributes.includes(attr))
    ];
    // console.log("Table.attribute_names", attribute_names)
    /* attribute_names.push("link") */

    return (
        <div className="table-responsive">
            <table className="table table-stripped">
                <thead>
                    <tr>
                        {sorted_attributes.map(name => <th key={name}>{name}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => <TableRow key={row?.id} datarow={row} attributes={sorted_attributes} />)}
                </tbody>
            </table>
        </div>
    )
}

const NonPriorityAttributeValue = ({ datarow = {}, name }) => {
    const value = datarow?.[name] || ""
    if (name === "id")
        return <td key={name}><Link item={datarow} >{datarow?.id || "Data Error"}</Link ></td>
    if (name === "name")
        return <td key={name}><Link item={datarow} /></td>

    const idpos = name.indexOf("Id")
    if (idpos === -1) {
        if (typeof value === "object")
            return <td key={name}>{`${value}`}</td>
        else
            return <td key={name}>{value || ""}</td>
    }

    const scalarname = name.replace("Id", "")
    const { id, __typename} = datarow?.[scalarname] || {}
    if (id && __typename && id == value) {
        return <td key={name}><Link item={datarow?.[scalarname]}>{value || ""}</Link></td>
    } else {
        if (typeof value === "object")
            return <td key={name}>{`${value}`}</td>
        else
            return <td key={name}>{value || ""}</td>
    }
    
}

const TableRow = ({ datarow = {}, attributes = [] }) => {
    // datarow["link"] = <Link item={datarow} />
    const priority_atributes = ["__typename", "id", "name"]
    return (
        <tr>
            {attributes.map(name => {
                if (name === "id")
                    return <td key={name}><Link item={datarow} >{datarow?.id || "Data Error"}</Link ></td>
                if (name === "name")
                    return <td key={name}><Link item={datarow} /></td>
                return NonPriorityAttributeValue({datarow, name})
            })}
        </tr>
    )
}
