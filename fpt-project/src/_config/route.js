import Home from "../com/Home";
import Login from "../com/Login";
import AdminScreen from "../com/admin/index";
import PlanContainer from "../com/headOfSection/ModalPlanContainer";

export const ROUTES = {
    HOME : '',
    LOGIN : 'login',
    ADMIN : 'admin',
    HEADOFSECTIONPLAN: 'plan'
}


export const public_route = [
    {
        path: `/${ROUTES.HOME}`,
        Com: Home,
    },
    {
        path: `/${ROUTES.LOGIN}`,
        Com: Login,
    },
    {
        path : `/${ROUTES.ADMIN}`,
        Com : AdminScreen
    },
    {
        path: `/404`,
        Com: () => <div>2223</div>,
    },
    {
        path: `/${ROUTES.HEADOFSECTIONPLAN}`,
        Com: PlanContainer
    }
];