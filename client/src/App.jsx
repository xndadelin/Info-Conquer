import { NavigationBar } from "./components/Navbar/Navbar";
import { Landing } from './pages/LandingPages/LandingUnauth'
import { Homepage } from "./pages/LandingPages/Homepage";
import { Footer } from "./components/Miscellaneous/Footer";
import { ProblemsSelection } from "./pages/Problems/ProblemsSelection";
import { Routes, Route, Router } from 'react-router-dom'
import { PublishProblem } from "./pages/Problems/PublishProblem";
import { Problem } from "./pages/Problems/Problem";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { Profile } from './pages/Profile/Profile'
import { Solution } from "./pages/Problems/Solution";
import { Problems } from "./pages/Problems/Problems"
import { PublishArticle } from "./pages/Article/PublishArticle";
import { Articles } from "./pages/Article/Articles";
import { Article } from "./pages/Article/Article";
import { EditArticle } from "./pages/Article/EditArticle";
import { PostAnnouncement } from "./pages/Announcement/PostAnnouncement";
import { Announcement } from "./pages/Announcement/Announcement";
import { CreateConstest } from "./pages/Contest/CreateContest";
import { Contests } from "./pages/Contest/Contests";
import { Contest } from "./pages/Contest/Contest";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { VerifyEmail } from "./pages/Auth/VerifyEmail";
import { Leaderboard } from "./pages/Leaderboard/Leaderboard";
import { Search } from "./pages/Search/Search";
import { AuthDiscord } from "./components/Auth/AuthDiscord";
import { Calendar } from "./pages/Calendar/Calendar";
import { Help } from "./components/Settings/Help";
import { ForgotPassword } from "./pages/Settings/ForgotPassword";
import { ResetPassword } from "./components/Settings/ResetPassword";
import { PrivacyPolicy } from "./pages/Policies/PrivacyPolicy";
import { SecurityPolicy } from "./pages/Policies/SecurityPolicy";
import { NotFound } from "./components/Miscellaneous/NotFound";
import { Loading } from "./components/Miscellaneous/Loading";
import ScrollTop from "./utils/ScrollTop";

function App() {
  const { user } = useContext(UserContext)
  if (!user)
    return <Loading />
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <Help />
      <Routes>
        <Route
          path="/"
          element={!user || !user.getUser ? <Landing /> : <Homepage />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/problems/publish"
          element={<PublishProblem />}
        />
        <Route
          path="/problems"
          element={<ProblemsSelection />}
        />
        <Route
          path="/problems/:id"
          element={<Problem />}
        />
        <Route
          path="/profile/:username"
          element={<Profile />}
        />
        <Route
          path="/solution/:username/:id"
          element={<Solution />}
        />
        <Route
          path="/problems/:category/:subcategory"
          element={<Problems />}
        />
        <Route
          path="/articles/publish"
          element={<PublishArticle />}
        />
        <Route
          path="/articles"
          element={<Articles />}
        />
        <Route
          path="/articles/:id"
          element={<Article />}
        />
        <Route
          path="/articles/edit/:id"
          element={<EditArticle />}
        />
        <Route
          path="/post-announcement"
          element={<PostAnnouncement />}
        />
        <Route
          path="/announcement/:title"
          element={<Announcement />}
        />
        <Route
          path="/contests/create"
          element={<CreateConstest />}
        />
        <Route
          path="/contests"
          element={<Contests />}
        />
        <Route
          path="/contests/view/:id"
          element={<Contest />}
        />
        <Route
          path="/verify/:token"
          element={<VerifyEmail />}
        />
        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />
        <Route
          path="/search/:query"
          element={<Search />}
        />
        <Route
          path="/auth/discord/callback"
          element={<AuthDiscord />}
        />
        <Route
          path="/calendar"
          element={<Calendar />}
        />
        <Route
          path="/contests/:contest/:id"
          element={<Problem />}
        />
        <Route
          path="/daily/:problem_name/:year/:month/:day"
          element={<Problem />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/security-policy"
          element={<SecurityPolicy />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
