import './App.css';
import { Route } from "react-router-dom";
import Navbar from './components/Navbar';
import {Home} from './components/Home';
import {About} from './components/About'
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';

function App() {
  const [alert, setAlert] = useState(null)
  const showAlert = (massage, type) => {
    setAlert({
      msg: massage,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
    <NoteState>
      
        <Navbar />
        <Alert alert={alert}/>
        <div className="container">
          <Route exact  path="/home" >
            <Home showAlert={showAlert} />
          </Route>
          <Route exact path="/about">
            <About/>
          </Route>
          <Route exact path="/login">
            <Login showAlert={showAlert}/>
          </Route>
          <Route exact path="/signup">
            <Signup showAlert={showAlert} />
          </Route>
        </div>
      </NoteState>
    </>
  );
}

export default App;
