// // useAsyncAction

// import { useQuery, ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
// import { useState, useCallback, useEffect, useRef } from 'react';

// export const useAsyncAction_ = (GraphQLAction, queryVariables, params = { deferred: false, network: true }, clientRef) => {
//     const { deferred, network } = params;
//     const fetchPromise = useRef(null);
//     const lastMergedParams = useRef(queryVariables);

//     const defaultClient = useRef(null);
//     if (!clientRef?.current) {
//         defaultClient.current = new ApolloClient({
//             link: new HttpLink({ uri: 'http://localhost:5432/api/gql' }), // Replace with your GraphQL endpoint
//             cache: new InMemoryCache(),
//         });
//     }

//     const client = clientRef?.current || defaultClient.current;

//     if (!client || !(client instanceof ApolloClient)) {
//         throw new Error("ApolloClient instance must be provided as 'client'.");
//     }

//     // Extract the actual query string and metadata from the GraphQLAction
//     let queryStr = GraphQLAction;
//     let nodes = [];
//     if (typeof GraphQLAction === "function") {
//         queryStr = GraphQLAction?.__metadata?.queryStr;
//         nodes = GraphQLAction?.__metadata?.nodes;
//         console.log("useGraphQLQueryWrapper", queryStr)
//         // GraphQLAction = GraphQLAction(queryVariables);
//         // queryStr = GraphQLAction?.__metadata?.queryStr;
//         queryStr = gql`${queryStr}`
//     }

//     const [state, setState] = useState({
//         loading: !deferred,
//         error: null,
//         entity: null,
//     });

//     const { data, error, loading, refetch } = useQuery(queryStr, {
//         client,
//         variables: queryVariables,
//         skip: deferred,
//         fetchPolicy: network ? 'cache-and-network' : 'cache-only',
//         onCompleted: (data) => {
//             setState((prev) => ({
//                 ...prev,
//                 loading: false,
//                 error: null,
//                 entity: data,
//             }));
//         },
//         onError: (error) => {
//             setState((prev) => ({
//                 ...prev,
//                 loading: false,
//                 error,
//             }));
//         },
//     });

//     const fetchData = useCallback(async (fetchParams = {}) => {
//         const mergedParams = { ...lastMergedParams.current, ...fetchParams };

//         if (
//             lastMergedParams.current &&
//             JSON.stringify(lastMergedParams.current) === JSON.stringify(mergedParams)
//         ) {
//             if (fetchPromise.current) {
//                 return fetchPromise.current;
//             }
//         } else if (fetchPromise.current) {
//             await fetchPromise.current;
//         }

//         lastMergedParams.current = mergedParams;

//         fetchPromise.current = (async () => {
//             try {
//                 const { data } = await refetch(mergedParams);
//                 setState((prev) => ({
//                     ...prev,
//                     loading: false,
//                     error: null,
//                     entity: data,
//                 }));
//                 return data;
//             } catch (err) {
//                 setState((prev) => ({
//                     ...prev,
//                     loading: false,
//                     error: err,
//                 }));
//                 throw err;
//             } finally {
//                 fetchPromise.current = null;
//             }
//         })();

//         setState((prev) => ({
//             ...prev,
//             loading: true,
//             error: null,
//         }));

//         return fetchPromise.current;
//     }, [refetch]);

//     const read = useCallback(
//         async (optionalParams = {}) => {
//             const mergedParams = { ...lastMergedParams.current, ...optionalParams };

//             if (
//                 lastMergedParams.current &&
//                 JSON.stringify(lastMergedParams.current) === JSON.stringify(mergedParams)
//             ) {
//                 if (fetchPromise.current) {
//                     await fetchPromise.current;
//                 }
//             } else {
//                 if (fetchPromise.current) {
//                     await fetchPromise.current;
//                 }
//                 throw fetchData(mergedParams);
//             }

//             if (state.error) {
//                 throw state.error;
//             }

//             return state.entity;
//         },
//         [state.error, fetchData]
//     );

//     useEffect(() => {
//         if (network && !deferred) {
//             fetchData();
//         }
//     }, [fetchData]);

//     return {
//         ...state,
//         fetch: fetchData,
//         read,
//     };
// };
