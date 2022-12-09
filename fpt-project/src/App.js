import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { public_route } from "./_config/route";
import Login from "./com/Login";




function App() {
  const isLogin = localStorage.getItem("access_token") ? true : false;
  const role = JSON.parse(localStorage.getItem("role"));
  console.log(isLogin, " ", role);
  return (
    <div>
      <BrowserRouter>
        <Routes>

          {
            public_route.map(route => {
              // const checkRole = isLogin && route.role.filter(i => role.includes(i)).length > 0
              return (
                    <Route key={route.path} path={route.path} element={
                      <route.Com />
                    }>
                    </Route>
              )
            })
          }
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
