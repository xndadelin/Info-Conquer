const { getUser } = require('./getUser');
const cookie = require('cookie');

module.exports = async (req, res, next) => {
    const context = { req, res };
    const user = await getUser(context);

    if (user) {
        const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
        const tokenFromCookie = cookies.csrfToken;
        const tokenFromHeader = req.headers['x-csrf-token'];

        if (tokenFromCookie && tokenFromHeader && tokenFromCookie === tokenFromHeader) {
            next();
        } else {
            res.status(403).json({ message: 'CSRF token is missing or invalid' });
        }
    } else {
        next();
    }
};
