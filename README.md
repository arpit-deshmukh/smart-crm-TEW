# Smart CRM

A full-stack Customer Relationship Management (CRM) application designed to help businesses manage their leads, contacts, deals, companies, and communications efficiently.

This repository contains both the **frontend** (React + Vite) and the **backend** (Node.js + Express).

**Link:** https://smart-crm-alpha.vercel.app/

 


<img width="1866" height="786" alt="Screenshot 2026-06-03 185626" src="https://github.com/user-attachments/assets/1cf656cd-9cb0-4ad0-9269-c127bb235a00" />

<img width="1824" height="733" alt="Screenshot 2026-06-03 185632" src="https://github.com/user-attachments/assets/b059eb25-976e-4241-92e4-4b66fabc91c0" />
<img width="1748" height="816" alt="Screenshot 2026-06-03 185723" src="https://github.com/user-attachments/assets/15ea4393-2d75-4561-9a7e-bf48e0a79745" />

<img width="1747" height="698" alt="image" src="https://github.com/user-attachments/assets/a0d6fe04-9307-4da9-9066-855758db62ab" />








## 🚀 Tech Stack

### Frontend

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + PostCSS
- **Routing:** React Router DOM
- **Animations:** Framer Motion
- **Charts/Visualizations:** Recharts
- **Icons:** Lucide React & React Icons
- **Additional Libraries:** React Chatbot Kit, React Phone Input 2, Axios

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Express Session, connect-mongo, Google Auth Library, bcryptjs
- **Email Services:** Node Mailjet, Nodemailer
- **CORS:** CORS middleware

## 📁 Project Structure

```
smart-crm/
├── backend/                # Node.js Express server
│   ├── src/                # Backend source code (controllers, models, routes, etc.)
│   ├── package.json        # Backend dependencies
│   └── .env                # Backend environment variables (ignored by git)
│
├── frontend/               # React Vite application
│   ├── src/                # Frontend source code (components, pages, services, etc.)
│   ├── package.json        # Frontend dependencies
│   └── .env                # Frontend environment variables (ignored by git)
│
└── .gitignore              # Root gitignore file
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Git](https://git-scm.com/)

## 🔑 Environment Variables

You will need to create a `.env` file in both the `frontend` and `backend` directories.

**`backend/.env`**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
# Add other necessary keys like Google Auth credentials if applicable
```

**`frontend/.env`**

```env
VITE_BACKEND_URL=http://localhost:5000
```

## 🚀 Installation & Running Locally

Follow these steps to get the project running on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/arpit-deshmukh/smart-crm-TEW.git
cd smart-crm-TEW
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

The backend server should now be running on `http://localhost:5000`.

### 3. Setup Frontend

Open a new terminal window/tab:

```bash
cd frontend
npm install
npm run dev
```

The frontend should now be running on `http://localhost:5173` (or the port specified by Vite).

## ✨ Features

- **Dashboard:** Visualize your sales, revenue, and activities.
- **Lead & Contact Management:** Keep track of your potential and existing customers.
- **Deal Tracking:** Manage your sales pipelines and deals.
- **Company Management:** Organize your B2B contacts.
- **Email Integration:** Send and track emails using Mailjet/Nodemailer.
- **Authentication:** Secure login and session management, including password reset functionality.
- **Admin Panel:** Separate dashboard and controls for administrators.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/arpit-deshmukh/smart-crm-TEW/issues) if you want to contribute.

## 📝 License

This project is licensed under the ISC License.
