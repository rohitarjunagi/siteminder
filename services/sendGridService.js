const request = require('request');
const sendGridConfig = require('../config/mailEndpoints').sendGridDetails;

exports.sendEmailUsingSendGrid = (fromEmail, recipients, subject, emailBody, ccList = [], bccList = []) => {

    const toPersonalization = recipients.map(recepient => {
        return {
            email: recepient
        }
    });


    let ccPersonalization = null;
    let bccPersonalization = null;

    if (ccList.length > 0) {
        ccPersonalization = ccList.map(cc => {
            return {
                email: cc
            }
        })
    }


    if (bccList.length > 0) {
        bccPersonalization = bccList.map(bcc => {
            return {
                email: bcc
            }
        })
    }

    const options = {
        method: 'POST',
        url: sendGridConfig.sendGridEndpoint,
        headers:
        {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env['SENDGRID_API_KEY']}`
        },
        body:
        {
            personalizations: [
                {
                    to: toPersonalization,
                    cc: ccPersonalization,
                    bcc: bccPersonalization
                }
            ],
            from: { email: fromEmail },
            subject: subject,
            content: [{ type: 'text/plain', value: emailBody }]
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) reject(error);
            else resolve(response.statusCode);
        })
    });


}
