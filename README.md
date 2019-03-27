# siteminder

A barebones Node.js app that will receive email recipients, cc list, bcc list and then
send a mail to the recipients after appropriate validation.

## Running Locally

```sh
$ git clone git@github.com:rohitarjunagi/siteminder.git
$ cd siteminder
$ npm install
$ npm start
```
## Running Test cases Locally

Test cases might fail locally as the local environment isn't initialized with api keys for the external mail service providers.

```sh
$ npm test
```

## Check Build Status after Each commit

[![Build Status](https://travis-ci.org/rohitarjunagi/siteminder.svg?branch=master)](https://travis-ci.org/rohitarjunagi/siteminder)



## Documentation

To use the app, post data to the app on this url: (https://siteminder-coding-challenge.herokuapp.com/v1/sendEmail)



- The data needs to be in application/json format
- The Data should have the following fields
```json
{
	"senderEmail": "test@test.com",
	"recipients": ["test@test.com"],
	"bccRecepients": ["test2@test.com", "test3@test.com"],
	"subject": "Hello World",
	"emailBody": "Test Email Body"
}

```
- Here is the sample Response if successful:

```json
{
    "message": "Email Sent Successfully"
}

```
- If recipients list is empty, you'll get an error
- If senderEmail field is empty, you'll get an error
- If recipients/ccRecepients/bccRecepients list contains duplicates, you'll get an error
- If an email address is duplicated across recipients, ccRecepients or bccRecepients list, you'll get an error

- If validation passes, then the service tries to send an email.


## Explanations

- Had to provide personal email address in certain parts of the integrated test case suite as the sandbox environment of mail gun will only send emails to mail addressess that have been verified and allow mail gun to send emails to it.


## TODOS

- travis and heroku needs to be wired up with the docker images and the images should be deployed on heroku and not the application directly (docker deployment commands are commented out in the travis file) I couldn't get the whole thing working end to end

- the docker compose should be used to inject the env variables. Right now I have setup the env variables inside in the dashboard of heroku and have encrypted the env variables for travis.

- appropriate level of logging has to be done based on dev or production environment

- Unit test cases suite is missing as part of the code submission. Ideally, unit test cases needs to be written for the mailService, mailGunService and sendGridService

- for a full stack experience, a react app needs to be developed which uses axios and react components to handle input form, form validation and form submission and display of results. This react app can be hosted on a static hosting service like s3.

## Challenges

- Took a bit of time to figure out how to use simple http module like request with mailGun API's and sendGrid API's as there weren't many examples out there.

