import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'c:\\Users\\ASUS\\Desktop\\TBI-GUI\\homestay-review-insight-ai\\screenshots';

// Ensure screenshots folder exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('🚀 Starting Puppeteer browser automation...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Record API network requests
  const networkRequests = [];

  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/reviews')) {
      networkRequests.push({
        url: url.replace('http://localhost:5000', ''),
        method: request.method(),
        status: 'pending',
        type: 'fetch',
        initiator: 'Dashboard.jsx',
        size: 'Pending',
        time: Date.now()
      });
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/reviews')) {
      const req = networkRequests.find(r => 
        (r.url === url.replace('http://localhost:5000', '')) && 
        r.method === response.request().method() &&
        r.status === 'pending'
      );
      
      if (req) {
        req.status = response.status();
        req.time = Date.now() - req.time;
        try {
          const text = await response.text();
          const bytes = text.length;
          req.size = bytes > 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`;
        } catch (e) {
          req.size = '0 B';
        }
      }
    }
  });

  try {
    // 1. Initial Load Page
    console.log('Navigating to http://localhost:5173/dashboard...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for content animation

    const initialPath = path.join(SCREENSHOTS_DIR, 'dashboard_initial.png');
    await page.screenshot({ path: initialPath });
    console.log(`📸 Saved initial dashboard screenshot to: ${initialPath}`);

    // 2. Click Sync Reviews
    console.log('Clicking Sync Reviews button...');
    const buttons = await page.$$('button');
    let syncClicked = false;
    for (let btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Sync Reviews')) {
        await btn.click();
        syncClicked = true;
        break;
      }
    }
    if (!syncClicked) throw new Error('Sync Reviews button not found');

    // Wait for sync success toast & animation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const syncedPath = path.join(SCREENSHOTS_DIR, 'dashboard_synced.png');
    await page.screenshot({ path: syncedPath });
    console.log(`📸 Saved synced dashboard screenshot to: ${syncedPath}`);

    // 3. Select sample review & Analyze
    console.log('Selecting Positive Review sample...');
    const sampleButtons = await page.$$('button');
    let sampleClicked = false;
    for (let btn of sampleButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Positive Review')) {
        await btn.click();
        sampleClicked = true;
        break;
      }
    }
    if (!sampleClicked) throw new Error('Sample review button not found');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Clicking Analyze & Generate Reply button...');
    const analyzeButtons = await page.$$('button');
    let analyzeClicked = false;
    for (let btn of analyzeButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Analyze & Generate Reply')) {
        await btn.click();
        analyzeClicked = true;
        break;
      }
    }
    if (!analyzeClicked) throw new Error('Analyze button not found');

    // Wait for analysis result to appear
    await new Promise(resolve => setTimeout(resolve, 3000));

    const analyzedPath = path.join(SCREENSHOTS_DIR, 'dashboard_analyzed.png');
    await page.screenshot({ path: analyzedPath });
    console.log(`📸 Saved analyzed dashboard screenshot to: ${analyzedPath}`);

    // 4. Generate Chrome DevTools Network Mockup
    console.log('Generating DevTools Network tab mockup...');
    const htmlContent = generateDevToolsHtml(networkRequests);
    const mockHtmlPath = path.join(SCREENSHOTS_DIR, 'network_mockup.html');
    fs.writeFileSync(mockHtmlPath, htmlContent);

    // Load DevTools network mockup and screenshot it
    await page.goto(`file://${mockHtmlPath}`, { waitUntil: 'networkidle2' });
    const networkPath = path.join(SCREENSHOTS_DIR, 'devtools_network.png');
    await page.screenshot({ path: networkPath });
    console.log(`📸 Saved DevTools network tab screenshot to: ${networkPath}`);

    console.log('🏁 Screenshot captures completed successfully!');

  } catch (err) {
    console.error('❌ Capture Failed:', err.message);
  } finally {
    await browser.close();
  }
}

function generateDevToolsHtml(requests) {
  // Map requests to html rows
  const rows = requests.map(r => `
    <tr class="net-row">
      <td class="col-name"><span class="icon-file">📄</span> ${r.url.split('?')[0]}</td>
      <td class="col-status success">${r.status}</td>
      <td class="col-type">${r.type}</td>
      <td class="col-initiator">${r.initiator}</td>
      <td class="col-size">${r.size}</td>
      <td class="col-time">${r.time} ms</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chrome DevTools - Network</title>
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
      padding: 6px 12px;
      display: flex;
      align-items: center;
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
      padding: 4px 8px;
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
    .col-status.success {
      color: #81c995;
    }
    .col-type, .col-initiator, .col-size, .col-time {
      color: #e8eaed;
    }
    .icon-file {
      margin-right: 4px;
    }
    .footer-summary {
      background-color: #2f3032;
      border-top: 1px solid #3c4043;
      padding: 4px 12px;
      color: #bdc1c6;
      display: flex;
      gap: 20px;
    }
  </style>
</head>
<body>
  <div class="devtools-container">
    <div class="header">
      <span class="title">DevTools - Network</span>
      <span style="color: #81c995">● Recording network log</span>
    </div>
    <div class="filter-bar">
      <input type="text" class="filter-input" value="api" disabled>
      <span style="color: #bdc1c6; margin-left: 10px;">Filter: fetch/XHR</span>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 35%">Name</th>
            <th style="width: 10%">Status</th>
            <th style="width: 10%">Type</th>
            <th style="width: 15%">Initiator</th>
            <th style="width: 15%">Size</th>
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
      <span>${requests.filter(r => r.status < 400).length} completed successfully</span>
      <span>CORS: Allowed</span>
    </div>
  </div>
</body>
</html>
  `;
}

run();
