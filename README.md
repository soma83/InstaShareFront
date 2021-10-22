# InstaShare Frontend App

## Prerequisites

This project was built using nodejs v12.22.1 and npm 6.14.12. These versions or higher are recommended. You might want consider using `yarn`. If so, install yarn 1.22.11.

## Important!!!

This app needs the API Rest app up and running in order to work. For that, please refer to https://github.com/soma83/InstaShareBack and follow instructions in there. 

The file `src/config/config.js` contains the required data (such as server, port) to make all the HTTP requests to the API.

 
By default this project starts using port 3001, if you need to use a different port just edit file `package.json` under `scripts` section the line `"start": "PORT=3001 react-scripts start"`. 

## How to 

Clone the repo

`git clone https://github.com/soma83/InstaShareFront.git`

Move to the folder:

`cd InstaShareFront`

Install dependencies:

`npm install` or just `npm i`. `yarn install` (or just `yarn`) if using yarn.

Start the project:

`npm start`, or `yarn start` if using yarn.

Follow the instructions and that's it.
