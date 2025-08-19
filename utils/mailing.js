const nodemailer = require('nodemailer');
const requer  = require("./config")

const mails = {
    feedback: async function (data) {
        console.log("OK MAIL", data)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {            
                user: requer.mail,
                pass: requer.pmail
            },
            tls: {
                rejectUnauthorized: false//importante para que no rebote la conexccion
            }
        })
        
        let mailOptions
            
        mailOptions = {
            from: 'SITIO WEB',
            to: 'raqueldigitalweb@gmail.com',            
            subject: 'FeedBack Cliente',
            html: ` <h1>Feedback</h1>
                    <p>Nombre: ${data.nombre}</p>  
                    <p>Contacto: ${data.contacto}<p>
                    <p>Como nos conociste?: ${data.conociste}<p>
                    <p>Cómo fue tu experiencia de compra?: ${data.xpCompra}<p>
                    <p>Qué te parecieron la navegacion, fue facil encontra lo que buscabas?: ${data.userXP}<p>
                    <p>comentario: ${data.comentarios}<p>
            `
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
                return err
            }
                console.log("[ MAIL ENVIADO EXITOSAMENTE ]")
            })
            return
    }
}

module.exports = mails