// מריץ את כל הדוגמאות בדפי הלימוד, מוודא שהן מתקמפלות ורצות,
// ושומר את הפלט שלהן ב-data/learn-outputs.js (מוצג בדף עוד לפני הרצה).
// הרצה: node test/gen-outputs.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const Harness = require(path.join(root, 'harness.js'));
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of fs.readdirSync(path.join(root, 'data')).filter((f) => f.startsWith('learn-') && f !== 'learn-outputs.js')) {
  vm.runInContext(fs.readFileSync(path.join(root, 'data', f), 'utf8'), ctx);
}
const RUN_TEST = [['run', 'T.runOut(new Runnable() { public void run() { Main.main(new String[0]); } });']];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'learn-'));
const outputs = {};
let bad = 0;
for (const lesson of ctx.window.LESSONS) {
  for (const sec of lesson.sections) {
    sec.blocks.forEach((b, i) => {
      if (typeof b === 'string') return;
      const id = `${lesson.id}-${sec.id}-${i}`;
      const cls = 'L_' + id.replace(/\W/g, '_');
      const info = Harness.build({ tests: RUN_TEST }, b.run, cls);
      const dir = path.join(tmp, cls);
      fs.mkdirSync(dir);
      fs.writeFileSync(path.join(dir, cls + '.java'), info.source);
      try {
        execFileSync('javac', ['--release', '8', '-nowarn', '-encoding', 'UTF-8', '-d', dir, path.join(dir, cls + '.java')], { stdio: 'pipe' });
        const res = Harness.parseResults(execFileSync('java', ['-cp', dir, cls], { stdio: 'pipe' }).toString());
        if (!res.out.length || res.fail) { bad++; console.log('✘', id, 'no output'); }
        else console.log('✔', id, '–', res.out.length, 'lines');
        outputs[id] = res.out.join('\n');
      } catch (e) {
        bad++;
        console.log('✘', id, String(e.stderr).slice(0, 1500));
      }
    });
  }
}
fs.writeFileSync(path.join(root, 'data', 'learn-outputs.js'),
  '// נוצר אוטומטית על ידי test/gen-outputs.js – הפלט הצפוי של כל דוגמה\nwindow.LEARN_OUT = ' + JSON.stringify(outputs, null, 1) + ';\n');
console.log(bad ? `${bad} examples failed` : 'all examples OK');
process.exit(bad ? 1 : 0);
