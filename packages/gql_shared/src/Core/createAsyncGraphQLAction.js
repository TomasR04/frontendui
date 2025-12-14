import { createFetchQuery } from "./createFetchQuery";
import { updateItemsFromGraphQLResult } from './updateItemsFromGraphQLResult'



class GQLMutationError extends Error {
    constructor(message, graphQLQuery, graphQLParameters, jsonResponse) {
      super(message);
      this.name = 'GQLMutationError';
      this.jsonResponse = jsonResponse; // Custom property
      this.graphQLQuery = graphQLQuery
      this.graphQLParameters = graphQLParameters
    }
}

/**
 * Creates an asynchronous GraphQL action with support for middleware chaining.
 * This function executes a GraphQL query, processes the result, and optionally chains additional middlewares.
 *
 * @param {string} graphQLQuery - The GraphQL query string to execute.
 * @param {Function|object} [params=updateItemsFromGraphQLResult2] - A middleware function to process the GraphQL result
 * or an object containing default query parameters.
 * @param {...Function} middlewares - Additional middleware functions to chain.
 *
 * @returns {Function} A middleware-compatible function that:
 *  - Accepts `jsonData` (query variables), `dispatch`, `getState`, and `next`.
 *  - Executes the GraphQL query with `jsonData` as variables.
 *  - Processes the query result through the middleware chain.
 *
 * @example
 * // Example usage with simple middlewares
 * const query = `
 *   query GetUser($id: ID!) {
 *     user(id: $id) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * const logMiddleware = (result) => (dispatch, getState, next) => {
 *     console.log("Log Middleware:", result);
 *     return next(result);
 * };
 *
 * const transformMiddleware = (result) => (dispatch, getState, next) => {
 *     const transformedResult = { ...result, transformed: true };
 *     console.log("Transform Middleware:", transformedResult);
 *     return next(transformedResult);
 * };
 *
 * const asyncAction = createAsyncGraphQLAction2(query, logMiddleware, transformMiddleware);
 * dispatch(asyncAction({ id: "12345" }));
 *
 * // Example usage with action chaining
 * const query2 = `
 *   query GetPosts($userId: ID!) {
 *     posts(userId: $userId) {
 *       id
 *       title
 *     }
 *   }
 * `;
 *
 * const getPostsAction = createAsyncGraphQLAction2(query2, logMiddleware, transformMiddleware);
 * const getUserAndPostsAction = createAsyncGraphQLAction2(query, updateItemsFromGraphQLResult2, getPostsAction);
 * dispatch(getUserAndPostsAction({ id: "12345" }));
 */
export const createAsyncGraphQLAction = (graphQLQuery, params = updateItemsFromGraphQLResult, ...middlewares) => {
    let graphQLQueryStr = graphQLQuery
    let nodes = []
    if (typeof graphQLQuery === "function") {
        graphQLQueryStr = graphQLQuery?.__metadata?.queryStr
        nodes = graphQLQuery?.__metadata?.nodes
        graphQLQuery = graphQLQuery()
    }

    if (typeof graphQLQuery !== "string") {
        throw new Error(`createAsyncGraphQLAction: 'query' must be a string.`);
    }

    if (!isTypenameCorrectlyPlaced(graphQLQuery)) {
        console.error(`query does not have __typename this can lead to improper error catching`)
        console.error(graphQLQuery)
    }
    // Validate that all middlewares are functions
    middlewares.forEach((middleware, index) => {
        if (typeof middleware !== "function") {
            throw new Error(`createAsyncGraphQLAction: Middleware at index ${index} is not a function.`);
        }
    });

    // If `params` is a function, treat it as middleware
    if (typeof params === "function") {
        middlewares = [params, ...middlewares]; // Add `params` as middleware
        params = {}; // Reset params to an empty object
    }

    const unparametrizedFetch = createFetchQuery(graphQLQuery, params);

    const AsyncGraphQLAction = (graphQLVariables) => {
        if (typeof graphQLVariables !== "object" || graphQLVariables === null) {
            throw new Error(`createAsyncGraphQLAction: 'graphQLVariables' must be a valid JSON object.\n${graphQLVariables}`);
        }

        return async (dispatch, getState, next = (jsonResult) => jsonResult) => {
            try {
                // Fetch the result from the GraphQL query
                const jsonResult = await unparametrizedFetch(graphQLVariables);

                // Check if the server response contains errors
                if (jsonResult.errors && Array.isArray(jsonResult.errors)) {
                    console.error("createAsyncGraphQLAction: Server returned errors.", jsonResult.errors);
                    // Optionally dispatch an error action
                    dispatch({
                        type: "ASYNC_GRAPHQL_ACTION_SERVER_ERROR",
                        payload: jsonResult.errors,
                    });
                    // return Promise.reject(jsonResult.errors);
                    
                    // Create a new Error and attach the errors array as a property
                    const error = new Error("Server returned errors in GraphQL response.");
                    error.details = jsonResult.errors;
                    return Promise.reject(error);
                }

                const jsonData = jsonResult?.data
                const values = Object.values(jsonData)
                // console.log("values", values, jsonData)
                if (values.length > 0) {
                    const __typename = values[0]?.__typename
                    if (__typename?.includes("Error"))
                        // return Promise.reject(new Error(values[0].msg));
                        return Promise.reject(
                            new GQLMutationError(
                                "Controlled fail from server ",
                                graphQLQuery,
                                graphQLVariables,
                                jsonResult
                            ));
                }
                
        
                // Middleware chain
                const chain = middlewares.reduceRight(
                    (nextMiddleware, middleware) => {
                        return async (result) => {
                            return middleware(result)(dispatch, getState, nextMiddleware);
                        };
                    },
                    next // Use the provided `next` as the base case
                );

                // Execute the chain
                return chain(jsonResult);
            } catch (error) {
                console.error("createAsyncGraphQLAction: Error during async action execution", error);
                // Dispatch a general error action
                dispatch({
                    type: "ASYNC_GRAPHQL_ACTION_GENERAL_ERROR",
                    payload: error.message,
                });
                throw error;
            }
        };
    };
    AsyncGraphQLAction.__metadata = {queryStr: graphQLQueryStr}
    return AsyncGraphQLAction
};

