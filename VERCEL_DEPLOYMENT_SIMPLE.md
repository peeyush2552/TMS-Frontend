# Simple Vercel Deployment Guide for Frontend

## ⚠️ Important: Ignore the .env File!

**Angular doesn't use `.env` files.** That file is just for reference/documentation.

---

## ✅ What Actually Matters

### **Only These Files Control Your API URL:**

1. **Development:** `src/environments/environment.ts`
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api',  // ← For local development
   };
   ```

2. **Production:** `src/environments/environment.production.ts`
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend-url.vercel.app/api',  // ← For Vercel
   };
   ```

---

## 🚀 Simplest Deployment Method (No .env needed!)

### **Step 1: Deploy Backend First**
```bash
cd server
vercel --prod
```

**Copy the URL you get.** For example: `https://tms-backend-abc123.vercel.app`

---

### **Step 2: Update Production Environment File**

Edit: `client/src/environments/environment.production.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tms-backend-abc123.vercel.app/api',  // ← YOUR ACTUAL URL HERE!
};
```

**Save the file.**

---

### **Step 3: Deploy Frontend**
```bash
cd client
vercel --prod
```

---

## ✅ That's It! No .env Configuration Needed!

---

## ❓ Why Two API Links?

You asked: "why there is two API link in .env"

**Answer:** There are two **environments**, not two links:

1. **Development Environment** (`environment.ts`)
   - Used when: You run `npm start` locally
   - API URL: `http://localhost:5000/api` (your local backend)
   - Purpose: For testing on your computer

2. **Production Environment** (`environment.production.ts`)
   - Used when: Vercel deploys your app
   - API URL: `https://your-backend.vercel.app/api` (deployed backend)
   - Purpose: For live users

**The `.env` file just shows these for reference** - Angular doesn't actually read it!

---

## 🎯 Will There Be Issues with Vercel?

### **NO ISSUES if you:**

✅ Update `environment.production.ts` with your real backend URL
✅ Deploy backend before frontend
✅ Make sure backend URL ends with `/api`

### **WILL HAVE ISSUES if:**

❌ You forget to update `environment.production.ts`
❌ You use wrong backend URL
❌ You forget `/api` at the end of the URL

---

## 🔍 How to Verify After Deployment

### **1. Check Your Frontend**
Visit your frontend URL: `https://your-frontend.vercel.app`

### **2. Open Browser Console (F12)**
You should see something like:
```
API URL: https://tms-backend-abc123.vercel.app/api
Production: true
```

### **3. Test Login**
- Email: `peeyush1@gmail.com`
- Password: `peeyush1`

If login works → ✅ Everything is correct!

---

## 🛠️ Optional: Advanced Method (Using Vercel Environment Variables)

If you want to change the API URL without editing code:

### **Step 1: Deploy Backend**
```bash
cd server
vercel --prod
```
Copy URL: `https://tms-backend-abc123.vercel.app`

### **Step 2: Set Environment Variable in Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Select your **frontend** project
3. Go to: **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `API_URL`
   - **Value:** `https://tms-backend-abc123.vercel.app/api`
   - **Environment:** Production
5. Save

### **Step 3: Deploy Frontend**
```bash
cd client
vercel --prod
```

The `scripts/set-env.js` will automatically use the `API_URL` from Vercel!

---

## 📊 Summary: What Controls the API URL?

| When | File Used | Purpose |
|------|-----------|---------|
| `npm start` | `environment.ts` | Local development |
| `vercel --prod` | `environment.production.ts` | Production deployment |
| Vercel Dashboard | Overrides `environment.production.ts` | Dynamic configuration |

**The `.env` file?** → Just documentation, not used by Angular!

---

## ✅ Recommended Approach

**For beginners:** Use the **Simplest Method** (Step 1-3 above)
- Easy to understand
- No confusion
- Edit one file, deploy

**For teams:** Use **Advanced Method** with Vercel env vars
- Change URL without code changes
- Better for multiple environments
- Team-friendly

---

## 🚨 Common Mistakes to Avoid

1. ❌ Don't forget to update `environment.production.ts`
2. ❌ Don't deploy frontend before backend
3. ❌ Don't forget `/api` at the end of URL
4. ❌ Don't commit real URLs if they contain secrets
5. ❌ Don't expect Angular to read `.env` files (it doesn't!)

---

## 🎯 Quick Checklist

Before deploying frontend:

- [ ] Backend deployed and URL copied
- [ ] Updated `environment.production.ts` with backend URL
- [ ] URL ends with `/api`
- [ ] Saved the file
- [ ] Ready to run `vercel --prod`

---

**You won't have any issues if you follow the Simplest Method above!** ✅

The `.env` file is just for documentation - you can ignore it or delete it!
