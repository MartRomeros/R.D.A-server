import nodemailer from 'nodemailer'

export const sendRecuperarClaveMail = async (destinatario:string) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'registro.asistencias.duoc@gmail.com',
            pass: process.env.APLICATION_PASS
        }
    })

    const mailOptions = {
        from: '"R.D.A" <registro.asistencias.duoc@gmail.com> ',
        to: destinatario,
        subject: 'Prueba con nodemailer',
        text: 'Es un correo de prueba',
        html: '<b>Este es un correo real enviado desde TypeScript y Nodemailer 🎉</b>'

    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error: any) {
        console.log(error)

    }

}