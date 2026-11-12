// התחברות והרשמה עם Firebase Authentication, ושמירת סוג המשתמש (מורה / תלמיד) ב-Firestore.
// הקובץ חושף את window.Auth ושולח את האירוע 'authchange' בכל שינוי.
const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';

const state = { ready: false, configured: false, user: null, profile: null, error: null };
const listeners = [];
function emit() {
  window.dispatchEvent(new CustomEvent('authchange', { detail: state }));
  listeners.forEach((fn) => fn(state));
}

const ERRORS = {
  'auth/email-already-in-use': 'כבר קיים משתמש עם האימייל הזה. נסו להתחבר.',
  'auth/invalid-email': 'כתובת האימייל לא תקינה.',
  'auth/weak-password': 'הסיסמה חלשה מדי – לפחות 6 תווים.',
  'auth/missing-password': 'יש להזין סיסמה.',
  'auth/invalid-credential': 'האימייל או הסיסמה שגויים.',
  'auth/wrong-password': 'האימייל או הסיסמה שגויים.',
  'auth/user-not-found': 'האימייל או הסיסמה שגויים.',
  'auth/too-many-requests': 'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.',
  'auth/network-request-failed': 'אין חיבור לרשת.',
  'auth/unauthorized-domain': 'הדומיין של האתר לא מאושר ב-Firebase (Authentication → Settings → Authorized domains).',
  'auth/operation-not-allowed': 'התחברות עם אימייל וסיסמה לא הופעלה ב-Firebase.',
  'permission-denied': 'אין הרשאה. הרשמה כמורה אפשרית רק לאימייל שאושר מראש על ידי מנהל האתר.'
};
function message(e) {
  const code = (e && e.code) || '';
  return ERRORS[code] || ERRORS[code.replace(/^firestore\//, '')] || (e && e.message) || 'שגיאה לא ידועה';
}

const api = {
  state,
  onChange(fn) { listeners.push(fn); fn(state); },
  async signUp() { throw new Error('Firebase לא הוגדר'); },
  async signIn() { throw new Error('Firebase לא הוגדר'); },
  async signOut() {},
  async resetPassword() { throw new Error('Firebase לא הוגדר'); },
  async saveProgress() {},
  async loadProgress() { return null; },
  async listStudents() { return []; },
  async logAttempt() {},
  async listAttempts() { return []; },
  message
};
window.Auth = api;

async function start() {
  const config = window.FIREBASE_CONFIG;
  if (!config || !config.apiKey) { state.ready = true; emit(); return; }
  state.configured = true;
  try {
    const [{ initializeApp }, fa, fs] = await Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js'),
      import(SDK + 'firebase-firestore.js')
    ]);
    const app = initializeApp(config);
    const auth = fa.getAuth(app);
    const db = fs.getFirestore(app);

    async function loadProfile(user) {
      const snap = await fs.getDoc(fs.doc(db, 'users', user.uid));
      return snap.exists() ? snap.data() : null;
    }

    api.signUp = async function (name, email, password, role) {
      state.signingUp = true;
      let cred;
      try {
        cred = await fa.createUserWithEmailAndPassword(auth, email, password);
      } catch (e) {
        state.signingUp = false;
        throw e;
      }
      try {
        await fa.updateProfile(cred.user, { displayName: name });
        const profile = { name: name, email: email.toLowerCase(), role: role, createdAt: fs.serverTimestamp() };
        await fs.setDoc(fs.doc(db, 'users', cred.user.uid), profile);
        state.user = cred.user;
        state.profile = { name: name, email: email.toLowerCase(), role: role };
        state.signingUp = false;
        emit();
      } catch (e) {
        // לא הצלחנו לשמור את הפרופיל (למשל: הרשמה כמורה בלי אישור) – מוחקים את המשתמש שנוצר
        state.signingUp = false;
        try { await cred.user.delete(); } catch (e2) { await fa.signOut(auth); }
        throw e;
      }
      return cred.user;
    };
    api.signIn = (email, password) => fa.signInWithEmailAndPassword(auth, email, password);
    api.signOut = () => fa.signOut(auth);
    api.resetPassword = (email) => fa.sendPasswordResetEmail(auth, email);

    // ההתקדמות של התלמיד נשמרת ב-progress/{uid}
    api.saveProgress = async function (data) {
      if (!state.user) return;
      await fs.setDoc(fs.doc(db, 'progress', state.user.uid), { data: JSON.stringify(data), updatedAt: fs.serverTimestamp() });
    };
    api.loadProgress = async function () {
      if (!state.user) return null;
      const snap = await fs.getDoc(fs.doc(db, 'progress', state.user.uid));
      if (!snap.exists()) return null;
      try { return JSON.parse(snap.data().data); } catch (e) { return null; }
    };
    // למורה: רשימת התלמידים וההתקדמות שלהם
    api.listStudents = async function () {
      const users = await fs.getDocs(fs.query(fs.collection(db, 'users'), fs.where('role', '==', 'student')));
      const out = [];
      for (const u of users.docs) {
        const p = await fs.getDoc(fs.doc(db, 'progress', u.id));
        let data = null;
        if (p.exists()) { try { data = JSON.parse(p.data().data); } catch (e) { } }
        out.push({ uid: u.id, name: u.data().name, email: u.data().email, progress: data, updatedAt: p.exists() && p.data().updatedAt ? p.data().updatedAt.toDate() : null });
      }
      return out;
    };

    // יומן לחיצות: כל "בדוק" וכל "הצג פתרון" של משתמש מחובר נשמר כמסמך ב-attempts
    api.logAttempt = async function (entry) {
      if (!state.user || !state.profile) return;
      const data = Object.assign({}, entry, { uid: state.user.uid, at: fs.serverTimestamp() });
      await fs.addDoc(fs.collection(db, 'attempts'), data);
    };
    // למורה (או לתלמיד עצמו): כל הלחיצות של תלמיד אחד, מהחדשה לישנה
    api.listAttempts = async function (uid) {
      const snap = await fs.getDocs(fs.query(fs.collection(db, 'attempts'), fs.where('uid', '==', uid)));
      const out = snap.docs.map((d) => {
        const x = d.data();
        return Object.assign({}, x, { id: d.id, at: x.at && x.at.toDate ? x.at.toDate() : null });
      });
      out.sort((a, b) => (b.at ? b.at.getTime() : 0) - (a.at ? a.at.getTime() : 0));
      return out;
    };
    api.getUser = async function (uid) {
      const snap = await fs.getDoc(fs.doc(db, 'users', uid));
      return snap.exists() ? snap.data() : null;
    };

    fa.onAuthStateChanged(auth, async (user) => {
      if (user && state.signingUp) return; // signUp יעדכן בעצמו אחרי שמירת הפרופיל
      state.user = user;
      state.profile = null;
      if (user) {
        try { state.profile = await loadProfile(user); } catch (e) { state.error = message(e); }
      }
      state.ready = true;
      emit();
    });
  } catch (e) {
    state.ready = true;
    state.error = 'טעינת Firebase נכשלה: ' + message(e);
    emit();
  }
}
start();
