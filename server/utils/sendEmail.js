const nodemailer = require('nodemailer')
const sendEmail = (email, codeForVerification) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mail = {
        from: {
            name: 'InfoConquer',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Verify your email address for InfoConquer',
        html: `<h1>Verify your email address</h1>
            <p>Click <a href="${process.env.CLIENT_URL}/verify/${codeForVerification}">here</a> to verify your email address</p>
            <p>If you did not register for InfoConquer, please ignore this email</p>
            <p style="color: red;">This link will expire in 24 hours</p>
        `
    }
    transporter.sendMail(mail, (err, info) => {
        if(err){
            throw new ApolloError(err)
        }
    })
}
module.exports = {
    sendEmail
}