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

  // מפת סעיפים: מזהה סעיף → המבחן/התרגול, השאלה והסעיף
  var PARTS = {};
  EXAMS.forEach(function (x) { x.questions.forEach(function (q) { q.parts.forEach(function (p) { PARTS[p.id] = { exam: x, q: q, p: p }; }); }); });
  function partLabel(id) {
    var i = PARTS[id];
    if (!i) return id;
    if (i.exam.kind === 'practice') return i.exam.title + ' · תרגיל ' + i.q.num + ' – ' + i.q.title;
    return i.exam.title + ' · ' + (i.exam.qLabel || 'שאלה') + ' ' + i.q.num + ' · ' + i.p.title;
  }
  // יומן לחיצות (רק למשתמש מחובר)
  function logAttempt(entry) {
    if (!window.Auth || !Auth.state.user || !Auth.state.profile) return;
    var i = PARTS[entry.part];
    entry.set = i ? i.exam.id : '';
    if (entry.code != null) entry.code = String(entry.code).slice(0, 15000);
    if (entry.errors) entry.errors = entry.errors.slice(0, 12).map(function (e) { return String(e).slice(0, 400); });
    Auth.logAttempt(entry).catch(function () { });
  }

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
    var needProfile = st.user && !st.profile;
    if (h === 'teacher' || (h === 'login' && !uid && !app.querySelector(needProfile ? '.profile-form' : '.auth-form:not(.profile-form)'))) { app.dataset.exam = ''; route(); }
    // משתמש Google חדש שעוד לא בחר תלמיד / מורה – שולחים אותו להשלמת ההרשמה
    else if (needProfile && h !== 'login') location.hash = '#/login';
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
    if (st.user && !st.profile) { renderCompleteProfile(wrap, st); return; }
    var mode = 'signin';
    var tabs = el('div', { class: 'auth-tabs', role: 'tablist' });
    var tIn = el('button', { type: 'button', role: 'tab', onclick: function () { setMode('signin'); } }, ['התחברות']);
    var tUp = el('button', { type: 'button', role: 'tab', onclick: function () { setMode('signup'); } }, ['הרשמה']);
    tabs.appendChild(tIn); tabs.appendChild(tUp);
    wrap.appendChild(el('h1', { text: 'התחברות והרשמה' }));
    var gMsg = el('p', { class: 'auth-msg', 'aria-live': 'polite' });
    var gBtn = el('button', { class: 'btn google wide', type: 'button', onclick: async function () {
      gBtn.disabled = true; gMsg.textContent = '';
      try { await Auth.signInWithGoogle(); }
      catch (e) { if (e && e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') { gMsg.textContent = Auth.message(e); gMsg.className = 'auth-msg bad'; } }
      finally { gBtn.disabled = false; }
    } }, [el('span', { class: 'g-logo', 'aria-hidden': 'true', html: GOOGLE_SVG }), el('span', { text: 'המשך עם Google' })]);
    wrap.appendChild(gBtn);
    wrap.appendChild(gMsg);
    wrap.appendChild(el('div', { class: 'or', text: 'או עם אימייל וסיסמה' }));
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

  var GOOGLE_SVG = '<svg viewBox="0 0 48 48" width="18" height="18"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

  // משתמש שנכנס עם Google בפעם הראשונה: שם וסוג משתמש
  function renderCompleteProfile(wrap, st) {
    wrap.appendChild(el('h1', { text: 'כמעט סיימנו' }));
    wrap.appendChild(el('p', { class: 'muted', dir: 'auto', text: 'נכנסת עם ' + (st.user.email || '') + '. נשאר רק לבחור שם וסוג משתמש.' }));
    var name = el('input', { type: 'text', autocomplete: 'name', required: true });
    name.value = st.user.displayName || '';
    var roleBox = el('fieldset', { class: 'roles' }, [
      el('legend', { text: 'אני' }),
      el('label', {}, [el('input', { type: 'radio', name: 'role', value: 'student', checked: true }), el('span', { text: 'תלמיד/ה' })]),
      el('label', {}, [el('input', { type: 'radio', name: 'role', value: 'teacher' }), el('span', { text: 'מורה' })])
    ]);
    var msg = el('p', { class: 'auth-msg', 'aria-live': 'polite' });
    var submit = el('button', { class: 'btn primary wide', type: 'submit' }, ['סיום הרשמה']);
    var cancel = el('button', { class: 'linkbtn', type: 'button', onclick: function () { Auth.signOut(); } }, ['ביטול והתנתקות']);
    var form = el('form', { class: 'auth-form profile-form', novalidate: true }, [
      el('label', { class: 'field' }, [el('span', { text: 'שם מלא' }), name]), roleBox,
      el('p', { class: 'hint-small', text: 'הרשמה כמורה אפשרית רק לאימייל שמנהל האתר אישר מראש.' }), msg, submit, cancel]);
    wrap.appendChild(form);
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var n = name.value.trim();
      if (!n) { msg.textContent = 'כתבו את השם.'; msg.className = 'auth-msg bad'; return; }
      submit.disabled = true;
      try { await Auth.completeProfile(n, form.querySelector('input[name=role]:checked').value); }
      catch (err) { msg.textContent = Auth.message(err); msg.className = 'auth-msg bad'; }
      finally { submit.disabled = false; }
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
      info.textContent = students.length ? students.length + ' תלמידים רשומים. המספרים הם סעיפים שנפתרו מתוך כלל הסעיפים. לחצו על שם של תלמיד כדי לראות את כל הלחיצות שלו על "בדוק" ו"הצג פתרון".' : 'עדיין אין תלמידים רשומים.';
      if (!students.length) return;
      var head = el('tr', {}, [el('th', { text: 'תלמיד' })].concat(sets.map(function (x) { return el('th', { text: x.title }); })).concat([el('th', { text: 'עדכון אחרון' })]));
      var body = el('tbody');
      students.sort(function (a, b) { return (a.name || '').localeCompare(b.name || '', 'he'); });
      students.forEach(function (s) {
        var prog = s.progress || {};
        var row = el('tr', {}, [el('td', {}, [el('a', { href: '#/teacher/' + s.uid, text: s.name || '(ללא שם)' }), el('div', { class: 'muted small', dir: 'ltr', text: s.email || '' })])]);
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

  // ---------- דף מורה: יומן הלחיצות של תלמיד ----------
  function fmtTime(d) { return d ? d.toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }) : '—'; }
  function renderStudentLog(uid) {
    document.title = 'יומן תלמיד – תרגול מבחני Java';
    app.innerHTML = '';
    var st = window.Auth && Auth.state;
    var title = el('h1', { text: 'יומן תלמיד' });
    var sub = el('p', { class: 'muted', dir: 'auto' });
    app.appendChild(el('div', { class: 'exam-head' }, [el('a', { class: 'back', href: '#/teacher', text: '→ לדף המורה' }), title, sub]));
    if (!st || !st.ready) { app.appendChild(el('p', { class: 'muted', text: 'טוען…' })); return; }
    if (!st.user || !st.profile || st.profile.role !== 'teacher') {
      app.appendChild(el('p', { class: 'note', html: 'הדף הזה מיועד למורים. <a href="#/login">התחברו</a> עם משתמש מורה.' }));
      return;
    }
    var info = el('p', { class: 'muted', text: 'טוען…' });
    app.appendChild(info);
    Auth.getUser(uid).then(function (u) {
      if (u) { title.textContent = 'יומן של ' + (u.name || ''); sub.textContent = u.email || ''; }
    }).catch(function () { });
    Auth.listAttempts(uid).then(function (list) {
      if (!list.length) { info.textContent = 'עדיין אין לחיצות של התלמיד הזה. (נרשמות רק לחיצות של תלמיד מחובר.)'; return; }
      var checks = list.filter(function (a) { return a.kind === 'check'; });
      var good = checks.filter(function (a) { return a.ok; }).length;
      var sols = list.length - checks.length;
      info.textContent = checks.length + ' לחיצות על "בדוק" (' + good + ' נכונות, ' + (checks.length - good) + ' לא נכונות) · ' + sols + ' צפיות בפתרון.';

      // סינון לפי מבחן / תרגול
      var sel = el('select', { 'aria-label': 'סינון' }, [el('option', { value: '', text: 'כל המבחנים והתרגולים' })]);
      EXAMS.forEach(function (x) { if (list.some(function (a) { return a.set === x.id; })) sel.appendChild(el('option', { value: x.id, text: x.title })); });
      var onlyBad = el('input', { type: 'checkbox' });
      app.appendChild(el('div', { class: 'log-filter' }, [sel, el('label', {}, [onlyBad, el('span', { text: ' רק תשובות לא נכונות' })])]));

      var body = el('tbody');
      var table = el('table', { class: 'students log' }, [el('thead', {}, [el('tr', {}, [
        el('th', { text: 'מתי' }), el('th', { text: 'סעיף' }), el('th', { text: 'פעולה' }), el('th', { text: 'תוצאה' }), el('th', { text: 'שגיאות וקוד' })])]), body]);
      app.appendChild(el('div', { class: 'table-wrap' }, [table]));
      function draw() {
        body.innerHTML = '';
        list.forEach(function (a) {
          if (sel.value && a.set !== sel.value) return;
          if (onlyBad.checked && !(a.kind === 'check' && !a.ok)) return;
          var res, cls;
          if (a.kind === 'solution') { res = '—'; cls = 'muted'; }
          else if (a.ok) { res = '✓ נכון' + (a.total ? ' (' + a.passed + '/' + a.total + ')' : ''); cls = 'ok'; }
          else { res = (a.compile ? '✗ שגיאת קומפילציה' : '✗ לא נכון') + (a.total ? ' (' + a.passed + '/' + a.total + ')' : ''); cls = 'bad'; }
          var det = null;
          if (a.kind === 'check' && ((a.errors && a.errors.length) || a.code)) {
            var inner = [el('summary', { text: a.errors && a.errors.length ? (a.errors.length === 1 ? 'שגיאה אחת' : a.errors.length + ' שגיאות') + ' וקוד' : 'הקוד' })];
            if (a.errors && a.errors.length) inner.push(el('ul', { class: 'log-errors', dir: 'auto' }, a.errors.map(function (e) { return el('li', { text: e }); })));
            if (a.code) inner.push(el('pre', { class: 'code', dir: 'ltr', text: a.code }));
            det = el('details', {}, inner);
          }
          var link = PARTS[a.part] ? el('a', { href: '#/' + PARTS[a.part].exam.id + '/' + a.part, text: partLabel(a.part) }) : el('span', { text: a.part || '' });
          body.appendChild(el('tr', {}, [
            el('td', { class: 'muted small', text: fmtTime(a.at) }),
            el('td', { class: 'wrap' }, [link]),
            el('td', { text: a.kind === 'solution' ? 'הצג פתרון' : 'בדוק' }),
            el('td', { class: 'res ' + cls, text: res }),
            el('td', { class: 'wrap' }, [det])
          ]));
        });
        if (!body.children.length) body.appendChild(el('tr', {}, [el('td', { colspan: '5', class: 'muted', text: 'אין רשומות שמתאימות לסינון.' })]));
      }
      sel.addEventListener('change', draw);
      onlyBad.addEventListener('change', draw);
      draw();
    }).catch(function (e) {
      info.textContent = 'טעינת היומן נכשלה: ' + Auth.message(e);
    });
  }

  // ---------- דף הבית ----------
  function card(exam) {
    var sc = examScore(exam);
    var pct = Math.round(100 * sc.got / sc.total);
    return el('a', { class: 'card' + (exam.kind === 'practice' ? ' practice' : exam.kind === 'easy' ? ' easy' : ''), href: '#/' + exam.id }, [
      el('h2', { text: exam.title }),
      el('p', { class: 'muted', text: exam.subtitle }),
      el('div', { class: 'meter', role: 'img', 'aria-label': 'התקדמות ' + pct + '%' }, [el('span', { style: 'width:' + pct + '%' })]),
      el('p', { class: 'stat', text: sc.done + ' מתוך ' + sc.count + (exam.kind === 'practice' ? ' תרגילים' : ' סעיפים · ' + sc.got + ' מתוך ' + sc.total + ' נקודות') })
    ]);
  }

  // ---------- תרגול מבחנים קלים ----------
  function renderEasy() {
    document.title = 'תרגול מבחנים קלים – תרגול מבחני Java';
    app.innerHTML = '';
    app.appendChild(el('div', { class: 'exam-head' }, [
      el('a', { class: 'back', href: '#', text: '→ לדף הראשי' }),
      el('h1', { text: 'תרגול מבחנים קלים' }),
      el('p', { text: 'שלושה מבחנים מלאים באותו מבנה של מבחן 11203, ברמה קלה יותר: מחלקות ועצמים, מערך חד־ממדי, מערך עצמים וניתוח קוד. טוב להתחיל כאן לפני המבחנים האמיתיים.' })
    ]));
    var g = el('div', { class: 'cards' });
    EXAMS.filter(function (e) { return e.kind === 'easy'; }).forEach(function (e) { g.appendChild(card(e)); });
    app.appendChild(g);
  }

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
    var practice = EXAMS.filter(function (e) { return e.kind === 'practice'; });
    var easy = EXAMS.filter(function (e) { return e.kind === 'easy'; });
    var exams = EXAMS.filter(function (e) { return !e.kind; });
    if (practice.length) {
      app.appendChild(el('h2', { class: 'section-title', text: 'תרגול' }));
      var pg = el('div', { class: 'cards' });
      practice.forEach(function (e) { pg.appendChild(card(e)); });
      app.appendChild(pg);
    }
    if (easy.length) {
      app.appendChild(el('h2', { class: 'section-title', text: 'מבחנים קלים' }));
      var eg = el('div', { class: 'cards' });
      easy.forEach(function (e) { eg.appendChild(card(e)); });
      app.appendChild(eg);
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
      exam.kind === 'easy' ? el('a', { class: 'back', href: '#/easy', text: '→ לתרגול מבחנים קלים' }) : el('a', { class: 'back', href: '#', text: '→ לדף הראשי' }),
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

  function failedOf(items) {
    return (items || []).filter(function (t) { return !t.ok; }).map(function (t) { return t.label + (t.why ? ' – ' + t.why : ''); });
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
      logAttempt({ kind: 'solution', part: p.id });
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
        logAttempt({ kind: 'check', part: p.id, ok: !!res.ok, code: input.value, errors: res.ok ? [] : [res.msg] });
        return;
      }
      var code = input.ta.value;
      if (p.type === 'static') {
        var st = p.check(code);
        show(st.ok ? 'good' : 'bad', st.ok ? 'נראה טוב! השוו גם לפתרון לדוגמה.' : 'חסרים פרטים בתשובה:', st.tests);
        setStatus(st.ok ? 'pass' : 'fail');
        logAttempt({ kind: 'check', part: p.id, ok: !!st.ok, code: code, errors: failedOf(st.tests),
          passed: (st.tests || []).filter(function (t) { return t.ok; }).length, total: (st.tests || []).length });
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
          logAttempt({ kind: 'check', part: p.id, ok: false, compile: true, code: code,
            errors: errs.length ? errs.map(function (er) { return (er.line ? 'Line ' + er.line + ': ' : '') + er.msg; }) : [out.log.slice(0, 400)] });
          return;
        }
        var res = Harness.parseResults(out.output);
        var items = srcChecks.concat(res.tests);
        if (res.timeout) items.push({ ok: false, label: 'הבדיקות לא הסתיימו בזמן', why: 'ייתכן שיש לולאה אינסופית' });
        if (!res.done && !res.tests.length) {
          show('bad', 'ההרצה לא החזירה תוצאות. פלט:', null, el('pre', { class: 'code', dir: 'ltr', text: (out.output || '').slice(0, 2000) }));
          setStatus('fail');
          logAttempt({ kind: 'check', part: p.id, ok: false, code: code, errors: ['ההרצה לא החזירה תוצאות: ' + (out.output || '').slice(0, 300)] });
          return;
        }
        var passed = items.filter(function (t) { return t.ok; }).length;
        var allOk = passed === items.length && items.length > 0;
        show(allOk ? 'good' : 'bad', allOk ? 'כל הבדיקות עברו! (' + passed + '/' + items.length + ')' : 'עברו ' + passed + ' מתוך ' + items.length + ' בדיקות:', items);
        setStatus(allOk ? 'pass' : 'fail');
        logAttempt({ kind: 'check', part: p.id, ok: allOk, code: code, passed: passed, total: items.length, errors: failedOf(items) });
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
      var key = parts[0] === 'teacher' && parts[1] ? 'teacher/' + parts[1] : parts[0];
      if (app.dataset.exam !== key) {
        if (parts[0] === 'login') renderLogin(); else if (parts[1]) renderStudentLog(parts[1]); else renderTeacher();
        app.dataset.exam = key;
      }
      window.scrollTo(0, 0);
      return;
    }
    var tab = parts[0] === 'easy' || (exam && exam.kind === 'easy') ? 'easy' : lesson ? lesson.id : exam && exam.kind === 'practice' ? exam.id : 'home';
    Array.prototype.forEach.call(document.querySelectorAll('.tabs a'), function (t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tab);
    });
    var act = document.querySelector('.tabs a.active');
    if (act) { var nav = act.parentNode; nav.scrollLeft += act.getBoundingClientRect().left - nav.getBoundingClientRect().left - 16; }
    if (parts[0] === 'easy') { if (app.dataset.exam !== 'easy') { renderEasy(); app.dataset.exam = 'easy'; } window.scrollTo(0, 0); return; }
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
