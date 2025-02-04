import ejs from 'ejs';
import dotEnv from 'dotenv';

/**
 * Replace request feedback html template variables by the given feedback which includes
 * name, email, senderName...
 * @param {String} html
 * @param {Object} param1
 * @return {String}
 */
export function feedbackRequestTemplate(html, {name, email, senderName, senderEmail, text}) {
  if (process.env.NODE_ENV !== 'production') {
    dotEnv.config();
  }

  /**
   * Because we pass them url parameters it's more save to encode emails
   */
  const receverEmail = encodeURIComponent(email);
  senderEmail = encodeURIComponent(senderEmail);
  const receverName = name;
  let commentaire='';
  /**
   * as comment is optional we replace html tags in case the request includes a comment (text)
   */
  if (text) {
    commentaire = String(text).replace(/\n/g, '<br>');
  }
  const urlClient = process.env.NODE_ENV !== 'production'? process.env.URL_CLIENT + '/send' : 'https://feedzback.zenika.com/send';
  const params = new URLSearchParams({senderName, senderEmail, receverName, receverEmail}).toString();
  const template = ejs.render(html,
      {name: senderName,
        senderName: name,
        text: commentaire,
        urlClientForm: urlClient,
        params: params,
      });
  return template;
}
