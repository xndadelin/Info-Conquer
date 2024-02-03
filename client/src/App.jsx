import { NavigationBar } from "./components/Navbar";
import { useMutation, useQuery, gql  } from "@apollo/client";
import {Loading} from './components/Loading'
import {Landing} from './pages/Landing'
import { Footer } from "./components/Footer";
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
      <Landing/>
      <Footer/>
    </div>
  );
}

export default App;
