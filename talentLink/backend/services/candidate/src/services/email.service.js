import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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

  async sendTestSubmissionEmail(user, test, score) {
    const adminEmail = 'saddanihatim283@gmail.com';
    const candidateName = `${user.firstName} ${user.lastName}`;
    const passed = score >= 70;
    const statusColor = passed ? '#10b981' : '#ef4444';
    const statusText = passed ? 'RÉUSSI' : 'ÉCHOUÉ';

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: `Nouveau résultat de test : ${test.title} - ${candidateName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
          <h2 style="color: #6366f1;">Nouveau résultat de test technique</h2>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Candidat :</strong> ${candidateName} (${user.email})</p>
            <p><strong>Test :</strong> ${test.title}</p>
            <p><strong>Difficulté :</strong> ${test.difficulty}</p>
            <p><strong>Points :</strong> ${test.points}</p>
          </div>

          <div style="text-align: center; padding: 20px; border: 2px solid ${statusColor}; border-radius: 8px; margin-bottom: 20px;">
             <h3 style="margin: 0; color: ${statusColor}; font-size: 24px;">${score}/100</h3>
             <p style="margin: 5px 0 0 0; font-weight: bold; color: ${statusColor};">${statusText}</p>
          </div>

          <p>Le résultat a été enregistré automatiquement dans la base de données.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">TalentLink Automated System</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Test submission email sent to ${adminEmail}`);
    } catch (error) {
      console.error('Error sending test submission email:', error);
      // We don't throw here to avoid failing the HTTP request if email fails, 
      // but we log it.
    }
  }
}

export default new EmailService();
