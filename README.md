Here's a user-friendly `README.md` designed specifically for people who will **clone your GitHub repo and run the project locally**:

---


# 📦 Case Intake Web Application

A full-stack case submission system built with **React** (frontend), **ASP.NET Core Web API** (backend), and **SQLite**. Users can submit cases with optional file attachments, and admins can manage, export, or reset all case data.

---

## 🚀 Quick Start

### 🔧 Requirements

- [.NET 7 SDK](https://dotnet.microsoft.com/download)
- [Node.js v18+](https://nodejs.org/)
- Git

---

## 🧩 Project Structure



/client         → React frontend (Vite)
---
/backend        → ASP.NET Core Web API
---
/UploadedFiles  → Where uploaded files are saved
---



---

## ⚙️ Backend Setup (API)

1. Open a terminal and navigate to the `backend` folder:
   bash
   cd backend
````

2. Restore and build:

   bash
   dotnet restore
   dotnet build
   

3. Run EF migrations to create the SQLite DB:

   bash
   dotnet ef database update
   

4. Start the backend server:

   bash
   dotnet run
   

5. The API should be live at:

   
   http://localhost:5268
   

---

## 🌐 Frontend Setup (React)

1. Open a second terminal and navigate to the `client` folder:

   bash
   cd client
   

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the frontend:

   bash
   npm run dev
   

4. Visit the app in your browser:

   
   http://localhost:3000
   

---

## 🔐 Login Credentials

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | Admin |
| user     | user123  | User  |

* **Users** can submit cases
* **Admins** can view, edit, delete, export, and reset cases

---

## 🗃 Uploaded Files

* Files are saved to the `/UploadedFiles` folder
* The file name is stored in the database

---

## 📤 Features

* Case submission with optional file upload
* Admin panel to manage cases
* CSV and JSON export options
* Reset all case data and uploads

---

## 📄 License

MIT License – feel free to use, modify, and contribute.

---
