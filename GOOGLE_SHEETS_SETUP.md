# Google Sheets Integration Setup Guide (Admin-Only)

## Overview
This guide helps you set up the **admin-only** authentication system:
- **Students**: No login needed - just enter their name and take tests
- **Admin**: Logs in with Google to view all scores and sync to Google Sheets
- **Scores**: Stored locally until admin syncs them to Google Sheets

## Architecture

```
┌─ Students (no login) ─┐
│  1. Enter name       │
│  2. Take test        │──→ Stored locally in browser
│  3. Submit answers   │
└──────────────────────┘

                              ↓

┌─ Admin Dashboard ────────┐
│  1. Login with Google   │
│  2. View all scores     │──→ Right from localStorage
│  3. Sync to Sheets      │
└─────────────────────────┘
```

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it "Math Sheet Grader"
4. Wait for project creation to finish

## Step 2: Enable Google Sheets API

1. In the left sidebar, click "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials (for Admin)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. You may need to set up a "Consent Screen" first:
   - Click "Configure Consent Screen"
   - Choose "External"
   - Fill in:
     - App name: "Math Sheet Grader"
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue" through all screens
4. Back to Credentials, click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:8000`
   - `https://yourgithubusername.github.io/math-sheet-grade2`
   - Replace `yourgithubusername` with your actual GitHub username
7. Click Create
8. Copy your **Client ID** (you'll need this)

## Step 4: Create Google Sheet for Scores

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Math Sheet Scores"
3. Create two sheets within it:
   - **Sheet 1**: Rename to "Grade2"
   - **Sheet 2**: Rename to "Grade7"
4. In each sheet, add headers in Row 1:
   - Column A: `Student Name`
   - Column B: `Timestamp`
   - Column C: `Sheet Type`
   - Column D: `Correct`
   - Column E: `Total`
   - Column F: `Percentage`
5. Share the sheet with view access if needed
6. Copy the **Sheet ID** from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

## Step 5: Configure Your App

1. Open `google-auth-config.js` in the math-sheet-grade2 folder
2. Replace these values:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   const GOOGLE_SHEETS_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```
3. Save the file

## Step 6: Test Locally

To test locally, use Python's built-in server:

```bash
cd math-sheet-grade2
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000`

### Test Flow:
1. Go to home page
2. Click on a grade (2 or 7)
3. Follow a worksheet link
4. **Enter your name** in the "Your Name" field
5. Take the test
6. Click "Check Answers"
7. Go to `http://localhost:8000/admin.html`
8. Click "Login with Google" button
9. Your scores should appear in the dashboard
10. Click "Sync All Scores to Google Sheets"

## Step 7: Deploy to GitHub Pages

Once tested locally:

```bash
git add -A
git commit -m "Configure Google Sheets integration"
git push origin main
```

Your app will be available at: `https://yourgithubusername.github.io/math-sheet-grade2`

## Usage

### For Students:
1. Visit the app
2. Choose Grade 2 or Grade 7
3. Pick a worksheet
4. **Enter your name** (required for tracking)
5. Take the test
6. Click "Check Answers"
7. Scores are saved automatically

### For Admin:
1. Visit `/admin.html` page
2. Click "Login with Google"
3. View all student scores by grade
4. See stats: Total students, total attempts, total correct, overall percentage
5. Click "📤 Sync All Scores to Google Sheets" to save to your Sheet
6. Optionally export as CSV for other uses
7. Click "Logout" when done

## Features

✅ **No student login required** - just enter name
✅ **Local score storage** - works offline
✅ **Admin-only authentication** - secure
✅ **Real-time dashboard** - see scores as students take tests
✅ **One-click sync** - push all data to Google Sheets
✅ **CSV export** - backup or analyze in Excel/Sheets
✅ **Stats tracking** - class averages and percentages

## Troubleshooting

### "Unauthorized origin" error
- Make sure you added your GitHub Pages URL to Authorized redirect URIs
- Format: `https://yourgithubusername.github.io/math-sheet-grade2`

### Scores not appearing in admin dashboard
- Make sure student names were entered before submitting answers
- Check browser's "Local Storage" (F12 → Application → Local Storage → math-sheet-grade2 origin)
- Try in an incognito window

### Sync to Google Sheets not working
- Check you're logged in as admin (green indicator visible)
- Verify Sheet ID is correct in `google-auth-config.js`
- Check Google Sheets API is enabled in Google Cloud Console
- Try syncing in an incognito window (avoids cache issues)

### Still seeing errors?
- Open browser DevTools (F12)
- Check Console tab for error messages
- Verify `google-auth-config.js` is loading (Network tab)
- Check that credentials are configured correctly

## Security Notes

- **Student data**: Stored only in browser's local storage (on each device)
- **Admin credentials**: Only used when admin logs in - never exposed to students
- **Google Sheets**: Only accessible by admin's Google account
- **No passwords stored** - uses OAuth 2.0 (industry standard)

## Support

For issues or questions:
1. Check browser console (F12)
2. Verify all configuration steps were followed
3. Try clearing cache and reloading
4. Check that Google Sheets API is enabled in Cloud Console

