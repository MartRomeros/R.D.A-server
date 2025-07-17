export const generarMailContrasena = (): string => {
    const mensaje: string = `
  <div style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; font-family: Arial, sans-serif; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333333; text-align: center;">Cambio de Contraseña</h2>
      <p style="font-size: 16px; color: #555555; line-height: 1.5;">
        Hola, te informamos que se ha generado una nueva contraseña para tu cuenta.
      </p>
      <p style="font-size: 16px; color: #555555; line-height: 1.5;">
        Tu nueva contraseña es la <strong>primera letra en mayúscula de tu apellido paterno</strong> seguida de tu <strong>RUT sin puntos y con guion</strong>.
      </p>
      <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; text-align: center; border-radius: 5px;">
        <span style="font-size: 18px; font-weight: bold; color: #222;">Ejemplo:</span><br>
        <span style="font-size: 20px; color: #2c3e50; margin-top: 10px; display: inline-block;">P12345678-9</span>
      </div>
      <p style="font-size: 16px; color: #555555;">
        Se recomienda cambiar esta contraseña después de iniciar sesión por seguridad.
      </p>
      <p style="font-size: 16px; color: #555555;">
        Si no solicitaste este cambio, por favor comunícate con el soporte técnico de inmediato.
      </p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://rda-registro.cl/login" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Iniciar sesión</a>
      </div>
    </div>
  </div>
  `
  return mensaje

}