/**
 * Checks if `__typename` is in the correct context for a GraphQL fragment.
 * For fragments, ensures `__typename` is in the first level of braces `{}`.
 * For queries/mutations, ensures it exists in the main body.
 *
 * @param {string} queryString - The GraphQL query string to check.
 * @returns {boolean} - Returns `true` if `__typename` is correctly placed, otherwise `false`.
 */
const isTypenameCorrectlyPlaced = (queryString) => {
    return queryString.includes("__typename")
    // const normalizedQuery = queryString.trim();

    // // Regex patterns for detecting query types
    // const fragmentRegex = /^fragment\s+\w+\s+on\s+\w+\s*\{([\s\S]*)\}$/s;
    // const queryOrMutationRegex = /^(query|mutation)\s+\w*\s*\(.*?\)\s*\{.*?__typename.*?\}/s;

    // if (fragmentRegex.test(normalizedQuery)) {
    //     // Extract the first level of braces in the fragment
    //     const firstLevelContent = normalizedQuery.match(fragmentRegex)?.[1] || '';
    //     let level = 0;
    //     let firstLevelOnly = '';

    //     for (const char of firstLevelContent) {
    //         if (char === '{') level++;
    //         if (level === 1) firstLevelOnly += char;
    //         if (char === '}') level--;
    //     }

    //     // Check if __typename exists in the extracted first-level content
    //     return /\b__typename\b/.test(firstLevelOnly);
    // } else if (queryOrMutationRegex.test(normalizedQuery)) {
    //     // For queries/mutations, just check if __typename exists in the main body
    //     return /\b__typename\b/.test(normalizedQuery);
    // }

    // return false;
};

/**
 * Creates a "GraphQL-like" function node that can be composed with sub-nodes,
 * and ensures each node is included only once in the final output.
 *
 * @param {string} queryStr - A string representing a GraphQL query or fragment.
 * @param  {...Function} fragments - Additional createQuery(...) nodes that should be included (once each).
 * @returns {Function} A callable function. When invoked, returns the complete joined string.
 *
 * @example
 * // Basic usage
 * const userFragment = createQueryStrLazy(`
 *   fragment UserFields on User {
 *     id
 *     name
 *   }
 * `);
 *
 * // Compose sub-fragments
 * const postFragment = createQueryStrLazy(`
 *   fragment PostFields on Post {
 *     id
 *     title
 *   }
 * `, userFragment);
 *
 * // Root query using sub-fragments
 * const rootQuery = createQueryStrLazy(`
 *   query getPosts {
 *     posts {
 *       ...PostFields
 *       author {
 *         ...UserFields
 *       }
 *     }
 *   }
 * `, postFragment);
 *
 * // Getting final string (with all unique fragments)
 * console.log(rootQuery());
 */
export const createQueryStrLazy = (queryStr, ...fragments) => {
  const visitor = (node, visited) => {
    // node musí být objekt/funkce (kvůli WeakSet) a mít metadata
    if (!node || (typeof node !== "function" && typeof node !== "object")) return "";
    const meta = node.__metadata;
    if (!meta || typeof meta.queryStr !== "string") return "";

    if (visited.has(node)) return "";
    visited.add(node);

    const nodes = Array.isArray(meta.nodes) ? meta.nodes : [];
    const subStrings = nodes.map((subNode) => visitor(subNode, visited)).filter(Boolean);

    const own = meta.queryStr; // případně .trim()
    return [own, ...subStrings].filter(Boolean).join("\n");
  };

  const lazyResult = () => {
    const visited = new WeakSet();
    return visitor(lazyResult, visited);
  };

  lazyResult.__metadata = {
    queryStr,
    nodes: fragments,
  };

  return lazyResult;
};
  
// const p = 'query p {...t ...q}'
// const q = 'fragment q {...t}'
// const t = 'fragment t {}'
// const ft = createQueryStrLazy(t)
// const fq = createQueryStrLazy(q, ft)
// const fp = createQueryStrLazy(p, ft, fq)
// console.log(fp.__metadata)
// const p_ = fp()
// console.log(p_)