/** Plantillas HTML de los correos transaccionales (Resend). */

const escapar = (texto: string) =>
  texto.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );

function layout(titulo: string, cuerpo: string): string {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f5f7fb;font-family:Segoe UI,Roboto,Arial,sans-serif;color:#1f2937">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:8px;padding:32px">
  <tr><td><p style="margin:0 0 24px;font-weight:700;color:#1d4ed8">Nómina Riwi</p>
  <h1 style="font-size:20px;margin:0 0 16px">${escapar(titulo)}</h1>${cuerpo}
  <p style="margin:32px 0 0;font-size:12px;color:#6b7280">Este es un mensaje automático, no respondas a este correo.</p>
  </td></tr></table></td></tr></table></body></html>`;
}

function boton(url: string, texto: string): string {
  return `<p style="margin:24px 0"><a href="${escapar(url)}" style="background:#1d4ed8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">${escapar(texto)}</a></p>
  <p style="font-size:12px;color:#6b7280">Si el botón no funciona, copia este enlace: ${escapar(url)}</p>`;
}

export function correoInvitacion(nombre: string, url: string, horas: number) {
  return {
    asunto: 'Te invitaron a Nómina Riwi',
    html: layout(
      `Hola, ${nombre}`,
      `<p>Te dieron acceso a la plataforma de liquidación de nómina. Define tu contraseña para activar tu cuenta.</p>
       ${boton(url, 'Activar mi cuenta')}
       <p style="font-size:14px">El enlace vence en ${horas} horas y solo se puede usar una vez.</p>`,
    ),
  };
}
