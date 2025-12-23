const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const data = req.body;

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

    await transporter.sendMail(mailAdmin);
    await transporter.sendMail(mailClient);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};