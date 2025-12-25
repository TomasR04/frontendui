import { Link, SimpleCardCapsule } from "../../Base/Components"
import { Col } from "../../Base/Components/Col"
import { Row } from "../../Base/Components/Row"

export const RBACObject = ({ item }) => {
    const { currentUserRoles=[] } = item || {}

    return (
        <SimpleCardCapsule title="Moje oprávnění">

            {currentUserRoles.map(role => (
                <Row key={role?.id}>
                    <Col>
                        <Link item={role?.roletype} />@
                        <Link item={role?.group} />
                    </Col>
                </Row>
            ))}

        </SimpleCardCapsule>
    )
}