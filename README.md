
# Simple Payroll System

Full-stack CRUD application for managing employee payroll and skillsets using .NET 10, Dapper, and React.

### 🧩 Key Decisions & Implementation

* **Dapper & MySQL**: I used Dapper for data access to keep the queries performant and avoid the overhead of a full ORM. The schema uses a many-to-many relationship for skillsets via a pivot table.
* **Salary Logic**: The calculation engine accounts for base pay, 2x daily rate on working days, and a birthday bonus. I’ve verified this logic against the provided sample data (Razak).
* **Architecture**: The backend is separated into Controllers, Services (for business logic), and Repositories (for data access) to keep the code testable and organized.

---

### 🏗️ Getting Started

#### 1. Database Setup

1. Run the `backend/database/schema.sql` script in your MySQL environment.
2. The script will create the `simple_payroll` database and seed it with the three required sample employees so you can test the search and payroll logic immediately.
3. Update the connection string in `backend/appsettings.json` to match your local MySQL `uid` and `pwd`.

#### 2. Running the Backend

```bash
cd backend
dotnet run

```

*API runs at `http://localhost:5106`. Interactive API documentation is available via **Scalar** at `/scalar/v1`.*

#### 3. Running the Frontend

```bash
cd frontend
npm install
npm run dev

```

*Frontend runs at `http://localhost:5173`. Make sure the backend is running first*

---

### 🧪 Business Logic Testing

Since the salary calculation has specific rules, I included an **xUnit** project to ensure the math is 100% accurate.

Run tests via inside Root folder:

```bash
dotnet test

```

*The tests cover standard working day pay, non-working day base pay, and the overlapping birthday bonus scenario.*

---

### 🛠️ Tech Used

* **Backend:** .NET 10, Dapper, MySQL, xUnit
* **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide Icons

---

### 📝 Notes for Reviewer

* **Search**: The search bar supports "wildcard" matching for both Name and Employee Number.
* **Archiving**: Instead of hard-deleting, the "Delete" button toggles an `is_archived` flag to preserve historical payroll records.
* **ID Generation**: Employee numbers are auto-generated based on the name prefix, a random seed, and birth date during creation.

---
