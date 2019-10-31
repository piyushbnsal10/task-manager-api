var sgMail=require('@sendgrid/mail')
var sendgridAPIiKey=process.env.Send_grid_API

sgMail.setApiKey(sendgridAPIiKey)

var sendWelcomeEmail=(email,name)=>{
    sgMail.send({
    to: email,
    from: 'maan.bnsal10@gmail.com',
    subject: 'Thanks for Joining !!!',
    text: `Hey ${name}`
})
}

var sendCancellationEmail=(email,name)=>{
    sgMail.send({
    to: email,
    from: 'maan.bnsal10@gmail.com',
    subject: 'Sorry to see you go!!!',
    text: `Goodbye ${name}`
})
}


module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}