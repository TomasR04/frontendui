import { Col } from "../Helpers/Col"
import { Row } from "../Helpers/Row"
import { Link } from "./Link"

const Attribute = ({attribute_name, attribute_value_result}) => {
    return (
        <Row key={attribute_name}>
            <Col className="col-4"><b>{attribute_name}</b></Col>
            <Col className="col-8">{attribute_value_result}</Col>
        </Row>
    )
}

const NonPriorityAttributeValue = ({ datarow = {}, name }) => {
    const value = datarow?.[name] || ""
    if (name === "id")
        return (<Row>
            <Col className="col-4"><b>{name}</b></Col>
            <Col className="col-8"><Link item={datarow} >{datarow?.id || "Data Error"}</Link ></Col></Row>)
    if (name === "name")
        return (<Row>
            <Col className="col-4"><b>{name}</b></Col>
            <Col className="col-8"><Link item={datarow} /></Col></Row>)

    const idpos = name.indexOf("Id")
    if (idpos === -1) {
        if (typeof value === "object")
            return null
        else
            return (<Row>
                <Col className="col-4"><b>{name}</b></Col>
                <Col className="col-8">{value || ""}</Col>
            </Row>)
            // return <td key={name}>{value || ""}</td>
    }

    const scalarname = name.replace("Id", "")
    const { id, __typename} = datarow?.[scalarname] || {}
    if (id && __typename && id == value) {
        return <Attribute attribute_name={name} attribute_value_result={<Link item={datarow?.[scalarname]}>{id}</Link>} />
    } else {
        if (typeof value === "object")
            return <Attribute attribute_name={name} attribute_value_result={`${value?.fullname || value?.name || value?.id}`} />
        else
            return <Attribute attribute_name={name} attribute_value_result={value || ""} />
    }
    
}

export const MediumContent = ({ item, children }) => {
    return (
        <>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                // if (attribute_name !== "id") return null
                if (Array.isArray(attribute_value)) return null
                if (attribute_value)
                    return (
                        <NonPriorityAttributeValue key={attribute_name} datarow={item} name={attribute_name} />
                    )
                else return null
            })}
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (attribute_value !== null) return null
                if (attribute_value)
                    return null
                else
                    return (
                        <NonPriorityAttributeValue key={attribute_name} datarow={item} name={attribute_name} />
                    )
            })}
            {children}
        </>
    )
}
