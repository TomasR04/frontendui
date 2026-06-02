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
import { ProgramLanguageTypeGQLModelRouterSegments} from "../../../packages/programLanguageType/src/ProgramLanguageTypeGQLModel/Pages/RouterSegment";
import { ProgramLevelTypeGQLModelRouterSegments} from "../../../packages/programLevelType/src/ProgramLevelTypeGQLModel/Pages/RouterSegment";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from "react-router-dom";

const ProgramRouter = () => {
    return (
        <div className="d-flex w-100 gap-2 mt-2 mb-2">
            <Link to="program/programGQLModel/list/" className="btn btn-primary flex-fill">
                Programy
            </Link>

            <Link to="programType/programTypeGQLModel/list/" className="btn btn-primary flex-fill">
                Typy programů
            </Link>

            <Link to="programTitleType/programTitleTypeGQLModel/list/" className="btn btn-primary flex-fill">
                Tituly
            </Link>

            <Link to="programFormType/programFormTypeGQLModel/list/" className="btn btn-primary flex-fill">
                Formy
            </Link>

            <Link to="programLanguageType/programLanguageTypeGQLModel/list/" className="btn btn-primary flex-fill">
                Jazyky
            </Link>

            <Link to="programLevelType/programLevelTypeGQLModel/list/" className="btn btn-primary flex-fill">
                Úrovně
            </Link>
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
            ...ProgramLanguageTypeGQLModelRouterSegments,
            ...ProgramLevelTypeGQLModelRouterSegments,
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
