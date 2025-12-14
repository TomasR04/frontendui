/**
 * This component contains large visualisation which should appear as a child of `TemplatePage` component.
 *
 * @component
 * @param {Object} props - The properties for the TemplateLargeCard component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateLargeContent template={templateEntity} />
 */
export const LargeContent = ({ item }) => {
    return (
        
        <pre>{JSON.stringify(item, null, 4)}</pre>
    )
}
