(function () {
  'use strict';
  var EXAMS = window.EXAMS || [];
  var LESSONS = window.LESSONS || [];
  var LEARN_OUT = window.LEARN_OUT || {};
  var app = document.getElementById('app');
  var STORE = 'java-exams-v1';

  // ---------- שמירת התקדמות ----------
  var store = {};
  try { store = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { store = {}; }
  var syncTimer = null;
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(store)); } catch (e) { }
    // משתמש מחובר – שומרים גם ב-Firebase (בהשהיה קצרה כדי לא לשמור בכל הקשה)
    if (window.Auth && Auth.state.user && Auth.state.profile) {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(function () { Auth.saveProgress(store).catch(function () { }); }, 1500);
    }
  }
  // מיזוג התקדמות מהענן: סטטוס "נפתר" נשמר מכל צד, קוד מקומי גובר על קוד מהענן
  function mergeProgress(remote) {
    if (!remote) return false;
    var changed = false;
    Object.keys(remote).forEach(function (id) {
      var r = remote[id] || {}, l = store[id] || (store[id] = {});
      if (l.code == null && r.code != null) { l.code = r.code; changed = true; }
      if (r.status === 'pass' && l.status !== 'pass') { l.status = 'pass'; changed = true; }
      else if (!l.status && r.status) { l.status = r.status; changed = true; }
    });
    return changed;
  }
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

  // ---------- משתמשים ----------
  var userbox = document.getElementById('userbox');
  var lastUid = null;
  function roleName(r) { return r === 'teacher' ? 'מורה' : 'תלמיד'; }
  function renderUserbox() {
    var st = window.Auth && Auth.state;
    userbox.innerHTML = '';
    if (!st || !st.ready) return;
    if (st.user && st.profile) {
      var kids = [el('span', { class: 'who', text: (st.profile.name || st.user.email) }), el('span', { class: 'role ' + st.profile.role, text: roleName(st.profile.role) })];
      if (st.profile.role === 'teacher') kids.push(el('a', { class: 'btn small', href: '#/teacher', text: 'דף מורה' }));
      kids.push(el('button', { class: 'btn small ghost', type: 'button', onclick: function () { Auth.signOut(); location.hash = '#/login'; } }, ['התנתקות']));
      kids.forEach(function (k) { userbox.appendChild(k); });
    } else {
      userbox.appendChild(el('a', { class: 'btn small primary', href: '#/login', text: 'התחברות / הרשמה' }));
    }
  }
  window.addEventListener('authchange', function () {
    var st = Auth.state;
    renderUserbox();
    var uid = st.user && st.profile ? st.user.uid : null;
    if (uid && uid !== lastUid) {
      lastUid = uid;
      Auth.loadProgress().then(function (remote) {
        mergeProgress(remote);
        save();
        if (location.hash.indexOf('#/login') === 0) location.hash = st.profile.role === 'teacher' ? '#/teacher' : '#';
        else { app.dataset.exam = ''; route(); }
      }).catch(function () { });
    } else if (!uid) {
      lastUid = null;
    }
    var h = location.hash.replace(/^#\/?/, '').split('/')[0];
    // דף ההתחברות מצויר מחדש רק אם הטופס עוד לא מוצג (כדי לא למחוק הודעת שגיאה)
    if (h === 'teacher' || (h === 'login' && !uid && !app.querySelector('.auth-form'))) { app.dataset.exam = ''; route(); }
  });

  function renderLogin() {
    document.title = 'התחברות – תרגול מבחני Java';
    app.innerHTML = '';
    var st = window.Auth && Auth.state;
    var wrap = el('section', { class: 'auth-card' });
    app.appendChild(wrap);
    if (!st || !st.ready) { wrap.appendChild(el('p', { class: 'muted', text: 'טוען…' })); return; }
    if (!st.configured) {
      wrap.appendChild(el('h1', { text: 'התחברות והרשמה' }));
      wrap.appendChild(el('p', { class: 'note', html: 'ההרשמה עדיין לא מחוברת ל-Firebase. מנהל האתר צריך למלא את הקובץ <code>firebase-config.js</code>.' }));
      return;
    }
    if (st.user && st.profile) {
      wrap.appendChild(el('h1', { text: 'שלום ' + (st.profile.name || '') }));
      wrap.appendChild(el('p', { text: 'את/ה מחובר/ת כ' + roleName(st.profile.role) + ' (' + st.profile.email + ').' }));
      wrap.appendChild(el('a', { class: 'btn primary', href: st.profile.role === 'teacher' ? '#/teacher' : '#', text: st.profile.role === 'teacher' ? 'לדף המורה' : 'להתחיל לתרגל' }));
      return;
    }
    var mode = 'signin';
    var tabs = el('div', { class: 'auth-tabs', role: 'tablist' });
    var tIn = el('button', { type: 'button', role: 'tab', onclick: function () { setMode('signin'); } }, ['התחברות']);
    var tUp = el('button', { type: 'button', role: 'tab', onclick: function () { setMode('signup'); } }, ['הרשמה']);
    tabs.appendChild(tIn); tabs.appendChild(tUp);
    wrap.appendChild(el('h1', { text: 'התחברות והרשמה' }));
    wrap.appendChild(tabs);

    function field(label, attrs) {
      var input = el('input', attrs);
      var f = el('label', { class: 'field' }, [el('span', { text: label }), input]);
      f.input = input;
      return f;
    }
    var fName = field('שם מלא', { type: 'text', autocomplete: 'name', required: true });
    var fEmail = field('אימייל', { type: 'email', autocomplete: 'email', dir: 'ltr', required: true });
    var fPass = field('סיסמה', { type: 'password', autocomplete: 'current-password', dir: 'ltr', required: true, minlength: '6' });
    var fPass2 = field('אימות סיסמה', { type: 'password', autocomplete: 'new-password', dir: 'ltr', minlength: '6' });
    var roleBox = el('fieldset', { class: 'roles' }, [
      el('legend', { text: 'אני' }),
      el('label', {}, [el('input', { type: 'radio', name: 'role', value: 'student', checked: true }), el('span', { text: 'תלמיד/ה' })]),
      el('label', {}, [el('input', { type: 'radio', name: 'role', value: 'teacher' }), el('span', { text: 'מורה' })])
    ]);
    var teacherNote = el('p', { class: 'hint-small', text: 'הרשמה כמורה אפשרית רק לאימייל שמנהל האתר אישר מראש.' });
    var msg = el('p', { class: 'auth-msg', 'aria-live': 'polite' });
    var submit = el('button', { class: 'btn primary wide', type: 'submit' }, ['התחברות']);
    var forgot = el('button', { class: 'linkbtn', type: 'button', onclick: async function () {
      var email = fEmail.input.value.trim();
      if (!email) { showMsg('כתבו את האימייל ואז לחצו שוב על "שכחתי סיסמה".', true); return; }
      try { await Auth.resetPassword(email); showMsg('נשלח מייל לאיפוס הסיסמה אל ' + email + '.'); }
      catch (e) { showMsg(Auth.message(e), true); }
    } }, ['שכחתי סיסמה']);
    var form = el('form', { class: 'auth-form', novalidate: true }, [fName, fEmail, fPass, fPass2, roleBox, teacherNote, msg, submit, forgot]);
    wrap.appendChild(form);

    function showMsg(t, bad) { msg.textContent = t; msg.className = 'auth-msg' + (bad ? ' bad' : ' good'); }
    function setMode(m) {
      mode = m;
      var up = m === 'signup';
      tIn.className = up ? '' : 'active'; tUp.className = up ? 'active' : '';
      tIn.setAttribute('aria-selected', String(!up)); tUp.setAttribute('aria-selected', String(up));
      fName.hidden = !up; fPass2.hidden = !up; roleBox.hidden = !up; teacherNote.hidden = !up; forgot.hidden = up;
      fPass.input.setAttribute('autocomplete', up ? 'new-password' : 'current-password');
      submit.textContent = up ? 'הרשמה' : 'התחברות';
      msg.textContent = '';
    }
    setMode(mode);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = fEmail.input.value.trim(), pass = fPass.input.value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg('כתובת האימייל לא תקינה.', true); return; }
      if (pass.length < 6) { showMsg('הסיסמה צריכה להכיל לפחות 6 תווים.', true); return; }
      submit.disabled = true;
      try {
        if (mode === 'signup') {
          var name = fName.input.value.trim();
          if (!name) { showMsg('כתבו את השם.', true); return; }
          if (pass !== fPass2.input.value) { showMsg('הסיסמאות לא זהות.', true); return; }
          var role = form.querySelector('input[name=role]:checked').value;
          showMsg('יוצר משתמש…');
          await Auth.signUp(name, email, pass, role);
        } else {
          showMsg('מתחבר…');
          await Auth.signIn(email, pass);
        }
      } catch (err) {
        showMsg(Auth.message(err), true);
      } finally {
        submit.disabled = false;
      }
    });
  }

  function renderTeacher() {
    document.title = 'דף מורה – תרגול מבחני Java';
    app.innerHTML = '';
    var st = window.Auth && Auth.state;
    app.appendChild(el('div', { class: 'exam-head' }, [el('a', { class: 'back', href: '#', text: '→ לדף הראשי' }), el('h1', { text: 'דף מורה' })]));
    if (!st || !st.ready) { app.appendChild(el('p', { class: 'muted', text: 'טוען…' })); return; }
    if (!st.user || !st.profile || st.profile.role !== 'teacher') {
      app.appendChild(el('p', { class: 'note', html: 'הדף הזה מיועד למורים. <a href="#/login">התחברו</a> עם משתמש מורה.' }));
      return;
    }
    var info = el('p', { class: 'muted', text: 'טוען את רשימת התלמידים…' });
    app.appendChild(info);
    var sets = EXAMS;
    Auth.listStudents().then(function (students) {
      info.textContent = students.length ? students.length + ' תלמידים רשומים. המספרים הם סעיפים שנפתרו מתוך כלל הסעיפים.' : 'עדיין אין תלמידים רשומים.';
      if (!students.length) return;
      var head = el('tr', {}, [el('th', { text: 'תלמיד' })].concat(sets.map(function (x) { return el('th', { text: x.title }); })).concat([el('th', { text: 'עדכון אחרון' })]));
      var body = el('tbody');
      students.sort(function (a, b) { return (a.name || '').localeCompare(b.name || '', 'he'); });
      students.forEach(function (s) {
        var prog = s.progress || {};
        var row = el('tr', {}, [el('td', {}, [el('div', { text: s.name || '' }), el('div', { class: 'muted small', dir: 'ltr', text: s.email || '' })])]);
        sets.forEach(function (x) {
          var parts = allParts(x), done = 0, pts = 0;
          parts.forEach(function (p) { if (prog[p.id] && prog[p.id].status === 'pass') { done++; pts += p.points; } });
          var cell = x.kind === 'practice' ? done + '/' + parts.length : pts + ' נק\' (' + done + '/' + parts.length + ')';
          row.appendChild(el('td', { class: done ? '' : 'muted', text: cell }));
        });
        row.appendChild(el('td', { class: 'muted small', text: s.updatedAt ? s.updatedAt.toLocaleString('he-IL') : '—' }));
        body.appendChild(row);
      });
      app.appendChild(el('div', { class: 'table-wrap' }, [el('table', { class: 'students' }, [el('thead', {}, [head]), body])]));
    }).catch(function (e) {
      info.textContent = 'טעינת התלמידים נכשלה: ' + Auth.message(e);
    });
  }

  // ---------- דף הבית ----------
  function renderHome() {
    document.title = 'תרגול מבחני Java';
    app.innerHTML = '';
    app.appendChild(el('section', { class: 'hero' }, [
      el('h1', { text: 'תרגול מבחנים – מבוא למדעי המחשב ושפת Java' }),
      el('p', { html: 'לומדים את החומר, מתרגלים בתרגילים מדורגים, ואז פותרים מבחנים מלאים. בכל סעיף כותבים תשובה ב-Java בתיבה ולוחצים <b>בדוק</b>: הקוד מקומפל ומורץ בדפדפן מול סדרת בדיקות, ורואים בדיוק מה עבר ומה לא.' })
    ]));
    if (LESSONS.length) {
      app.appendChild(el('h2', { class: 'section-title', text: 'לימוד' }));
      var lg = el('div', { class: 'cards' });
      LESSONS.forEach(function (l) {
        lg.appendChild(el('a', { class: 'card learn', href: '#/' + l.id }, [
          el('h2', { text: l.title }),
          el('p', { class: 'muted', text: l.subtitle }),
          el('p', { class: 'stat', text: l.sections.length + ' נושאים' })
        ]));
      });
      app.appendChild(lg);
    }
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

  // ---------- דף לימוד ----------
  var RUN_TESTS = [['run', 'T.runOut(new Runnable() { public void run() { Main.main(new String[0]); } });']];
  function renderLesson(lesson) {
    document.title = lesson.title + ' – תרגול מבחני Java';
    app.innerHTML = '';
    app.appendChild(el('div', { class: 'exam-head' }, [
      el('a', { class: 'back', href: '#', text: '→ לדף הראשי' }),
      el('h1', { text: lesson.title }),
      el('p', { class: 'muted', text: lesson.subtitle }),
      el('p', { class: 'note', html: 'בכל דוגמה אפשר לשנות את הקוד וללחוץ <b>הרץ</b> כדי לראות מה יודפס. הפלט שמופיע מתחת לדוגמה הוא הפלט של הקוד המקורי.' })
    ]));
    var toc = el('nav', { class: 'toc', 'aria-label': 'נושאים' });
    var ol = el('ol');
    lesson.sections.forEach(function (sec) {
      ol.appendChild(el('li', {}, [el('a', { href: '#/' + lesson.id + '/' + sec.id, text: sec.title })]));
    });
    toc.appendChild(el('h2', { text: 'נושאים' }));
    toc.appendChild(ol);
    app.appendChild(toc);
    lesson.sections.forEach(function (sec, si) {
      var section = el('section', { class: 'lesson', id: sec.id }, [el('h2', { text: (si + 1) + '. ' + sec.title })]);
      sec.blocks.forEach(function (b, bi) {
        if (typeof b === 'string') section.appendChild(el('div', { class: 'prose', html: b }));
        else section.appendChild(renderExample(lesson.id + '-' + sec.id + '-' + bi, b.run));
      });
      app.appendChild(section);
    });
    var practice = EXAMS.filter(function (e) { return e.id === lesson.practice; })[0];
    if (practice) {
      app.appendChild(el('a', { class: 'card practice next', href: '#/' + practice.id }, [
        el('h2', { text: 'לתרגול: ' + practice.title + ' ←' }),
        el('p', { class: 'muted', text: practice.subtitle })
      ]));
    }
  }

  function renderExample(id, code) {
    var box = el('div', { class: 'example' });
    var editor = makeEditor(code, function () { }, 4);
    var outPre = el('pre', { class: 'output', dir: 'ltr' });
    var outLabel = el('div', { class: 'out-label', text: 'פלט:' });
    function setOut(text, kind) { outPre.textContent = text; outPre.className = 'output' + (kind ? ' ' + kind : ''); }
    if (LEARN_OUT[id] != null) setOut(LEARN_OUT[id]);
    var btn = el('button', { class: 'btn primary', type: 'button', onclick: run }, ['▶ הרץ']);
    var reset = el('button', { class: 'btn ghost', type: 'button', onclick: function () { editor.set(code); if (LEARN_OUT[id] != null) setOut(LEARN_OUT[id]); } }, ['איפוס']);
    editor.addEventListener('run', run);
    function run() {
      var src = editor.ta.value;
      var cls = Runner.newClassName();
      var built = Harness.build({ tests: RUN_TESTS }, src, cls);
      btn.disabled = true;
      setOut(Runner.state === 'ready' ? 'מקמפל ומריץ…' : 'טוען את מנוע ה-Java (בפעם הראשונה זה לוקח כחצי דקה)…', 'busy');
      Runner.run(built.source, cls).then(function (out) {
        if (!out.compiled) {
          var errs = Harness.mapErrors(out.log, built, cls + '.java');
          var lines = src.split('\n');
          setOut('שגיאת קומפילציה:\n' + (errs.length ? errs.slice(0, 6).map(function (e) {
            return (e.line ? 'Line ' + e.line + ': ' : '') + e.msg + (e.line ? '\n    ' + (lines[e.line - 1] || '').trim() : '');
          }).join('\n') : out.log.slice(0, 1500)), 'error');
          return;
        }
        var res = Harness.parseResults(out.output);
        if (/main/.test(src) && !/class\s+Main\b/.test(src)) { setOut('צריכה להיות מחלקה בשם Main עם השיטה main.', 'error'); return; }
        var text = res.out.join('\n');
        if (res.timeout) text += '\n(ההרצה נעצרה – ייתכן שיש לולאה אינסופית)';
        res.tests.forEach(function (t) { if (!t.ok) text += '\n' + t.why; });
        setOut(text || '(אין פלט)', /Exception|נזרקה חריגה/.test(text) ? 'error' : '');
      }).catch(function (e) {
        setOut('לא ניתן היה להריץ Java בדפדפן הזה: ' + (e && e.message || e), 'error');
      }).then(function () { btn.disabled = false; });
    }
    box.appendChild(editor);
    box.appendChild(el('div', { class: 'actions' }, [btn, reset]));
    box.appendChild(outLabel);
    box.appendChild(outPre);
    return box;
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
    var inPractice = /^(loops|oop)-/.test(p.id);
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
    var lesson = LESSONS.filter(function (l) { return l.id === parts[0]; })[0];
    if (parts[0] === 'login' || parts[0] === 'teacher') {
      Array.prototype.forEach.call(document.querySelectorAll('.tabs a'), function (t) { t.classList.remove('active'); });
      if (app.dataset.exam !== parts[0]) { if (parts[0] === 'login') renderLogin(); else renderTeacher(); app.dataset.exam = parts[0]; }
      window.scrollTo(0, 0);
      return;
    }
    var tab = lesson ? lesson.id : exam && exam.kind === 'practice' ? exam.id : 'home';
    Array.prototype.forEach.call(document.querySelectorAll('.tabs a'), function (t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tab);
    });
    var act = document.querySelector('.tabs a.active');
    if (act) { var nav = act.parentNode; nav.scrollLeft += act.getBoundingClientRect().left - nav.getBoundingClientRect().left - 16; }
    if (!exam && !lesson) { renderHome(); window.scrollTo(0, 0); return; }
    var cur = (exam || lesson).id;
    if (app.dataset.exam !== cur) { if (exam) renderExam(exam); else renderLesson(lesson); app.dataset.exam = cur; }
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
