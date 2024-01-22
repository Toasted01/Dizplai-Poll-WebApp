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

## Introduction

Web app created using React and NodeJs to supply the user with multiple choice polls that the user can interact with.  
When the user submits their answer they are able to see the percentage of votes for each of the options.

## Folder Structure

The repo is split into two folders for the Backend and Frontend

- The backend folder contains everything for running the API on the backend.
  - 'data' contains the two .json files that are used to store the poll questions and the votes
  - 'controllers' contains the logic for reading and writing to the files in 'data'
  - 'routes' contains the routing for the GET and POST requests
  - 'server.js' is the root file that runs the server on port 3001
- The Frontend folder contains the react app frontend that the user interacts with

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

The front end and back end are ran seperatley.  
Start up the backend first so you dont have to refresh the page on the front end.

Frontend:

- cd Frontend
- npm start

Backend:

- cd Backend
- node server.js

## Usage

Go into the file /frontend/src/controller/apiController.js and change apiServerIP to the ip:port of your backend server, dont use localhost for it
Connect to http://localhost:3000 or http://192.168.xx.xx:3000 to view the front end react app. when running npm start it should tell you where it is hosted
You will be presented with one of the polls.  
Read the question then select an option and hit submit.  
The page will change to display the percentage popularity of each option
