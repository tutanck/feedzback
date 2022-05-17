import { feedbackRequestTemplate } from "../model/feedbackRequestTemplate.js"
import dotEnv from 'dotenv'
import mailgun from 'mailgun-js';
import * as fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const emailTemplate = fs.readFileSync(__dirname + '/../emailTemplate/askFeedbackModel.html').toString();

if (process.env.NODE_ENV !== 'production') {
  dotEnv.config();
}

const apiKey  = process.env.API_KEY;
const domain = process.env.DOMAIN;

const myMailgun =  mailgun({
  apiKey: apiKey,
  domain: domain,
});

export const askFeedback = async ({askFeedback})=> {
    
    const template = feedbackRequestTemplate(emailTemplate, askFeedback);
    let msg = {
        to: askFeedback.senderEmail,
        from: askFeedback.email,
        subject: "Solliciter un feedback",
        html: template
    }

    if(process.env.NODE_ENV !== 'production') {
      msg = {
        ...msg,
        to: "feedzback@zenika.com",
        from: "binyat.sharif@gmail.com"
      }

    } 

    const res = await myMailgun.messages().send(msg).then(()=> {return 'Votre demande a bien été envoyé'})
    .catch(()=> {return "Votre demande n'est pas envoyé vérifiez les données s'il vous plaît"});

    return res;
 }
