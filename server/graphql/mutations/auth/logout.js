module.exports = {
      async logout(_, {}, context){
          context.res.clearCookie('token', { httpOnly: true, secure: true });
          context.res.clearCookie('refreshToken', { httpOnly: true, secure: true });               
      }
}