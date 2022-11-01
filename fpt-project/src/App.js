import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './com/Login';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/login">
            <Login />
          </Route>
          
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
