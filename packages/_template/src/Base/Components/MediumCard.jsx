import { CardCapsule } from "./CardCapsule"
import { Link } from "./Link"
import { MediumContent } from "./MediumContent"

export const MediumCard = ({ item }) => {
    return (
        <CardCapsule header={<Link item={item}/>} item={item}>
            <MediumContent item={item} />
        </CardCapsule>
    )
}
