// import Row from "react-bootstrap/Row"
import { MediumCard } from "./MediumCard"
import { CardCapsule as CardCapsule_} from "./CardCapsule"
import { Row } from "../../../../_template/src/Base/Components/Row"
// import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { MediumContent as MediumContent_ } from "./MediumContent"
import { InteractiveMutations } from '../Mutations/InteractiveMutations'
import { LeftColumn, MiddleColumn } from "./Col"
import { MainContent } from "./MainContent"
import React from "react";
/**
 * A large card component for displaying detailed content and layout for an template entity.
 *
 * This component wraps an `TemplateCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `TemplateMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the TemplateLargeCard component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateLargeCard template={templateEntity}>
 *   <p>Additional content for the middle column.</p>
 * </TemplateLargeCard>
 */
const FIELDS_TO_REMOVE = [
    "__typename",
    "lastchange",
    "changedbyId",
    "createdbyId",
    "created",
    "_updatedAt",
    "_version",
    "rbacobject",
    "rbacobjectId",
    "id",
    "name"
];

function cleanItem(item) {
    if (!item || typeof item !== "object") return item;
    const cleaned = { ...item };
    FIELDS_TO_REMOVE.forEach((field) => delete cleaned[field]);
    return cleaned;
}

function ClearChildren(children) {
    if (!children) return null;

    return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (!child.props?.item) return child;

        return React.cloneElement(child, {
            item: cleanItem(child.props.item),
        });
    });
}
export const LargeCard = ({ item, children, CardCapsule=CardCapsule_, MediumContent=MediumContent_ }) => {
    //console.log("Item:", item);
    //console.log("Children:", children);
    var clearChildren = ClearChildren(children)
    return (
        <CardCapsule item={item} >
            <Row>
                <LeftColumn>
                    <CardCapsule item={item} title="Detail">
                        <MediumContent item={item} />
                    </CardCapsule>
                    <InteractiveMutations item={item} />
                </LeftColumn>
                
                <MiddleColumn>
                    
                    {children}
                </MiddleColumn>
            </Row>
        </CardCapsule>
    )
}
/*export const LargeCard = ({ item, children, CardCapsule=CardCapsule_, MediumContent=MediumContent_ }) => {
    //console.log("Item:", item);
    //console.log("Children:", children);
    return (
        <CardCapsule item={item} >
            <Row>
                <LeftColumn>
                    <CardCapsule item={item} title="Detail">
                        <MediumContent item={item} />
                    </CardCapsule>
                    <InteractiveMutations item={item} />
                </LeftColumn>
                
                <MainContent>
                    {children}
                </MainContent>
            </Row>
        </CardCapsule>
    )
}*/
