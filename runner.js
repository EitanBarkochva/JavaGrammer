/*
 * מריץ Java בדפדפן בעזרת CheerpJ (JVM של OpenJDK 8 ב-WebAssembly),
 * ומקמפל עם javac מתוך tools.jar של OpenJDK 8 (נמצא בתיקייה lib).
 */
(function (root) {
  'use strict';
  var CHEERPJ_URL = 'https://cjrtnc.leaningtech.com/3.0/cj3loader.js';
  var readyPromise = null;
  var queue = Promise.resolve();
  var listeners = [];
  var state = 'idle'; // idle | loading | ready | error

  function setState(s, msg) {
    state = s;
    listeners.forEach(function (fn) { fn(s, msg); });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('טעינת ' + src + ' נכשלה')); };
      document.head.appendChild(s);
    });
  }

  function consoleEl() {
    var el = document.getElementById('console');
    if (!el) {
      el = document.createElement('pre');
      el.id = 'console';
      el.hidden = true;
      document.body.appendChild(el);
    }
    return el;
  }

  // CheerpJ ממפה את /app/ לשורש האתר
  function toolsJarPath() {
    return '/app' + new URL('lib/tools.jar', location.href).pathname;
  }

  async function readFileText(path) {
    try {
      var blob = await cjFileBlob(path);
      if (!blob) return null;
      return await blob.text();
    } catch (e) {
      return null;
    }
  }

  function init() {
    if (readyPromise) return readyPromise;
    setState('loading');
    readyPromise = (async function () {
      consoleEl();
      await loadScript(CHEERPJ_URL);
      await cheerpjInit({ status: 'none' });
      // חימום: קומפילציה של מחלקה קטנה כדי ש-javac ייטען מראש
      await compileAndRun('public class Warmup { public static void main(String[] a) { } }', 'Warmup', true);
      setState('ready');
    })().catch(function (e) {
      setState('error', e && e.message);
      readyPromise = null;
      throw e;
    });
    return readyPromise;
  }

  async function compileAndRun(source, cls, skipRun) {
    var con = consoleEl();
    var src = '/str/' + cls + '.java';
    var log = '/files/' + cls + '.log';
    var out = '/files/' + cls + '.out';
    cheerpOSAddStringFile(src, new TextEncoder().encode(source));

    con.textContent = '';
    var t0 = performance.now();
    var code = await cheerpjRunMain('com.sun.tools.javac.Main', toolsJarPath(),
      '-encoding', 'UTF-8', '-nowarn', '-g:none', '-proc:none',
      '-Xstdout', log, '-d', '/files/', src);
    var compileLog = (await readFileText(log)) || con.textContent || '';
    if (code !== 0) {
      return { compiled: false, log: compileLog, ms: performance.now() - t0 };
    }
    if (skipRun) return { compiled: true };

    con.textContent = '';
    await cheerpjRunMain(cls, '/files/', out);
    var text = await readFileText(out);
    if (!text || text.indexOf('@@DONE') < 0) text = con.textContent;
    return { compiled: true, output: text || '', ms: performance.now() - t0 };
  }

  var counter = 0;
  // מריץ את קוד הבדיקה; הרצות נכנסות לתור כדי שלא ירוצו במקביל
  function run(source, cls) {
    var job = queue.then(function () {
      return init().then(function () { return compileAndRun(source, cls); });
    });
    queue = job.catch(function () {});
    return job;
  }

  function newClassName() {
    counter++;
    return 'Check' + Date.now().toString(36) + counter;
  }

  root.Runner = {
    init: init,
    run: run,
    newClassName: newClassName,
    onState: function (fn) { listeners.push(fn); fn(state); },
    get state() { return state; }
  };
})(this);
