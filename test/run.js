// מוודא שכל פתרון לדוגמה עובר את כל הבדיקות, ושהקוד ההתחלתי לא עובר.
// הרצה: node test/run.js [part-id-filter]
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const vm = require('vm');

const root = path.join(__dirname, '..');
const Harness = require(path.join(root, 'harness.js'));
const Checks = require(path.join(root, 'checks.js'));

const ctx = { window: {}, Checks };
vm.createContext(ctx);
for (const f of fs.readdirSync(path.join(root, 'data')).sort()) {
  vm.runInContext(fs.readFileSync(path.join(root, 'data', f), 'utf8'), ctx, { filename: f });
}
const exams = ctx.window.EXAMS;
const filter = process.argv[2] || '';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jtest-'));
let bad = 0, count = 0;

function runJava(part, code, tag) {
  const cls = 'Run_' + part.id.replace(/\W/g, '_') + '_' + tag;
  const info = Harness.build(part, code, cls);
  const dir = path.join(tmp, cls);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, cls + '.java');
  fs.writeFileSync(file, info.source);
  try {
    execFileSync('javac', ['--release', '8', '-nowarn', '-encoding', 'UTF-8', '-d', dir, file], { stdio: 'pipe' });
  } catch (e) {
    const log = String(e.stderr || '') + String(e.stdout || '');
    return { compileError: true, log, errors: Harness.mapErrors(log, info, cls + '.java'), info };
  }
  const out = execFileSync('java', ['-cp', dir, cls], { stdio: 'pipe', timeout: 30000 }).toString();
  return { res: Harness.parseResults(out), out, info };
}

for (const exam of exams) for (const q of exam.questions) for (const part of q.parts) {
  if (filter && !part.id.includes(filter)) continue;
  count++;
  if (part.type === 'text') {
    const r = part.check(part.testAnswer || part.solution);
    if (!r.ok) { bad++; console.log('✘', part.id, 'solution rejected:', r.msg); }
    else console.log('✔', part.id);
    if (part.check(part.starterAnswer || 'xyz').ok) { bad++; console.log('✘', part.id, 'accepts junk'); }
    continue;
  }
  if (part.type === 'static') {
    const r = part.check(part.solution);
    if (!r.ok) { bad++; console.log('✘', part.id, r.msg); } else console.log('✔', part.id);
    if (part.check(part.starter).ok) { bad++; console.log('✘', part.id, 'starter accepted'); }
    continue;
  }
  for (const sc of part.sourceChecks || []) {
    if (!sc.re.test(part.solution)) { bad++; console.log('✘', part.id, 'sourceCheck fails on solution:', sc.label); }
  }
  const sol = runJava(part, part.solution, 'sol');
  if (sol.compileError) {
    bad++; console.log('✘', part.id, 'solution does not compile\n', sol.log.slice(0, 2500));
    continue;
  }
  const r = sol.res;
  if (!r.done || r.fail || r.timeout || r.pass === 0) {
    bad++; console.log('✘', part.id, 'solution fails tests:\n', sol.out);
  } else console.log('✔', part.id, `(${r.pass} checks)`);
  const st = runJava(part, part.starter, 'start');
  if (!st.compileError && st.res.fail === 0 && st.res.done) {
    bad++; console.log('✘', part.id, 'starter passes all tests!');
  }
  for (const [i, w] of (part.wrong || []).entries()) {
    const wr = runJava(part, w, 'wrong' + i);
    if (!wr.compileError && wr.res.fail === 0) { bad++; console.log('✘', part.id, 'wrong answer #' + i + ' passes'); }
  }
}
console.log(`\n${count - bad}/${count} parts OK`);
process.exit(bad ? 1 : 0);
