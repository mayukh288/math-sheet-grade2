// Admin-Only Google Authentication & Sheets Configuration
// Replace these with your own credentials from Google Cloud Console

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_SHEETS_ID = 'YOUR_GOOGLE_SHEET_ID';

let googleAuth = null;
let adminEmail = null;

// Initialize Google API (ADMIN ONLY)
function initGoogleAPI() {
  gapi.load('auth2', () => {
    gapi.auth2.init({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets'
    }).then(() => {
      const auth2 = gapi.auth2.getAuthInstance();
      googleAuth = auth2;
      
      // Check if already signed in
      if (auth2.isSignedIn.get()) {
        const profile = auth2.currentUser.get().getBasicProfile();
        adminEmail = profile.getEmail();
        updateAdminUI(true);
      } else {
        updateAdminUI(false);
      }

      // Listen for auth changes
      auth2.isSignedIn.listen(isSignedIn => {
        if (isSignedIn) {
          const profile = auth2.currentUser.get().getBasicProfile();
          adminEmail = profile.getEmail();
          updateAdminUI(true);
        } else {
          adminEmail = null;
          updateAdminUI(false);
        }
      });

      // Also load the Sheets API
      gapi.load('sheets', { 'version': 'v4' });
    });
  });
}

function adminSignIn() {
  if (googleAuth) {
    googleAuth.signIn().then(() => {
      console.log('Admin signed in successfully');
    }).catch(err => console.error('Admin sign-in error:', err));
  }
}

function adminSignOut() {
  if (googleAuth) {
    googleAuth.signOut().then(() => {
      console.log('Admin signed out');
    });
  }
}

function updateAdminUI(isSignedIn) {
  const loginBtn = document.getElementById('adminLoginBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const adminDisplay = document.getElementById('adminDisplay');
  const syncBtn = document.getElementById('syncBtn');

  if (isSignedIn) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (syncBtn) syncBtn.style.display = 'inline-block';
    if (adminDisplay) adminDisplay.textContent = `Logged in as: ${adminEmail}`;
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (syncBtn) syncBtn.style.display = 'none';
    if (adminDisplay) adminDisplay.textContent = '';
  }
}

function isAdminLoggedIn() {
  return googleAuth && googleAuth.isSignedIn.get();
}

// Sync all collected student scores to Google Sheets
async function syncScoresToSheets() {
  if (!isAdminLoggedIn()) {
    alert('Please login as admin first');
    return false;
  }

  try {
    const allScores = JSON.parse(localStorage.getItem('allStudentScores')) || {};
    if (Object.keys(allScores).length === 0) {
      alert('No student scores to sync');
      return false;
    }

    let syncedCount = 0;

    for (const grade in allScores) {
      const sheetName = grade === 'grade2' ? 'Grade2' : 'Grade7';
      const studentScores = allScores[grade];

      for (const studentName in studentScores) {
        const scores = studentScores[studentName];
        
        for (const scoreRecord of scores) {
          const rowData = {
            values: [[
              studentName,
              scoreRecord.timestamp,
              scoreRecord.sheetType,
              scoreRecord.correct,
              scoreRecord.total,
              scoreRecord.percentage
            ]]
          };

          await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEETS_ID,
            range: `${sheetName}!A:F`,
            valueInputOption: 'RAW',
            resource: rowData
          });

          syncedCount++;
        }
      }
    }

    alert(`✅ Successfully synced ${syncedCount} scores to Google Sheets!`);
    return true;
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    alert('❌ Sync failed. Check console for details.');
    return false;
  }
}

// Local storage functions for students (no auth needed)
function saveLocalScore(studentName, grade, sheetType, correct, total) {
  const allScores = JSON.parse(localStorage.getItem('allStudentScores')) || { grade2: {}, grade7: {} };
  const gradeKey = grade === 2 ? 'grade2' : 'grade7';
  
  if (!allScores[gradeKey][studentName]) {
    allScores[gradeKey][studentName] = [];
  }

  const percentage = Math.round((correct / total) * 100);
  allScores[gradeKey][studentName].push({
    sheetType: sheetType,
    correct: correct,
    total: total,
    percentage: percentage + '%',
    timestamp: new Date().toISOString()
  });

  localStorage.setItem('allStudentScores', JSON.stringify(allScores));
  console.log(`Score saved locally for ${studentName}`);
}

// Load Google API Script
(function() {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.onload = initGoogleAPI;
  document.head.appendChild(script);
})();
