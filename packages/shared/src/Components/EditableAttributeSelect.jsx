import { useDispatch } from "react-redux"
import { CreateAsyncQueryValidator2 } from "@hrbolek/uoisfrontend-gql-shared"

/**
 * shared module.
 * @module shared/components
 */

const validator = CreateAsyncQueryValidator2({error: "Něco se nepovedlo", success: "Změna uložena"})

/**
 * A component for editing a select attribute of an item with asynchronous updates.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.item - The item being edited.
 * @param {React.ReactNode} props.children - List of <option /> elements.
 * @param {string} props.attributeName - Name of the attribute to be edited.
 * @param {Function} props.asyncUpdater - A function that returns a Promise for updating the item.
 * @param {string} [props.label] - Label for the select input.
 * @returns {JSX.Element} The editable attribute select component.
 */
export const EditableAttributeSelect = ({
    item,
    label,
    children,
    attributeName,
    asyncUpdater,
}) => {
    const dispatch = useDispatch();
    const attributeValue = item[attributeName];

    // Initialize validators with predefined messages
    const validate = validator(dispatch);

    // Handle changes to the select input
    const handleChange = (e) => {
        const value = e.target.value;
        const updatedItem = { ...item, [attributeName]: value };
        const action = asyncUpdater(updatedItem);

        // Dispatch the async action and validate the response
        validate(dispatch(action));
    };

    return (
        <div className="form-floating">
            <select
                className="form-select"
                id={`select-${item.id}`}
                value={attributeValue}
                onChange={handleChange}
                aria-label={label || ""}
            >
                {children}
            </select>
            {label && <label htmlFor={`select-${item.id}`}>{label}</label>}
        </div>
    );
};