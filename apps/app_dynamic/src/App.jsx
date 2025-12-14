import 'bootstrap/dist/css/bootstrap.min.css';

import { useAsyncThunkAction } from "@hrbolek/uoisfrontend-dynamic";
import { RootProviders } from "@hrbolek/uoisfrontend-dynamic";
import { createAsyncGraphQLAction2 } from '../../../packages/dynamic/src/Core/createAsyncGraphQLAction2';
import { reduceToFirstEntity } from '../../../packages/dynamic/src/Store/Middlewares';
import { useAsync } from '../../../packages/dynamic/src/Hooks/useAsyncThunkAction';
import { sdlQuery } from '../../../packages/dynamic/src/Core/gqlClient2';
import { BaseUI } from '../../../packages/_template/src/Base';
import { TemplateUI } from '../../../packages/_template/src/Template/Utils';
import { AppRouter } from './AppRouter';

export const GQLENDPOINT = "/api/gql"
// const getSdl = () => client.sdl()


export const App = () => {
    return (
        <RootProviders clientOptions={{ endpoint: GQLENDPOINT }}>
            {/* <MainPage /> */}
            <AppRouter />
        </RootProviders>
    );
};


const meQuery = `{
  me {
    __typename
    id
    email
    name
    fullname
    surname
  }
}`

const meAsyncAction = createAsyncGraphQLAction2(meQuery, reduceToFirstEntity)
const sdlAsyncAction = createAsyncGraphQLAction2(sdlQuery)
export const Page = () => {
    const { loading, error, data, entity } = useAsyncThunkAction(meAsyncAction, { id: "51d101a0-81f1-44ca-8366-6cf51432e8d6" })
    return (
        <div>
            <hr />
            Page
            {loading && <div>Loading</div>}
            {error && <div>{JSON.stringify(error)}</div>}
            {data && <div>{JSON.stringify(data)}</div>}
            {entity && <div>{JSON.stringify(entity)}</div>}

            <hr />
        </div>
    )
}

export const Page2 = () => {
    const { loading, error, data, entity } = useAsync(sdlAsyncAction, {})
    return (
        <div>
            <hr />
            Page2
            {loading && <div>Loading</div>}
            {error && <div>{JSON.stringify(error)}</div>}
            {data && <div>{JSON.stringify(data)}</div>}
            {entity && <div>{JSON.stringify(entity)}</div>}

            <hr />
        </div>
    )
}


export const Page3 = () => {
    return (
        <BaseUI.Page />
    )
}

export const Page4 = () => {
    return (
        <TemplateUI.Page />
    )
}