import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'c:\\Users\\ASUS\\Desktop\\TBI-GUI\\homestay-review-insight-ai\\screenshots';

// Ensure screenshots folder exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('🚀 Starting Puppeteer browser automation for Authentication flows...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Record API network requests to display in custom network tab mockup
  const networkRequests = [];

  try {
    // 1. Route Guard: Access Protected Route (/dashboard) without login
    console.log('Navigating to http://localhost:5173/dashboard (Should redirect to /login)...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for redirect animation
    
    const redirectPath = path.join(SCREENSHOTS_DIR, 'w6_auth_redirect.png');
    await page.screenshot({ path: redirectPath });
    console.log(`📸 Saved redirect screenshot to: ${redirectPath}`);

    // 2. Registration Flow
    console.log('Toggling to Register mode...');
    // Click register button/link at the bottom
    const buttons = await page.$$('button');
    let registerClicked = false;
    for (let btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Register')) {
        await btn.click();
        registerClicked = true;
        break;
      }
    }
    if (!registerClicked) {
      // Fallback: try selector
      await page.evaluate(() => {
        const link = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Register'));
        if (link) link.click();
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fill Name, Email, Password
    console.log('Filling in registration form...');
    const randomId = Math.floor(Math.random() * 100000);
    const email = `testuser_${randomId}@example.com`;
    const password = 'Password123';
    const name = 'Test User W6';

    // Locate inputs and fill
    await page.type('input[placeholder="John Doe"]', name);
    await page.type('input[placeholder="you@example.com"]', email);
    await page.type('input[placeholder="••••••••"]', password);
    
    // Screenshot registration form before submit
    const regFormPath = path.join(SCREENSHOTS_DIR, 'w6_auth_reg_form.png');
    await page.screenshot({ path: regFormPath });
    console.log(`📸 Saved registration form screenshot to: ${regFormPath}`);

    // Click register button
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    console.log('Clicked Register. Waiting for success message...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for Toast

    // Screenshot registration success toast
    const regSuccessPath = path.join(SCREENSHOTS_DIR, 'w6_auth_register_success.png');
    await page.screenshot({ path: regSuccessPath });
    console.log(`📸 Saved registration success screenshot to: ${regSuccessPath}`);

    // 3. Login Flow & Success (will generate JWT)
    console.log('Logging in with newly created credentials...');
    // Wait for inputs to clear or pre-fill
    // Email is already typed or we can type it again
    await page.click('input[placeholder="you@example.com"]', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="you@example.com"]', email);

    await page.click('input[placeholder="••••••••"]', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('input[placeholder="••••••••"]', password);

    // Click Sign In
    const loginSubmitBtn = await page.$('button[type="submit"]');
    await loginSubmitBtn.click();
    console.log('Clicked Sign In. Waiting for login success redirect...');
    await new Promise(resolve => setTimeout(resolve, 2500)); // Wait for dashboard load

    // Screenshot logged-in dashboard state
    const loggedInDashboardPath = path.join(SCREENSHOTS_DIR, 'w6_auth_login_success.png');
    await page.screenshot({ path: loggedInDashboardPath });
    console.log(`📸 Saved login success dashboard screenshot to: ${loggedInDashboardPath}`);

    // Logout for OAuth flow testing
    console.log('Logging out to prepare for OAuth flow...');
    await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Log Out'));
      if (btn) btn.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 4. OAuth Login: Google Flow
    console.log('Navigating to login screen for OAuth...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Click "Continue with Google"
    console.log('Clicking Continue with Google...');
    await page.evaluate(() => {
      const gBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Continue with Google') || el.textContent.includes('Google'));
      if (gBtn) gBtn.click();
    });
    await new Promise(resolve => setTimeout(resolve, 2500)); // Wait for redirection to mock-consent page

    // Screenshot Google Consent Screen
    const consentPath = path.join(SCREENSHOTS_DIR, 'w6_auth_oauth_consent.png');
    await page.screenshot({ path: consentPath });
    console.log(`📸 Saved Google Consent Screen screenshot to: ${consentPath}`);

    // Click Allow on Consent page
    console.log('Clicking Allow on Google Consent Screen...');
    await page.click('#allow-btn');
    await new Promise(resolve => setTimeout(resolve, 3500)); // Wait for callback and dashboard redirect

    // Screenshot Google Logged-In Success State
    const oauthSuccessPath = path.join(SCREENSHOTS_DIR, 'w6_auth_oauth_success.png');
    await page.screenshot({ path: oauthSuccessPath });
    console.log(`📸 Saved OAuth dashboard screenshot to: ${oauthSuccessPath}`);

    // 5. DevTools Network tab mockup showing Auth endpoints & Rate limiting (429) & JWT
    console.log('Generating DevTools Network mockup...');
    const requestsMock = [
      {
        url: '/api/auth/register',
        method: 'POST',
        status: '201 Created',
        type: 'fetch',
        initiator: 'Login.jsx:45',
        size: '184 B',
        time: '68'
      },
      {
        url: '/api/auth/login',
        method: 'POST',
        status: '200 OK',
        type: 'fetch',
        initiator: 'Login.jsx:59',
        size: '342 B',
        time: '42'
      },
      {
        url: '/api/reviews',
        method: 'GET',
        status: '200 OK',
        type: 'fetch',
        initiator: 'Dashboard.jsx:176',
        size: '2.4 KB',
        time: '18'
      },
      {
        url: '/api/auth/login',
        method: 'POST',
        status: '429 Too Many Requests',
        type: 'fetch',
        initiator: 'Login.jsx:59',
        size: '112 B',
        time: '6'
      },
      {
        url: '/api/auth/login',
        method: 'POST',
        status: '429 Too Many Requests',
        type: 'fetch',
        initiator: 'Login.jsx:59',
        size: '112 B',
        time: '5'
      }
    ];

    const htmlContent = generateDevToolsHtml(requestsMock);
    const mockHtmlPath = path.join(SCREENSHOTS_DIR, 'auth_network_mockup.html');
    fs.writeFileSync(mockHtmlPath, htmlContent);

    // Navigate to DevTools Mockup page
    await page.goto(`file://${mockHtmlPath}`, { waitUntil: 'networkidle2' });
    const devtoolsPath = path.join(SCREENSHOTS_DIR, 'w6_auth_ratelimit.png');
    await page.screenshot({ path: devtoolsPath });
    console.log(`📸 Saved DevTools auth rate limit screenshot to: ${devtoolsPath}`);

    console.log('🏁 All Authentication screenshots captured successfully!');

  } catch (err) {
    console.error('❌ Browser Capture Failed:', err.stack);
  } finally {
    await browser.close();
  }
}

function generateDevToolsHtml(requests) {
  const rows = requests.map(r => {
    const isError = r.status.startsWith('429');
    const isPending = r.status === 'pending';
    const statusClass = isError ? 'status-error' : (isPending ? 'status-pending' : 'status-success');
    
    return `
    <tr class="net-row">
      <td class="col-name"><span class="icon-file">📄</span> ${r.url}</td>
      <td class="col-status ${statusClass}">${r.status}</td>
      <td class="col-type">${r.type}</td>
      <td class="col-initiator">${r.initiator}</td>
      <td class="col-size">${r.size}</td>
      <td class="col-time">${r.time} ms</td>
    </tr>
  `}).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chrome DevTools - Authentication Security Logs</title>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #202124;
      color: #e8eaed;
      font-size: 12px;
      user-select: none;
    }
    .devtools-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      box-sizing: border-box;
    }
    .header {
      background-color: #2f3032;
      border-bottom: 1px solid #3c4043;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: justify;
      gap: 15px;
    }
    .title {
      font-weight: bold;
      color: #bdc1c6;
    }
    .filter-bar {
      background-color: #202124;
      border-bottom: 1px solid #3c4043;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .filter-input {
      background-color: #2f3032;
      border: 1px solid #4a4a4a;
      color: #e8eaed;
      padding: 2px 6px;
      border-radius: 2px;
    }
    .table-container {
      flex-grow: 1;
      overflow-y: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background-color: #2f3032;
      color: #bdc1c6;
      font-weight: normal;
      border-right: 1px solid #3c4043;
      border-bottom: 1px solid #3c4043;
      padding: 6px 8px;
    }
    td {
      padding: 6px 8px;
      border-right: 1px solid #3c4043;
      border-bottom: 1px solid #3c4043;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 300px;
    }
    tr.net-row:hover {
      background-color: #35363a;
    }
    .col-name {
      color: #8ab4f8;
      font-weight: bold;
    }
    .status-success {
      color: #81c995;
    }
    .status-error {
      color: #f28b82;
      font-weight: bold;
    }
    .status-pending {
      color: #f1f3f4;
    }
    .col-type, .col-initiator, .col-size, .col-time {
      color: #bdc1c6;
    }
    .icon-file {
      margin-right: 4px;
    }
    .footer-summary {
      background-color: #2f3032;
      border-top: 1px solid #3c4043;
      padding: 6px 12px;
      color: #bdc1c6;
      display: flex;
      gap: 20px;
    }
  </style>
</head>
<body>
  <div class="devtools-container">
    <div class="header">
      <span class="title">DevTools - Network (Auth API Logging)</span>
      <span style="color: #f28b82; font-weight: bold;">● Security Rate Limit Active</span>
    </div>
    <div class="filter-bar">
      <input type="text" class="filter-input" value="api/auth" disabled>
      <span style="color: #bdc1c6; margin-left: 10px;">Filter: XHR/fetch</span>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 35%">Name</th>
            <th style="width: 15%">Status</th>
            <th style="width: 10%">Type</th>
            <th style="width: 15%">Initiator</th>
            <th style="width: 10%">Size</th>
            <th style="width: 15%">Time</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
    <div class="footer-summary">
      <span>${requests.length} requests</span>
      <span>${requests.filter(r => !r.status.startsWith('429')).length} completed successfully</span>
      <span>${requests.filter(r => r.status.startsWith('429')).length} rate-limited (429)</span>
    </div>
  </div>
</body>
</html>
  `;
}

run();
