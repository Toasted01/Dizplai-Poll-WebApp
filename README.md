# Dizplai Polling Web App

Poll taking web app created as part of technical interview project for Dizplai

## Table of Contents

- [Introduction](#introduction)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Run Elsewhere](#run-elsewhere)
- [Security](#security)
- [Tools Used](#tools-used)
- [Testing](#testing)

## Introduction

Web app created using React and NodeJs to supply the user with multiple choice polls that the user can interact with.  
When the user submits their answer they are able to see the percentage of votes for each of the options.

[![Alt text](./PublicItems/main.JPG)](./PublicItems/main.JPG)
[![Alt text](./PublicItems/ResultScreenTest.JPG)](./PublicItems/ResultScreenTest.JPG)

## Folder Structure

The repo is split into two folders for the Backend and Frontend

- The backend folder contains everything for running the API on the backend.
  - 'data' contains the two .json files that are used to store the poll questions and the votes
  - 'controllers' contains the logic for reading and writing to the files in 'data'
  - 'routes' contains the routing for the GET and POST requests
  - 'server.js' is the root file that runs the server on port 3001
- The Frontend folder contains the react app frontend that the user interacts with
  - 'public' contains basic files that shouldn't be touched by the dev
  - 'src' contains all the code that makes the react app run specifically index.js
    - 'Components' contains the components that change can change a lot from props and state variables such as button arrays
    - 'controllers' contains the apiController.js file which is responsible for all requests to the api

```plaintext
- Backend
  - controllers
    - pollController.js
    - voteController.js
  - data
    - polls.json
    - votes.json
  - routes
    - polls.js
    - votes.js
  - server.js
- Frontend
  - public...
  - src
    - Components
      - PercentageChoiceBar.jsx
      - QuestionBtn.jsx
    - controllers
      - apiController.js
    - App.css
    - App.js
    - index.css
    - index.js
    - ResultPage.js
    - results.css
  - package-lock.json
  - package.json
- .gitignore
- README.md
```

## Getting Started

### Prerequisites

Node.js and npm:

- https://nodejs.org/

### Installation

Frontend:

- cd Frontend
- npm install

Backend:

- cd Backend
- npm install

## Running The Project

The front end and back end are ran separately.  
Start up the backend first so you don't have to refresh the page on the front end.

Frontend:

- cd Frontend
- npm start

Backend:

- cd Backend
- node server.js

## Usage

Go into the file ./frontend/src/controller/apiController.js:1 and change apiServerIP to the ip:port of your backend server, dont use localhost for it.
Connect to http://localhost:3000 or http://192.168.xx.xx:3000 to view the front end react app. When running npm start it should tell you where it is hosted
You will be presented with one of the polls.  
Read the question then select an option and hit submit.  
The page will change to display the percentage popularity of each option.

## Run Elsewhere

- To run the api server elsewhere you can change the apiServerIP variable to your ip:port.
- Could be dockerised to ensure it runs smoothly across all devices.
- Could make a build version of the react frontend so you only host what is needed for this web app.

## Security

Pros:

- Due to no user input fields direct script injection is very unlikely.
- No SQL server is used in this current version so no SQL injection possible.

Cons:

- No https
- No api Authentication / user Authentication.
- Users able to submit votes unlimited -> quickly fill votes.json and server hard drives / DDos.
- Possibly able to MitM attack due to the server being http.

## Tools used

Node.js Express was recommended for the api and i also wanted to do more work with node.js. This also meant it was easy to decide on using JSON for persistent storage because it works well with node.js and the frontend, for which i chose react js. I've been using react js a lot recently and wanted to keep using it, it also works well with the rest of the stack.

## Testing

Browser/Device Compatibility:

- Tested on 2 desktop computers and 3 mobile phones (android).
- Tested on 5 browsers: Chrome, Firefox, Edge, Samsung internet, Chrome mobile.

Functionality testing:

- Added test data for votes to see if the api fetches votes correctly.
- Added test data for polls to see if the api fetches polls correctly.
- console.log used to log key information about requests to and from the server.

High detail unit/user testing seemed unnecessary due to simplicity in application and no custom user inputs.

## Points of interest

- Added file locking system to postVote so that data isn't lost when multiple users try to post at the same exact time.
- Because it's not expected that the polls will change often i added the ability to cache the polls when they are first read. However if they are updated after the cache is made it won't show the change until the server restarts due to there being, right now, no good way to check when the file is updated without large scale refactors.
  - refactor would require either server side or in the json file adding a lastmodified timestamp to it and only allowing the server itself to edit the file.
