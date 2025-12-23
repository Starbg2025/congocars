
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
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

    // Note: This requires valid process.env variables to work in a real Netlify deployment.
    // If they aren't set, this will fail. We use a try/catch.
    await transporter.sendMail(mailAdmin);
    await transporter.sendMail(mailClient);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error("Email Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
