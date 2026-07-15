export const makeMutationURI = (linkURI, action, { withId = false } = {}) => {
    const resolvedLinkURI = typeof linkURI === "function" ? linkURI() : linkURI;
    const viewSegmentRe = /\/view(\/|$)/;
    if (typeof resolvedLinkURI !== "string") throw new Error(`LinkURI must be a string. Got: ${typeof resolvedLinkURI}`);
    if (!viewSegmentRe.test(resolvedLinkURI)) throw new Error(`LinkURI must contain '/view'. Got: ${resolvedLinkURI}`);

    const base = resolvedLinkURI.replace(viewSegmentRe, `/${action}$1`).replace(/\/?$/, "/");
    return withId ? `${base}:id` : base.replace(/\/$/, "");
};