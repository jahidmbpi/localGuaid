import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  try {
    const host = process.env.SMTP_HOST || "smtp.ethereal.email";
    const port = Number(process.env.SMTP_PORT) || 587;
    
    // We can also allow gmail/other standard transporters
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        // Ethereal credentials fallback if not provided
        user: process.env.SMTP_USER || "darrick.block@ethereal.email",
        pass: process.env.SMTP_PASS || "S2bT3k9dJ1f3w55r9E",
      },
    });

    const mailOptions = {
      from: `"LocalGuide Platform" <${process.env.SMTP_USER || "darrick.block@ethereal.email"}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    if (host === "smtp.ethereal.email") {
      console.log(`Ethereal Test Email Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
