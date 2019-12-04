# Social Cinema Client

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Social Cinema

install all dependencies on the front end using npm install
run the front end using npm start

pip install backend dependencies:
flask
flask_cors
requests
dotenv

create database and add user/password to .env file
psql -U <user>
<password>

CREATE DATABASE social_cinema

flask db init <-- creates migration folder
flask db migrate
flask db upgrade
