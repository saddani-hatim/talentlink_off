import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendInterviewInvitation(candidateEmail, candidateName, companyName, jobTitle) {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: candidateEmail,
      subject: `Invitation à un entretien - ${companyName} via TalentLink`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 15px; padding: 30px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6366f1; margin: 0;">TalentLink</h1>
          </div>
          <h2 style="color: #1f2937;">Bonjour ${candidateName},</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Nous avons le plaisir de vous informer que l'entreprise <strong>${companyName}</strong> a été impressionnée par votre profil suite à votre candidature pour le poste de <strong>${jobTitle}</strong>.
          </p>
          <div style="background-color: #f3f4f6; border-radius: 10px; padding: 20px; margin: 25px 0;">
             <p style="margin: 0; color: #1f2937; font-weight: bold;">Prochaine étape : Entretien</p>
             <p style="margin: 10px 0 0 0; color: #4b5563;">
               Un membre de l'équipe de recrutement vous contactera très prochainement pour fixer une date et un horaire pour un premier échange.
             </p>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">
            En attendant, vous pouvez consulter les détails de votre candidature sur votre tableau de bord TalentLink.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/candidate/profile" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accéder à mon tableau de bord</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Bonne chance pour la suite du processus !
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            Ceci est un message automatique envoyé par TalentLink au nom de ${companyName}.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Interview invitation email sent to ${candidateEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending interview email:', error);
      throw new Error(`Erreur lors de l'envoi de l'invitation: ${error.message}`);
    }
  }
}

export default new EmailService();
