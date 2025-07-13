import transporter from "../config/nodemailer.js";

export const sendOtp = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Account Verification OTP",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2c3e50;">Team Courselect</h2>
                <p>Hi there,</p>
                <p>Thank you for registering with <strong>Courselect</strong>.</p>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #1abc9c;">
                    ${otp}
                </div>
                <p>Please use this OTP to complete your account setup. This code is valid for 15 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <br />
                <p>Best regards,</p>
                <p><strong>The Courselect Team</strong></p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};