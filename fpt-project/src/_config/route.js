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
        path: `/${ROUTES.LOGIN}`,
        Com: Login,
        role : [1 ,2 ,3]
    },
    {
        path: `/${ROUTES.HOME}`,
        Com: Home,
        role : [1 ,2 ,3]
    },
    {
        path : `/${ROUTES.ADMIN}`,
        Com : AdminScreen,
        // role : [1]
        role : [1 ,2 ,3]
    },
    {
        path: `/404`,
        Com: () => <div>2223</div>,
        role : [1 ,2 ,3]
    },
    {
        path: `/${ROUTES.HEADOFSECTIONPLAN}`,
        Com: PlanContainer,
        // role : [2]
        role : [1 ,2 ,3]
    },
    {
        path: `/${ROUTES.PLAN_DETAIL}`,
        Com: PlanDetailContainer,
        // role : [2]
        role : [1 ,2 ,3]
    },
    {
        path: `/${ROUTES.LECTURE}`,
        Com: LectureContainer,
        // role : [3]
        role : [1 ,2 ,3]
    },
    {
        path: `/${ROUTES.LECTURE_DETAIL}`,
        Com: LectureDetailContainer,
        // role : [3]
        role : [1 ,2 ,3]
    },
    {
        path: `/${ROUTES.TRAINING}`,
        Com: TrainingContainer,
        // role : [3]
        role : [1 ,2 ,3]
    }

];