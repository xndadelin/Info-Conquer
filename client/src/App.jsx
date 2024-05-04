import { NavigationBar } from "./components/Navbar";
import {Landing} from './pages/LandingUnauth'
import {Homepage} from "./pages/Homepage";
import { Footer } from "./components/Footer";
import { ProblemsSelection } from "./pages/ProblemsSelection";
import {Routes, Route} from 'react-router-dom'
import { PublishProblem } from "./pages/PublishProblem";
import { Problem } from "./components/Problem";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import {Profile} from './components/Profile'
import {Solution} from "./components/Solution";
import {Problems} from "./components/Problems"
import {Loading} from "./components/Loading";
import {PublishArticle} from "./pages/PublishArticle";
import { Articles } from "./pages/Articles";
import { Article } from "./components/Article";
import { NotFound } from "./pages/NotFound";
import { EditArticle } from "./components/EditArticle";
import { PostAnnouncement } from "./pages/PostAnnouncement";
import { Announcement } from "./components/Announcement";
import { CreateConstest } from "./pages/CreateContest";
import { Contests } from "./pages/Contests";
function App() {
  const {user} = useContext(UserContext)
  if(!user)
    return <Loading/>
  return (
    <div>
      <NavigationBar/>
        <Routes>
          <Route
            path="/"
            element={!user || !user.getUser ? <Landing/>: <Homepage/>}
          />
          <Route
            path="/problems/publish"
            element={<PublishProblem/>} 
          />
          <Route
            path="/problems"
            element={<ProblemsSelection/>}
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
          <Route
            path="/problems/:category/:subcategory"
            element={<Problems/>}
          />
          <Route
            path="/articles/publish"
            element={<PublishArticle/>}
          />
          <Route
            path="/articles"
            element={<Articles/>}
          />
          <Route
            path="/articles/:id"
            element={<Article/>}
          />
          <Route
            path="/articles/edit/:id"
            element={<EditArticle/>}
          />
          <Route 
            path="/post-announcement"
            element={<PostAnnouncement/>}
          />
          <Route 
            path="/announcement/:title"
            element={<Announcement/>}
          />
          <Route
            path="/contests/create"
            element={<CreateConstest/>}
          />
          <Route
            path="/contests"
            element={<Contests/>}
          />
          <Route
            path="*"
            element={<NotFound/>}
          />
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;
