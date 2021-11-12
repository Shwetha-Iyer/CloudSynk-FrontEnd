import './App.css';
import Mainpage from "./components/mainpage";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/login';
import Signup from './components/signup';
import Forgot from './components/forgot';
import Dashboard from './components/dashboard';
import Resetpassword from './components/resetpassword';
import Activate from './components/activate';
function App() {
  return <>
  <Router>
    <Switch>
      <Route path="/" component={Mainpage} exact={true}/>
      <Route path="/login" component={Login} exact={true}/>
      <Route path="/signup" component={Signup} exact={true}/>
      <Route path="/forgot" component={Forgot} exact={true}/>
      <Route path="/dashboard" component={Dashboard} exact={true}/>
      <Route path="/resetpassword/:token" component={Resetpassword} exact={true}/>
      <Route path="/activateaccount/:token" component={Activate} exact={true}/>
    </Switch>
  </Router>
  </>
}

export default App;
