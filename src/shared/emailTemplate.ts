import { ICreateAccount, IResetPassword } from '../types/emailTamplate';
const logoImage = 'https://airport-airbnb-website.vercel.app/airbnb-logo.png'

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 40px; color: #333;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">

      <!-- Logo -->
      <img src="${logoImage}" alt="Logo" style="width: 100px; margin-bottom: 24px; border-radius: 50%;" />

      <!-- Title -->
      <h2 style="color: #111; font-size: 20px; margin-bottom: 12px; font-weight: 600;">
        Hi ${values.name},
      </h2>
      <p style="font-size: 15px; color: #555; margin-bottom: 28px; line-height: 1.6;">
        Use the following verification code to securely sign in to your <strong>Toothlens</strong> account.
      </p>

      <!-- OTP Code Box -->
      <div style="background-color: #002D62; color: #fff; font-size: 26px; font-weight: bold; letter-spacing: 6px; padding: 18px 0; width: 160px; margin: 0 auto 28px; border-radius: 10px; box-shadow: inset 0 -2px 4px rgba(0,0,0,0.15);">
        ${values.otp}
      </div>

      <!-- Expiration Note -->
      <p style="font-size: 14px; color: #666; margin-bottom: 8px;">
        This code will expire in <strong>3 minutes</strong>.
      </p>

      <!-- Footer Note -->
      <p style="font-size: 12px; color: #999; margin-top: 20px; line-height: 1.5;">
        If you didn’t request this code, you can safely ignore this email.  
        For security reasons, do not share this code with anyone.
      </p>
  </div>
</body>

`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 40px; color: #333;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 14px; padding: 36px 28px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); text-align: center;">

      <!-- Logo -->
      <img src=${logoImage} alt="Logo" style="display: block; margin: 0 auto 28px; width: 120px; border-radius: 50%;" />

      <!-- Title -->
      <h2 style="color: #111; font-size: 20px; font-weight: 600; margin-bottom: 16px;">
        Your One-Time Verification Code
      </h2>

      <!-- Message -->
      <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
        Use the following code to securely sign in to your <strong>Toothlens</strong> account.
      </p>

      <!-- OTP Box -->
      <div style="background-color: #277E16; color: #fff; font-size: 26px; font-weight: bold; letter-spacing: 6px; padding: 16px 0; width: 140px; margin: 0 auto 28px; border-radius: 10px; box-shadow: inset 0 -2px 4px rgba(0,0,0,0.15);">
        ${values.otp}
      </div>

      <!-- Expiration -->
      <p style="font-size: 14px; color: #666; margin-bottom: 22px;">
        This code is valid for <strong>3 minutes</strong>.
      </p>

      <!-- Security Disclaimer -->
      <p style="font-size: 13px; color: #999; text-align: left; line-height: 1.6; margin-top: 20px;">
        If you did not request this code, you can safely ignore this email.  
        Someone else may have typed your email address by mistake.
      </p>
  </div>
</body>
`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};
