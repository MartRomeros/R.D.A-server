import nodemailer from 'nodemailer'

export const sendRecuperarClaveMail = async (destinatario: string, mensaje: string, subject: string, text: string) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'martinsantiago.se@gmail.com',
            pass: process.env.APLICATION_PASS
        }
    })

    const mailOptions = {
        from: '"R.D.A" <martinsantiago.se@gmail.com> ',
        to: destinatario,
        subject: subject,
        text: text,
        html: mensaje
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error: any) {
        console.log(error)

    }

}