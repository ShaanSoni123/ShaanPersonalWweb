# 📧 Email Setup Guide - Contact Form

Your contact form is ready, but you need to connect it to an email service so you actually receive messages!

## 🎯 Quick Setup (5 Minutes) - Web3Forms (Recommended)

**This is the EASIEST option - no backend code needed!**

### Step 1: Get Your Free API Key

1. Go to [web3forms.com](https://web3forms.com)
2. Click "Get Started for Free"
3. Enter your email: **shaansoni21@gmail.com**
4. Click "Create Access Key"
5. Copy your access key (looks like: `abc123-def456-ghi789`)

### Step 2: Add API Key to Your Project

1. Create a file called `.env.local` in your project root:
```bash
touch .env.local
```

2. Add this line to `.env.local`:
```
NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key_here
```

Replace `your_access_key_here` with the key you copied!

### Step 3: Restart Your Server

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Test It!

1. Go to http://localhost:3000
2. Scroll to the Contact section
3. Fill out the form and submit
4. Check your email (shaansoni21@gmail.com)! 📬

**Done! You'll now receive all contact form submissions via email!** ✅

---

## 🚀 Alternative: Resend (More Professional)

If you want more control and professional emails:

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up (free: 3,000 emails/month)
3. Get your API key from dashboard

### Step 2: Install Resend Package

```bash
npm install resend
```

### Step 3: Add API Key

Add to `.env.local`:
```
RESEND_API_KEY=re_your_key_here
```

### Step 4: Update API Route

In `app/api/contact/route.js`, **uncomment** the Resend code (lines marked with comments)

### Step 5: Verify Your Domain (Optional)

For professional emails from your own domain:
1. Add your domain in Resend dashboard
2. Add DNS records they provide
3. Update `from:` address in `route.js`

---

## 🧪 Testing Without Setup

The form will work WITHOUT any setup - it will:
- ✅ Validate the form
- ✅ Show success message
- ✅ Log submissions to console
- ❌ But won't email you

Perfect for testing before going live!

---

## 🔍 Troubleshooting

### "Message received but no email service configured"

You see this because `.env.local` doesn't have the API key yet. Follow Step 2 above!

### "Failed to send message"

1. Check `.env.local` exists and has the correct key
2. Restart your dev server
3. Check browser console for errors (F12)
4. Verify your API key is correct

### Email not arriving

1. Check spam folder
2. Verify the email in Web3Forms settings
3. Check Web3Forms dashboard for delivery logs

### Still not working?

Email yourself directly for now! The email link works:
- Click the email in the Contact section
- Your email client will open
- People can email you directly at shaansoni21@gmail.com

---

## 📊 Which Option to Choose?

### Choose **Web3Forms** if:
- ✅ You want the fastest setup (5 minutes)
- ✅ You're just starting out
- ✅ You don't want to manage email infrastructure
- ✅ Free tier is enough (no limit on free plan!)

### Choose **Resend** if:
- ✅ You want professional branded emails
- ✅ You have your own domain
- ✅ You want detailed analytics
- ✅ You're building for a client/business

---

## 🎯 Recommended: Start with Web3Forms

**Why?**
- 5-minute setup
- No credit card required
- Unlimited emails on free plan
- Works perfectly for portfolios
- You can always switch to Resend later!

---

## ✅ After Setup Checklist

Once emails are working:

- [ ] Test form on desktop
- [ ] Test form on mobile
- [ ] Check spam folder for test emails
- [ ] Save Web3Forms dashboard link for checking submissions
- [ ] Add your domain to Web3Forms (optional)
- [ ] Set up email notifications in Web3Forms settings

---

## 🚀 Ready to Go Live?

Before deploying to Vercel:

1. **IMPORTANT**: Add your `.env.local` variables to Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `NEXT_PUBLIC_WEB3FORMS_KEY` with your key
   - Redeploy

2. Test the form on your live site

3. You're done! 🎉

---

## 💡 Pro Tips

1. **Auto-reply**: In Web3Forms settings, enable auto-reply to thank people instantly
2. **Spam Protection**: Web3Forms includes honeypot and reCAPTCHA
3. **Multiple Recipients**: Add CC addresses in Web3Forms dashboard
4. **Custom Success Message**: Update the alert message in `Contact.jsx`
5. **Email Templates**: Customize the HTML in `route.js` for prettier emails

---

## 📧 Need Help?

If you're stuck:
1. Check the browser console (F12 → Console tab)
2. Check the terminal where `npm run dev` is running
3. Verify `.env.local` file exists and has correct key
4. Make sure you restarted the server after adding `.env.local`

**Quick test**: Open http://localhost:3000/api/contact in your browser
- You should see: `{"error":"All fields are required"}`
- If you see this, your API route is working! ✅

---

**Your contact form is ready! Just add the API key and you're live!** 🎉

