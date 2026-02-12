# Google Sheets Integration Setup Guide

## Overview
This guide will help you set up Google authentication and automatic score saving to Google Sheets.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it "Math Sheet Grader"
4. Wait for project creation to finish

## Step 2: Enable Google Sheets API

1. In the left sidebar, click "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

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
   - Column A: `Email`
   - Column B: `Timestamp`
   - Column C: `Grade`
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

To test locally, you can use Python's built-in server:

```bash
cd math-sheet-grade2
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000`

## Step 7: Deploy to GitHub Pages

Once tested:
```bash
git add -A
git commit -m "Add Google Sheets integration"
git push origin main
```

Your app will be available at: `https://yourgithubusername.github.io/math-sheet-grade2`

## Features

- **Automatic Login**: Students click "Login with Google" button
- **Score Logging**: Each time "Check Answers" is clicked, scores are saved to Google Sheets
- **Anonymous Fallback**: If not logged in, scores still save locally to localStorage
- **Teacher View**: View all student scores in Google Sheets dashboard

## Troubleshooting

### "Unauthorized origin" error
- Make sure you added your GitHub Pages URL to the Authorized redirect URIs in Google Cloud Console
- Format: `https://yourgithubusername.github.io/math-sheet-grade2`

### Scores not saving to Sheets
- Check browser console (F12) for errors
- Ensure you're logged in (green "Logged in" indicator visible)
- Verify the Sheet ID is correct
- Make sure Google Sheets API is enabled in Google Cloud Console

### Still seeing errors?
- Try in an incognito window
- Clear browser cache
- Check that `google-auth-config.js` is being loaded (check Network tab in DevTools)
