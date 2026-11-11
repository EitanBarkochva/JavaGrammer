// בדיקת קצה-לקצה של האתר בדפדפן (Playwright), עם CheerpJ מדומה שמקמפל ב-javac מקומי.
// הרצה: node test/e2e.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-'));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jar': 'application/java-archive' };

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      const msg = JSON.parse(body);
      const dir = path.join(work, 'cp');
      fs.mkdirSync(dir, { recursive: true });
      let result = {};
      if (req.url === '/__javac') {
        const file = path.join(work, path.basename(msg.path));
        fs.writeFileSync(file, Buffer.from(msg.source, 'base64'));
        try {
          execFileSync('javac', ['--release', '8', '-encoding', 'UTF-8', '-nowarn', '-d', dir, file], { stdio: 'pipe' });
          result = { code: 0, log: '' };
        } catch (e) {
          // ממירים את הנתיב לנתיב בסגנון CheerpJ כמו שיופיע בדפדפן
          result = { code: 1, log: String(e.stderr).split(file).join(msg.path) };
        }
      } else if (req.url === '/__run') {
        try {
          result = { code: 0, out: execFileSync('java', ['-cp', dir, msg.cls], { stdio: 'pipe', timeout: 30000 }).toString() };
        } catch (e) { result = { code: 1, out: String(e.stdout) + String(e.stderr) }; }
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(result));
    });
    return;
  }
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0].split('#')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

