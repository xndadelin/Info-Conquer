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
import { Contest } from "./components/Contest";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyEmail } from "./components/VerifyEmail";
import { Leaderboard } from "./pages/Leaderboard";
import { Search } from "./components/Search";
import { AuthDiscord } from "./components/AuthDiscord";
import { Calendar } from "./pages/Calendar";
function App() {
  const {user} = useContext(UserContext)
  if(!user)
    return <Loading/>
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar/>
        <Routes>
          <Route
            path="/"
            element={!user || !user.getUser ? <Landing/>: <Homepage/>}
          />
          <Route
            path="/login"
            element={<Login/>}
          />
          <Route
            path="/register"
            element={<Register/>}
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
            path="/contests/view/:id"
            element={<Contest/>}
          />
          <Route
            path="/verify/:token"
            element={<VerifyEmail/>}
          />
          <Route
            path="/leaderboard"
            element={<Leaderboard/>}
          />
          <Route
            path="/search/:query"
            element={<Search/>}
          />
          <Route
            path="/auth/discord/callback"
            element={<AuthDiscord/>}
          />
          <Route
            path="/calendar"
            element={<Calendar/>}
          />
          <Route
            path="/contests/:contest/:id"
            element={<Problem/>}
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
