import { NavigationBar } from "./components/Navbar";
import { useMutation, useQuery, gql  } from "@apollo/client";
import {Loading} from './components/Loading'
import {Landing} from './pages/LandingUnauth'
import { LandingAuth } from "./pages/LandingAuth";
import { Footer } from "./components/Footer";
import { Problems } from "./pages/Problems";
import {Routes, Route} from 'react-router-dom'
import { PublishProblem } from "./pages/PublishProblem";
import { Problem } from "./components/Problem";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
function App() {
  const {user} = useContext(UserContext)
  return (
    <div>
      <NavigationBar/>
        <Routes>
          <Route
            path="/"
            element={user && !user.getUser ? <Landing/>: <LandingAuth/>}
          />
          <Route
            path="/problems/publish"
            element={<PublishProblem user={user}/>} 
          />
          <Route
            path="/problems"
            element={<Problems/>}
          />
          <Route
            path="/problem/:id"
            element={<Problem user={user}/>}
          />
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;
