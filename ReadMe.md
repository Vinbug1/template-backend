# Expenses Tracker Backend

This is the backend service for the **Expenses Tracker** application. It is built with **Node.js** and **TypeScript**, using **PostgreSQL** as the database and **Eliza** for conversational interfaces. The backend is designed to handle expenses, income tracking, user authentication, and report generation.

---

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Expense Management**:
  - Add, update, and delete expenses.
  - Categorize expenses (e.g., food, transport, entertainment).
- **Income Management**:
  - Track multiple income sources.
- **Reports**:
  - Generate monthly, weekly, and custom reports.
  - Graphical representation of income vs expenses.
- **Conversational Interface**:
  - Leverage **Eliza** to provide chatbot-like interactions for adding or querying expenses.

---

## Tech Stack

### Backend
- **Node.js**: Runtime environment.
- **TypeScript**: Strongly typed language for better maintainability.
- **PostgreSQL**: Relational database for secure data storage.
- **Eliza**: Conversational AI for natural language interactions.

### Tools
- **Express.js**: Web framework for building RESTful APIs.
- **TypeORM**: Object-Relational Mapping for database interactions.
- **Jest**: Testing framework for unit and integration tests.

---

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- PostgreSQL (v13 or later)
- Yarn or npm

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/expenses-tracker-backend.git
   cd expenses-tracker-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/expenses_tracker
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ELIZA_API_KEY=your_eliza_api_key
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   # or
   yarn migrate
   ```

5. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```

The server will run on `http://localhost:3000` by default.

---

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Log in a user.

### Expenses
- **POST** `/api/expenses` - Add a new expense.
- **GET** `/api/expenses` - Retrieve all expenses.
- **GET** `/api/expenses/:id` - Retrieve a specific expense.
- **PUT** `/api/expenses/:id` - Update an expense.
- **DELETE** `/api/expenses/:id` - Delete an expense.

### Income
- **POST** `/api/income` - Add a new income source.
- **GET** `/api/income` - Retrieve all income sources.
- **GET** `/api/income/:id` - Retrieve a specific income source.
- **PUT** `/api/income/:id` - Update an income source.
- **DELETE** `/api/income/:id` - Delete an income source.

### Reports
- **GET** `/api/reports` - Generate expense and income reports.

---

## Testing

Run unit and integration tests using Jest:
```bash
npm test
# or
yarn test
```

---

## Folder Structure

```
expenses-tracker-backend/
├── src/
│   ├── controllers/    # API controllers
│   ├── middleware/     # Middleware functions
│   ├── models/         # Database models
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
├── tests/              # Test cases
├── .env                # Environment variables
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

---

## Contribution

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For inquiries or support, contact us at `support@expenses-tracker.com`.

