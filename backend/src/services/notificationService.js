const nodemailer = require('nodemailer');
const User = require('../models/User');

/**
 * Service de notifications multi-canal
 * Supporte: Email, SMS (Twilio), Push (OneSignal/Firebase)
 */

// Créer le transporteur email
const createTransporter = () => {
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
  
  return null;
};

// ==================== EMAIL ====================
/**
 * Envoyer une notification email pour un nouveau post
 */
const sendEmailNotification = async (post, recipients) => {
  try {
    if (!recipients || recipients.length === 0) {
      console.log('⚠️ Aucun destinataire pour la notification email');
      return;
    }

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

    const subject = '📰 Nouveau post sur GJ Camp Newsletter';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .post-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .author { display: flex; align-items: center; margin-bottom: 15px; }
          .author-name { font-weight: bold; color: #667eea; }
          .post-text { color: #555; line-height: 1.8; }
          .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📰 Nouveau Post</h1>
            <p>Génération Josué Camp Newsletter</p>
          </div>
          <div class="content">
            <div class="post-card">
              <div class="author">
                <span class="author-name">${post.author.firstName} ${post.author.lastName}</span>
                <span style="color: #999; margin-left: 10px;">vient de publier</span>
              </div>
              <div class="post-text">
                ${post.text.substring(0, 300)}${post.text.length > 300 ? '...' : ''}
              </div>
              ${post.image ? `<img src="${process.env.FRONTEND_URL}${post.image}" style="width: 100%; border-radius: 8px; margin-top: 15px;" alt="Image du post">` : ''}
            </div>
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/newsletter" class="btn">Voir le post complet</a>
            </div>
            <div class="footer">
              <p>Vous recevez cet email car vous êtes abonné aux notifications GJ Camp.</p>
              <p><a href="${process.env.FRONTEND_URL}/profil" style="color: #667eea;">Gérer mes préférences</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoi groupé (max 50 destinataires par email pour éviter le spam)
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const info = await transporter.sendMail({
        from: `"GJ Camp Newsletter" <${process.env.EMAIL_USER}>`,
        bcc: batch.map(r => r.email).join(','), // BCC pour confidentialité
        subject,
        html: htmlContent
      });

      console.log(`✅ Email envoyé à ${batch.length} utilisateurs (batch ${Math.floor(i/batchSize) + 1})`);
      
      // Si en développement avec Ethereal, afficher le lien de prévisualisation
      if (process.env.NODE_ENV !== 'production' && i === 0) {
        console.log('🔗 Prévisualisation:', nodemailer.getTestMessageUrl(info));
      }
    }

    return { success: true, sent: recipients.length };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error: error.message };
  }
};

// ==================== SMS (Twilio) ====================
/**
 * Envoyer une notification SMS via Twilio
 * Nécessite: npm install twilio
 * Variables d'env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 */
