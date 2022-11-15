import Home from "../com/Home";
import Login from "../com/Login";
import AdminScreen from "../com/admin/index";
import PlanContainer from "../com/headOfSection/PlanContainer";
import PlanDetailContainer from "../com/headOfSection/PlanDetailContainer";
import LectureContainer from "../com/lecture/LectureContainer";
import LectureDetailContainer from "../com/lecture/LectureDetailContainer";
import TrainingContainer from "../com/training/TrainingContainer";

export const ROUTES = {
    HOME : '',
    LOGIN : 'login',
    ADMIN : 'admin',
    HEADOFSECTIONPLAN: 'plan',
    PLAN_DETAIL: `plan/:Id`,
    LECTURE: 'lecture',
    LECTURE_DETAIL: 'lecture/:Id',
    TRAINING:'train'
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
    },
    {
        path: `/${ROUTES.PLAN_DETAIL}`,
        Com: PlanDetailContainer
    },
    {
        path: `/${ROUTES.LECTURE}`,
        Com: LectureContainer
    },
    {
        path: `/${ROUTES.LECTURE_DETAIL}`,
        Com: LectureDetailContainer
    },
    {
        path: `/${ROUTES.TRAINING}`,
        Com: TrainingContainer
    }

];