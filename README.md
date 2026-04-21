# CampusBuzz 🚀

**CampusBuzz** is a premium, full-stack event management platform designed for educational ecosystems. It bridges the gap between students, faculty, and administrators with a high-performance, visually stunning interface and robust automation.

## 🔗 Live Links
- **Live Demo:** [Check it out on Vercel](https://your-frontend-url.vercel.app)
- **Backend API:** [Hosted on Render](https://your-backend-url.onrender.com)
- **Status:** Production Ready ✅

## ✨ Premium Features

### 🎓 For Students
- **Inverting Liquid Cursor**: A high-end, responsive interaction experience.
- **Magnetic UI Elements**: Smooth, interactive buttons and navigation.
- **Smart Registration**: One-click event signups with automated PDF certificates.
- **Real-time Notifications**: In-app alerts and email reminders via Nodemailer.
- **AI-Powered Search**: Smart filtering by domain, date, and engagement mode.

### 👨‍🏫 For Faculty & Organizers
- **Event Studio**: Rich media support for event creation.
- **Dynamic Filtering**: Professional 2-level classification (Domain & Type).
- **Analytics Dashboard**: Real-time tracking of registration and attendance.
- **Feedback Engine**: Direct insight into student sentiment and engagement.

### 🛡️ Core Infrastructure
- **Role-Based Access (RBAC)**: Secure routes for Students, Faculty, and Admins.
- **Push Notifications**: WebPush API integration for instant reach.
- **Production-Ready CORS**: Dynamic origin handling for secure cross-domain requests.

## 🛠️ Tech Stack

| Layer | Stack |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion, Tailwind CSS, Shadcn UI |
| **Backend** | Node.js, Express, JWT, Node-Cron, Nodemailer |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Gemini API Key (for AI features)

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/mansi-24082006/Campuss.git
   cd Campuss
   npm install
   ```

2. **Environment Setup**
   Configure your `.env` files in both `frontend/` and `backend/` based on the provided patterns.

3. **Run Locally**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

## 📂 Project Structure
- `backend/`: Core API, models, and notification engine.
- `frontend/`: React components, custom hooks, and Framer Motion animations.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Built with ❤️ for the Modern Campus**
