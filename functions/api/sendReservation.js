const nodemailer = require("nodemailer");

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const data = await request.json();

    // Configuration du transporteur avec les variables d'environnement Cloudflare
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.ADMIN_EMAIL,
        pass: env.ADMIN_EMAIL_PASSWORD
      }
    });

    const mailAdmin = {
      from: "CONGOCAR EXCLUSIVE <no-reply@congocar.com>",
      to: "mungu.massikini@hotmail.com",
      subject: "Nouvelle réservation – CONGOCAR EXCLUSIVE",
      text: `Une nouvelle réservation a été effectuée :
      
Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone}
Voiture: ${data.car}
Message: ${data.message || 'Aucun message'}`
    };

    const mailClient = {
      from: "CONGOCAR EXCLUSIVE <no-reply@congocar.com>",
      to: data.email,
      subject: "Confirmation de votre réservation – CONGOCAR EXCLUSIVE",
      text: `Bonjour ${data.name},
      
Merci pour votre réservation pour le véhicule suivant : ${data.car}.
L'administrateur de CONGOCAR EXCLUSIVE a bien reçu votre demande et vous contactera très prochainement au numéro ${data.phone}.

Cordialement,
L'équipe CONGOCAR EXCLUSIVE`
    };

    await transporter.sendMail(mailAdmin);
    await transporter.sendMail(mailClient);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}