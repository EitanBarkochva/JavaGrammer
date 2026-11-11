/*
 * בונה קובץ Java אחד שמכיל את קוד התלמיד, את קוד העזר של השאלה ואת הבדיקות.
 * הקובץ משמש גם בדפדפן וגם בסקריפט הבדיקה (Node).
 */
(function (root) {
  'use strict';

  var T_CLASS = [
    'static final class T {',
    '  static int pass = 0, fail = 0;',
    '  static long ticks = 0;',
    '  static final StringBuilder LOG = new StringBuilder();',
    '  static void tick() { if (++ticks > 5000000L) throw new RuntimeException("נראה שיש לולאה אינסופית (יותר מדי איטרציות)"); }',
    '  static void line(String s) { LOG.append(s).append("\\n"); }',
    '  static String clean(String s) { return s.replace("\\n", " ").replace("|", "/"); }',
    '  static void ok(String label, boolean cond) { ok(label, cond, ""); }',
    '  static void ok(String label, boolean cond, String why) {',
    '    if (cond) { pass++; line("@@PASS|" + clean(label)); }',
    '    else { fail++; line("@@FAIL|" + clean(label) + "|" + clean(why)); }',
    '  }',
    '  static String show(Object o) {',
    '    if (o == null) return "null";',
    '    if (o instanceof String) return "\\"" + o + "\\"";',
    '    if (o instanceof Character) return "\'" + o + "\'";',
    '    if (o.getClass().isArray()) { String s = java.util.Arrays.deepToString(new Object[]{o}); return s.substring(1, s.length() - 1); }',
    '    return String.valueOf(o);',
    '  }',
    '  static boolean same(Object a, Object b) {',
    '    if (a instanceof Number && b instanceof Number) return ((Number) a).doubleValue() == ((Number) b).doubleValue();',
    '    return java.util.Arrays.deepEquals(new Object[]{a}, new Object[]{b});',
    '  }',
    '  static void eq(String label, Object expected, Object actual) {',
    '    ok(label, same(expected, actual), "ציפינו ל- " + show(expected) + " אבל התקבל " + show(actual));',
    '  }',
    '  static void err(String label, Throwable e) {',
    '    fail++;',
    '    String m = e.getMessage();',
    '    line("@@FAIL|" + clean(label) + "|" + clean("נזרקה חריגה: " + e.getClass().getSimpleName() + (m == null ? "" : " – " + m)));',
    '  }',
    '  static String[] capture(Runnable r) {',
    '    java.io.PrintStream old = System.out;',
    '    java.io.ByteArrayOutputStream buf = new java.io.ByteArrayOutputStream();',
    '    try { System.setOut(new java.io.PrintStream(buf, true, "UTF-8")); } catch (Exception ex) { throw new RuntimeException(ex); }',
    '    try { r.run(); } finally { System.setOut(old); }',
    '    String s;',
    '    try { s = buf.toString("UTF-8"); } catch (Exception ex) { s = buf.toString(); }',
    '    s = s.replace("\\r", "").trim();',
    '    return s.length() == 0 ? new String[0] : s.split("\\n");',
    '  }',
    '  static String dash(String s) { return s == null ? null : s.replace("\\u2013", "-").replace("\\u2014", "-"); }',
    '}'
  ].join('\n');

  // מוסיף T.tick() בתחילת גוף כל לולאה (for / while / do) עם סוגריים מסולסלים,
  // כדי שלולאה אינסופית תיעצר עם הודעה במקום לתקוע את הדפדפן.
  function guardLoops(code) {
    var out = '';
    var i = 0, n = code.length;
    var pending = false; // ראינו for/while/do ומחכים ל- {
    var depth = 0; // עומק סוגריים עגולים מאז מילת הלולאה
    while (i < n) {
      var c = code[i];
      // הערות ומחרוזות – מעתיקים כמו שהן
      if (c === '/' && code[i + 1] === '/') {
        var e = code.indexOf('\n', i); if (e < 0) e = n;
        out += code.slice(i, e); i = e; continue;
      }
      if (c === '/' && code[i + 1] === '*') {
        var e2 = code.indexOf('*/', i + 2); e2 = e2 < 0 ? n : e2 + 2;
        out += code.slice(i, e2); i = e2; continue;
      }
      if (c === '"' || c === "'") {
        var j = i + 1;
        while (j < n && code[j] !== c && code[j] !== '\n') { if (code[j] === '\\') j++; j++; }
        out += code.slice(i, j + 1); i = j + 1; continue;
      }
      if (/[A-Za-z_]/.test(c) && (i === 0 || !/[A-Za-z0-9_$]/.test(code[i - 1]))) {
        var m = /^[A-Za-z_][A-Za-z0-9_$]*/.exec(code.slice(i, i + 40));
        var w = m[0];
        if (w === 'for' || w === 'while') { pending = 'paren'; depth = 0; }
        else if (w === 'do') { pending = 'brace'; }
        out += w; i += w.length; continue;
      }
      if (pending === 'paren') {
        if (c === '(') depth++;
        else if (c === ')') { depth--; if (depth === 0) pending = 'brace'; }
        else if (c === ';' && depth === 0) pending = false; // do { } while (...);
        out += c; i++; continue;
      }
      if (pending === 'brace') {
        if (c === '{') { out += '{ T.tick();'; pending = false; i++; continue; }
        if (!/\s/.test(c)) pending = false;
      }
      out += c; i++;
    }
    return out;
  }

  // "public class X" / "class X" בקוד התלמיד הופכים למחלקה פנימית סטטית
  function nestClasses(code) {
    return code.replace(/(^|[\n;{}])([ \t]*)((?:public|private|protected)\s+)?((?:final|abstract)\s+)?class\s+/g,
      function (all, pre, ind, acc, mod) { return pre + ind + (mod || '') + 'static class '; });
  }

  function indent(s, pad) {
    return s.split('\n').map(function (l) { return l.length ? pad + l : l; }).join('\n');
  }

  function testsBlock(tests) {
    return tests.map(function (t) {
      var label = JSON.stringify(t[0]);
      return '    T.ticks = 0; try { ' + t[1] + ' } catch (Throwable e) { T.err(' + label + ', e); }';
    }).join('\n');
  }

  /**
   * q – אובייקט השאלה, code – קוד התלמיד, cls – שם המחלקה החיצונית.
   * מחזיר { source, studentStart, studentLines }
   */
  function build(q, code, cls) {
    var imports = [];
    var raw = code.replace(/\r/g, '').replace(/^[ \t]*import\s+(static\s+)?[\w.]+(\.\*)?\s*;[ \t]*$/gm, function (m) {
      imports.push(m.trim()); return '';
    });
    var student = guardLoops(nestClasses(raw));
    var parts = [];
    var header = (imports.length ? imports.join(' ') + '\n' : '') + 'public class ' + cls + ' {\n';
    parts.push(header);
    var studentStart = -1;
    function pushStudent(prefix, suffix) {
      var before = parts.join('') + prefix;
      var line = before.split('\n').length; // מספר השורה שבה מתחיל קוד התלמיד
      if (studentStart < 0) studentStart = line;
      parts.push(prefix + student + suffix);
    }

    if (q.variants) {
      // שאלות "טסטר": קוד התלמיד רץ מול כמה גרסאות של המחלקות (תקינה ושגויות)
      q.variants.forEach(function (v) {
        parts.push('static final class ' + v.name + ' {\n' + (q.common || '') + '\n' + v.support + '\n');
        pushStudent('static void run() {\n', '\n}\n');
        parts.push('}\n');
      });
    } else if (q.wrap) {
      var w = q.wrap.split('%%CODE%%');
      pushStudent(w[0], w[1]);
      parts.push('\n' + (q.support || '') + '\n');
    } else {
      pushStudent('', '\n');
      parts.push('\n' + (q.support || '') + '\n');
    }

    parts.push(T_CLASS + '\n');
    parts.push('static void runTests() {\n' + testsBlock(q.tests) + '\n}\n');
    parts.push([
      'public static void main(String[] args) throws Exception {',
      '  Thread th = new Thread(new Runnable() { public void run() {',
      '    try { runTests(); } catch (Throwable e) { T.err("הרצת הבדיקות", e); }',
      '  }});',
      '  th.setDaemon(true);',
      '  th.start();',
      '  th.join(15000);',
      '  if (th.isAlive()) T.line("@@TIMEOUT");',
      '  T.line("@@DONE|" + T.pass + "|" + T.fail);',
      '  String all = T.LOG.toString();',
      '  try { java.io.PrintStream ps = new java.io.PrintStream(new java.io.FileOutputStream(java.io.FileDescriptor.out), true, "UTF-8"); ps.print(all); ps.flush(); }',
      '  catch (Exception ex) { System.out.print(all); System.out.flush(); }',
      '  if (args.length > 0) {',
      '    try { java.io.Writer w = new java.io.OutputStreamWriter(new java.io.FileOutputStream(args[0]), "UTF-8"); w.write(all); w.close(); }',
      '    catch (Exception ex) { }',
      '  }',
      '}'
    ].join('\n') + '\n');
    parts.push('}\n');
    return {
      source: parts.join(''),
      studentStart: studentStart,
      studentLines: student.split('\n').length
    };
  }

  // מפענח את פלט הבדיקות
  function parseResults(text) {
    var res = { tests: [], done: false, timeout: false, pass: 0, fail: 0 };
    (text || '').split('\n').forEach(function (l) {
      l = l.trim();
      if (l.indexOf('@@PASS|') === 0) res.tests.push({ ok: true, label: l.slice(7) });
      else if (l.indexOf('@@FAIL|') === 0) {
        var p = l.slice(7).split('|');
        res.tests.push({ ok: false, label: p[0], why: p.slice(1).join('|') });
      } else if (l === '@@TIMEOUT') res.timeout = true;
      else if (l.indexOf('@@DONE|') === 0) {
        var d = l.split('|'); res.done = true; res.pass = +d[1]; res.fail = +d[2];
      }
    });
    return res;
  }

  // ממפה הודעות שגיאה של javac למספרי שורות בקוד התלמיד
  function mapErrors(log, info, fileName) {
    var lines = (log || '').replace(/\r/g, '').split('\n');
    var out = [];
    var re = new RegExp('^.*?' + fileName.replace('.', '\\.') + ':(\\d+): (?:error|שגיאה): (.*)$');
    for (var k = 0; k < lines.length; k++) {
      var m = re.exec(lines[k]);
      if (!m) continue;
      var ln = +m[1] - info.studentStart + 1;
      var inStudent = ln >= 1 && ln <= info.studentLines;
      out.push({ line: inStudent ? ln : null, msg: m[2], code: (lines[k + 1] || '').trim() });
    }
    return out;
  }

  var api = { build: build, parseResults: parseResults, mapErrors: mapErrors, guardLoops: guardLoops, nestClasses: nestClasses };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Harness = api;
})(this);
