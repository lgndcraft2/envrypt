# Envrypt - Secure Secret Management

Envrypt is a modern, secure vault management application designed for teams to store, share, and manage environment variables and secrets securely. Built with security and user experience in mind, it features end-to-end management of sensitive data, robust access controls, and a seamless team onboarding experience.

## 🚀 Features

*   **Secure Authentication**: Powered by Supabase Auth, supporting Email/Password and Google OAuth.
*   **Team & Role Management**: Create teams, invite members, and manage roles (Owner, Admin, Member).
*   **Secret Vaults**: Organize secrets into named vaults (e.g., "Production", "Staging").
*   **Secret Management**:
    *   Add secrets individually or bulk paste from `.env` files.
    *   Secure "Click-to-Reveal" prevents secrets from being exposed in the network tab on load.
    *   Download secrets as `.env` files.
    *   Edit and Delete functionality.
*   **Audit Logging**: Track who accessed or modified secrets.
*   **Service Tokens**: Generate tokens for programmatic access (e.g., CI/CD pipelines).
*   **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a slick, responsive experience.

## 🛠 Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **State/Routing**: React Router DOM, Context API
*   **Icons**: Material Symbols

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: Supabase (PostgreSQL)
*   **Security**: AES-256 Encryption for stored secrets
*   **Validation**: Pydantic

## 📂 Project Structure

```bash
envrypt/
├── backend/            # Python FastAPI Backend
│   ├── app/
│   │   ├── routers/    # API Endpoints (auth, audit, secrets, etc.)
│   │   ├── main.py     # App entry point
│   │   └── ...
│   └── requirements.txt
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── lib/        # API and Supabase clients
│   │   └── ...
│   └── package.json
└── README.md
```

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   Supabase Account

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
MASTER_ENCRYPTION_KEY=32_byte_random_string
```

Run the server:
```bash
uvicorn app.main:app --reload
```
The API will run at `http://localhost:8000`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000/api
```

Run the development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🔒 Security Architecture

*   **Secret Transmission**: Secrets are never sent to the client in plain text during listing. They are masked (`value: null`) until a specific "Reveal" request is made.
*   **Encryption**: Secrets are encrypted at rest using a master encryption key.
*   **Access Control**: All endpoints enforce team membership and role-based permissions.

## 📦 Deployment

### Frontend (Vercel)
1.  Connect your repository to Vercel.
2.  Set the Framework Preset to **Vite**.
3.  Add the environment variables (`VITE_SUPABASE_URL`, etc.) in the Vercel dashboard.
4.  Deploy!

### Backend
Deploy the FastAPI app to a provider like **Render**, **Railway**, or **AWS**. Ensure you update the `VITE_API_URL` in your frontend deployment to point to your live backend URL.

## 📝 License

This project is licensed under the MIT License.