const sendSMSNotification = async (post, recipients) => {
  try {
    // Vérifier si Twilio est configuré
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log('⚠️ SMS désactivé: Twilio non configuré');
      return { success: false, error: 'Twilio non configuré' };
    }

    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const message = `📰 GJ Camp Newsletter\n${post.author.firstName} a publié: "${post.text.substring(0, 100)}..."\nVoir: ${process.env.FRONTEND_URL}/newsletter`;

    let sentCount = 0;
    for (const recipient of recipients) {
      if (recipient.phoneNumber && recipient.smsNotifications) {
        try {
          await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: recipient.phoneNumber
          });
          sentCount++;
        } catch (err) {
          console.error(`❌ Erreur SMS pour ${recipient.phoneNumber}:`, err.message);
        }
      }
    }

    console.log(`✅ SMS envoyés: ${sentCount}/${recipients.length}`);
    return { success: true, sent: sentCount };
  } catch (error) {
    console.error('❌ Erreur service SMS:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PUSH (OneSignal) ====================
/**
 * Envoyer une notification push via OneSignal
 * Nécessite: npm install onesignal-node
 * Variables d'env: ONESIGNAL_APP_ID, ONESIGNAL_API_KEY
 */
const sendPushNotification = async (post, recipients) => {
  try {
    // Vérifier si OneSignal est configuré
    if (!process.env.ONESIGNAL_APP_ID || !process.env.ONESIGNAL_API_KEY) {
      console.log('⚠️ Push désactivé: OneSignal non configuré');
      return { success: false, error: 'OneSignal non configuré' };
    }

    const OneSignal = require('onesignal-node');
    const client = new OneSignal.Client({
      userAuthKey: process.env.ONESIGNAL_API_KEY,
      app: { appAuthKey: process.env.ONESIGNAL_API_KEY, appId: process.env.ONESIGNAL_APP_ID }
    });

    // Filtrer les utilisateurs avec ID push
    const playerIds = recipients
      .filter(r => r.pushPlayerId && r.pushNotifications)
      .map(r => r.pushPlayerId);

    if (playerIds.length === 0) {
      console.log('⚠️ Aucun utilisateur avec push activé');
      return { success: true, sent: 0 };
    }

    const notification = {
      contents: { en: post.text.substring(0, 100) + '...' },
      headings: { en: `📰 ${post.author.firstName} ${post.author.lastName}` },
      url: `${process.env.FRONTEND_URL}/newsletter`,
      include_player_ids: playerIds,
      big_picture: post.image ? `${process.env.FRONTEND_URL}${post.image}` : null
    };

    const response = await client.createNotification(notification);
    console.log(`✅ Push envoyés: ${response.body.recipients}`);
    
    return { success: true, sent: response.body.recipients };
  } catch (error) {
    console.error('❌ Erreur service Push:', error);
    return { success: false, error: error.message };
  }
};

// ==================== ORCHESTRATION ====================
/**
 * Notifier tous les utilisateurs abonnés (Email + SMS + Push)
 */
const notifyNewPost = async (post) => {
  try {
    console.log('🔔 Envoi des notifications pour le post:', post._id);

    // Récupérer les utilisateurs avec notifications activées
    const users = await User.find({
      $or: [
        { emailNotifications: true },
        { smsNotifications: true },
        { pushNotifications: true }
      ]
    }).select('email firstName lastName phoneNumber emailNotifications smsNotifications pushNotifications pushPlayerId');

    if (users.length === 0) {
      console.log('⚠️ Aucun utilisateur avec notifications activées');
      return { success: true, message: 'Aucun abonné' };
    }

    console.log(`📊 ${users.length} utilisateurs trouvés`);

    // Séparer par type de notification
    const emailRecipients = users.filter(u => u.emailNotifications);
    const smsRecipients = users.filter(u => u.smsNotifications);
    const pushRecipients = users.filter(u => u.pushNotifications);

    // Envoyer en parallèle
    const results = await Promise.allSettled([
      emailRecipients.length > 0 ? sendEmailNotification(post, emailRecipients) : Promise.resolve({ success: true, sent: 0 }),
      smsRecipients.length > 0 ? sendSMSNotification(post, smsRecipients) : Promise.resolve({ success: true, sent: 0 }),
      pushRecipients.length > 0 ? sendPushNotification(post, pushRecipients) : Promise.resolve({ success: true, sent: 0 })
    ]);

    const [emailResult, smsResult, pushResult] = results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason });

    console.log('📊 Résumé notifications:');
    console.log(`  📧 Email: ${emailResult.sent || 0} envoyés`);
    console.log(`  📱 SMS: ${smsResult.sent || 0} envoyés`);
    console.log(`  🔔 Push: ${pushResult.sent || 0} envoyés`);

    return {
      success: true,
      stats: {
        email: emailResult.sent || 0,
        sms: smsResult.sent || 0,
        push: pushResult.sent || 0,
        total: (emailResult.sent || 0) + (smsResult.sent || 0) + (pushResult.sent || 0)
      }
    };
  } catch (error) {
    console.error('❌ Erreur système de notifications:', error);
    return { success: false, error: error.message };
  }
};

// ==================== NOTIFICATION ADMIN ====================
/**
 * Notifier uniquement les admins/responsables
 */
const notifyAdmins = async (subject, message) => {
  try {
    const admins = await User.find({
      role: { $in: ['admin', 'responsable'] },
      emailNotifications: true
    }).select('email firstName lastName');

    if (admins.length === 0) return;

    let transporter = createTransporter();
    if (!transporter) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
    }

    await transporter.sendMail({
      from: `"GJ Camp" <${process.env.EMAIL_USER}>`,
      to: admins.map(a => a.email).join(','),
      subject: `🔔 ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">${subject}</h2>
          <p>${message}</p>
          <hr style="border: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Notification automatique - GJ Camp</p>
        </div>
      `
    });

    console.log(`✅ ${admins.length} admins notifiés`);
  } catch (error) {
    console.error('❌ Erreur notification admins:', error);
  }
};

module.exports = {
  notifyNewPost,
  sendEmailNotification,
  sendSMSNotification,
  sendPushNotification,
  notifyAdmins
};
