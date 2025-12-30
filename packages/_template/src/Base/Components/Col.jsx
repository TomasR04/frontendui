import { Col as Col_ } from "react-bootstrap"

export const Col = ({ children, className, ...props }) => {
    return (
        <div {...props} className={className ? className + " col" : "col"}>
            {children}
        </div>
    )
}

export const LeftColumn = ({children, ...props}) => {
    return (
        <Col_ xl={3} md={12} {...props}>{children}</Col_> 
    )
}

export const MiddleColumn = ({children, ...props}) => {
    return (
        <Col_ xl={9} md={12} {...props}>{children}</Col_> 
    )
}