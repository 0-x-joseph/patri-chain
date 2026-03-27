import { Client } from 'postmark';

const postmarkClient = new Client(process.env.POSTMARK_API_KEY || '');

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
    try {
        if (!process.env.POSTMARK_API_KEY) {
            console.warn('Postmark API key not configured. Simulating email send.');
            console.log('Email to:', to);
            console.log('Subject:', subject);
            return { success: true, simulated: true };
        }

        await postmarkClient.sendEmail({
            From: process.env.POSTMARK_FROM_EMAIL || 'noreply@patrimoine-app.com',
            To: to,
            Subject: subject,
            HtmlBody: html,
            TextBody: text || html.replace(/<[^>]*>/g, ''),
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
}

export async function sendVerificationEmail(
    email: string,
    token: string,
    fullName: string
) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2>Welcome to Patri-Chain, ${fullName}!</h2>
      <p>Thank you for registering as an artisan. Please verify your email address to complete your registration.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${verificationUrl}" style="background-color: #166534; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        Or copy and paste this link in your browser:<br/>
        <code>${verificationUrl}</code>
      </p>
      
      <p style="color: #666; font-size: 12px;">
        This link expires in 24 hours.
      </p>
    </div>
  `;

    const text = `Welcome to Patri-Chain, ${fullName}! Please verify your email by visiting: ${verificationUrl}`;

    await sendEmail({
        to: email,
        subject: 'Verify Your Patri-Chain Account',
        html,
        text,
    });
}