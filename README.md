# Expense Tracker

Expense Tracker is a web application for tracking personal expenses. The application allows users to add, edit, delete, and filter expenses, while displaying the total amount, number of expenses, and highest expense. The backend uses Node.js, Express, and PostgreSQL to store and manage expense data through a REST API.


## How to run

**Backend**

1. Make sure Node.js and PostgreSQL are installed.
2. Create a PostgreSQL database named expense_tracker.
3. Open the schema.sql file in pgAdmin and run it on the expense_tracker database.
4. Create a .env file in the backend folder.
5. Add the PostgreSQL connection information to the .env file:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=expense_tracker
6. Open the terminal in the backend folder.
7. Install the required packages:
npm install express cors pg dotenv
8. Start the backend:
node server.js
9. The backend will run on:
http://localhost:3000

**Frontend**

1. Open the project in VS Code.
2. Make sure the backend server is running.
3. Open the frontend/index.html file using the Live Server extension in VS Code.
4. The Expense Tracker interface will open in the browser .
5. Keep the backend server running while using the frontend so that the application can communicate with the API.

## Features


- [✅] Add an expense (with validation)
- [✅] Delete an expense
- [✅] Edit an expense
- [✅] Filter by category
- [✅] Summary cards (total, count, highest)
- [✅] Data is saved in a PostgreSQL database

## Screenshots


1. API testing screenshots using Thunder Client from Phase 1
2. Desktop view of the Expense Tracker.
3. Mobile/responsive view of the Expense Tracker.

## API Testing

The backend API was tested using Thunder Client in VS Code.

For each request, I selected the appropriate HTTP method (GET, POST, PUT, or DELETE) and used the API endpoint URL.

The backend runs on:

http://localhost:3000

The following endpoints were tested:

GET http://localhost:3000/api/expenses
GET http://localhost:3000/api/expenses/:id
POST http://localhost:3000/api/expenses
PUT http://localhost:3000/api/expenses/:id
DELETE http://localhost:3000/api/expenses/:id

For POST and PUT requests, I used the JSON Body to send the expense data, including:


{
  "title": "Lunch",
  "amount": 5.5,
  "category": "Food",
  "date": "2026-09-25"
}


I tested both successful requests and error cases, including invalid data and expenses that do not exist.

The API returned the expected HTTP status codes, such as 200, 201, 400, and 404.


## What was the hardest part?

The main challenge was connecting the frontend to the backend API and making sure that changes made through the interface were correctly stored in PostgreSQL.

This was solved by using JavaScript fetch() with async/await for API requests. Error handling was implemented using try/catch, and the API was tested separately with Thunder Client before connecting it to the frontend.

After adding, editing, or deleting an expense, the application requests the latest data from the API so that the displayed information stays synchronized with the database.

-Video Link :
https://drive.google.com/file/d/1kMYjSxuFqAaSmjbEEVKG4QQttkMu4_qL/view?usp=sharing

-GitHub Link :
https://github.com/narjesalnaji8/first-project.git
