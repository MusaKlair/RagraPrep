import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_13fwD7JE_7Xb8dfe6T6KFgf5Z7TjETSQB');


/**
 * Email service for sending emails using Resend
 * Follows Single Responsibility Principle - only handles email sending
 */
export class EmailService {
  private static fromEmail = 'onboarding@zalnex.me';

  /**
   * Generate a secure random password
   */
  static generatePassword(length: number = 12): string {
    const crypto = require('crypto');
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }
    return password;
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(to: string, newPassword: string, userName?: string | null): Promise<void> {
    const name = userName || to.split('@')[0];

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Protocol Access - Ragra Prep</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAFAFA;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FAFAFA; padding: 40px 20px;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #e5e7eb;">
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #10b981; margin-bottom: 16px;">
                [SYSTEM ACTION REQUIRED]
              </div>
              <h1 style="margin: 0; color: #111111; font-family: Georgia, serif; font-size: 32px; font-weight: 400; line-height: 1.2;">
                Credential Reset
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #525252; font-size: 16px; line-height: 1.6;">
                Node Identifier: <strong style="color: #111111; font-weight: 600;">${name}</strong>
              </p>
              
              <p style="margin: 0 0 32px 0; color: #525252; font-size: 15px; line-height: 1.6;">
                A protocol sequence has been initiated to override your existing access terminal. New authentication keys have been generated and deployed via encrypted channel to this address.
              </p>
              
              <!-- Password Box -->
              <div style="background-color: #FAFAFA; border: 1px solid #e5e7eb; padding: 32px; margin: 32px 0; text-align: center;">
                <p style="margin: 0 0 12px 0; color: #737373; font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">
                  Temporary Authorization String
                </p>
                <div style="color: #111111; font-size: 28px; font-weight: 700; font-family: 'Courier New', Courier, monospace; letter-spacing: 4px; word-break: break-all;">
                  ${newPassword}
                </div>
              </div>
              
              <p style="margin: 24px 0; color: #525252; font-size: 14px; line-height: 1.6; border-left: 2px solid #ef4444; padding-left: 16px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #ef4444; display: block; margin-bottom: 4px;">Warning</span>
                This key is temporary. Access the system and deploy a new permanent string immediately upon injection.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin: 40px 0;">
                <tr>
                  <td align="left">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #111111; color: #ffffff; text-decoration: none; padding: 16px 32px; font-family: 'Courier New', Courier, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #111111; transition: all 0.2s ease;">
                      [INITIALIZE LOGIN]
                    </a>
                  </td>
                </tr>
              </table>
              
              <div style="margin: 40px 0 0 0; color: #737373; font-size: 13px; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Invalid Sequence Request?</span>
                If this terminal reset was not authorized by your local node, contact network administrators immediately to lock your account down.
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #FAFAFA; padding: 32px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #111111; font-family: Georgia, serif; font-size: 18px; font-weight: 600;">
                Ragra Prep
              </p>
              <p style="margin: 0 0 16px 0; color: #737373; font-family: 'Courier New', Courier, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
                Academic Preparation Protocol
              </p>
              <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                SYSTEM_GENERATED_DISPATCH // DO_NOT_REPLY
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: this.fromEmail,
      to: to,
      subject: '[SYSTEM] Credential Override - Ragra Prep',
      html: html,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error('Failed to send password reset email');
    }

    console.log('Password reset email sent successfully:', data);
  }
}

