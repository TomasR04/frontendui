import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
} from "react-router-dom";
import { NavigationHistoryLinks, NavigationHistoryProvider } from '../../../packages/_template/src/Base/Helpers/NavigationHistoryProvider';

import { BaseRouterSegments } from "../../../packages/_template/src/Base/Pages/RouterSegment";

// import { GroupRouterSegments } from "../../../packages/_template/src/GroupGQLModel/Pages/RouterSegment";
// import { RoleTypeRouterSegments } from "../../../packages/_template/src/RoleTypeGQLModel/Pages";
// import { UserRouterSegments } from "../../../packages/_template/src/UserGQLModel/Pages/RouterSegment";
// import { GroupTypeRouterSegments } from "../../../packages/_template/src/GroupTypeGQLModel/Pages/RouterSegment";
// import { RoleRouterSegments } from "../../../packages/_template/src/RoleGQLModel/Pages";
// import { Page } from "../../../packages/_template/src/Base/Pages/Page";
import { AppNavbar } from "./AppNavbar";
import { ProgramGQLModelRouterSegments} from "../../../packages/program/src/ProjectGQLModel/Pages/RouterSegment";
import { ProgramTypeGQLModelRouterSegments} from "../../../packages/programType/src/ProgramTypeGQLModel/Pages/RouterSegment";
import { ProgramFormTypeGQLModelRouterSegments} from "../../../packages/programFormType/src/ProgramFormTypeGQLModel/Pages/RouterSegment";
import { ProgramTitleTypeGQLModelRouterSegments} from "../../../packages/programTitleType/src/ProgramTitleTypeGQLModel/Pages/RouterSegment";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProgramRouter = () => {
    return (
        <div className="d-flex w-100 gap-2 mt-2 mb-2">
        <a href="/programGQLModel/list/" className="btn btn-primary flex-fill">Programy</a>
        <a href="/programTypeGQLModel/list/" className="btn btn-primary flex-fill">Typy programů</a>
        <a href="/programTitleTypeGQLModel/list/" className="btn btn-primary flex-fill">Tituly</a>
        <a href="/programFormTypeGQLModel/list/" className="btn btn-primary flex-fill">Formy</a>
        </div>
    );
};

const AppLayout = () => (
    <NavigationHistoryProvider>
        <ProgramRouter />
        <AppNavbar />
        
        <NavigationHistoryLinks />
        <Outlet />
    </NavigationHistoryProvider>
);

const Routes = [
    {
        path: "/",          // root
        element: <AppLayout />,
        children: [
            ...ProgramGQLModelRouterSegments,
            ...ProgramTypeGQLModelRouterSegments,
            ...ProgramFormTypeGQLModelRouterSegments,
            ...ProgramTitleTypeGQLModelRouterSegments,
            ...BaseRouterSegments,
            // ...GroupRouterSegments,
            // ...RoleTypeRouterSegments,
            // ...UserRouterSegments,
            // ...GroupTypeRouterSegments,
            // ...RoleRouterSegments,
            
        ],
    },
];

// console.log("Routes", Routes)
// console.log("Routes", GroupRouterSegments)

const router = createBrowserRouter(Routes);


export const AppRouter = () => <RouterProvider router={router} />;
