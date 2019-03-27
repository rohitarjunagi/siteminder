const request = require('request');

const mailGunConfig = require('../config/mailEndpoints').mailGunDetails;

exports.sendEmailUsingMailGun = (fromEmail, recipients, subject, emailBody, ccList = [], bccList = []) => {
    const mailgunOpts = {
        url: mailGunConfig.mailGunDomainEndpoint + '/messages',
        headers: {
            Authorization: 'Basic ' + new Buffer('api:' + process.env['MAILGUN_API_KEY']).toString('base64')
        },
        form: {
            from: fromEmail,
            to: recipients,
            subject: subject,
            text: emailBody
        }
    };

    if (ccList.length > 0) {
        mailgunOpts.form.cc = ccList;
    }

    if (bccList.length > 0) {
        mailgunOpts.form.bcc = bccList;
    }

    return new Promise((resolve, reject) => {
        request.post(mailgunOpts, (err, response) => {
            if (err) reject(err);
            else resolve(response.statusCode)
        });
    })
}