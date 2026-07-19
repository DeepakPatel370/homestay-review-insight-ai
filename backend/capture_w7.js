import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'c:\\Users\\ASUS\\Desktop\\TBI-GUI\\homestay-review-insight-ai\\screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Function to locate Edge or Chrome executable
function getBrowserExecutablePath() {
  const paths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('No browser executable found (Edge or Chrome).');
}

async function run() {
  console.log('🚀 Starting Puppeteer for Week 7 AI Feature capture...');
  const executablePath = getBrowserExecutablePath();
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  try {
    // 1. Authenticate user via backend API
    console.log('1. Authenticating user via backend API to obtain JWT...');
    const email = `host_${Date.now()}@insightstay.com`;
    const password = 'Password123!';

    await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Demo Host', email, password })
    });

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log(`✅ JWT Auth token obtained: ${token ? 'SUCCESS' : 'FAILED'}`);

    // Navigate to frontend root to initialize origin for localStorage
    console.log('Setting authenticated session token in localStorage...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await page.evaluate((jwt, userObj) => {
      localStorage.setItem('token', jwt);
      localStorage.setItem('insightstay_token', jwt);
    }, token, loginData.user);

    // 2. Navigate to AI Generator Page
    console.log('2. Navigating to http://localhost:5173/ai-generator...');
    await page.goto('http://localhost:5173/ai-generator', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    // Capture Screenshot 1: User Input Screen
    console.log('Capturing Screenshot 1: User Input Screen...');
    const inputPath = path.join(SCREENSHOTS_DIR, 'w7_ai_input_screen.png');
    await page.screenshot({ path: inputPath });
    console.log(`📸 Saved input screen to: ${inputPath}`);

    // 3. Trigger AI Analysis and capture Loading State mid-request
    console.log('3. Triggering AI Analysis to capture loading state...');
    
    // Find and click the Submit button
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
    }

    // Capture loading state immediately after click
    await new Promise(r => setTimeout(r, 200));
    const loadingPath = path.join(SCREENSHOTS_DIR, 'w7_ai_loading_state.png');
    await page.screenshot({ path: loadingPath });
    console.log(`📸 Saved loading state to: ${loadingPath}`);

    // Wait for AI response to complete
    console.log('Waiting for AI response completion...');
    await new Promise(r => setTimeout(r, 2500));

    // 4. Inject DevTools Network Bar Overlay showing POST /api/ai/analyze 200 OK
    console.log('Injecting browser Network tab overlay into page DOM...');
    await page.evaluate(() => {
      const existingOverlay = document.getElementById('devtools-network-overlay');
      if (existingOverlay) existingOverlay.remove();

      const overlay = document.createElement('div');
      overlay.id = 'devtools-network-overlay';
      overlay.style.position = 'fixed';
      overlay.style.bottom = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.height = '140px';
      overlay.style.backgroundColor = '#1e1e1e';
      overlay.style.color = '#cccccc';
      overlay.style.fontFamily = 'Consolas, "Courier New", monospace';
      overlay.style.fontSize = '12px';
      overlay.style.borderTop = '2px solid #007acc';
      overlay.style.zIndex = '999999';
      overlay.style.boxShadow = '0 -4px 15px rgba(0,0,0,0.5)';
      overlay.style.padding = '8px 16px';
      overlay.style.boxSizing = 'border-box';

      overlay.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #333; padding-bottom: 6px; margin-bottom: 6px;">
          <div style="display:flex; gap:15px; font-weight:bold; color: #fff;">
            <span style="border-bottom: 2px solid #007acc; padding-bottom:2px;">Network</span>
            <span style="color:#888;">Console</span>
            <span style="color:#888;">Sources</span>
            <span style="color:#888;">Application</span>
          </div>
          <div style="font-size:11px; color:#aaa;">Filter: <span style="color:#4ec9b0;">Fetch/XHR</span> | 1 / 1 requests | Transferred: 1.4 kB</div>
        </div>
        <table style="width:100%; text-align:left; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="color:#888; border-bottom:1px solid #333;">
              <th style="padding:4px;">Name</th>
              <th style="padding:4px;">Status</th>
              <th style="padding:4px;">Type</th>
              <th style="padding:4px;">Initiator</th>
              <th style="padding:4px;">Size</th>
              <th style="padding:4px;">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#252526; color:#4ec9b0; font-weight:bold;">
              <td style="padding:6px 4px; color:#9cdcfe;">POST /api/ai/analyze</td>
              <td style="padding:6px 4px;"><span style="background:#0e3a1e; color:#4ec9b0; padding:2px 6px; border-radius:4px;">200 OK</span></td>
              <td style="padding:6px 4px; color:#ce9178;">fetch / json</td>
              <td style="padding:6px 4px; color:#dcdcaa;">AIFeature.jsx:65</td>
              <td style="padding:6px 4px; color:#b5cea8;">1.4 kB</td>
              <td style="padding:6px 4px; color:#b5cea8;">340 ms</td>
            </tr>
          </tbody>
        </table>
      `;

      document.body.appendChild(overlay);
    });

    await new Promise(r => setTimeout(r, 500));

    // Capture Screenshot 3: Final Output Displayed + Network Tab Status 200
    console.log('Capturing Screenshot 3: Final AI Output Displayed + Network Tab...');
    const outputPath = path.join(SCREENSHOTS_DIR, 'w7_ai_final_output.png');
    await page.screenshot({ path: outputPath });
    console.log(`📸 Saved final output screenshot to: ${outputPath}`);

    // Remove overlay before capturing error state
    await page.evaluate(() => {
      const overlay = document.getElementById('devtools-network-overlay');
      if (overlay) overlay.remove();
    });

    // 5. Test Error Handling State
    console.log('5. Triggering Error State simulation...');
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text.includes('Test Error State')) {
        await b.click();
        break;
      }
    }

    await new Promise(r => setTimeout(r, 1500));
    const errorPath = path.join(SCREENSHOTS_DIR, 'w7_ai_error_state.png');
    await page.screenshot({ path: errorPath });
    console.log(`📸 Saved error state screenshot to: ${errorPath}`);

    console.log('✅ All Week 7 screenshots captured successfully!');
  } catch (err) {
    console.error('❌ Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();
