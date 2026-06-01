import { useSelector } from "react-redux"
import { useParams } from "react-router"

import { selectItemById } from "../../../packages/dynamic/src/Store";
import { PageNavbar } from "../../../packages/_template/src/Base/Pages/PageNavbar";

export const AppNavbar = () => {
    const { id } = useParams()
    const item = useSelector((dataroot) => selectItemById(dataroot, id)) || {}

    return (
        <PageNavbar item={item}>
        </PageNavbar>
    )
}
