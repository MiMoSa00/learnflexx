# Deployment Instructions - Email Verification & Payment Setup

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
Before deploying to production, update your `.env` file:

```env
# Change this from localhost to your production domain
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**Example for different platforms**:
- **Vercel**: `https://your-project.vercel.app`
- **Custom Domain**: `https://learnflex.com`
- **Subdomain**: `https://app.learnflex.com`

### 2. Supabase Configuration

#### Email Verification Settings
1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Email Templates**
3. Check **Confirmation Link** template
4. Verify it contains the correct redirect URL (should be automatic with our setup)

#### Site URL Configuration
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/login`
   - `https://yourdomain.com/signup`

### 3. Database Check
Ensure your Supabase database has:
```sql
-- Verify profiles table exists with subscription_id
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'subscription_id';

-- Should return: subscription_id
```

---

## 🚀 Deployment Steps

### Step 1: Update Environment Variables
```bash
# Production .env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
NEXTAUTH_URL="https://yourdomain.com"
# ... other variables
```

### Step 2: Build the Application
```bash
npm install
npm run build
```

### Step 3: Test Locally
```bash
# Test with production build locally
NEXT_PUBLIC_APP_URL="http://localhost:3000" npm start
```

### Step 4: Deploy

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard or:
vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://yourdomain.com
```

#### Option B: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
ENV NEXT_PUBLIC_APP_URL=https://yourdomain.com
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Option C: Manual Server
```bash
# SSH into server
ssh user@yourserver.com

# Clone and setup
git clone https://github.com/yourrepo/learnflex.git
cd learnflex
npm ci

# Create production .env
cat > .env << EOF
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_SUPABASE_URL="your_url"
# ... other vars
EOF

# Build and run
npm run build
npm start
```

### Step 5: Verify Deployment

#### Test Email Verification
1. Sign up on production site
2. Check email inbox
3. Verify email link has format: `https://yourdomain.com/auth/callback?code=...`
4. Click link and verify it works

#### Test Payment Setup
1. Log in to your account
2. Go to Dashboard → Settings
3. Find "Payment Setup" section
4. Set up payment mandate with test data
5. Verify it saves subscription ID

#### Test Checkout Payment Check
1. Go to browse courses
2. Add course to checkout
3. Try to continue without payment setup
4. Should redirect to Settings
5. Set up payment and try again
6. Should proceed normally

---

## 🔗 URL Mappings

| Environment | NEXT_PUBLIC_APP_URL | Email Link Will Use |
|---|---|---|
| Development | `http://localhost:3000` | `http://localhost:3000/auth/callback` |
| Staging | `https://staging.learnflex.com` | `https://staging.learnflex.com/auth/callback` |
| Production | `https://learnflex.com` | `https://learnflex.com/auth/callback` |

---

## 🔐 Security Considerations

### Email Verification Security
- ✅ Supabase handles token generation and validation
- ✅ Tokens expire after time limit
- ✅ One-time use only
- ✅ HTTPS enforced (in production)

### Payment Data Security
- ✅ BVN stored securely (encrypted by backend)
- ✅ Account numbers not exposed in frontend
- ✅ PayWithAccount API handles tokenization
- ✅ Subscription IDs used instead of storing payment methods

### Best Practices
1. Always use HTTPS in production
2. Keep API keys in server-only variables
3. Validate all user input on backend
4. Use environment variables for secrets
5. Monitor Supabase logs for suspicious activity

---

## 📊 Monitoring & Logging

### Monitor Email Verification
```bash
# Check Supabase logs
# Supabase Dashboard → Logs → Auth

# Look for:
# - Email sent successfully
# - Link clicked
# - Session created
# - Errors or failures
```

### Monitor Payment Setup
```bash
# Check Supabase logs
# Look for:
# - Profile updates
# - Payment mandate creations
# - API failures

# PayWithAccount logs:
# Check your PayWithAccount dashboard for mandate status
```

### Application Monitoring
Recommended tools:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - Performance monitoring
- **Datadog** - Infrastructure monitoring

---

## 🆘 Post-Deployment Troubleshooting

### Issue: Email verification links show 404
**Solution**:
1. Check `NEXT_PUBLIC_APP_URL` is correct
2. Verify Supabase redirect URLs are configured
3. Check `/auth/callback` route is deployed
4. Clear browser cache

### Issue: Payment setup not saving
**Solution**:
1. Verify Supabase connection on production
2. Check `subscription_id` column exists
3. Check PayWithAccount API keys are valid
4. Review browser console errors

### Issue: Users can't proceed to checkout
**Solution**:
1. Verify payment setup was completed
2. Check subscription_id is stored in database
3. Review checkout review logic
4. Check profile query is working

---

## 📈 Rollback Plan

If issues occur after deployment:

### Quick Rollback
```bash
# If using Vercel
vercel rollback

# If using manual deployment
git revert <commit-hash>
npm run build
npm start
```

### Database Rollback
```sql
-- If needed, clear problematic subscription IDs
UPDATE profiles 
SET subscription_id = NULL 
WHERE subscription_id LIKE 'ref_%'
AND created_at > NOW() - INTERVAL '1 hour';
```

### Restore Previous .env
```bash
# Keep backup of production env
cp .env .env.backup.prod
git checkout HEAD~1 -- .env
```

---

## ✅ Post-Deployment Verification

After deployment, verify these features work:

- [ ] Email signup sends verification email
- [ ] Verification email link works
- [ ] User can verify and login
- [ ] Settings page shows Payment Setup section
- [ ] Can set up payment mandate in Settings
- [ ] Payment status updates correctly
- [ ] Checkout enforces payment setup
- [ ] Users redirected to Settings if not set up
- [ ] No errors in browser console
- [ ] No errors in Supabase logs

---

## 📞 Support Resources

### Official Documentation
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Supabase Email**: https://supabase.com/docs/guides/auth/passwordless-login/email

### Debugging Tools
- **Supabase Dashboard**: https://app.supabase.com
- **Browser DevTools**: F12 → Console/Network tabs
- **Supabase Logs**: Real-time logs in dashboard

### Contact Support
- Supabase Support: https://supabase.com/support
- PayWithAccount Support: support@paywithaccount.com
- GitHub Issues: Your repository

---

## 🎉 Deployment Complete!

Once verified, your LearnFlex application will have:
✅ Production-ready email verification
✅ Flexible payment setup management
✅ Enforced payment verification
✅ Secure data handling
✅ Professional user experience

**Congratulations on your deployment!**
