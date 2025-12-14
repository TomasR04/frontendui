import { useDispatch } from "react-redux"
import { TextInput } from './TextInput'
import { CreateAsyncQueryValidator2 } from "@hrbolek/uoisfrontend-gql-shared"

/**
 * shared module.
 * @module shared/components
 */

const validator = CreateAsyncQueryValidator2({error: "Něco se nepovedlo", success: "Změna uložena"})

/**
 * A component for editing an attribute of an item with asynchronous updates.
 * 
 * @param {Object} props - The props for the component.
 * @param {Object} props.item - The item being edited.
 * @param {string} props.attributeName - The name of the attribute to be edited.
 * @param {Function} props.asyncUpdater - A function that returns an async action for updating the item.
 * @param {string} [props.label] - The label for the input field.
 * @param {string} [props.type="text"] - The input type (e.g., "text", "number").
 * 
 * @returns {JSX.Element} The editable attribute component.
 */
export const EditableAttributeText = ({
    item,
    attributeName,
    asyncUpdater,
    label,
    type = "text",
    ...props
}) => {
    const dispatch = useDispatch();
    const attributeValue = item[attributeName];

    // Initialize validators with the provided messages
    const validate = validator(dispatch);

    // Handle changes to the attribute
    const handleChange = (value) => {
        const updatedItem = { ...item, [attributeName]: value };
        const action = asyncUpdater(updatedItem);

        // Dispatch the async action and validate the response
        validate(dispatch(action));
    };

    return (
        <div className="form-floating">
            <TextInput
                type={type}
                id={item.id}
                value={attributeValue}
                onChange={handleChange}
                {...props}
            />
            {label && <label htmlFor={item.id}>{label}</label>}
        </div>
    );
};