"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (to, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = process.env.SMTP_HOST || "smtp.ethereal.email";
        const port = Number(process.env.SMTP_PORT) || 587;
        // We can also allow gmail/other standard transporters
        const transporter = nodemailer_1.default.createTransport({
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
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
        if (host === "smtp.ethereal.email") {
            console.log(`Ethereal Test Email Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
    }
    catch (error) {
        console.error("Failed to send email:", error);
    }
});
exports.sendEmail = sendEmail;
