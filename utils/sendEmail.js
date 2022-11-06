const nodemailer = require('nodemailer');

const sendEmail = (username, email, link)=>{

    let subject = 'Welcome to BlogDude';
    let text;
    let body;

    if(link){
        text = `Hello ${username}, here is your reset password link`;
        body = `<a href=${link} target='_blank'>Reset Password</a>`;
    }else{
        text = `Congratulations!! ${username}, your account has been successfully created`;
        body = `<p>We are glad to tell you that you are now have became member of our family</p>`;
    }

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    });

    const mailOptions = {
        form:process.env.EMAIL,
        to:email,
        subject:subject,
        text:text,
        html:body
    };

    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Email sent successfully.. ' + info.response);
        }
    });
}

module.exports = sendEmail;
