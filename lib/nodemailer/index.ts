import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE,NEWS_SUMMARY_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAIL_EMAIL!,
        pass: process.env.NODEMAIL_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro} : WelcomeEmailData) =>{
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}' , name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `Stockly <stockly@anju.pro>`,
        to: email,
        subject: `Welcome to Stockly - your stock market toolkit is ready!`,
        text: 'Thanks for joining Stockly',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Signalist News" <signalist@jsmastery.pro>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from Signalist`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};