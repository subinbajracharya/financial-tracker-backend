import nodemailer from "nodemailer"

// Send email
const processEmail = async (obj) => {
    // Create email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: +process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
    });

    const info = await transporter.sendMail({
        from: `"Financial Tracker" <${process.env.EMAIL_USER}>`,
        ...obj
    });

    console.log("Message sent:", info.messageId);
}

export const sendEmailVerificationTemplate = async (to, url, userName) => {
    const obj = {
        to,
        subject: "Verify your Email",
        text: `Please verify your email by clicking on this link ${url}`,
        html: `
        <p>Dear ${userName},</p>
        <h1>To verify your account, please click the button below<h1>
        <br />
        <br />

        <a href="${url}" target="_blank" style="background-color: green; color: white; padding: 10px 15px; border-radius: 8px">Verify Your Email</a>
        <br />
        <br />
        <p>Thank you for registering with us!</p>
        <br />
        <br />
        <p>Warm Regards,</p>
        <p>Financial Tracker</p>
        `,
    }

    await processEmail(obj)
}
