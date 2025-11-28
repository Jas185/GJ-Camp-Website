# GJ Camp Website - AI Coding Agent Instructions

## Project Overview
Full-stack MERN application for a youth church group ("Génération Josué") with authentication, email verification, and event registration. The project is in **French** - all user-facing text, variable names, and comments should be in French.

## Architecture

### Stack
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React 18 + React Router v6 + Axios
- **Auth**: JWT tokens stored in localStorage
- **Email**: Nodemailer with multiple provider support (Gmail, SendGrid, Brevo, or Ethereal for testing)

### Key Directories
```
backend/src/
  ├── controllers/     # Business logic (authController.js, registrationController.js)
  ├── models/          # Mongoose schemas (User.js)
  ├── routes/          # Express routes (authRoutes.js)
  ├── middleware/      # JWT auth middleware (auth.js)
  └── config/          # DB & email configuration

frontend/src/
  ├── pages/           # Route components (HomePage, LoginPage, SignupPage, VerifyEmailPage)
  ├── components/      # Reusable UI (Header, Footer, Carousel)
  ├── context/         # AuthContext for global auth state
  └── styles/          # App.css with design system
```

## Development Workflow

### Running Locally
1. **Backend**: `cd backend && npm run dev` → http://localhost:5000
2. **Frontend**: `cd frontend && npm start` → http://localhost:3000
3. Frontend proxies API calls to backend via `"proxy": "http://localhost:5000"` in frontend/package.json

### Environment Variables
Backend requires `.env` file with:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Token signing key
- `FRONTEND_URL` - CORS origin (http://localhost:3000)
- `EMAIL_*` - Email service config (see backend/src/config/email.js for options)

## Code Conventions

### Language
- All user messages, console logs, and comments: **French**
- Examples: `"Inscription réussie !"`, `// Générer le token de vérification`

### Authentication Pattern
- **JWT Strategy**: Token generated in `authController.generateToken()` with 7-day expiry
- **Middleware**: `backend/src/middleware/auth.js` validates token and attaches `req.user.userId`
- **Frontend Context**: `AuthContext` provides `user`, `token`, `login()`, `signup()`, `logout()`
- **Protected Routes**: Use `auth` middleware, e.g., `router.get('/me', auth, authController.getMe)`

### User Model Methods
- `generateEmailVerificationToken()` - Creates hashed token valid for 24h
- `comparePassword(enteredPassword)` - Bcrypt comparison
- `toJSON()` - Auto-removes password from responses
- Pre-save hook auto-hashes password

### Email Verification Flow
1. Signup creates user with `isEmailVerified: false`
2. `emailVerificationToken` (hashed) and `emailVerificationExpires` stored in User
3. Email sent with plain token via `sendVerificationEmail(email, firstName, token)`
4. User clicks link → `GET /api/auth/verify-email/:token` → marks `isEmailVerified: true`

### Error Handling
- Use `express-validator` for input validation (see authRoutes.js)
- Return French error messages: `{ message: "Cet email est déjà utilisé" }`
- Validation errors array: `errors.array().map(err => err.msg).join(', ')`

### Frontend Patterns
- **Routing**: React Router v6 with `<Routes>` and `element` prop
- **API Calls**: Axios with `/api/*` paths (proxied to backend)
- **Auth Headers**: `Authorization: Bearer ${token}` for protected endpoints
- **State Management**: Context API for auth, local state for forms

### Design System (from App.css)
- Primary Red: `#a01e1e`
- Gold (header): `#d4af37`
- Dark Blue (footer): `#001a4d`
- White: `#ffffff`

## Common Tasks

### Adding a Protected Route
1. Backend: Add route with `auth` middleware → `router.post('/endpoint', auth, controller.method)`
2. Controller: Access user via `req.user.userId`
3. Frontend: Include token in request → `axios.get('/api/endpoint', { headers: { Authorization: \`Bearer ${token}\` } })`

### Adding a New Model
1. Create in `backend/src/models/` with Mongoose schema
2. Export with `module.exports = mongoose.model('ModelName', schema)`
3. Import in controller: `const ModelName = require('../models/ModelName')`

### Email Configuration
- Production: Set `EMAIL_SERVICE=gmail` or `EMAIL_SERVICE=sendgrid` with credentials
- Development: Uses Ethereal.email test accounts (check console for preview URL)
- Custom SMTP: Set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`

## Registration System (In Progress)
- `registrationController.js` handles event registrations
- Calculates payment (total: 120€, minimum: 20€)
- Links to User model via `user: user._id`
- **Note**: Registration model not yet created - controller references missing `models/Registration.js`

## Testing
- Backend health check: `GET /api/health` → `{ message: "✅ Backend fonctionnaire" }`
- Email testing: Run `node backend/test-email.js` to verify email config

## Notes
- `my-web-page/` appears to be legacy/static HTML - main app is in `frontend/`
- UI uses emoji extensively (🚀, ✅, ❌, ✉️) in logs and messages
- Server logs use French with emoji: `console.log('🚀 Serveur démarré sur le port ${PORT}')`
