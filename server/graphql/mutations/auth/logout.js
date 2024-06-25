module.exports = {
      async logout(_, {}, context){
          try{
            context.res.clearCookie('token', { httpOnly: true, secure: true });
            context.res.clearCookie('refreshToken', { httpOnly: true, secure: true });
          }catch(error){
            console.log(error)
          }                    
      }
}