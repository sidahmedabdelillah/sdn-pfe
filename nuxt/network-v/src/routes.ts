// src/routes.ts

// pages
import ToplogyPage from './Pages/TopologyPage'
import FlowPage from './Pages/FlowsPage'

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
    {
        key: 'switch-flows',
        title: 'Switch Flows',
        path: '/flows/:dpid',
        enabled: true,
        component: FlowPage
    }
]

export default routes