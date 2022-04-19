// src/routes.ts

// pages
import ToplogyPage from './Pages/TopologyPage'
// other
import {FC} from "react";
import { isConstructorDeclaration } from 'typescript';

// interface
interface Route {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    component: FC<{}>
}

const routes: Array<Route> = [
    {
        key: 'topology-route',
        title: 'Topology',
        path: '/',
        enabled: true,
        component: ToplogyPage
    },
]

export default routes