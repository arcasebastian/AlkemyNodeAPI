# Alkemy Disney API

#### This is a project created as part of the AlkemyLabs Node.Js Challenge. 
_
## Objective
The objective of this challenge was to create a RESTful API with Node.js using Express.js, following REST patterns and conventions.

## Approach taken 

The API was built using a TDD(Test Driven Development) approach, using the tests as a central part of the process. 

## Documentation

This API allows to a registered user to do basic CRUD functions for Characters, Movies/Series and Genres. So in the first place you need to register a valid Email. 

The full documentation can be found in [Postman](https://documenter.getpostman.com/view/8603160/UV5WCxNr)


## Setup

To use this repository you need to have:

  - Npm installed. 
  - A valid Mysql database. 

Before you run the server for the first time you have to create a .env file in the root folder with the following fields: 
  
  - DATABASE: Production database schema.
  - TEST_DATABASE: Database schema used to run the tests. It can be the same as Production, but is recommended to use a new one.
  - DATABASE_USER: Mysql user with full access to both databases. 
  - DATABASE_PASSWORD: Mysql password for the user.
  - DATABASE_HOST: Ip with the mysql instance running (Must be "db" if you are using the incluided docker config)
  - JWT_SECRET: Value used to encrypt users authetication tokens. 

Then you can run `npm start` to start the local server in production mode or `npm test` to run it in test mode with all the tests. 

#### Courier. 

This project utilizes [Courier](https://www.courier.com/) to send a welcome mail to a new user. To make use of this you need to create a courier Account, log in and setup a new Notification message, sets up at least one Email Channel to that notification. 

Once this is done you needs to add to .env file the following fields: 

  - COURIER_AUTH_TOKEN: Courier Auth Token. 
  - COURIER_NOT_EVENT: Courier Notification Event ID
  - COURIER_BRAND: Courier Brand ID. 

This values can be found in the Send Tab of the notification configuration. 


## Heroku.

This API can be found in the following url: https://alkemy-api-challenge.herokuapp.com 

