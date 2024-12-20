const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
        logger: true,
        debug: true
    });
    // console.log('User:', process.env.GMAIL_USER); 
    // console.log('Pass:', process.env.GMAIL_PASS);    

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
        html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

module.exports = sendVerificationEmail;
