// import { URIRoot } from "../../uriroot";
import { ProxyLink } from "./ProxyLink";

const RegisterOfLinks = {};
export const registerLink = (__typename, Link, overrideLinkURI) => {

    const Link_ = overrideLinkURI
        ? ({ ...props }) => <Link {...props} LinkURI={overrideLinkURI} />
        : Link;

    const registeredLink = RegisterOfLinks[__typename];

    if (!registeredLink || overrideLinkURI) {
        RegisterOfLinks[__typename] = Link_;
    } else {
        console.warn(`Link for typename ${__typename} is already registered.`);
    }
};

export const GenericURIRoot = "/generic";

export const SubjectURIRoot = "/subject";
export const UserURIRoot = "/user";
export const GroupURIRoot = "/group";
export const ProgramGQLModelURIRoot = "/program";

//export const LinkURI = GenericURIRoot + "/view/";
export const VectorItemsURI = GenericURIRoot + "/list/";

const getLinkRoot = (item) => {
    const typename = item?.__typename ?? "";
    const normalizedTypename = typename.toLowerCase();

    if (normalizedTypename.includes("subject")) return SubjectURIRoot;
    if (normalizedTypename.includes("user")) return UserURIRoot;
    if (normalizedTypename.includes("group")) return GroupURIRoot;
    if (normalizedTypename.includes("programgqlmodel")) return ProgramGQLModelURIRoot;

    return GenericURIRoot;
};

// Returns the base view URI for a given item type.
// The generated value is used for constructing links for view/edit/delete actions.
// For registered specific link types, `LinkURI` may be overridden via `registerLink`.
export const LinkURI = (item) => {
    const root = getLinkRoot(item);
    return `${root}/${item?.__typename}/view/`;
}

// Builds the final target URI for a single item and action.
// Generic items use `/generic/:typename/:action/:id`, while known roots use `/{root}/{typename}/{action}/{id}`.
const getLinkTargetURI = (item, action = "view") => {
    const root = getLinkRoot(item);

    if (root === GenericURIRoot) {
        return item?.__typename && item?.id
            ? `${root}/${item.__typename}/${action}/${item.id}`
            : "#";
    }

    return item?.id ? `${root}/${item.__typename}/${action}/${item.id}` : "#";
};

// Base Link component for rendering item links across the app.
// It resolves a type-specific link component if registered, otherwise falls back to a generic path.
// The default `action` is `view`, but the consumer can request `edit`, `delete`, etc.
export const Link = ({ item, action="view", children, ...others }) => {
    
    const SpecificLink = item?.__typename ? RegisterOfLinks[item.__typename] : null;
    if (SpecificLink && SpecificLink !== Link) {
        // Use a type-specific registered Link component when available.
        return <SpecificLink item={item} action={action} {...others}>{children}</SpecificLink>;
    }
    
    const label =
        children || item?.fullname || item?.name || item?.id || "Missing";

    const to = getLinkTargetURI(item, action);

    return <ProxyLink to={to} {...others}>{label}</ProxyLink>;
};

export const makeMutationURI = (linkURI, action, { withId = false } = {}) => {
    const resolvedLinkURI = typeof linkURI === "function" ? linkURI() : linkURI;
    const viewSegmentRe = /\/view(\/|$)/;
    if (typeof resolvedLinkURI !== "string") throw new Error(`LinkURI must be a string. Got: ${typeof resolvedLinkURI}`);
    if (!viewSegmentRe.test(resolvedLinkURI)) throw new Error(`LinkURI must contain '/view'. Got: ${resolvedLinkURI}`);

    const base = resolvedLinkURI.replace(viewSegmentRe, `/${action}$1`).replace(/\/?$/, "/");
    return withId ? `${base}:id` : base.replace(/\/$/, "");
};