import { ButtonWithDialog } from "@hrbolek/uoisfrontend-shared"
import { useItemRoles } from "../../../../dynamic/src/Hooks/useRoles"


export const UserGDPR = ({ item, ...props }) => {
    const { can, roleNames } = useItemRoles(item, ["zpracovatel gdpr"])
    if (can)
        return (
            <ButtonWithDialog {...props}>
                UserGDPR<br/>
                {JSON.stringify(roleNames)}
            </ButtonWithDialog>
        )
    else 
        return (<span className="btn btn-danger">Nemáte oprávnění</span>)
}