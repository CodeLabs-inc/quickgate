const nodemailer = require("nodemailer");

const linkPlatform =
  process.env.NODE_ENV === "production"
    ? "https://dashboard.tobefixed.co"
    : "http://localhost:3000";
const logoPlatform = 'https://caloraiapp.s3.us-east-1.amazonaws.com/caffeine_code.gif'
const senderEmail = "federicoaugusto.lacchini@gmail.com";
const senderName = "Gated Inc.";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "federicoaugusto.lacchini@gmail.com",
    pass: "sudx vgkz fxlf gnci",
  },
});

async function sendVerificationEmail(
  token,
  email,
) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"${senderName}" <${senderEmail}>`,
    to: `${email}`,
    subject: `${senderName} - ${token} - Activation Code`, // Subject line
    text: ` 
            Hello,

            You requested a verification code to access your ${senderName} account.
            Your verification code is: **${token}**

            Please enter this code on the verification page to proceed.
            If you did not request this code, please ignore this email.

            Best regards,
            ${senderName}
            `,
    html: `
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invitation Email</title>
                    <style>
                        body {
                            background-color: white;
                            font-family: Arial, sans-serif;
                            color: #333333;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: white;
                            padding: 20px;
                            border: 1px solid #dddddd;
                            border-radius: 8px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

                            
                        }
                        .button {
                            display: inline-block;
                            margin: 20px auto;
                            padding: 15px 25px;
                            background-color: #007BFF;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                            font-weight: bold;
                        }
                        .button:hover {
                            background-color: #0056b3;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 12px;
                            color: #999999;
                            text-align: center;
                        }

                        .containerLogo{
                            width: 100%;

                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }

                        .logo{
                            width: 200px;
                            height: 200px;
                            border-radius: 10px;
                            background-color: #ffffff;
                            object-fit: contain;
                        }
                            
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="containerLogo">
                            <img src="${logoPlatform}" class='logo'>
                        </div>
                        <p>Hello,</p>

                        <p>You requested a verification code to access your <strong>${senderName}</strong> account.</p>
                        <p>Your verification code is</p>

                        
                            
                        <div style="text-align: center;">
                            <div class='button'>${token}</a>
                        </div>

                        <p>Please enter this code on the verification page to proceed</p>
                        <p>If you do not know this organization, please ignore this email.</p>

                        <p>Best regards,</p>
                        <p><strong>${senderName}</strong></p>

                        <div class="footer">
                            <p>This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </body>
            </html>
            `,
  });

  return info.messageId ? true : false;
}
async function sendAdminAccountCreationEmail(
    password,
    email,
) {
    // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"${senderName}" <${senderEmail}>`,
    to: `${email}`,
    subject: `${senderName} - You have been invited`, // Subject line
    text: ` 
            Hello,

            You have been invited to ${senderName}
            Your password is: **${password}**

            You will be able to change your password once you log in.

            Activate your email now by clicking the link below:
            ${linkPlatform}/auth/verify?email=${email}
            If you did not request this code, please ignore this email.

            Best regards,
            ${senderName}
            `,
    html: `
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invitation Email</title>
                    <style>
                        body {
                            background-color: white;
                            font-family: Arial, sans-serif;
                            color: #333333;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: white;
                            padding: 20px;
                            border: 1px solid #dddddd;
                            border-radius: 8px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

                            
                        }
                        .button {
                            display: inline-block;
                            margin: 20px auto;
                            padding: 15px 25px;
                            background-color: #007BFF;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            text-align: center;
                            font-weight: bold;
                        }
                        .button:hover {
                            background-color: #0056b3;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 12px;
                            color: #999999;
                            text-align: center;
                        }

                        .containerLogo{
                            width: 100%;

                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }

                        .logo{
                            width: 200px;
                            height: 200px;
                            border-radius: 10px;
                            background-color: #ffffff;
                            object-fit: contain;
                        }
                            
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="containerLogo">
                            <img src="${logoPlatform}" class='logo'>
                        </div>
                        <p>Hello,</p>

                        <p>You have been invited to <strong>${senderName}</strong></p>
                        <p>Your password code is</p>

                        
                            
                        <div style="text-align: center;">
                            <div class='button'>${password}</a>
                        </div>

                        <p>You will be able to change your password once you log in</p>

                        <p>Activate your email now by clicking the link below:</p>
                        <a href="${linkPlatform}/auth/verify?email=${email}" style="text-align: center;">
                            <div class='button'>Verify email</a>
                        </a>

                        <p>If you can't click on the button above paste the link below in the browser</p>
                        <p>${linkPlatform}/auth/verify?email=${email}</p>

                        <p>If you do not know this organization, please ignore this email.</p>

                        <p>Best regards,</p>
                        <p><strong>${senderName}</strong></p>

                        <div class="footer">
                            <p>This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </body>
            </html>
            `,
    });

    return info.messageId ? true : false;
}


function dectectPlusInEmail(email) {
    // Replace all occurrences of '+' with '%2B'
    const encodedEmail = email.replace(/\+/g, "%2B");
    return encodedEmail;
  }

module.exports = {
  sendVerificationEmail,
  sendAdminAccountCreationEmail,
};
