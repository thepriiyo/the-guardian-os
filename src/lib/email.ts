import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuthorizationEmail(email: string, assessmentId: string, jobTitle: string) {
  try {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://the-guardian-os.vercel.app'}/dashboard?id=${assessmentId}`;

    const { data, error } = await resend.emails.send({
      from: 'The Guardian OS <intelligence@guardian-os.com>',
      to: [email],
      subject: `🛡️ TACTICAL DOSSIER DECRYPTED: ${jobTitle}`,
      html: `
        <div style="background-color: #020617; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 20px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; font-size: 24px; font-weight: 900; letter-spacing: -1px; font-style: italic;">THE GUARDIAN OS</h1>
            <div style="height: 1px; background: linear-gradient(to right, transparent, #3b82f6, transparent); margin-top: 10px;"></div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 10px;">[ UPLINK CONFIRMED ]</p>
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 20px;">Your Tactical Survival Roadmap is Ready.</h2>
            <p style="color: #94a3b8; line-height: 1.6;">Operative, your authorization fee has been verified. The intelligence engine has completed its diagnostic scan for the role of <strong>${jobTitle}</strong>.</p>
          </div>

          <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 30px;">
            <p style="font-size: 12px; color: #3b82f6; font-family: monospace; margin-bottom: 15px;">PATHWAY: ${assessmentId}</p>
            <a href="${dashboardUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Access Decrypted Dossier</a>
          </div>

          <div style="border-top: 1px solid #1e293b; padding-top: 20px; text-align: center;">
            <p style="font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 2px;">Survive by Design // 2026 Protocol</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('[EMAIL_DISPATCH_FAIL]:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[EMAIL_CRITICAL_FAIL]:', err);
    return { success: false, error: err };
  }
}
