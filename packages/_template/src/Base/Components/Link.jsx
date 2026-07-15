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

export const LinkURI = GenericURIRoot + "/view/";
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

const getLinkTargetURI = (item, action = "view") => {
    const root = getLinkRoot(item);

    if (root === GenericURIRoot) {
        return item?.__typename && item?.id
            ? `${root}/${item.__typename}/${action}/${item.id}`
            : "#";
    }

    return item?.id ? `${root}/${item.__typename}/${action}/${item.id}` : "#";
};

export const Link = ({ item, action="view", children, ...others }) => {
    
    const SpecificLink = item?.__typename ? RegisterOfLinks[item.__typename] : null;
    if (SpecificLink && SpecificLink !== Link) {
        // console.log('Using specific link for typename:', item.__typename);
        return <SpecificLink item={item} action={action} {...others}>{children}</SpecificLink>;
    }
    
    const label =
        children || item?.fullname || item?.name || item?.id || "Missing";

    const to = getLinkTargetURI(item, action);

    return <ProxyLink to={to} {...others}>{label}</ProxyLink>;
};

export const makeMutationURI = (linkURI, action, { withId = false } = {}) => {
    const viewSegmentRe = /\/view(\/|$)/;
    if (!viewSegmentRe.test(linkURI)) throw new Error(`LinkURI must contain '/view'. Got: ${linkURI}`);

    const base = linkURI.replace(viewSegmentRe, `/${action}$1`).replace(/\/?$/, "/");
    return withId ? `${base}:id` : base.replace(/\/$/, "");
};