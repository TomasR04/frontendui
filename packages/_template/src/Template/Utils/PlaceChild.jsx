import { useGQLEntityContext } from "./GQLEntityProvider"

export const PlaceChild = ({ Component }) => {
    const { item } = useGQLEntityContext()
    return (
        <Component item={item} />
    )
}