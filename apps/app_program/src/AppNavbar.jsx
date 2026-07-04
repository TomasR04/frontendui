import { useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { Button } from "react-bootstrap"
import { List } from "react-bootstrap-icons"
import { Link } from "react-router-dom"

import { selectItemById } from "../../../packages/dynamic/src/Store";
import { PageNavbar } from "../../../packages/_template/src/Base/Pages/PageNavbar";

const ProgramRouterMenu = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-bottom bg-light px-3 py-2">
            <Button
                type="button"
                variant={isOpen ? "dark" : "primary"}
                aria-label="Program menu"
                aria-expanded={isOpen}
                aria-pressed={isOpen}
                onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsOpen((value) => !value)
                }}
                className="d-inline-flex align-items-center gap-2"
            >
                <List size={24} />
            </Button>

            {isOpen && (
                <div className="d-flex w-100 gap-2 mt-3 mb-1 flex-wrap position-static">
                    <Link to="program/programGQLModel/list/" className="btn btn-primary flex-fill">
                        Programy
                    </Link>

                    <Link to="programType/programTypeGQLModel/list/" className="btn btn-primary flex-fill">
                        Typy programů
                    </Link>

                    <Link to="programTitleType/programTitleTypeGQLModel/list/" className="btn btn-primary flex-fill">
                        Tituly
                    </Link>

                    <Link to="programFormType/programFormTypeGQLModel/list/" className="btn btn-primary flex-fill">
                        Formy
                    </Link>

                    <Link to="programLanguageType/programLanguageTypeGQLModel/list/" className="btn btn-primary flex-fill">
                        Jazyky
                    </Link>

                    <Link to="programLevelType/programLevelTypeGQLModel/list/" className="btn btn-primary flex-fill">
                        Úrovně
                    </Link>
                </div>
            )}
        </div>
    )
}

export const AppNavbar = () => {
    const { id } = useParams()
    const item = useSelector((dataroot) => selectItemById(dataroot, id)) || {}

    return (
        <>
            <PageNavbar item={item} />
            <ProgramRouterMenu />
        </>
    )
}
