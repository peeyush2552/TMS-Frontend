# Frontend Environment Variables Setup

## 📋 How Environment Variables Work in Angular

Angular uses **environment files** (`environment.ts` and `environment.production.ts`) instead of `.env` files.

---

## 🎯 Two Ways to Configure

### **Option 1: Vercel Dashboard** ⭐ RECOMMENDED

This is the easiest way for production deployment.

#### **Steps:**

1. **Deploy your backend first and get the URL**
2. **Go to Vercel Dashboard** → Your Frontend Project
3. **Settings** → **Environment Variables**
4. **Add Environment Variable:**
   - Name: `API_URL`
   - Value: `https://your-backend-url.vercel.app/api`
   - Environment: **Production**
5. **Save**
6. **Redeploy** your frontend

The `scripts/set-env.js` will automatically use this variable during build!

---

### **Option 2: Manual Update** (Simple)

Just edit the file directly before deploying.

#### **Steps:**

1. **Deploy backend first**
2. **Copy your backend URL**
3. **Edit:** `client/src/environments/environment.production.ts`
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-actual-backend-url.vercel.app/api',
   };
   ```
4. **Commit and push**
5. **Deploy frontend**

---

## 📁 File Structure

```
client/
├── .env                          # Local reference (not used by Angular)
├── .env.example                  # Template
├── scripts/
│   └── set-env.js               # Script to inject env vars
├── src/
│   └── environments/
│       ├── environment.ts                # Development config
│       └── environment.production.ts     # Production config
├── package.json                  # Updated with build:prod script
└── vercel.json                  # Uses build:prod command
```

---

## 🔧 Configuration Files

### **1. Development (`environment.ts`)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
};
```
- Used when: `ng serve`
- Used when: `npm start`

### **2. Production (`environment.production.ts`)**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.vercel.app/api',
};
```
- Used when: `ng build --configuration production`
- Used when: `npm run build:prod`
- Used by: Vercel during deployment

### **3. Build Script (`scripts/set-env.js`)**
```javascript
// Reads API_URL from environment and updates environment.production.ts
const apiUrl = process.env.API_URL || 'default-url';
```

---

## 🚀 Deployment Workflows

### **Workflow A: Using Vercel Environment Variables** ⭐

```bash
# 1. Deploy backend
cd server
vercel --prod
# Copy backend URL: https://tms-backend-xyz.vercel.app

# 2. Set environment variable in Vercel Dashboard
# Go to: Frontend Project → Settings → Environment Variables
# Add: API_URL = https://tms-backend-xyz.vercel.app/api

# 3. Deploy frontend
cd client
vercel --prod

# ✅ Done! The set-env.js script will use the API_URL from Vercel
```

### **Workflow B: Manual Configuration**

```bash
# 1. Deploy backend
cd server
vercel --prod
# Copy backend URL: https://tms-backend-xyz.vercel.app

# 2. Update environment.production.ts manually
# Edit: client/src/environments/environment.production.ts
# Change apiUrl to: 'https://tms-backend-xyz.vercel.app/api'

# 3. Deploy frontend
cd client
vercel --prod

# ✅ Done!
```

---

## 🧪 Testing

### **Test Local Development**
```bash
cd client
npm start
# Check browser console:
# - production: false
# - apiUrl: 'http://localhost:5000/api'
```

### **Test Production Build**
```bash
cd client

# Option 1: With environment variable
API_URL=https://your-backend.vercel.app/api npm run build:prod

# Option 2: Without (uses value in environment.production.ts)
npm run build:prod

# Serve locally
npx http-server dist/client/browser -p 4200
# Check browser console for API URL
```

### **Verify Which Environment is Active**
Add to any component:
```typescript
import { environment } from '../environments/environment';

ngOnInit() {
  console.log('🔧 Environment Config:', environment);
  console.log('📡 API URL:', environment.apiUrl);
  console.log('🏭 Production:', environment.production);
}
```

---

## 📝 package.json Scripts

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "node scripts/set-env.js && ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  }
}
```

**New script:**
- `build:prod` - Runs set-env.js first, then builds for production

---

## 🔒 Security

### **✅ Safe to commit:**
- `environment.ts` (contains localhost)
- `environment.production.ts` (with placeholder URL)
- `.env.example`
- `scripts/set-env.js`

### **❌ Don't commit:**
- `.env` (if it contains real URLs)
- Real backend URLs with secrets

### **.gitignore already includes:**
```
.env
.env.local
.env.production
```

---

## 🎯 Quick Reference

| Use Case | Command | API URL Source |
|----------|---------|----------------|
| Local Dev | `npm start` | `environment.ts` (localhost) |
| Prod Build (Vercel) | `npm run build:prod` | `process.env.API_URL` or `environment.production.ts` |
| Manual Prod Build | `ng build --configuration production` | `environment.production.ts` |

---

## 🔍 Troubleshooting

### **Issue: API calls going to wrong URL**

**Check:**
```typescript
import { environment } from '../environments/environment';
console.log('Current API URL:', environment.apiUrl);
```

**Solution:**
- For development: Edit `environment.ts`
- For production: Edit `environment.production.ts` OR set `API_URL` in Vercel

### **Issue: Build using wrong environment**

**Check build command:**
```bash
# Development build
ng build

# Production build
ng build --configuration production
# OR
npm run build:prod
```

### **Issue: Vercel not picking up API_URL**

**Solution:**
1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Ensure `API_URL` is set for **Production** environment
4. Redeploy: Deployments → Latest → Redeploy

---

## 📊 Environment Variable Flow

```
Local Development:
npm start → Uses environment.ts → http://localhost:5000/api

Production (Vercel Dashboard):
Vercel Deploy → Reads API_URL env var → set-env.js updates environment.production.ts → Build → Uses updated URL

Production (Manual):
Edit environment.production.ts → Commit → Deploy → Uses hardcoded URL
```

---

## ✅ Checklist

### **Before First Deployment:**
- [ ] Backend deployed and URL copied
- [ ] `environment.production.ts` updated (if using manual method)
- [ ] OR `API_URL` set in Vercel Dashboard (if using Vercel env var)
- [ ] `package.json` has `build:prod` script
- [ ] `vercel.json` uses `build:prod` command
- [ ] `scripts/set-env.js` exists

### **After Deployment:**
- [ ] Frontend accessible
- [ ] Check browser console for API URL
- [ ] Test API calls (network tab)
- [ ] No CORS errors
- [ ] Login works

---

## 💡 Recommendation

**Use Vercel Dashboard Environment Variables** for:
- ✅ Easy updates without code changes
- ✅ Different URLs for preview vs production
- ✅ Secure credential management
- ✅ Team collaboration

**Use Manual Configuration** for:
- ✅ Simple deployments
- ✅ Full control
- ✅ No extra dashboard configuration

---

**Last Updated:** June 20, 2026  
**Status:** ✅ READY TO USE
