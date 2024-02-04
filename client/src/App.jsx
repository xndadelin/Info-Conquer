import { NavigationBar } from "./components/Navbar";
import { useMutation, useQuery, gql  } from "@apollo/client";
import {Loading} from './components/Loading'
import {Landing} from './pages/LandingUnauth'
import { LandingAuth } from "./pages/LandingAuth";
import { Footer } from "./components/Footer";
import { Problems } from "./pages/Problems";
import {Routes, Route} from 'react-router-dom'
import { PublishProblem } from "./pages/PublishProblem";
const getUser = gql`
    query{
        getUser {
            username,
            createdAt,
            email,
            admin
        }
    }
`
function App() {
  const {loading, error, data}  = useQuery(getUser)
  if(loading){
    return (
      <Loading/>
    )
  }
  return (
    <div>
      <NavigationBar data={data}/>
        <Routes>
          <Route
            path="/"
            element={!data.getUser ? <Landing/>: <LandingAuth data={data}/>}
          />
          <Route
            path="/problems/publish"
            element={<PublishProblem data={data}/>} 
          />
          <Route
            path="/problems"
            element={<Problems/>}
          />
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;
