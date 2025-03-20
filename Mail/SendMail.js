const nodemailer = require("nodemailer");


const sendMailNodemailer= async ({to, subject,text,html})=>
{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "digiskyfusion@gmail.com",
          pass: "ucuygzqkbgpxonfx",
        },
      });


      const info = await transporter.sendMail({
        from: '"Karan" <digiskyfusion@gmail.com>', // sender address
        to,
        subject,
        text,
        html,
      });
    
      // console.log("Message sent: %s", info.messageId);


}

module.exports= {sendMailNodemailer}