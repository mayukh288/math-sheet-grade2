// Google Authentication & Sheets Configuration
// Replace these with your own credentials from Google Cloud Console

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_SHEETS_ID = 'YOUR_GOOGLE_SHEET_ID';
const SPREADSHEET_RANGES = {
  grade2: 'Grade2!A:F',
  grade7: 'Grade7!A:F'
};

let googleAuth = null;
let userEmail = null;

// Initialize Google API
function initGoogleAPI() {
  gapi.load('auth2', () => {
    googleAuth = gapi.auth2.init({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets'
    });
    
    // Check if already signed in
    if (googleAuth.isSignedIn.get()) {
      const profile = googleAuth.currentUser.get().getBasicProfile();
      userEmail = profile.getEmail();
      updateAuthUI(true);
    } else {
      updateAuthUI(false);
    }

    // Listen for auth changes
    googleAuth.isSignedIn.listen(isSignedIn => {
      if (isSignedIn) {
        const profile = googleAuth.currentUser.get().getBasicProfile();
        userEmail = profile.getEmail();
        updateAuthUI(true);
      } else {
        userEmail = null;
        updateAuthUI(false);
      }
    });
  });
}

function signIn() {
  if (googleAuth) {
    googleAuth.signIn().then(() => {
      console.log('Signed in successfully');
    }).catch(err => console.error('Sign-in error:', err));
  }
}

function signOut() {
  if (googleAuth) {
    googleAuth.signOut().then(() => {
      console.log('Signed out');
    });
  }
}

function updateAuthUI(isSignedIn) {
  const loginBtn = document.getElementById('googleLoginBtn');
  const logoutBtn = document.getElementById('googleLogoutBtn');
  const userDisplay = document.getElementById('userDisplay');

  if (isSignedIn && loginBtn) {
    loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (userDisplay) userDisplay.textContent = `Logged in as: ${userEmail}`;
  } else if (loginBtn) {
    loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userDisplay) userDisplay.textContent = '';
  }
}

// Save score to Google Sheets
async function saveScoreToSheets(grade, sheetName, dataRow) {
  if (!googleAuth || !googleAuth.isSignedIn.get()) {
    console.warn('Not signed in. Scores will only be saved locally.');
    return false;
  }

  try {
    const accessToken = googleAuth.currentUser.get().getAuthResponse().id_token;
    
    // Prepare data with timestamp
    const timestamp = new Date().toISOString();
    const rowData = {
      values: [[
        userEmail,
        timestamp,
        dataRow.grade || '',
        dataRow.correct || 0,
        dataRow.total || 0,
        dataRow.percentage || '0%'
      ]]
    };

    // Append to sheet
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: `${sheetName}!A:F`,
      valueInputOption: 'RAW',
      resource: rowData
    });

    console.log('Score saved to Google Sheets:', response);
    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return false;
  }
}

// Load Google API Script
(function() {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.onload = initGoogleAPI;
  document.head.appendChild(script);
})();
