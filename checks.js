// בדיקות לשאלות טקסט (מעקב קוד) – רצות ישירות ב-JavaScript
(function (root) {
  'use strict';
  function norm(s) {
    s = String(s == null ? '' : s).replace(/\r/g, '').trim();
    // הסרת מירכאות חיצוניות אם התלמיד הקיף את התשובה במירכאות
    var m = /^["“”'](.*)["“”']$/.exec(s);
    if (m) s = m[1];
    return s;
  }
  var Checks = {
    norm: norm,
    exact: function (input, expected) {
      var s = norm(input);
      if (!s) return { ok: false, msg: 'לא נכתבה תשובה.' };
      if (s === expected) return { ok: true, msg: 'נכון!' };
      if (s.toLowerCase() === expected.toLowerCase()) return { ok: false, msg: 'כמעט – שימו לב לאותיות גדולות וקטנות.' };
      if (s.replace(/\s+/g, '') === expected.replace(/\s+/g, '')) return { ok: false, msg: 'כמעט – שימו לב לרווחים.' };
      return { ok: false, msg: 'לא נכון. נסו לעקוב שוב אחרי הקוד שורה אחר שורה.' };
    },
    // התשובה נכונה אם הרצת הפונקציה על הקלט שנכתב נותנת את הפלט הדרוש
    byRun: function (input, fn, expected) {
      var s = norm(input);
      if (!s && expected !== '') return { ok: false, msg: 'לא נכתבה תשובה.' };
      var got = fn(s);
      if (got === expected) return { ok: true, msg: 'נכון! עבור הקלט "' + s + '" השיטה מחזירה "' + got + '".' };
      return { ok: false, msg: 'לא נכון. עבור הקלט "' + s + '" השיטה מחזירה "' + got + '" ולא "' + expected + '".' };
    },
    // מפרק רשימת ערכים בוליאניים / מספרים מתוך טקסט
    list: function (input) {
      return norm(input).replace(/[{}\[\]]/g, '').split(/[\s,]+/).filter(function (x) { return x.length; });
    },
    // הסרת התחילית "a = " אם נכתבה
    stripAssign: function (input) { return norm(input).replace(/^\w+\s*=\s*/, '').replace(/;\s*$/, ''); }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Checks;
  else root.Checks = Checks;
})(this);
