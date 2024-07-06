const { postAnnouncement } = require('./mutations/announcement/postAnnouncement');
const { dislikeArticle } = require('./mutations/article/dislikeArticle');
const { editArticle } = require('./mutations/article/editArticle');
const { likeArticle } = require('./mutations/article/likeArticle');
const { publishArticle } = require('./mutations/article/publishArticle');
const { authDiscord } = require('./mutations/auth/authDiscord');
const { login } = require('./mutations/auth/login');
const { logout } = require('./mutations/auth/logout');
const { register } = require('./mutations/auth/register');
const { changeEmail, changeUsername, changePassword } = require('./mutations/auth/settings');
const { verifyEmail } = require('./mutations/auth/verifyEmail');
const { createContest } = require('./mutations/contest/createContest');
const { joinContest } = require('./mutations/contest/joinContest');
const { createProblem } = require('./mutations/problem/createProblem');
const { rateProblem } = require('./mutations/problem/rateProblem');
const { submitSolution } = require('./mutations/problem/submitSolution');
const { createReport } = require('./mutations/report/createReport');
const { getChatbotMessage } = require('./mutations/problem/getChatbotMessage');
const { updateProfilePicture } = require('./mutations/profile/updateProfilePicture');
const { updateBio } = require('./mutations/profile/updateBio');

const { getAnnouncement } = require('./queries/announcement/getAnnouncement');
const { getAnnouncements } = require('./queries/announcement/getAnnouncements');
const { getArticle } = require('./queries/article/getArticle');
const { getArticles } = require('./queries/article/getArticles');
const { getContest } = require('./queries/contest/getContest');
const { getContests } = require('./queries/contest/getContests');
const { getHomepageInfo } = require('./queries/miscellaneous/getHomepageInfo');
const { getLeaderboard } = require('./queries/miscellaneous/getLeaderboard');
const { getSearch } = require('./queries/miscellaneous/getSearch');
const { getDailies } = require('./queries/problem/getDailies');
const { getProblem } = require('./queries/problem/getProblem');
const { getProblems } = require('./queries/problem/getProblems');
const { getProblemStats } = require('./queries/problem/getProblemStats');
const { getSolution } = require('./queries/solution/getSolution');
const { getSubmissions } = require('./queries/solution/getSubmissions');
const { getActivity } = require('./queries/user/getActivity');
const { getProfile } = require('./queries/user/getProfile');
const { getUsers } = require('./queries/user/getUsers');
const { getUser } = require('./queries/user/getUser')

const resolvers = {
  Query: {
    getAnnouncement,
    getAnnouncements,
    getArticle,
    getArticles,
    getContest,
    getContests,
    getHomepageInfo,
    getLeaderboard,
    getSearch,
    getDailies,
    getProblem,
    getProblems,
    getProblemStats,
    getSolution,
    getSubmissions,
    getActivity,
    getProfile,
    getUsers,
    getUser
  },
  Mutation: {
    postAnnouncement,
    dislikeArticle,
    editArticle,
    likeArticle,
    publishArticle,
    authDiscord,
    login,
    logout,
    register,
    changeEmail,
    changePassword,
    changeUsername,
    verifyEmail,
    createContest,
    joinContest,
    createProblem,
    rateProblem,
    submitSolution,
    createReport,
    getChatbotMessage,
    updateProfilePicture,
    updateBio
  }
};

module.exports = resolvers;