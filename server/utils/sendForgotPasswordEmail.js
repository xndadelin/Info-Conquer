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
        subject: 'Forgot Password for InfoConquer',
        html: `<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #2c3e50;
            margin-bottom: 20px;
          }
          .btn {
            display: inline-block;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .warning {
            color: #e74c3c;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Your Password</h1>
          <p>We received a request to reset your password for your InfoConquer account. If you didn't make this request, you can safely ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <a href="${process.env.CLIENT_URL}/reset-password/${codeForVerification}" class="btn">Reset Password</a>
          <p class="warning">This link will expire in 24 hours for security reasons.</p>
          <p>If you're having trouble with the button above, copy and paste the following URL into your web browser:</p>
          <p>${process.env.CLIENT_URL}/reset-password/${codeForVerification}</p>
          <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The InfoConquer Team</p>
        </div>
      </body>
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