const fakeCheerpJ = `
window.__files = {};
window.cheerpjInit = async () => {};
window.cheerpOSAddStringFile = (p, data) => { window.__files[p] = data; };
const b64 = (u8) => { let s = ''; u8.forEach((c) => (s += String.fromCharCode(c))); return btoa(s); };
window.cheerpjRunMain = async (cls, cp, ...args) => {
  if (cls === 'com.sun.tools.javac.Main') {
    if (!cp.endsWith('/lib/tools.jar') || !cp.startsWith('/app/')) throw new Error('bad tools.jar path ' + cp);
    const src = args[args.length - 1];
    const log = args[args.indexOf('-Xstdout') + 1];
    const r = await (await fetch('/__javac', { method: 'POST', body: JSON.stringify({ path: src, source: b64(window.__files[src]) }) })).json();
    window.__files[log] = new TextEncoder().encode(r.log);
    return r.code;
  }
  const r = await (await fetch('/__run', { method: 'POST', body: JSON.stringify({ cls }) })).json();
  window.__files[args[0]] = new TextEncoder().encode(r.out);
  return r.code;
};
window.cjFileBlob = async (p) => window.__files[p] ? new Blob([window.__files[p]]) : null;
`;

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('https://cjrtnc.leaningtech.com/**', (route) => route.fulfill({ contentType: 'text/javascript', body: fakeCheerpJ }));
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }));

  let failures = 0;
  const expect = (cond, msg) => { console.log((cond ? '✔ ' : '✘ ') + msg); if (!cond) failures++; };

  await page.goto(base);
  expect((await page.locator('.card').count()) === 6, 'דף הבית מציג 5 מבחנים וכרטיס תרגול');
  await page.screenshot({ path: path.join(work, 'home.png') });

  // מבחן מועד א: פתרון שגוי ואז נכון
  await page.goto(base + '#/z2026');
  await page.waitForSelector('#z2026-2a textarea');
  const ta = page.locator('#z2026-2a textarea');
  await ta.fill('public static int busyRunLength(int[] cars, int stIdx, int minCars) {\n  int len = 0;\n  for (int i = stIdx; i < cars.length; i++) if (cars[i] >= minCars) len++;\n  return len;\n}');
  await page.click('#z2026-2a .btn.primary');
  await page.waitForSelector('#z2026-2a .result.bad, #z2026-2a .result.good', { timeout: 60000 });
  const wrongText = await page.locator('#z2026-2a .result').innerText();
  expect(/עברו \d+ מתוך \d+/.test(wrongText), 'פתרון שגוי מקבל רשימת בדיקות שנכשלו');

  await ta.fill('public static int busyRunLength(int[] cars, int stIdx, int minCars) {\n  int len = 0;\n  while (stIdx + len < cars.length && cars[stIdx + len] >= minCars) len++;\n  return len;\n}');
  await page.click('#z2026-2a .btn.primary');
  await page.waitForFunction(() => /כל הבדיקות עברו/.test(document.querySelector('#z2026-2a .result').innerText), null, { timeout: 60000 });
  expect(true, 'פתרון נכון עובר את כל הבדיקות');

  // שגיאת קומפילציה עם מספר שורה
  await ta.fill('public static int busyRunLength(int[] cars, int stIdx, int minCars) {\n  int len = 0\n  return len;\n}');
  await page.click('#z2026-2a .btn.primary');
  await page.waitForFunction(() => /קומפילציה/.test(document.querySelector('#z2026-2a .result').innerText), null, { timeout: 60000 });
  const ce = await page.locator('#z2026-2a .result').innerText();
  expect(/Line 2/.test(ce), 'שגיאת קומפילציה מוצגת עם מספר השורה בקוד התלמיד (' + ce.split('\n')[1] + ')');

  // לולאה אינסופית נעצרת
  await ta.fill('public static int busyRunLength(int[] cars, int stIdx, int minCars) {\n  int len = 0;\n  while (true) { len++; }\n}');
  await page.click('#z2026-2a .btn.primary');
  await page.waitForSelector('#z2026-2a .result.bad', { timeout: 60000 });
  const inf = await page.locator('#z2026-2a .result').innerText();
  expect(/לולאה אינסופית/.test(inf), 'לולאה אינסופית מזוהה: ' + inf.slice(0, 300));

  // שאלת טקסט
  await page.fill('#z2026-4a input, #z2026-4a textarea', 'RGB');
  await page.click('#z2026-4a .btn.primary');
  expect(/נכון/.test(await page.locator('#z2026-4a .result').innerText()), 'שאלת מעקב: תשובה נכונה מתקבלת');
  await page.fill('#z2026-4b textarea', 'Java sharp has Tea');
  await page.click('#z2026-4b .btn.primary');
  expect(/נכון/.test(await page.locator('#z2026-4b .result').innerText()), 'שאלת קלט עם תשובות רבות נבדקת בהרצה');

  // הצגת פתרון
  await page.click('#z2026-1a .btn:not(.primary):not(.ghost)');
  expect(await page.locator('#z2026-1a .solution pre').isVisible(), 'כפתור הצג פתרון עובד');

  // שאלת טסטר (גרסאות שגויות)
  await page.goto(base + '#/d02');
  await page.waitForSelector('#d02-1c textarea');
  const sol = await page.evaluate(() => window.EXAMS.find((e) => e.id === 'd02').questions[0].parts[2].solution);
  await page.locator('#d02-1c textarea').fill(sol);
  await page.click('#d02-1c .btn.primary');
  await page.waitForFunction(() => /כל הבדיקות עברו/.test(document.querySelector('#d02-1c .result').innerText), null, { timeout: 60000 });
  expect(true, 'שאלת טסטר: הפתרון עובר');

  // הניקוד מתעדכן ונשמר אחרי רענון
  await page.goto(base + '#/z2026');
  await page.reload();
  await page.waitForSelector('.score');
  const score = await page.locator('.score').innerText();
  expect(/^10 \/ 100/.test(score.trim()), 'הניקוד נשמר אחרי רענון: ' + score);
  await page.screenshot({ path: path.join(work, 'exam.png'), fullPage: false });

  // כרטיסיית תרגול לולאות ומערכים
  await page.click('.tabs a[data-tab="loops"]');
  await page.waitForSelector('#loops-10 textarea');
  expect((await page.locator('.question').count()) === 10, 'בכרטיסיית התרגול יש 10 תרגילים');
  await page.locator('#loops-1 textarea').fill('public static int sum(int[] a) {\n  int s = 0;\n  for (int x : a) s += x;\n  return s;\n}');
  await page.click('#loops-1 .btn.primary');
  await page.waitForFunction(() => /כל הבדיקות עברו/.test(document.querySelector('#loops-1 .result').innerText), null, { timeout: 60000 });
  expect(/פתרתם 1 מתוך 10/.test(await page.locator('.score').innerText()), 'תרגיל 1 נפתר והמונה מתעדכן');
  await page.screenshot({ path: path.join(work, 'loops.png') });

  // מובייל – בלי גלילה אופקית
  const m = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await m.route('https://cjrtnc.leaningtech.com/**', (route) => route.fulfill({ contentType: 'text/javascript', body: fakeCheerpJ }));
  await m.goto(base + '#/m02');
  await m.waitForSelector('.part');
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow <= 0, 'אין גלילה אופקית במובייל (' + overflow + ')');
  await m.screenshot({ path: path.join(work, 'mobile.png') });

  expect(errors.length === 0, 'אין שגיאות JavaScript בדף ' + errors.join(' | '));
  console.log('screenshots in', work);
  await browser.close();
  server.close();
  process.exit(failures ? 1 : 0);
})();
