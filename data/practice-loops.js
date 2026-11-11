// תרגול לולאות ומערכים – 10 תרגילים מהקל לקשה
(function () {
  function ex(num, level, title, html, starter, solution, tests, extra) {
    var part = {
      id: 'loops-' + num, title: title, points: 10, type: 'java',
      html: html, starter: starter, solution: solution, tests: tests
    };
    Object.keys(extra || {}).forEach(function (k) { part[k] = extra[k]; });
    return { num: num, points: 10, title: title, level: level, parts: [part] };
  }

  (window.EXAMS = window.EXAMS || []).push({
    id: 'loops',
    kind: 'practice',
    title: 'תרגול לולאות ומערכים',
    subtitle: '10 תרגילים מדורגים, מהקל ועד רמת המבחנים',
    intro: 'התרגילים מסודרים מהקל לקשה. התחילו מתרגיל 1, ובכל תרגיל כתבו את השיטה בתיבה ולחצו "בדוק".',
    qLabel: 'תרגיל',
    questions: [
      ex(1, 'קל', 'סכום איברי מערך',
        `<p>כתבו את השיטה <code>public static int sum(int[] a)</code> המחזירה את סכום כל איברי המערך <code>a</code>. עבור מערך ריק השיטה תחזיר 0.</p>
<pre class="code">sum({3, 5, -2, 10}) ==> 16
sum({}) ==> 0</pre>`,
        `public static int sum(int[] a) {

}`,
        `public static int sum(int[] a) {
    int s = 0;
    for (int i = 0; i < a.length; i++) {
        s += a[i];
    }
    return s;
}`,
        [
          ['דוגמה', String.raw`T.eq("sum({3, 5, -2, 10})", 16, sum(new int[]{3, 5, -2, 10}));`],
          ['מערך ריק', String.raw`T.eq("sum({})", 0, sum(new int[]{}));`],
          ['איבר יחיד', String.raw`T.eq("sum({7})", 7, sum(new int[]{7}));`],
          ['שליליים', String.raw`T.eq("sum({-1, -2, -3})", -6, sum(new int[]{-1, -2, -3}));`]
        ]),

      ex(2, 'קל', 'ספירת מספרים זוגיים',
        `<p>כתבו את השיטה <code>public static int countEven(int[] a)</code> המחזירה כמה מאיברי המערך הם מספרים זוגיים.</p>
<pre class="code">countEven({4, 7, 10, 3, 0}) ==> 3   // 4, 10, 0
countEven({1, 3, 5}) ==> 0</pre>
<p class="note">רמז: מספר זוגי הוא מספר שהשארית שלו בחלוקה ב-2 היא 0. שימו לב גם למספרים שליליים.</p>`,
        `public static int countEven(int[] a) {

}`,
        `public static int countEven(int[] a) {
    int count = 0;
    for (int i = 0; i < a.length; i++) {
        if (a[i] % 2 == 0) {
            count++;
        }
    }
    return count;
}`,
        [
          ['דוגמה 1', String.raw`T.eq("countEven({4, 7, 10, 3, 0})", 3, countEven(new int[]{4, 7, 10, 3, 0}));`],
          ['דוגמה 2', String.raw`T.eq("countEven({1, 3, 5})", 0, countEven(new int[]{1, 3, 5}));`],
          ['שליליים', String.raw`T.eq("countEven({-4, -3, -2})", 2, countEven(new int[]{-4, -3, -2}));`],
          ['מערך ריק', String.raw`T.eq("countEven({})", 0, countEven(new int[]{}));`]
        ]),

      ex(3, 'קל', 'אינדקס האיבר הגדול ביותר',
        `<p>כתבו את השיטה <code>public static int maxIndex(int[] a)</code> המחזירה את <b>האינדקס</b> של האיבר הגדול ביותר במערך. אם הערך הגדול ביותר מופיע כמה פעמים, יוחזר האינדקס הראשון. ניתן להניח שהמערך לא ריק.</p>
<pre class="code">maxIndex({3, 9, 2, 9, 1}) ==> 1
maxIndex({-5, -2, -8}) ==> 1</pre>`,
        `public static int maxIndex(int[] a) {

}`,
        `public static int maxIndex(int[] a) {
    int idx = 0;
    for (int i = 1; i < a.length; i++) {
        if (a[i] > a[idx]) {
            idx = i;
        }
    }
    return idx;
}`,
        [
          ['דוגמה 1 – המקסימום מופיע פעמיים', String.raw`T.eq("maxIndex({3, 9, 2, 9, 1})", 1, maxIndex(new int[]{3, 9, 2, 9, 1}));`],
          ['דוגמה 2 – כולם שליליים', String.raw`T.eq("maxIndex({-5, -2, -8})", 1, maxIndex(new int[]{-5, -2, -8}));`],
          ['מקסימום בסוף', String.raw`T.eq("maxIndex({1, 2, 3})", 2, maxIndex(new int[]{1, 2, 3}));`],
          ['איבר יחיד', String.raw`T.eq("maxIndex({42})", 0, maxIndex(new int[]{42}));`]
        ]),

      ex(4, 'בינוני', 'האם המערך ממוין',
        `<p>כתבו את השיטה <code>public static boolean isSorted(int[] a)</code> המחזירה <code>true</code> אם איברי המערך מסודרים בסדר עולה (כל איבר גדול או שווה לאיבר שלפניו), ו-<code>false</code> אחרת. מערך ריק או מערך עם איבר אחד נחשב ממוין.</p>
<pre class="code">isSorted({1, 3, 3, 8}) ==> true
isSorted({1, 5, 4, 8}) ==> false</pre>`,
        `public static boolean isSorted(int[] a) {

}`,
        `public static boolean isSorted(int[] a) {
    for (int i = 1; i < a.length; i++) {
        if (a[i] < a[i - 1]) {
            return false;
        }
    }
    return true;
}`,
        [
          ['דוגמה 1', String.raw`T.eq("isSorted({1, 3, 3, 8})", true, isSorted(new int[]{1, 3, 3, 8}));`],
          ['דוגמה 2', String.raw`T.eq("isSorted({1, 5, 4, 8})", false, isSorted(new int[]{1, 5, 4, 8}));`],
          ['הפרה בסוף', String.raw`T.eq("isSorted({1, 2, 3, 0})", false, isSorted(new int[]{1, 2, 3, 0}));`],
          ['הפרה בהתחלה', String.raw`T.eq("isSorted({5, 1, 2, 3})", false, isSorted(new int[]{5, 1, 2, 3}));`],
          ['מערך ריק', String.raw`T.eq("isSorted({})", true, isSorted(new int[]{}));`],
          ['איבר יחיד', String.raw`T.eq("isSorted({4})", true, isSorted(new int[]{4}));`]
        ]),

      ex(5, 'בינוני', 'היפוך מערך',
        `<p>כתבו את השיטה <code>public static int[] reverse(int[] a)</code> המחזירה <b>מערך חדש</b> שבו איברי <code>a</code> בסדר הפוך. אין לשנות את המערך <code>a</code>.</p>
<pre class="code">reverse({1, 2, 3, 4}) ==> {4, 3, 2, 1}
reverse({}) ==> {}</pre>`,
        `public static int[] reverse(int[] a) {

}`,
        `public static int[] reverse(int[] a) {
    int[] r = new int[a.length];
    for (int i = 0; i < a.length; i++) {
        r[i] = a[a.length - 1 - i];
    }
    return r;
}`,
        [
          ['דוגמה', String.raw`T.eq("reverse({1, 2, 3, 4})", new int[]{4, 3, 2, 1}, reverse(new int[]{1, 2, 3, 4}));`],
          ['אורך אי-זוגי', String.raw`T.eq("reverse({7, 8, 9})", new int[]{9, 8, 7}, reverse(new int[]{7, 8, 9}));`],
          ['מערך ריק', String.raw`T.eq("reverse({})", new int[]{}, reverse(new int[]{}));`],
          ['המערך המקורי לא משתנה', String.raw`int[] a = {1, 2, 3};
            int[] r = reverse(a);
            T.eq("a לא השתנה", new int[]{1, 2, 3}, a);
            T.ok("הוחזר מערך חדש", r != a, "הוחזר אותו מערך");`]
        ]),

      ex(6, 'בינוני', 'כמה פעמים ספרה מופיעה במספר',
        `<p>כתבו את השיטה <code>public static int countDigit(int num, int d)</code> המקבלת מספר שלם אי-שלילי <code>num</code> וספרה <code>d</code> (בין 0 ל-9), ומחזירה כמה פעמים הספרה <code>d</code> מופיעה במספר. יש להשתמש בחלוקה ושארית (<code>/</code> ו-<code>%</code>) ולא להמיר למחרוזת.</p>
<pre class="code">countDigit(17271, 7) ==> 2
countDigit(1234, 5) ==> 0
countDigit(0, 0) ==> 1</pre>`,
        `public static int countDigit(int num, int d) {

}`,
        `public static int countDigit(int num, int d) {
    if (num == 0) {
        return d == 0 ? 1 : 0;
    }
    int count = 0;
    while (num > 0) {
        if (num % 10 == d) {
            count++;
        }
        num = num / 10;
    }
    return count;
}`,
        [
          ['דוגמה 1', String.raw`T.eq("countDigit(17271, 7)", 2, countDigit(17271, 7));`],
          ['דוגמה 2', String.raw`T.eq("countDigit(1234, 5)", 0, countDigit(1234, 5));`],
          ['דוגמה 3 – המספר 0', String.raw`T.eq("countDigit(0, 0)", 1, countDigit(0, 0));`],
          ['אפסים באמצע', String.raw`T.eq("countDigit(10050, 0)", 3, countDigit(10050, 0));`],
          ['ספרה יחידה', String.raw`T.eq("countDigit(9, 9)", 1, countDigit(9, 9));`]
        ],
        { sourceChecks: [{ label: 'אין המרה למחרוזת', re: /^(?![\s\S]*(String\.valueOf|toString|""\s*\+|\+\s*""|Integer\.toString|charAt))/ }] }),

      ex(7, 'בינוני-קשה', 'הרצף הארוך ביותר של ערכים שווים',
        `<p>כתבו את השיטה <code>public static int longestEqualRun(int[] a)</code> המחזירה את אורך הרצף הארוך ביותר של איברים <b>סמוכים</b> שערכם שווה. עבור מערך ריק יוחזר 0.</p>
<pre class="code">longestEqualRun({1, 1, 2, 2, 2, 3, 2}) ==> 3   // 2, 2, 2
longestEqualRun({5, 6, 7}) ==> 1
longestEqualRun({4, 4, 1, 4, 4, 4, 4}) ==> 4   // הרצף בסוף המערך</pre>`,
        `public static int longestEqualRun(int[] a) {

}`,
        `public static int longestEqualRun(int[] a) {
    if (a.length == 0) {
        return 0;
    }
    int best = 1, cur = 1;
    for (int i = 1; i < a.length; i++) {
        if (a[i] == a[i - 1]) {
            cur++;
        } else {
            cur = 1;
        }
        if (cur > best) {
            best = cur;
        }
    }
    return best;
}`,
        [
          ['דוגמה 1', String.raw`T.eq("longestEqualRun({1, 1, 2, 2, 2, 3, 2})", 3, longestEqualRun(new int[]{1, 1, 2, 2, 2, 3, 2}));`],
          ['דוגמה 2 – אין חזרות', String.raw`T.eq("longestEqualRun({5, 6, 7})", 1, longestEqualRun(new int[]{5, 6, 7}));`],
          ['דוגמה 3 – רצף בסוף', String.raw`T.eq("longestEqualRun({4, 4, 1, 4, 4, 4, 4})", 4, longestEqualRun(new int[]{4, 4, 1, 4, 4, 4, 4}));`],
          ['כל המערך', String.raw`T.eq("longestEqualRun({8, 8, 8})", 3, longestEqualRun(new int[]{8, 8, 8}));`],
          ['מערך ריק', String.raw`T.eq("longestEqualRun({})", 0, longestEqualRun(new int[]{}));`]
        ]),

      ex(8, 'קשה', 'הערך השכיח ביותר',
        `<p>כתבו את השיטה <code>public static int mostFrequent(int[] a)</code> המחזירה את הערך שמופיע הכי הרבה פעמים במערך. אם יש כמה ערכים כאלה, יוחזר הערך שמופיע <b>ראשון</b> במערך. ניתן להניח שהמערך לא ריק. אין להשתמש במערך עזר.</p>
<pre class="code">mostFrequent({3, 1, 3, 2, 1, 3}) ==> 3
mostFrequent({5, 7, 7, 5}) ==> 5       // שניהם פעמיים, 5 מופיע ראשון
mostFrequent({9}) ==> 9</pre>`,
        `public static int mostFrequent(int[] a) {

}`,
        `public static int mostFrequent(int[] a) {
    int best = a[0];
    int bestCount = 0;
    for (int i = 0; i < a.length; i++) {
        int count = 0;
        for (int j = 0; j < a.length; j++) {
            if (a[j] == a[i]) {
                count++;
            }
        }
        if (count > bestCount) {
            bestCount = count;
            best = a[i];
        }
    }
    return best;
}`,
        [
          ['דוגמה 1', String.raw`T.eq("mostFrequent({3, 1, 3, 2, 1, 3})", 3, mostFrequent(new int[]{3, 1, 3, 2, 1, 3}));`],
          ['דוגמה 2 – שוויון', String.raw`T.eq("mostFrequent({5, 7, 7, 5})", 5, mostFrequent(new int[]{5, 7, 7, 5}));`],
          ['דוגמה 3 – איבר יחיד', String.raw`T.eq("mostFrequent({9})", 9, mostFrequent(new int[]{9}));`],
          ['השכיח בסוף', String.raw`T.eq("mostFrequent({1, 2, 4, 4, 4})", 4, mostFrequent(new int[]{1, 2, 4, 4, 4}));`],
          ['כולם שונים', String.raw`T.eq("mostFrequent({6, 2, 8})", 6, mostFrequent(new int[]{6, 2, 8}));`],
          ['שליליים', String.raw`T.eq("mostFrequent({-1, -2, -2, 0})", -2, mostFrequent(new int[]{-1, -2, -2, 0}));`]
        ]),

      ex(9, 'קשה – רמת מבחן', 'חלון רצוף עם הסכום הגדול ביותר',
        `<p>בחנות רושמים במערך את מספר המבקרים בכל יום. רוצים למצוא את <b>k הימים הרצופים</b> שבהם היו הכי הרבה מבקרים.</p>
<p>כתבו את השיטה <code>public static int bestWindow(int[] a, int k)</code> המחזירה את האינדקס שבו מתחיל רצף של <code>k</code> איברים סמוכים שסכומם הגדול ביותר. אם יש כמה רצפים כאלה, יוחזר האינדקס של הראשון. אם <code>k</code> קטן מ-1 או גדול מאורך המערך, יוחזר <code>-1</code>.</p>
<pre class="code">a = {4, 2, 7, 1, 8, 3, 0}
bestWindow(a, 2) ==> 4    // 8+3=11 הוא הסכום הגדול ביותר של 2 ימים רצופים
bestWindow(a, 3) ==> 2    // 7+1+8=16
bestWindow(a, 8) ==> -1   // אין 8 ימים במערך</pre>
<p class="note">רמז: כתבו שיטת עזר <code>windowSum(int[] a, int start, int k)</code> שמחשבת סכום של רצף אחד, ובדקו בעזרתה כל נקודת התחלה אפשרית. שימו לב לנקודת ההתחלה האחרונה, כדי לא לחרוג מהמערך.</p>`,
        `public static int bestWindow(int[] a, int k) {

}`,
        `public static int windowSum(int[] a, int start, int k) {
    int s = 0;
    for (int i = start; i < start + k; i++) {
        s += a[i];
    }
    return s;
}

public static int bestWindow(int[] a, int k) {
    if (k < 1 || k > a.length) {
        return -1;
    }
    int best = 0;
    int bestSum = windowSum(a, 0, k);
    for (int start = 1; start <= a.length - k; start++) {
        int sum = windowSum(a, start, k);
        if (sum > bestSum) {
            bestSum = sum;
            best = start;
        }
    }
    return best;
}`,
        [
          ['k = 2', String.raw`T.eq("bestWindow({4, 2, 7, 1, 8, 3, 0}, 2)", 4, bestWindow(new int[]{4, 2, 7, 1, 8, 3, 0}, 2));`],
          ['k = 3', String.raw`T.eq("bestWindow({4, 2, 7, 1, 8, 3, 0}, 3)", 2, bestWindow(new int[]{4, 2, 7, 1, 8, 3, 0}, 3));`],
          ['שוויון – הראשון', String.raw`T.eq("bestWindow({5, 1, 5, 1, 5}, 2)", 0, bestWindow(new int[]{5, 1, 5, 1, 5}, 2));`],
          ['החלון בסוף המערך', String.raw`T.eq("bestWindow({1, 2, 3, 9, 9}, 2)", 3, bestWindow(new int[]{1, 2, 3, 9, 9}, 2));`],
          ['k שווה לאורך המערך', String.raw`T.eq("bestWindow({3, 1, 2}, 3)", 0, bestWindow(new int[]{3, 1, 2}, 3));`],
          ['ערכים שליליים', String.raw`T.eq("bestWindow({-5, -1, -2, -8}, 2)", 1, bestWindow(new int[]{-5, -1, -2, -8}, 2));`],
          ['k לא חוקי', String.raw`T.eq("bestWindow({1, 2}, 3)", -1, bestWindow(new int[]{1, 2}, 3));
            T.eq("bestWindow({1, 2}, 0)", -1, bestWindow(new int[]{1, 2}, 0));`]
        ]),

      ex(10, 'קשה – רמת מבחן', 'דחיסת רצפים במערך',
        `<p>כתבו את השיטה <code>public static int[] compress(int[] a)</code> המחזירה מערך חדש שבו כל רצף של איברים <b>סמוכים</b> שווים מופיע פעם אחת בלבד, לפי הסדר. ערך שמופיע שוב אחרי ערך אחר (לא צמוד) נשאר. המערך המוחזר צריך להיות באורך המדויק (בלי תאים מיותרים), ואין לשנות את <code>a</code>.</p>
<pre class="code">compress({1, 1, 2, 2, 2, 1, 3, 3}) ==> {1, 2, 1, 3}
compress({4, 5, 6}) ==> {4, 5, 6}
compress({7, 7, 7}) ==> {7}
compress({}) ==> {}</pre>
<p class="note">רמז: עברו על המערך פעם אחת כדי לספור כמה רצפים יש (כך תדעו מה גודל המערך החדש), ופעם שנייה כדי למלא אותו.</p>`,
        `public static int[] compress(int[] a) {

}`,
        `public static int[] compress(int[] a) {
    if (a.length == 0) {
        return new int[0];
    }
    // מעבר ראשון: ספירת הרצפים
    int count = 1;
    for (int i = 1; i < a.length; i++) {
        if (a[i] != a[i - 1]) {
            count++;
        }
    }
    // מעבר שני: מילוי המערך החדש
    int[] res = new int[count];
    res[0] = a[0];
    int k = 1;
    for (int i = 1; i < a.length; i++) {
        if (a[i] != a[i - 1]) {
            res[k] = a[i];
            k++;
        }
    }
    return res;
}`,
        [
          ['דוגמה 1', String.raw`T.eq("compress({1, 1, 2, 2, 2, 1, 3, 3})", new int[]{1, 2, 1, 3}, compress(new int[]{1, 1, 2, 2, 2, 1, 3, 3}));`],
          ['דוגמה 2 – אין רצפים', String.raw`T.eq("compress({4, 5, 6})", new int[]{4, 5, 6}, compress(new int[]{4, 5, 6}));`],
          ['דוגמה 3 – רצף אחד', String.raw`T.eq("compress({7, 7, 7})", new int[]{7}, compress(new int[]{7, 7, 7}));`],
          ['דוגמה 4 – מערך ריק', String.raw`T.eq("compress({})", new int[]{}, compress(new int[]{}));`],
          ['רצף בסוף', String.raw`T.eq("compress({1, 2, 2})", new int[]{1, 2}, compress(new int[]{1, 2, 2}));`],
          ['המערך המקורי לא משתנה', String.raw`int[] a = {3, 3, 4};
            compress(a);
            T.eq("a לא השתנה", new int[]{3, 3, 4}, a);`]
        ])
    ]
  });
})();
