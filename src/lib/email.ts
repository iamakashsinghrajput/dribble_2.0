import nodemailer from 'nodemailer';

const smtpConfig = {
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '465', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    console.log('Attempting to send email to:', to);
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    let errorMessage = 'Failed to send email.';
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
         if ((error as any).code === 'EAUTH' || (error as any).responseCode === 535) {
            errorMessage += ' Check your EMAIL_USERNAME and EMAIL_PASSWORD (App Password for Gmail).';
        }
    }
    return { success: false, error: errorMessage };
  }
}