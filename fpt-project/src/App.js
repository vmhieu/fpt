import Login from "./com/Login";
import { BrowserRouter ,Routes, Route, Switch, Redirect } from "react-router-dom";
import { public_route } from "./_config/route";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            {public_route.map(route => (
              <Route key={route.path} path={route.path} element={<route.Com />}>
                {/* <route.Com /> */}
              </Route>
            ))}
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
