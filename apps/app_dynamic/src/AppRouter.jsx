import {
      createBrowserRouter,
      RouterProvider
} from "react-router-dom";

import { BaseUI } from "../../../packages/_template/src/Base";
import { TemplateRouterSegments } from "../../../packages/_template/src/Template/Pages/RouterSegment";

const Routes = [
    // UserRouterSegment
    {
        path: "/typename/:typename/view/:id",
        element: <BaseUI.Page />
    },
    ...TemplateRouterSegments
]
const router = createBrowserRouter(Routes);

export const AppRouter = () => <RouterProvider router={router} />