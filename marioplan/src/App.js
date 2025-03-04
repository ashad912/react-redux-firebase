import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from "./components/layout/Navbar"
import Dashboard from "./components/dashboard/Dashboard"
import ProjectDetails from './components/projects/ProjectDetails'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import CreateProject from './components/projects/CreateProject';
import Canvas from './components/extras/Canvas'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path = '/' component={Dashboard} />
            <Route path = '/project/:id' component={ProjectDetails}/>
            <Route path = '/signin' component={SignIn}/>
            <Route path = '/signup' component={SignUp}/>
            <Route path = '/create' component={CreateProject}/>
            <Route path = '/canvas' component={Canvas}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
