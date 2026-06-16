# 🌐 Community Help Hub (CHH)

Community Help Hub is a digital public infrastructure platform designed to bridge the gap between citizens and critical public utility services in Andhra Pradesh, India. The application serves as a unified platform for emergency response hotlines, healthcare services, government welfare schemes, educational resources, and interactive community support.

🔗 **Live Demo**: [community-help-hub.netlify.app](https://community-help-hub.netlify.app/)

The project features a **two-tier architecture**:
1. **Legacy Static Webpage**: A lightweight, fast-loading, single-page static site located in the root folder for offline/low-bandwidth usage.
2. **Modernized Full-Stack Web App**: A production-ready, feature-rich platform under the `frontend` and `backend` directories, featuring an admin panel, live chatbot, multilingual translations, security headers, rate-limiting, and an automatic in-memory mock database fallback.

---

## 🚀 Key Features

### 💻 Citizen Portal
- **🚨 Unified Emergency Contacts**: Instantly call or locate services like Ambulance (108), Police (112), Fire (101), Women Helpline (181), and Child Protection (1098).
- **🏥 Healthcare Finder**: Filter area hospitals, primary health centers (PHC), and blood banks by district. Includes maps integration.
- **🌾 Welfare Scheme Database**: Discover Andhra Pradesh government schemes (e.g., *Thalliki vandanam*, *NTR Vydhyaseva*, *Annadhatha Sukhibava*, *Aada Bidda Nidhi*) with filters for students, farmers, women, and senior citizens.
- **📚 Education & Career Portal**: Resources including APSSDC skill development, SWAYAM/NPTEL portals, and government job updates.
- **🤖 Offline-Capable AI Chatbot**: A floating assistant that helps users find emergency contacts, local hospitals, and scheme guidelines.
- **🗣️ Multilingual Translations**: Full support for **English** and **Telugu (తెలుగు)** powered by `i18next`.
- **🌙 Dark/Light Theme**: Sleek, Harmonious UI theme switcher.

### 🛡️ Administrative Console
- **🔐 Secure Authentication**: JWT-based login system for officials.
- **📊 Interactive Board**: Review citizen feedback and report logs.
- **⚙️ Complete CRUD Management**: Dynamically add, update, or delete emergency hotlines, hospital listings, and welfare schemes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **State Management**: Redux Toolkit (with Redux-Persist for session persistence)
- **Routing**: React Router v7
- **Localization**: i18next & react-i18next
- **Styling**: Vanilla CSS (custom design tokens, fully responsive, CSS variables, dark/light theme integration)
- **API Client**: Axios (with authorization interceptors)

### Backend
- **Framework**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose) with an automatic in-memory mock database fallback on database connection failure
- **Security**: Helmet headers, CORS, MongoDB sanitization, XSS protection, and rate-limiting
- **Logging**: Winston logger (daily rotated logs)
- **Authentication**: bcryptjs & jsonwebtoken (JWT)

---

## 📁 Project Structure

```
Community-Help-Hub/
├── backend/                   # Node/Express API Server
│   ├── src/
│   │   ├── config/            # DB configuration & dotenv setup
│   │   ├── controllers/       # Business logic (auth, schemes, hospitals, feedback)
│   │   ├── middleware/        # Rate-limiter, auth verification, error handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # REST API endpoints
│   │   ├── services/          # Gemini chatbot processing & mock services
│   │   └── utils/             # Winston logger, AppError helper, and mockDb seed data
│   ├── server.js              # Server entrypoint
│   └── .env                   # Environment variables
├── frontend/                  # React/Vite Client
│   ├── public/                # Static public assets
│   ├── src/
│   │   ├── components/        # Common UI components, chatbot widgets, and modals
│   │   ├── hooks/             # Custom React hooks (auth, API)
│   │   ├── layouts/           # Default layout (headers, selectors, chatbot injection)
│   │   ├── pages/             # Portal pages (Home, Schemes, Admin, Contact)
│   │   ├── routes/            # Protected & public route configurations
│   │   ├── store/             # Redux slice configurations
│   │   ├── utils/             # i18n translation configurations
│   │   └── main.jsx           # App entrypoint
│   └── vite.config.js         # Build and proxy config
├── index.html                 # Legacy Static Portal (HTML structure)
├── script.js                  # Legacy Static Logic
└── style.css                  # Legacy Static Styles
```

---

## ⚙️ Setup & Installation

### Option A: Running the Modernized Full-Stack Web App (Recommended)

#### 1. Setup the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (if missing):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/community_help_hub
   JWT_SECRET=super-secure-secret-key-community-help-hub-api-2026
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no MongoDB connection is found, the backend will automatically transition to **Mock DB Mode**, enabling complete app functionality using local in-memory datasets.*
4. Start the server:
   ```bash
   npm run dev
   ```

#### 2. Setup the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

### Option B: Running the Legacy Static Site
If you prefer to run the lightweight static page:
Simply double-click or open `index.html` in the root folder of the project using any modern web browser.

---

## 🔐 Demo Credentials

For testing the **Administrative Console** at `http://localhost:5173/login`:
- **Username / Email**: `admin`
- **Password**: `AdminPassword123`

---

## 🤝 Contribution
Contributions are welcome! Please follow these guidelines:
1. Fork the Repository.
2. Create a Feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

Developed as a Community Service Project to improve public access to digital public services.
