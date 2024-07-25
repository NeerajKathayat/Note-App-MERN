import CreateNotes from './assets/CreateNotes';
import Login from './assets/Login';
import NavBar from './assets/NavBar';
import Notes from './assets/Notes';
import SignUp from './assets/SignUp';
import PrivateComponent from './assets/PrivateComponent';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";


function App() {
   
  return (
    <>
      <Router>
        <Routes>
         <Route path="/" element={<Navigate to="/login" />} />

          <Route element={<PrivateComponent />}>
            <Route path="/dashboard" exact element={<Notes />} />
          </Route>
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
