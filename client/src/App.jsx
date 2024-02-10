import { NavigationBar } from "./components/Navbar";
import {Landing} from './pages/LandingUnauth'
import { LandingAuth } from "./pages/LandingAuth";
import { Footer } from "./components/Footer";
import { Problems } from "./pages/Problems";
import {Routes, Route} from 'react-router-dom'
import { PublishProblem } from "./pages/PublishProblem";
import { Problem } from "./components/Problem";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import {Profile} from './components/Profile'
import {Solution} from "./components/Solution";

function App() {
  const {user} = useContext(UserContext)
  return (
    <div>
      <NavigationBar/>
        <Routes>
          <Route
            path="/"
            element={!user || !user.getUser ? <Landing/>: <LandingAuth/>}
          />
          <Route
            path="/problems/publish"
            element={<PublishProblem/>} 
          />
          <Route
            path="/problems"
            element={<Problems/>}
          />
          <Route
            path="/problems/:id"
            element={<Problem/>}
          />
          <Route
            path="/profile/:username"
            element={<Profile/>}
          />
          <Route
            path="/solution/:username/:id"
            element={<Solution/>}
          />
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;
