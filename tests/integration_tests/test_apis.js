process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const assert = chai.assert;

chai.use(chaiHttp);


describe('Request Body Validation Errors', () => {

    it('it should return errror if sender field is missing', done => {
        
        const requestBody = {};
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'Sender Email is not provided');
                done();
            });
    });

    it('it should return errror if recipients field is missing', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com"
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'Recipient email(s) is not provided');
                done();
            });
    });

    it('it should return errror if subject field is missing', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["rohitarjunagi@gmail.com"]
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'Subject Field Cannot Be Blank');
                done();
            });
    });

    it('it should return errror if body field is missing', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["rohitarjunagi@gmail.com"],
            "subject": "Hello World!"
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'Email Body Cannot Be Blank');
                done();
            });
    });

    it('it should return error if recipients field and cc fields are duplicated', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["rohitarjunagi@gmail.com"],
            "subject": "Hello World!",
            "ccRecipients": ["rohitarjunagi@gmail.com", "rohitarjunagi2@gmail.com"],
            "emailBody": "TEST BODY CONTENT"
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'Emails are duplicated in recipients list and CC List');
                done();
            });
    });

    it('it should return errror if recipients field and bcc fields are duplicated', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["rohitarjunagi@gmail.com"],
            "subject": "Hello World!",
            "emailBody": "TEST BODY CONTENT",
            "ccRecipients": ["rohitarjunagi2@gmail.com"],
            "bccRecipients": ["rohitarjunagi@gmail.com", "rohitarjunagi3@gmail.com"]
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'Emails are duplicated in recipients list and BCC List');
                done();
            });
    });

    it('it should return errror if cc field has duplicate mail ids', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["rohitarjunagi@gmail.com"],
            "subject": "Hello World!",
            "emailBody": "TEST BODY CONTENT",
            "ccRecipients": ["rohitarjunagi2@gmail.com", "rohitarjunagi4@gmail.com", "rohitarjunagi2@gmail.com"],
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'There are duplicate Emails in the CC list');
                done();
            });
    });

    it('it should return errror if bcc field has duplicate mail ids', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["rohitarjunagi@gmail.com"],
            "subject": "Hello World!",
            "emailBody": "TEST BODY CONTENT",
            "bccRecipients": ["rohitarjunagi2@gmail.com", "rohitarjunagi4@gmail.com", "rohitarjunagi2@gmail.com"],
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 422);
                assert.equal(res.body.message, 'There are duplicate Emails in the BCC list');
                done();
            });
    });
});


describe('Send Email Service', () => {

    before(() => {
        process.env['SENDGRID_API_KEY'] = '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';
        process.env['MAILGUN_API_KEY'] = '2c2e0549a3a41b5fa79b00d5f2a08725-e51d0a44-167a154c';
    });

    after(() => {
        delete process.env['SENDGRID_API_KEY'];
        delete process.env['MAILGUN_API_KEY'];
    });

    it('it should send email through mail gun', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["rohitarjunagi@gmail.com"],
            "subject": "Hello World!",
            "emailBody": "TEST BODY CONTENT",
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Email Sent Successfully');
                done();
            });
    }).timeout(5000);

    it('it should send email through send grid when mailgun fails', done => {

        // since rohitarjunagi2@gmail.com is not registered through the mailgun sandbox,
        // the mailgun service fails and the service failsover to the sendgrid service
        // the user does not notice and gets the same response on success

        const requestBody = {
            "senderEmail": "test@test.com",
            "recipients": ["test@test.com"],
            "subject": "Hello World!",
            "emailBody": "TEST BODY CONTENT",
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Email Sent Successfully');
                done();
            });

    }).timeout(5000);

    it('it should send email when unique emails are present for to, cc and bcc fields', done => {

        // since test@test.com is not registered through the mailgun sandbox,
        // the mailgun service fails and the service failsover to the sendgrid service
        // the user does not notice and gets the same response on success

        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["test@test.com"],
            "ccRecipients": ["test2@test.com", "test3@test.com"],
            "bccRecipients": ["test4@test.com", "test5@test.com"],
            "subject": "Hello World!",
            "emailBody": "TEST BODY CONTENT",
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Email Sent Successfully');
                done();
            });

    }).timeout(5000);    
});


describe('UnAuthorized requests::', () => {

    let api_key = process.env['SENDGRID_API_KEY'];

    before(() => {
        process.env['SENDGRID_API_KEY']= 'wrong_key';
    });

    after(() => {
        process.env['SENDGRID_API_KEY'] = api_key;
    });

    it('it should return 401 when request to mail servers are unauthorized', done => {
        const requestBody = {
            "senderEmail": "rohitarjunagi@gmail.com",
            "recipients": ["test@test.com"],
            "ccRecipients": ["test2@test.com", "test3@test.com"],
            "bccRecipients": ["test4@test.com", "test5@test.com"],
            "subject": "Hello World!",
            "emailBody": "TEST BODY CONTENT",
        };
        chai.request(app)
            .post('/v1/sendEmail/')
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 401);
                assert.equal(res.body.message, 'UnAuthorized');
                done();
            });
    }).timeout(5000);
})