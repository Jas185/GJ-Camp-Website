const nodemailer = require('nodemailer');

// Configuration du transporteur d'email
const createTransporter = () => {
  // En production, utiliser un service d'email configuré
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else if (process.env.EMAIL_SERVICE === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (process.env.EMAIL_HOST) {
    // Configuration personnalisée (Brevo, Mailgun, etc.)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  
  // En développement, retourner null (on créera un compte Ethereal)
  return null;
};

// Envoyer un email de vérification
const sendVerificationEmail = async (email, firstName, verificationToken) => {
  let transporter = createTransporter();
  
  // Si pas de transporteur configuré, créer un compte de test Ethereal
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Compte email de test créé:', testAccount.user);
  }

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: `"GJ Camp" <${process.env.EMAIL_USER || 'noreply@gjcamp.com'}>`,
    to: email,
    subject: '✉️ Confirmez votre adresse email - GJ Camp',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #a01e1e; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background-color: #001a4d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue sur GJ Camp !</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${firstName},</h2>
              <p>Merci de vous être inscrit sur GJ Camp. Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">✅ Confirmer mon email</a>
              </div>
              
              <p>Ou copiez ce lien dans votre navigateur :</p>
              <p style="background-color: #e9e9e9; padding: 10px; border-radius: 3px; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <p><strong>Ce lien expire dans 24 heures.</strong></p>
              
              <p>Si vous n'avez pas créé de compte sur GJ Camp, vous pouvez ignorer cet email.</p>
              
              <p>Cordialement,<br>L'équipe GJ Camp</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} GJ Camp - Tous droits réservés</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Bonjour ${firstName},
      
      Merci de vous être inscrit sur GJ Camp. Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur ce lien :
      
      ${verificationUrl}
      
      Ce lien expire dans 24 heures.
      
      Si vous n'avez pas créé de compte sur GJ Camp, vous pouvez ignorer cet email.
      
      Cordialement,
      L'équipe GJ Camp
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  
  // Si en développement avec Ethereal, afficher le lien de prévisualisation
  if (process.env.NODE_ENV !== 'production') {
    console.log('📨 Email de vérification envoyé');
    console.log('🔗 Prévisualisation:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

// Renvoyer un email de vérification
const resendVerificationEmail = async (email, firstName, verificationToken) => {
  return sendVerificationEmail(email, firstName, verificationToken);
};

module.exports = {
  sendVerificationEmail,
  resendVerificationEmail,
};
