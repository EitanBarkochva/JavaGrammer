(function () {
  'use strict';
  var EXAMS = window.EXAMS || [];
  var app = document.getElementById('app');
  var STORE = 'java-exams-v1';

  // ---------- שמירת התקדמות ----------
  var store = {};
  try { store = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { store = {}; }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(store)); } catch (e) { } }
  function rec(id) { return store[id] || (store[id] = {}); }

  // ---------- עזרים ----------
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function allParts(exam) {
    var r = [];
    exam.questions.forEach(function (q) { q.parts.forEach(function (p) { r.push(p); }); });
    return r;
  }
  function examScore(exam) {
    var got = 0, total = 0, done = 0, parts = allParts(exam);
    parts.forEach(function (p) {
      total += p.points;
      if (rec(p.id).status === 'pass') { got += p.points; done++; }
    });
    return { got: got, total: total, done: done, count: parts.length };
  }

  // ---------- מנוע ה-Java ----------
  var engine = document.getElementById('engine');
  Runner.onState(function (s, msg) {
    engine.className = 'engine ' + s;
    var label = engine.querySelector('.label');
    label.textContent = {
      idle: 'מנוע Java: ייטען בבדיקה הראשונה',
      loading: 'מנוע Java: נטען…',
      ready: 'מנוע Java: מוכן',
      error: 'מנוע Java: הטעינה נכשלה'
    }[s] || s;
    if (msg) engine.title = msg;
  });

  // ---------- דף הבית ----------
  function renderHome() {
    document.title = 'תרגול מבחני Java';
    app.innerHTML = '';
    app.appendChild(el('section', { class: 'hero' }, [
      el('h1', { text: 'תרגול מבחנים – מבוא למדעי המחשב ושפת Java' }),
      el('p', { html: 'חמישה מבחנים מלאים. בכל סעיף כותבים תשובה ב-Java בתיבה ולוחצים <b>בדוק</b>: הקוד מקומפל ומורץ בדפדפן מול סדרת בדיקות, ורואים בדיוק מה עבר ומה לא.' })
    ]));
    function card(exam) {
      var sc = examScore(exam);
      var pct = Math.round(100 * sc.got / sc.total);
      return el('a', { class: 'card' + (exam.kind === 'practice' ? ' practice' : ''), href: '#/' + exam.id }, [
        el('h2', { text: exam.title }),
        el('p', { class: 'muted', text: exam.subtitle }),
        el('div', { class: 'meter', role: 'img', 'aria-label': 'התקדמות ' + pct + '%' }, [el('span', { style: 'width:' + pct + '%' })]),
        el('p', { class: 'stat', text: sc.done + ' מתוך ' + sc.count + (exam.kind === 'practice' ? ' תרגילים' : ' סעיפים · ' + sc.got + ' מתוך ' + sc.total + ' נקודות') })
      ]);
    }
    var practice = EXAMS.filter(function (e) { return e.kind === 'practice'; });
    var exams = EXAMS.filter(function (e) { return e.kind !== 'practice'; });
    if (practice.length) {
      app.appendChild(el('h2', { class: 'section-title', text: 'תרגול' }));
      var pg = el('div', { class: 'cards' });
      practice.forEach(function (e) { pg.appendChild(card(e)); });
      app.appendChild(pg);
    }
    app.appendChild(el('h2', { class: 'section-title', text: 'מבחנים' }));
    var grid = el('div', { class: 'cards' });
    exams.forEach(function (e) { grid.appendChild(card(e)); });
    app.appendChild(grid);
    app.appendChild(el('section', { class: 'how' }, [
      el('h2', { text: 'איך זה עובד' }),
      el('ul', {}, [
        el('li', { html: '<b>שאלות קוד</b> – כותבים בתיבה את המחלקה או השיטה (מה שמסומן בתיבה). כפתור <b>בדוק</b> מקמפל את הקוד עם javac ומריץ בדיקות. בהרצה הראשונה טעינת מנוע ה-Java לוקחת כחצי דקה.' }),
        el('li', { html: '<b>שאלות מעקב קוד</b> ("מה יודפס") – כותבים את התשובה, והיא נבדקת מיד.' }),
        el('li', { html: '<b>הצג פתרון</b> – פתרון לדוגמה. יש בדרך כלל יותר מפתרון נכון אחד, והבדיקות בודקות התנהגות ולא נוסח.' }),
        el('li', { html: 'הקוד שכתבתם וההתקדמות נשמרים בדפדפן הזה.' })
      ])
    ]));
    // טעינה מוקדמת של המנוע ברקע אחרי שהדף מוצג
    setTimeout(function () { Runner.init().catch(function () { }); }, 1500);
  }

  // ---------- דף מבחן ----------
  function renderExam(exam) {
    document.title = exam.title + ' – תרגול מבחני Java';
    app.innerHTML = '';
    var sc = examScore(exam);
    var scoreEl = el('div', { class: 'score' });
    function updateScore() {
      var s = examScore(exam);
      scoreEl.innerHTML = exam.kind === 'practice'
        ? 'פתרתם <b>' + s.done + '</b> מתוך ' + s.count + ' תרגילים'
        : '<b>' + s.got + '</b> / ' + s.total + ' נקודות · ' + s.done + ' מתוך ' + s.count + ' סעיפים';
    }
    updateScore();

    app.appendChild(el('div', { class: 'exam-head' }, [
      el('a', { class: 'back', href: '#', text: '→ לדף הראשי' }),
      el('h1', { text: exam.title }),
      el('p', { class: 'muted', text: exam.subtitle }),
      el('p', { text: exam.intro }),
      scoreEl
    ]));

    var qLabel = exam.qLabel || 'שאלה';
    var nav = el('nav', { class: 'qnav', 'aria-label': qLabel });
    exam.questions.forEach(function (q) {
      nav.appendChild(el('a', { href: '#/' + exam.id + '/q' + q.num, text: exam.kind === 'practice' ? String(q.num) : qLabel + ' ' + q.num }));
    });
    app.appendChild(nav);

    exam.questions.forEach(function (q) {
      var sec = el('section', { class: 'question', id: 'q' + q.num }, [
        el('h2', {}, [el('span', { text: qLabel + ' ' + q.num + ' – ' + q.title }),
          q.level ? el('span', { class: 'level lv-' + (q.level.indexOf('קשה') >= 0 ? 'hard' : q.level === 'קל' ? 'easy' : 'mid'), text: q.level })
                  : el('span', { class: 'pts', text: q.points + ' נקודות' })])
      ]);
      if (q.intro) sec.appendChild(el('div', { class: 'prose', html: q.intro }));
      q.parts.forEach(function (p) { sec.appendChild(renderPart(p, updateScore)); });
      app.appendChild(sec);
    });
  }

  // ---------- עורך קוד פשוט ----------
  function makeEditor(initial, onChange, rows) {
    var wrap = el('div', { class: 'editor' });
    var gutter = el('div', { class: 'gutter', 'aria-hidden': 'true' });
    var ta = el('textarea', { class: 'code-input', dir: 'ltr', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'קוד Java' });
    ta.value = initial;
    function lines() {
      var n = ta.value.split('\n').length;
      var s = '';
      for (var i = 1; i <= n; i++) s += i + '\n';
      gutter.textContent = s;
      ta.style.height = 'auto';
      ta.style.height = Math.max(ta.scrollHeight, (rows || 6) * 21 + 20) + 'px';
    }
    ta.addEventListener('input', function () { lines(); onChange(ta.value); });
    ta.addEventListener('keydown', function (e) {
      var s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
      if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (e.shiftKey) {
          var ls = v.lastIndexOf('\n', s - 1) + 1;
          var m = /^ {1,4}/.exec(v.slice(ls));
          if (m) { ta.setRangeText('', ls, ls + m[0].length, 'end'); ta.selectionStart = ta.selectionEnd = Math.max(ls, s - m[0].length); }
        } else {
          ta.setRangeText('    ', s, en, 'end');
        }
        ta.dispatchEvent(new Event('input'));
      } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        var lineStart = v.lastIndexOf('\n', s - 1) + 1;
        var ind = /^[ \t]*/.exec(v.slice(lineStart))[0];
        var before = v.slice(lineStart, s).trim();
        var extra = before.slice(-1) === '{' ? '    ' : '';
        ta.setRangeText('\n' + ind + extra, s, en, 'end');
        ta.dispatchEvent(new Event('input'));
      } else if (e.key === '}' ) {
        var ls2 = v.lastIndexOf('\n', s - 1) + 1;
        if (/^ {4,}$/.test(v.slice(ls2, s)) && s === en) {
          e.preventDefault();
          ta.setRangeText('}', s - 4, s, 'end');
          ta.dispatchEvent(new Event('input'));
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        wrap.dispatchEvent(new CustomEvent('run'));
      }
    });
    wrap.appendChild(gutter);
    wrap.appendChild(ta);
    wrap.ta = ta;
    wrap.set = function (v) { ta.value = v; lines(); onChange(v); };
    setTimeout(lines, 0);
    return wrap;
  }

  function renderPart(p, updateScore) {
    var r = rec(p.id);
    var box = el('article', { class: 'part', id: p.id });
    var status = el('span', { class: 'status' });
    function setStatus(s) {
      r.status = s; save();
      status.className = 'status ' + (s || '');
      status.textContent = s === 'pass' ? '✓ נפתר' : s === 'fail' ? 'עוד לא' : '';
      updateScore();
    }
    var inPractice = /^loops-/.test(p.id);
    box.appendChild(el('h3', {}, [el('span', { text: inPractice ? 'המשימה' : p.title }), inPractice ? null : el('span', { class: 'pts', text: p.points + ' נק\'' }), status]));
    box.appendChild(el('div', { class: 'prose', html: p.html }));
    setStatus(r.status);

    var result = el('div', { class: 'result', 'aria-live': 'polite' });
    var solBox = el('div', { class: 'solution', hidden: true });
    var input;

    if (p.type === 'text') {
      input = el('textarea', { class: 'text-input', rows: '1', dir: 'ltr', placeholder: p.placeholder || '', spellcheck: 'false', 'aria-label': 'תשובה' });
      input.value = r.code != null ? r.code : '';
      input.addEventListener('input', function () { r.code = input.value; save(); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } });
      box.appendChild(input);
    } else {
      var rows = (p.starter || '').split('\n').length;
      input = makeEditor(r.code != null ? r.code : p.starter, function (v) { r.code = v; save(); }, Math.min(rows, 30));
      input.addEventListener('run', function () { check(); });
      box.appendChild(input);
    }

    var btnCheck = el('button', { class: 'btn primary', type: 'button', onclick: function () { check(); } }, ['בדוק']);
    var btnSol = el('button', { class: 'btn', type: 'button', onclick: toggleSolution }, ['הצג פתרון']);
    var btnReset = p.type === 'text' ? null : el('button', { class: 'btn ghost', type: 'button', onclick: function () {
      if (confirm('לאפס את התיבה לקוד ההתחלתי? הקוד שכתבתם יימחק.')) { input.set(p.starter); result.innerHTML = ''; }
    } }, ['איפוס']);
    box.appendChild(el('div', { class: 'actions' }, [btnCheck, btnSol, btnReset,
      p.type === 'java' ? el('span', { class: 'hint', text: 'Ctrl+Enter לבדיקה' }) : null]));
    box.appendChild(result);
    box.appendChild(solBox);

    function toggleSolution() {
      if (!solBox.hidden) { solBox.hidden = true; btnSol.textContent = 'הצג פתרון'; return; }
      solBox.innerHTML = '';
      solBox.appendChild(el('h4', { text: 'פתרון לדוגמה' }));
      solBox.appendChild(el('pre', { class: 'code', dir: 'ltr', text: p.solution }));
      solBox.hidden = false;
      btnSol.textContent = 'הסתר פתרון';
    }

    function show(kind, title, items, extra) {
      result.innerHTML = '';
      result.className = 'result ' + kind;
      result.appendChild(el('div', { class: 'result-title', text: title }));
      if (items && items.length) {
        var ul = el('ul', { class: 'checks' });
        items.forEach(function (t) {
          ul.appendChild(el('li', { class: t.ok ? 'ok' : 'bad' }, [
            el('span', { class: 'mark', text: t.ok ? '✓' : '✗' }),
            el('span', { class: 'lbl', dir: 'auto', text: t.label }),
            t.why ? el('div', { class: 'why', dir: 'auto', text: t.why }) : null
          ]));
        });
        result.appendChild(ul);
      }
      if (extra) result.appendChild(extra);
    }

    function check() {
      if (p.type === 'text') {
        var res = p.check(input.value);
        show(res.ok ? 'good' : 'bad', res.msg);
        setStatus(res.ok ? 'pass' : 'fail');
        return;
      }
      var code = input.ta.value;
      if (p.type === 'static') {
        var st = p.check(code);
        show(st.ok ? 'good' : 'bad', st.ok ? 'נראה טוב! השוו גם לפתרון לדוגמה.' : 'חסרים פרטים בתשובה:', st.tests);
        setStatus(st.ok ? 'pass' : 'fail');
        return;
      }
      var srcChecks = (p.sourceChecks || []).map(function (sc) {
        return { ok: sc.re.test(code), label: sc.label, why: sc.re.test(code) ? '' : 'בדיקה של נוסח הקוד – לפי דרישת השאלה' };
      });
      var cls = Runner.newClassName();
      var built;
      try { built = Harness.build(p, code, cls); } catch (e) { show('bad', 'שגיאה בהכנת הקוד: ' + e.message); return; }
      btnCheck.disabled = true;
      var waiting = Runner.state === 'ready' ? 'מקמפל ומריץ…' : 'טוען את מנוע ה-Java (בפעם הראשונה זה לוקח כחצי דקה)…';
      show('busy', waiting);
      Runner.run(built.source, cls).then(function (out) {
        if (!out.compiled) {
          var errs = Harness.mapErrors(out.log, built, cls + '.java');
          var lines = code.split('\n');
          var list = el('ul', { class: 'errors', dir: 'ltr' });
          errs.slice(0, 8).forEach(function (er) {
            list.appendChild(el('li', {}, [
              el('b', { text: er.line ? 'Line ' + er.line + ': ' : '' }),
              el('span', { text: er.msg }),
              er.line ? el('code', { text: (lines[er.line - 1] || '').trim() }) : null
            ]));
          });
          if (!errs.length) list.appendChild(el('li', { text: out.log.slice(0, 1500) || 'שגיאה לא ידועה' }));
          show('bad', 'הקוד לא עובר קומפילציה. תקנו את השגיאות ונסו שוב:', null, list);
          setStatus('fail');
          return;
        }
        var res = Harness.parseResults(out.output);
        var items = srcChecks.concat(res.tests);
        if (res.timeout) items.push({ ok: false, label: 'הבדיקות לא הסתיימו בזמן', why: 'ייתכן שיש לולאה אינסופית' });
        if (!res.done && !res.tests.length) {
          show('bad', 'ההרצה לא החזירה תוצאות. פלט:', null, el('pre', { class: 'code', dir: 'ltr', text: (out.output || '').slice(0, 2000) }));
          setStatus('fail');
          return;
        }
        var passed = items.filter(function (t) { return t.ok; }).length;
        var allOk = passed === items.length && items.length > 0;
        show(allOk ? 'good' : 'bad', allOk ? 'כל הבדיקות עברו! (' + passed + '/' + items.length + ')' : 'עברו ' + passed + ' מתוך ' + items.length + ' בדיקות:', items);
        setStatus(allOk ? 'pass' : 'fail');
      }).catch(function (e) {
        show('bad', 'לא ניתן היה להריץ Java בדפדפן הזה (' + (e && e.message || e) + '). נסו לרענן, או השתמשו בדפדפן Chrome / Edge / Firefox עדכני. בינתיים אפשר להשוות לפתרון לדוגמה.');
      }).then(function () { btnCheck.disabled = false; });
    }
    return box;
  }

  // ---------- ניתוב ----------
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/');
    var exam = EXAMS.filter(function (e) { return e.id === parts[0]; })[0];
    var tab = exam && exam.kind === 'practice' ? exam.id : 'home';
    Array.prototype.forEach.call(document.querySelectorAll('.tabs a'), function (t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tab);
    });
    if (!exam) { renderHome(); window.scrollTo(0, 0); return; }
    if (app.dataset.exam !== exam.id) { renderExam(exam); app.dataset.exam = exam.id; }
    var target = parts[1] && document.getElementById(parts[1]);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () {
    var h = location.hash.replace(/^#\/?/, '').split('/')[0];
    if (h !== app.dataset.exam) app.dataset.exam = '';
    route();
  });
  route();
})();
