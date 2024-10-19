function OTPEmailTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 10px 0;
            background-color: #007bff;
            color: white;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #333;
            letter-spacing: 4px;
            padding: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            background-color: #f4f4f4;
            border-radius: 0 0 8px 8px;
            color: #777;
            font-size: 14px;
          }
          .footer p {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Thank you for signing up! To verify your email, please use the OTP below:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for the next 5 minutes. Do not share this code with anyone.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Socialbook. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `;
}

module.exports = OTPEmailTemplate;
