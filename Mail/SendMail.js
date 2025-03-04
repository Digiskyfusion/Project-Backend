const nodemailer = require("nodemailer");


const sendMailNodemailer= async ({to, subject,text,html})=>
{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "manishsharma5382@gmail.com",
          pass: "rxotvhjyxbfmnwjl",
        },
      });


      const info = await transporter.sendMail({
        from: '"Manish" <manishsharma5382@gmail.com>', // sender address
        to,
        subject,
        text,
        html,
      });
    
      // console.log("Message sent: %s", info.messageId);


}

module.exports= {sendMailNodemailer}