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
function App() {
  const {user} = useContext(UserContext)
  console.log(user)
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
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;
