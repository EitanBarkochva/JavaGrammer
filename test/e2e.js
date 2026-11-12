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


// Firebase מדומה (בזיכרון של הדף) – מממש רק את מה ש-auth.js משתמש בו, כולל כלל המורים המאושרים
const fakeApp = `export function initializeApp(c) { return { c }; }`;
const fakeAuth = `
const S = window.__fb = window.__fb || { users: {}, cur: null, cbs: [], docs: {}, teacherEmails: { 'teacher@school.org': true } };
const fire = () => S.cbs.forEach((f) => f(S.cur));
const err = (code) => { const e = new Error(code); e.code = code; return e; };
export function getAuth() { return {}; }
export function onAuthStateChanged(a, cb) { S.cbs.push(cb); setTimeout(() => cb(S.cur), 0); }
export async function createUserWithEmailAndPassword(a, email, pass) {
  email = email.toLowerCase();
  if (S.users[email]) throw err('auth/email-already-in-use');
  if (pass.length < 6) throw err('auth/weak-password');
  const user = { uid: 'u' + Object.keys(S.users).length, email, async delete() { delete S.users[email]; S.cur = null; fire(); } };
  S.users[email] = { pass, user };
  S.cur = user; fire();
  return { user };
}
export async function signInWithEmailAndPassword(a, email, pass) {
  const u = S.users[email.toLowerCase()];
  if (!u || u.pass !== pass) throw err('auth/invalid-credential');
  S.cur = u.user; fire(); return { user: u.user };
}
export async function signOut() { S.cur = null; fire(); }
export async function updateProfile() {}
export async function sendPasswordResetEmail() {}
`;
const fakeStore = `
const S = window.__fb = window.__fb || { users: {}, cur: null, cbs: [], docs: {}, teacherEmails: { 'teacher@school.org': true } };
const err = (code) => { const e = new Error(code); e.code = code; return e; };
export function getFirestore() { return {}; }
export function doc(db, col, id) { return { col, id }; }
export function collection(db, col) { return { col }; }
export function where(f, op, v) { return { f, v }; }
export function query(c, w) { return { col: c.col, w }; }
export function serverTimestamp() { const t = new Date(Date.now() + (S.tick = (S.tick || 0) + 1)); return { toDate: () => t }; }
export async function setDoc(ref, data) {
  if (ref.col === 'users' && data.role === 'teacher' && !S.teacherEmails[S.cur.email]) throw err('permission-denied');
  S.docs[ref.col + '/' + ref.id] = data;
}
let n = 0;
export async function addDoc(c, data) {
  if (c.col === 'attempts' && (!S.cur || data.uid !== S.cur.uid)) throw err('permission-denied');
  S.docs[c.col + '/a' + (n++)] = data;
}
export async function getDoc(ref) { const d = S.docs[ref.col + '/' + ref.id]; return { exists: () => !!d, data: () => d, id: ref.id }; }
export async function getDocs(q) {
  const out = Object.keys(S.docs).filter((k) => k.startsWith(q.col + '/') && S.docs[k][q.w.f] === q.w.v)
    .map((k) => ({ id: k.split('/')[1], data: () => S.docs[k] }));
  return { docs: out };
}
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
  expect((await page.locator('.card').count()) === 9, 'דף הבית מציג 2 כרטיסי לימוד, 2 תרגול ו-5 מבחנים');
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

  // דף לימוד – הרצת דוגמה ששונתה
  await page.click('.tabs a[data-tab="learn-loops"]');
  await page.waitForSelector('.lesson .example textarea');
  const firstOut = await page.locator('.example pre.output').first().innerText();
  expect(/i = 1/.test(firstOut), 'הפלט הצפוי מוצג לפני הרצה');
  await page.locator('.example textarea').first().fill('public class Main {\n  public static void main(String[] args) {\n    for (int i = 0; i < 3; i++) System.out.println("שלום " + i);\n  }\n}');
  await page.locator('.example .btn.primary').first().click();
  await page.waitForFunction(() => /שלום 2/.test(document.querySelector('.example pre.output').innerText), null, { timeout: 60000 });
  expect(true, 'דוגמה ששונתה רצה ומציגה את הפלט החדש');
  await page.click('.tabs a[data-tab="learn-oop"]');
  await page.waitForSelector('#aliasing');
  expect((await page.locator('.lesson').count()) >= 10, 'דף לימוד מחלקות מוצג');
  await page.screenshot({ path: path.join(work, 'learn.png') });
  await page.click('.tabs a[data-tab="oop"]');
  await page.waitForSelector('#oop-10 textarea');
  expect((await page.locator('.question').count()) === 10, 'בתרגול מחלקות יש 10 תרגילים');

  // מובייל – בלי גלילה אופקית
  const m = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await m.route('https://cjrtnc.leaningtech.com/**', (route) => route.fulfill({ contentType: 'text/javascript', body: fakeCheerpJ }));
  await m.goto(base + '#/learn-oop');
  await m.waitForSelector('.lesson');
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow <= 0, 'אין גלילה אופקית במובייל (' + overflow + ')');
  await m.screenshot({ path: path.join(work, 'mobile.png') });


  // ---------- הרשמה והתחברות (Firebase מדומה) ----------
  const ap = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  ap.on('pageerror', (e) => errors.push(e.message));
  await ap.route('https://cjrtnc.leaningtech.com/**', (route) => route.fulfill({ contentType: 'text/javascript', body: fakeCheerpJ }));
  await ap.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }));
  await ap.route('https://www.gstatic.com/firebasejs/**/firebase-app.js', (r) => r.fulfill({ contentType: 'text/javascript', body: fakeApp }));
  await ap.route('https://www.gstatic.com/firebasejs/**/firebase-auth.js', (r) => r.fulfill({ contentType: 'text/javascript', body: fakeAuth }));
  await ap.route('https://www.gstatic.com/firebasejs/**/firebase-firestore.js', (r) => r.fulfill({ contentType: 'text/javascript', body: fakeStore }));
  await ap.route('**/firebase-config.js', (r) => r.fulfill({ contentType: 'text/javascript', body: 'window.FIREBASE_CONFIG = { apiKey: "x", projectId: "p" };' }));
  await ap.goto(base + '#/login');
  await ap.waitForSelector('.auth-form');
  await ap.click('.auth-tabs button:nth-child(2)');
  await ap.fill('.field:nth-of-type(1) input', 'נועה תלמידה');
  await ap.fill('input[type=email]', 'noa@school.org');
  await ap.fill('input[autocomplete=new-password] >> nth=0', 'secret1');
  await ap.locator('input[type=password]').nth(1).fill('secret1');
  await ap.click('.auth-form button[type=submit]');
  await ap.waitForSelector('.userbox .role.student');
  expect(/נועה/.test(await ap.locator('.userbox').innerText()), 'הרשמת תלמיד: השם וסוג המשתמש מוצגים בכותרת');
  // התלמיד פותר תרגיל – ההתקדמות נשמרת ב-Firebase
  await ap.goto(base + '#/loops');
  await ap.waitForSelector('#loops-1 textarea');
  // ניסיון שגוי (שגיאת קומפילציה) וצפייה בפתרון – נרשמים ביומן
  await ap.locator('#loops-1 textarea').fill('public static int sum(int[] a) {\n  int s = 0\n  return s;\n}');
  await ap.click('#loops-1 .btn.primary');
  await ap.waitForFunction(() => /קומפילציה/.test(document.querySelector('#loops-1 .result').innerText), null, { timeout: 60000 });
  await ap.click('#loops-1 .actions .btn:nth-child(2)');
  await ap.click('#loops-1 .actions .btn:nth-child(2)');
  await ap.locator('#loops-1 textarea').fill('public static int sum(int[] a) {\n  int s = 0;\n  for (int x : a) s += x;\n  return s;\n}');
  await ap.click('#loops-1 .btn.primary');
  await ap.waitForFunction(() => /כל הבדיקות עברו/.test(document.querySelector('#loops-1 .result').innerText), null, { timeout: 60000 });
  await ap.waitForFunction(() => window.__fb.docs['progress/u0'], null, { timeout: 5000 });
  expect(true, 'ההתקדמות של התלמיד נשמרה ב-Firestore');
  await ap.click('.userbox button');
  await ap.waitForSelector('.auth-form');
  // מורה בלי אישור – נדחה
  await ap.click('.auth-tabs button:nth-child(2)');
  await ap.fill('.field:nth-of-type(1) input', 'מורה מזויף');
  await ap.fill('input[type=email]', 'fake@school.org');
  await ap.locator('input[type=password]').nth(0).fill('secret1');
  await ap.locator('input[type=password]').nth(1).fill('secret1');
  await ap.check('input[value=teacher]');
  await ap.click('.auth-form button[type=submit]');
  await ap.waitForSelector('.auth-msg.bad');
  expect(/רק לאימייל שאושר מראש/.test(await ap.locator('.auth-msg').innerText()), 'הרשמה כמורה בלי אישור נדחית');
  // מורה מאושר
  await ap.fill('.field:nth-of-type(1) input', 'המורה דנה');
  await ap.fill('input[type=email]', 'teacher@school.org');
  await ap.click('.auth-form button[type=submit]');
  await ap.waitForSelector('table.students', { timeout: 10000 });
  const row = await ap.locator('table.students tbody tr').first().innerText();
  expect(/נועה/.test(row) && /1\/10/.test(row), 'דף המורה מציג את התלמיד וההתקדמות שלו: ' + row.replace(/\s+/g, ' ').slice(0, 120));
  await ap.screenshot({ path: path.join(work, 'teacher.png') });
  // יומן הלחיצות של התלמיד
  await ap.click('table.students tbody tr a');
  await ap.waitForSelector('table.log tbody tr', { timeout: 10000 });
  const logRows = await ap.locator('table.log tbody tr').allInnerTexts();
  expect(logRows.length === 3, 'ביומן יש 3 לחיצות (קומפילציה, פתרון, נכון): ' + logRows.length);
  expect(/נכון/.test(logRows[0]) && /פתרון/.test(logRows[1]) && /קומפילציה/.test(logRows[2]), 'סדר הלחיצות והתוצאות ביומן נכונים');
  await ap.locator('table.log details summary').last().click();
  expect(/Line 2/.test(await ap.locator('table.log').innerText()), 'השגיאות נשמרו עם מספר שורה');
  await ap.check('.log-filter input[type=checkbox]');
  expect((await ap.locator('table.log tbody tr').count()) === 1, 'סינון "רק לא נכונות" עובד');
  expect(/נועה/.test(await ap.locator('.exam-head h1').innerText()), 'שם התלמיד בכותרת היומן');
  await ap.screenshot({ path: path.join(work, 'student-log.png'), fullPage: true });
  await ap.click('.userbox button');
  await ap.waitForSelector('.auth-form');
  await ap.fill('input[type=email]', 'noa@school.org');
  await ap.locator('input[type=password]').nth(0).fill('wrong!!');
  await ap.click('.auth-form button[type=submit]');
  await ap.waitForSelector('.auth-msg.bad');
  expect(/שגויים/.test(await ap.locator('.auth-msg').innerText()), 'סיסמה שגויה מציגה הודעה בעברית');
  await ap.locator('input[type=password]').nth(0).fill('secret1');
  await ap.click('.auth-form button[type=submit]');
  await ap.waitForSelector('.userbox .role.student');
  expect(true, 'התחברות מחדש של התלמיד עובדת');
  await ap.goto(base + '#/login');
  await ap.click('.userbox button');
  await ap.waitForSelector('.auth-form');
  await ap.screenshot({ path: path.join(work, 'login.png') });

  expect(errors.length === 0, 'אין שגיאות JavaScript בדף ' + errors.join(' | '));
  console.log('screenshots in', work);
  await browser.close();
  server.close();
  process.exit(failures ? 1 : 0);
})();
