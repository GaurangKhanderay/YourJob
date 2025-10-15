# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Convex Connection Error
**Error**: `Could not find public function for 'auth:getCurrentUser'`

**Solution**:
```bash
# 1. Start Convex dev server
npx convex dev

# 2. Wait for it to complete and copy the URL
# 3. Update .env.local with the correct URL
NEXT_PUBLIC_CONVEX_URL=https://your-actual-convex-url.convex.cloud

# 4. Restart your Next.js dev server
npm run dev
```

### 2. TypeScript Errors in Convex
**Error**: `Type 'string' is not assignable to type 'Id<"users">'`

**Solution**: This has been fixed! The errors were due to using string literals instead of proper Convex ID types. All files have been updated with proper type casting.

### 3. Database Not Seeded
**Error**: No data showing in the app

**Solution**:
```bash
# Run the database seeding script
npm run setup

# Or manually seed if the script fails
npx convex run seed:seedUsers
npx convex run seed:seedJobs
```

### 4. Build Errors
**Error**: Various build/compilation errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Restart everything
npm run dev
```

### 5. Environment Variables Not Loading
**Error**: `process.env.NEXT_PUBLIC_CONVEX_URL is undefined`

**Solution**:
1. Check `.env.local` exists in the root directory
2. Make sure variable names start with `NEXT_PUBLIC_`
3. Restart the dev server after changing env vars
4. Check for typos in variable names

### 6. Convex Dev Server Issues
**Error**: Convex dev server won't start

**Solution**:
```bash
# Kill any existing Convex processes
pkill -f convex

# Clear Convex cache
rm -rf .convex

# Start fresh
npx convex dev
```

### 7. Port Already in Use
**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### 8. Module Resolution Errors
**Error**: `Cannot resolve module` or import errors

**Solution**:
```bash
# Clear all caches
rm -rf .next
rm -rf node_modules
rm -rf .convex

# Reinstall everything
npm install
npx convex dev
npm run dev
```

## 🚀 Complete Fresh Setup

If you're still having issues, try this complete fresh setup:

```bash
# 1. Clean everything
rm -rf .next
rm -rf node_modules
rm -rf .convex
rm .env.local

# 2. Reinstall dependencies
npm install

# 3. Run quick setup
npm run quick-setup

# 4. Start Convex (in one terminal)
npx convex dev

# 5. Update .env.local with your Convex URL

# 6. Start Next.js (in another terminal)
npm run dev

# 7. Seed the database
npm run setup
```

## 🔍 Debugging Tips

### Check Convex Status
```bash
# Check if Convex is running
curl http://localhost:3000/api/health

# Check Convex logs
npx convex logs
```

### Check Environment Variables
```bash
# Print all env vars (in Node.js)
console.log(process.env)

# Check specific var
echo $NEXT_PUBLIC_CONVEX_URL
```

### Check Network Issues
```bash
# Test Convex connection
curl -X POST https://your-convex-url.convex.cloud/api/query \
  -H "Content-Type: application/json" \
  -d '{"function": "auth:getCurrentUser", "args": {}}'
```

## 📞 Getting Help

If you're still stuck:

1. **Check the logs**: Look at both terminal outputs for error messages
2. **Convex Dashboard**: Visit your Convex dashboard to see if functions are deployed
3. **Browser Console**: Check browser dev tools for client-side errors
4. **Network Tab**: Check if API calls are failing

## 🎯 Quick Fixes

### Reset Everything
```bash
# Nuclear option - reset everything
git clean -fd
rm -rf node_modules .next .convex
npm install
npm run quick-setup
```

### Check File Permissions
```bash
# Make sure scripts are executable
chmod +x scripts/*.js
```

### Verify Dependencies
```bash
# Check for outdated packages
npm outdated

# Update if needed
npm update
```

---

**Remember**: Most issues are resolved by ensuring Convex dev server is running and environment variables are set correctly! 🚀
