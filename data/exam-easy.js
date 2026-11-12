// מבחני תרגול קלים (גרסאות א, ב, ג) – לפי מבנה מבחן 11203 ברמה קלה יותר
(function () {
  // main של התלמיד הופך ל-studentMain כדי לא להתנגש ב-main של הבדיקות
  function renameMain(code) { return code.replace(/\bvoid\s+main\s*\(/, 'void studentMain('); }
  // בשאלת התנאי התלמיד כותב רק את התנאי; מסירים "if" וסוגר מסולסל אם נכתבו
  function condOnly(code) {
    return code.trim().replace(/^if\b\s*/, '').replace(/\{\s*$/, '').replace(/;\s*$/, '').trim();
  }
  // תשובת מעקב: המספר הראשון שנכתב (אפשר להוסיף הסבר אחריו)
  function numAnswer(expected) {
    return function (s) {
      var t = Checks.norm(s);
      if (!t) return { ok: false, msg: 'לא נכתבה תשובה.' };
      var m = /-?\d+(\.\d+)?/.exec(t);
      if (!m) return { ok: false, msg: 'כתבו את המספר שיוחזר (אפשר להוסיף הסבר אחריו).' };
      if (Number(m[0]) === expected) return { ok: true, msg: 'נכון! השיטה מחזירה ' + expected + '.' };
      return { ok: false, msg: 'לא נכון. נסו לעקוב אחרי הלולאה איבר אחר איבר ולרשום את ערך המשתנה בכל שלב.' };
    };
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function lines(arr) { return 'new String[]{' + arr.map(function (x) { return JSON.stringify(x); }).join(', ') + '}'; }

  function makeExam(c) {
    var id = c.id;
    var C = c.q1, A = c.q2, O = c.q3, F = c.q4;

    // ---------- שאלה 1 ----------
    var cls1Starter = `public class ${C.cls} {
    private String ${C.strField};
    private int ${C.numField};

    public ${C.cls}(String ${C.strField}, int ${C.numField}) {
        // השלימו את הבנאי

    }

    public int ${C.getter}() {
        // השלימו

    }

    public boolean ${C.pred}() {
        // השלימו

    }
}`;
    var cls1Solution = `public class ${C.cls} {
    private String ${C.strField};
    private int ${C.numField};

    public ${C.cls}(String ${C.strField}, int ${C.numField}) {
        this.${C.strField} = ${C.strField};
        this.${C.numField} = ${C.numField};
    }

    public int ${C.getter}() {
        return ${C.numField};
    }

    public boolean ${C.pred}() {
        return ${C.numField} ${C.op} ${C.limit};
    }
}`;
    var cls1Support = `static class ${C.cls} {
    private String ${C.strField};
    private int ${C.numField};
    public ${C.cls}(String ${C.strField}, int ${C.numField}) { this.${C.strField} = ${C.strField}; this.${C.numField} = ${C.numField}; }
    public String ${C.strGetter}() { return ${C.strField}; }
    public int ${C.getter}() { return ${C.numField}; }
    public boolean ${C.pred}() { return ${C.numField} ${C.op} ${C.limit}; }
}`;
    var holderStarter = `public class ${C.holder} {
    private ${C.holderFieldType} ${C.holderField};
    private ${C.cls} ${C.objField};

    public ${C.holder}(${C.holderFieldType} ${C.holderField}, ${C.cls} ${C.objField}) {
        // השלימו

    }

    public boolean ${C.holderPred}() {
        // השלימו

    }
}`;
    var holderSolution = `public class ${C.holder} {
    private ${C.holderFieldType} ${C.holderField};
    private ${C.cls} ${C.objField};

    public ${C.holder}(${C.holderFieldType} ${C.holderField}, ${C.cls} ${C.objField}) {
        this.${C.holderField} = ${C.holderField};
        this.${C.objField} = ${C.objField};
    }

    public boolean ${C.holderPred}() {
        return ${C.objField}.${C.pred}();
    }
}`;
    var q1 = {
      num: 1, points: 28, title: 'מחלקות ועצמים',
      intro: `<p>${C.intro}</p>`,
      parts: [
        {
          id: id + '-1a', title: 'סעיף א – השלמת מחלקה', points: 12, type: 'java',
          html: `<p>השלימו בנאי המקבל שני ערכים ושומר אותם בתכונות; השלימו את השיטה <code>${C.getter}</code> המחזירה את התכונה המספרית; והשלימו את השיטה הבוליאנית <code>${C.pred}</code>: ${C.predText}</p>`,
          starter: cls1Starter, solution: cls1Solution,
          tests: [
            ['הבנאי שומר את התכונות', String.raw`${C.cls} x = new ${C.cls}("${C.sample[0]}", ${C.sample[1]});
              T.eq("${C.strField} אחרי new ${C.cls}(\"${C.sample[0]}\", ${C.sample[1]})", "${C.sample[0]}", x.${C.strField});
              T.eq("${C.numField} אחרי new ${C.cls}(\"${C.sample[0]}\", ${C.sample[1]})", ${C.sample[1]}, x.${C.numField});`],
            [C.getter, String.raw`T.eq("${C.getter}() מחזירה ${C.sample[1]}", ${C.sample[1]}, new ${C.cls}("${C.sample[0]}", ${C.sample[1]}).${C.getter}());
              T.eq("${C.getter}() מחזירה ${C.sample2}", ${C.sample2}, new ${C.cls}("X", ${C.sample2}).${C.getter}());`]
          ].concat(C.predCases.map(function (pc) {
            return [C.pred + '(' + pc[0] + ')', String.raw`T.eq("${C.pred}() עבור ${C.numField} = ${pc[0]}", ${pc[1]}, new ${C.cls}("X", ${pc[0]}).${C.pred}());`];
          }))
        },
        {
          id: id + '-1b', title: 'סעיף ב – מחלקה המכילה עצם', points: 10, type: 'java',
          html: `<p>${C.holderText} השתמשו בשיטה <code>${C.pred}</code>.</p><p class="note">המחלקה <code>${C.cls}</code> מסעיף א נתונה וכתובה.</p>`,
          starter: holderStarter, solution: holderSolution, support: cls1Support,
          sourceChecks: [{ label: 'השיטה משתמשת ב-' + C.pred, re: new RegExp('\\.\\s*' + C.pred + '\\s*\\(') }],
          tests: [
            ['עצם שמקיים את התנאי', String.raw`T.eq("${C.holderPred}() כש-${C.pred}() מחזירה true", true, new ${C.holder}(${C.holderSample}, new ${C.cls}("A", ${C.yesVal})).${C.holderPred}());`],
            ['עצם שלא מקיים את התנאי', String.raw`T.eq("${C.holderPred}() כש-${C.pred}() מחזירה false", false, new ${C.holder}(${C.holderSample}, new ${C.cls}("B", ${C.noVal})).${C.holderPred}());`],
            ['הבנאי שומר את התכונות', String.raw`${C.cls} o = new ${C.cls}("C", ${C.yesVal});
              ${C.holder} h = new ${C.holder}(${C.holderSample}, o);
              T.eq("${C.holderField} נשמר בבנאי", ${C.holderSample}, h.${C.holderField});
              T.ok("${C.objField} נשמר בבנאי", h.${C.objField} == o, "התכונה ${C.objField} לא קיבלה את העצם שהועבר לבנאי");`]
          ]
        },
        {
          id: id + '-1c', title: 'סעיף ג – כתיבת תוכנית ראשית', points: 6, type: 'java',
          html: `<p>${C.mainText}</p><p class="note">המחלקה <code>${C.cls}</code> נתונה, ויש בה גם את השיטה <code>${C.strGetter}()</code> המחזירה את ה-${C.strField}. כל הדפסה בשורה נפרדת (<code>System.out.println</code>).</p>`,
          starter: `public static void main(String[] args) {
    // כתבו כאן את הפקודות

}`,
          solution: C.mainSolution, support: cls1Support, prep: renameMain,
          sourceChecks: [{ label: 'נוצרים שני עצמים מסוג ' + C.cls, re: new RegExp('new\\s+' + C.cls + '\\s*\\([\\s\\S]*new\\s+' + C.cls + '\\s*\\(') }],
          tests: [
            ['הפלט', String.raw`String[] out = T.capture(new Runnable() { public void run() { studentMain(new String[0]); } });
              for (int i = 0; i < out.length; i++) out[i] = out[i].trim();
              T.eq("הפלט של התוכנית", java.util.Arrays.toString(${lines(C.mainOut)}), java.util.Arrays.toString(out));`]
          ]
        }
      ]
    };

    // ---------- שאלה 2 ----------
    var q2 = {
      num: 2, points: 26, title: 'מערך חד־ממדי',
      intro: `<p>${A.intro}</p><pre class="code" dir="ltr">${A.decl}</pre>`,
      parts: A.parts.map(function (m, i) {
        return {
          id: id + '-2' + 'ab'[i], title: (i ? 'סעיף ב – חישוב במערך' : 'סעיף א – ספירה במערך'), points: i ? 14 : 12, type: 'java',
          html: `<p>כתבו שיטה סטטית לפי החתימה הבאה. ${m.text}</p>`,
          starter: `${m.sig} {
    // כתבו את הקוד

}`,
          solution: `${m.sig} {
${m.body}
}`,
          tests: m.cases.map(function (cs) {
            return ['' + cs[0], String.raw`T.eq("${m.name}(${cs[0]})", ${cs[1]}, ${m.name}(new int[]${cs[0]}));`];
          })
        };
      })
    };

    // ---------- שאלה 3 ----------
    var itemSupport = `static class ${O.item} {
    private String name;
    private int ${O.num};
    public ${O.item}(String name, int ${O.num}) { this.name = name; this.${O.num} = ${O.num}; }
    public String getName() { return name; }
    public int ${O.getter}() { return ${O.num}; }
}`;
    function container(method, body) {
      return `public class ${O.box} {
    private ${O.item}[] ${O.arr};
    private int size; // מספר העצמים בפועל

    public ${O.box}(int maxSize) {          // נתון
        ${O.arr} = new ${O.item}[maxSize];
        size = 0;
    }

    public void add(${O.item} x) {          // נתון
        ${O.arr}[size] = x;
        size++;
    }

    ${method} {
${body}
    }
}`;
    }
    function build(list, max) {
      return `${O.box} c = new ${O.box}(${max || 10});` + list.map(function (x) { return ` c.add(new ${O.item}("${x[0]}", ${x[1]}));`; }).join('');
    }
    function listText(list) { return list.length ? list.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') : 'ריק'; }
    var q3 = {
      num: 3, points: 30, title: 'מערך עצמים',
      intro: `<p>${O.intro}</p>
<pre class="code" dir="ltr">public class ${O.item} {
    private String name;
    private int ${O.num};

    public ${O.item}(String name, int ${O.num}) { ... }
    public String getName() { ... }
    public int ${O.getter}() { ... }
}</pre>
<p class="note">האיברים בשימוש נמצאים באינדקסים 0 עד <code>size-1</code> ברצף, ואין בתחום הזה <code>null</code>. אפשר להשתמש בשיטות <code>getName</code> ו-<code>${O.getter}</code> בלי לממש אותן. בתיבה נתונים גם הבנאי והשיטה <code>add</code> שמוסיפה עצם.</p>`,
      parts: O.parts.map(function (m, i) {
        return {
          id: id + '-3' + 'abc'[i], title: ['סעיף א – ספירת עצמים', 'סעיף ב – חיפוש העצם הראשון', 'סעיף ג – סכימה'][i], points: 10, type: 'java',
          html: `<p>כתבו את השיטה <code>${esc(m.sig)}()</code>. ${m.text}</p>`,
          starter: container(m.sig + '()', '        // השלימו\n'),
          solution: container(m.sig + '()', m.body),
          support: itemSupport,
          tests: m.cases.map(function (cs) {
            return ['' + listText(cs[0]), String.raw`${build(cs[0])} T.eq("${m.name}() עבור: ${listText(cs[0])}", ${JSON.stringify(cs[1])}, c.${m.name}());`];
          })
        };
      })
    };

    // ---------- שאלה 4 ----------
    var fooCode = F.code;
    var q4 = {
      num: 4, points: 16, title: 'ניתוח קוד',
      intro: `<p>לפניכם השיטה <code>foo</code>. עיינו בקוד וענו על הסעיפים.</p><pre class="code" dir="ltr">${esc(fooCode)}</pre>`,
      parts: [
        {
          id: id + '-4a', title: 'סעיף א – מעקב אחר פלט', points: 5, type: 'text',
          html: `<p>מה יוחזר מהקריאה הבאה? (כתבו את המספר, ואפשר להוסיף הסבר קצר אחריו.)</p><pre class="code" dir="ltr">foo(new int[]${F.call1[0]})</pre>`,
          placeholder: 'הערך שיוחזר', check: numAnswer(F.call1[1]), solution: String(F.call1[1]) + ' – ' + F.call1[2]
        },
        {
          id: id + '-4b', title: 'סעיף ב – מעקב נוסף', points: 5, type: 'text',
          html: `<p>מה יוחזר מהקריאה הבאה?</p><pre class="code" dir="ltr">foo(new int[]${F.call2[0]})</pre>`,
          placeholder: 'הערך שיוחזר', check: numAnswer(F.call2[1]), solution: String(F.call2[1]) + ' – ' + F.call2[2]
        },
        {
          id: id + '-4c', title: 'סעיף ג – שינוי תנאי', points: 6, type: 'java',
          html: `<p>${F.condText}</p><p class="note">כתבו בתיבה רק את התנאי שבתוך <code>if ( ... )</code>. בתיבה נמצא התנאי המקורי – שנו אותו.</p>`,
          starter: F.oldCond, solution: F.newCond, prep: condOnly,
          wrap: 'static int foo(int[] a) {\n' + F.wrapBefore + '\n        if (\n%%CODE%%\n        ) {\n' + F.wrapInside + '\n        }\n    }\n' + F.wrapAfter + '\n}\n',
          tests: F.condCases.map(function (cs) {
            return ['' + cs[0], String.raw`T.eq("foo(${cs[0]}) עם התנאי החדש", ${cs[1]}, foo(new int[]${cs[0]}));`];
          })
        }
      ]
    };

    return {
      id: id, kind: 'easy', title: c.title, subtitle: c.subtitle,
      intro: 'במבחן 4 שאלות, יש לענות על כולן. משך מומלץ: 90–120 דקות. הניקוד הכולל: 100 נקודות. אפשר להניח שהנתונים תקינים אלא אם נאמר אחרת.',
      questions: [q1, q2, q3, q4]
    };
  }

  var EX = window.EXAMS = window.EXAMS || [];

  // ===================== גרסה א – ספרייה בית ספרית =====================
  EX.push(makeExam({
    id: 'ea', title: 'מבחן קל – גרסה א', subtitle: 'ספרייה בית ספרית · מבוסס על מבנה מבחן 11203, ברמה קלה יותר',
    q1: {
      cls: 'Book', strField: 'title', numField: 'pages', strGetter: 'getTitle', getter: 'getPages', pred: 'isLong', op: '>', limit: 200,
      intro: 'המחלקה <code>Book</code> מתארת ספר בספרייה בית ספרית. לכל עצם שתי תכונות: <code>title</code> (שם הספר) ו-<code>pages</code> (מספר העמודים).',
      predText: 'מחזירה <code>true</code> אם בספר יש יותר מ-200 עמודים, ואחרת <code>false</code>.',
      sample: ['Java', 150], sample2: 320, predCases: [[201, true], [200, false], [450, true], [90, false]],
      holder: 'LibraryCard', holderFieldType: 'String', holderField: 'student', objField: 'book', holderPred: 'hasLongBook', holderSample: '"Dana"', yesVal: 250, noVal: 150,
      holderText: 'נתונה המחלקה <code>LibraryCard</code> עם שתי תכונות: שם התלמיד ועצם מסוג <code>Book</code>. השלימו את הבנאי ואת השיטה <code>hasLongBook</code>, המחזירה <code>true</code> אם הספר בכרטיס הוא ספר ארוך.',
      mainText: 'צרו שני ספרים: הראשון בשם <code>"Java"</code> ובו 150 עמודים, והשני בשם <code>"Science"</code> ובו 250 עמודים. הדפיסו את שם הספר הראשון ואת התוצאה של <code>isLong</code> עבור הספר השני.',
      mainSolution: `public static void main(String[] args) {
    Book b1 = new Book("Java", 150);
    Book b2 = new Book("Science", 250);
    System.out.println(b1.getTitle());
    System.out.println(b2.isLong());
}`,
      mainOut: ['Java', 'true']
    },
    q2: {
      intro: 'נתון מערך של מספרים שלמים המייצג ציוני תלמידים במבחן:', decl: 'int[] scores = {70, 90, 60, 80, 100};',
      parts: [
        { name: 'countPassing', sig: 'public static int countPassing(int[] scores)', text: 'השיטה מחזירה כמה ציונים במערך גדולים או שווים ל-60.',
          body: `    int count = 0;
    for (int i = 0; i < scores.length; i++) {
        if (scores[i] >= 60) {
            count++;
        }
    }
    return count;`,
          cases: [['{70, 90, 60, 80, 100}', 5], ['{50, 59, 60, 61}', 2], ['{10, 20}', 0], ['{}', 0], ['{100}', 1]] },
        { name: 'averageScore', sig: 'public static double averageScore(int[] scores)', text: 'השיטה מחזירה את ממוצע הציונים במערך. אפשר להניח שהמערך אינו ריק.',
          body: `    int sum = 0;
    for (int i = 0; i < scores.length; i++) {
        sum += scores[i];
    }
    return (double) sum / scores.length;`,
          cases: [['{70, 90, 60, 80, 100}', '80.0'], ['{1, 2}', '1.5'], ['{55}', '55.0'], ['{90, 85, 70}', '245.0 / 3']] }
      ]
    },
    q3: {
      item: 'Student', num: 'grade', getter: 'getGrade', box: 'Classroom', arr: 'students',
      intro: 'נתונה המחלקה <code>Student</code>, המייצגת תלמיד. יש לה שתי תכונות: שם התלמיד וציון התלמיד. נתונה גם המחלקה <code>Classroom</code>, המחזיקה מערך של עצמים מסוג <code>Student</code>.',
      parts: [
        { name: 'countPassing', sig: 'public int countPassing', text: 'היא מחזירה את מספר התלמידים שציונם 60 ומעלה.',
          body: `        int count = 0;
        for (int i = 0; i < size; i++) {
            if (students[i].getGrade() >= 60) {
                count++;
            }
        }
        return count;`,
          cases: [[[['Dan', 70], ['Noa', 59], ['Avi', 60], ['Tal', 95]], 3], [[['Dan', 40]], 0], [[], 0], [[['A', 100], ['B', 100]], 2]] },
        { name: 'firstExcellent', sig: 'public String firstExcellent', text: 'היא מחזירה את שם התלמיד הראשון שציונו 90 ומעלה; אם אין כזה, היא מחזירה <code>"None"</code>.',
          body: `        for (int i = 0; i < size; i++) {
            if (students[i].getGrade() >= 90) {
                return students[i].getName();
            }
        }
        return "None";`,
          cases: [[[['Dan', 70], ['Noa', 92], ['Avi', 99]], 'Noa'], [[['Dan', 89], ['Noa', 90]], 'Noa'], [[['Dan', 50]], 'None'], [[], 'None']] },
        { name: 'sumGrades', sig: 'public int sumGrades', text: 'היא מחזירה את סכום הציונים של כל התלמידים.',
          body: `        int sum = 0;
        for (int i = 0; i < size; i++) {
            sum += students[i].getGrade();
        }
        return sum;`,
          cases: [[[['Dan', 70], ['Noa', 90], ['Avi', 60]], 220], [[['Dan', 100]], 100], [[], 0]] }
      ]
    },
    q4: {
      code: `public static int foo(int[] a) {
    int count = 0;
    for (int i = 0; i < a.length; i++) {
        if (a[i] > 5) {
            count++;
        }
    }
    return count;
}`,
      call1: ['{3, 7, 9, 2}', 2, 'השיטה סופרת כמה איברים גדולים מ-5: רק 7 ו-9.'],
      call2: ['{1, 4, 8, 10}', 2, 'רק 8 ו-10 גדולים מ-5.'],
      condText: 'שנו את התנאי בשורה של <code>if</code> כך שהשיטה תספור איברים <b>זוגיים</b> במקום איברים שגדולים מ-5.',
      oldCond: 'a[i] > 5', newCond: 'a[i] % 2 == 0',
      wrapBefore: '    int count = 0;\n    for (int i = 0; i < a.length; i++) {', wrapInside: '            count++;', wrapAfter: '    return count;',
      condCases: [['{1, 2, 3, 4}', 2], ['{2, 4, 6}', 3], ['{1, 3, 5}', 0], ['{10, 7, 6, 5}', 2], ['{0, 9}', 1]]
    }
  }));

  // ===================== גרסה ב – חנות צעצועים =====================
  EX.push(makeExam({
    id: 'eb', title: 'מבחן קל – גרסה ב', subtitle: 'חנות צעצועים · מבוסס על מבנה מבחן 11203, ברמה קלה יותר',
    q1: {
      cls: 'Toy', strField: 'name', numField: 'price', strGetter: 'getName', getter: 'getPrice', pred: 'isCheap', op: '<', limit: 50,
      intro: 'המחלקה <code>Toy</code> מתארת צעצוע בחנות צעצועים. לכל עצם שתי תכונות: <code>name</code> (שם הצעצוע) ו-<code>price</code> (מחיר הצעצוע בשקלים).',
      predText: 'מחזירה <code>true</code> אם מחיר הצעצוע נמוך מ-50 שקלים, ואחרת <code>false</code>.',
      sample: ['Ball', 30], sample2: 120, predCases: [[49, true], [50, false], [10, true], [200, false]],
      holder: 'Gift', holderFieldType: 'String', holderField: 'receiver', objField: 'toy', holderPred: 'isBudgetGift', holderSample: '"Yael"', yesVal: 30, noVal: 120,
      holderText: 'נתונה המחלקה <code>Gift</code> עם שתי תכונות: שם מקבל המתנה ועצם מסוג <code>Toy</code>. השלימו את הבנאי ואת השיטה <code>isBudgetGift</code>, המחזירה <code>true</code> אם הצעצוע במתנה הוא זול.',
      mainText: 'צרו שני צעצועים: <code>"Ball"</code> במחיר 30 ו-<code>"Robot"</code> במחיר 120. הדפיסו את מחיר הצעצוע הראשון ואת התוצאה של <code>isCheap</code> עבור השני.',
      mainSolution: `public static void main(String[] args) {
    Toy t1 = new Toy("Ball", 30);
    Toy t2 = new Toy("Robot", 120);
    System.out.println(t1.getPrice());
    System.out.println(t2.isCheap());
}`,
      mainOut: ['30', 'false']
    },
    q2: {
      intro: 'נתון מערך של מספרים שלמים המייצג מחירי מוצרים בחנות:', decl: 'int[] prices = {20, 70, 35, 90, 40};',
      parts: [
        { name: 'countCheap', sig: 'public static int countCheap(int[] prices)', text: 'השיטה מחזירה כמה מחירים במערך קטנים מ-50.',
          body: `    int count = 0;
    for (int i = 0; i < prices.length; i++) {
        if (prices[i] < 50) {
            count++;
        }
    }
    return count;`,
          cases: [['{20, 70, 35, 90, 40}', 3], ['{49, 50, 51}', 1], ['{100, 200}', 0], ['{}', 0]] },
        { name: 'totalPrice', sig: 'public static int totalPrice(int[] prices)', text: 'השיטה מחזירה את סכום המחירים במערך.',
          body: `    int sum = 0;
    for (int i = 0; i < prices.length; i++) {
        sum += prices[i];
    }
    return sum;`,
          cases: [['{20, 70, 35, 90, 40}', 255], ['{5}', 5], ['{}', 0], ['{10, 10, 10}', 30]] }
      ]
    },
    q3: {
      item: 'Product', num: 'stock', getter: 'getStock', box: 'Store', arr: 'products',
      intro: 'נתונה המחלקה <code>Product</code>, המייצגת מוצר. יש לה שתי תכונות: שם המוצר וכמות המוצר במלאי. נתונה גם המחלקה <code>Store</code>, המחזיקה מערך של עצמים מסוג <code>Product</code>.',
      parts: [
        { name: 'countInStock', sig: 'public int countInStock', text: 'היא מחזירה את מספר המוצרים שכמותם במלאי גדולה מ-0.',
          body: `        int count = 0;
        for (int i = 0; i < size; i++) {
            if (products[i].getStock() > 0) {
                count++;
            }
        }
        return count;`,
          cases: [[[['Pen', 5], ['Cup', 0], ['Bag', 1]], 2], [[['Pen', 0]], 0], [[], 0], [[['A', 3], ['B', 7]], 2]] },
        { name: 'firstOutOfStock', sig: 'public String firstOutOfStock', text: 'היא מחזירה את שם המוצר הראשון שכמותו במלאי היא 0; אם אין כזה, היא מחזירה <code>"None"</code>.',
          body: `        for (int i = 0; i < size; i++) {
            if (products[i].getStock() == 0) {
                return products[i].getName();
            }
        }
        return "None";`,
          cases: [[[['Pen', 5], ['Cup', 0], ['Bag', 0]], 'Cup'], [[['Pen', 0]], 'Pen'], [[['Pen', 2], ['Cup', 1]], 'None'], [[], 'None']] },
        { name: 'totalItems', sig: 'public int totalItems', text: 'היא מחזירה את סכום כל היחידות במלאי בכל המוצרים.',
          body: `        int sum = 0;
        for (int i = 0; i < size; i++) {
            sum += products[i].getStock();
        }
        return sum;`,
          cases: [[[['Pen', 5], ['Cup', 0], ['Bag', 12]], 17], [[['Pen', 3]], 3], [[], 0]] }
      ]
    },
    q4: {
      code: `public static int foo(int[] a) {
    int sum = 0;
    for (int i = 0; i < a.length; i++) {
        if (a[i] < 10) {
            sum += a[i];
        }
    }
    return sum;
}`,
      call1: ['{4, 12, 3, 10}', 7, 'השיטה מחברת רק את האיברים הקטנים מ-10: 4 + 3 = 7 (10 אינו קטן מ-10).'],
      call2: ['{1, 2, 15, 6}', 9, '1 + 2 + 6 = 9.'],
      condText: 'שנו את התנאי בשורה של <code>if</code> כך שהשיטה תחבר רק מספרים <b>גדולים מ-10</b>.',
      oldCond: 'a[i] < 10', newCond: 'a[i] > 10',
      wrapBefore: '    int sum = 0;\n    for (int i = 0; i < a.length; i++) {', wrapInside: '            sum += a[i];', wrapAfter: '    return sum;',
      condCases: [['{4, 12, 3, 10}', 12], ['{11, 10, 20}', 31], ['{1, 2}', 0], ['{100}', 100]]
    }
  }));

  // ===================== גרסה ג – חוג ספורט =====================
  EX.push(makeExam({
    id: 'ec', title: 'מבחן קל – גרסה ג', subtitle: 'חוג ספורט · מבוסס על מבנה מבחן 11203, ברמה קלה יותר',
    q1: {
      cls: 'Player', strField: 'name', numField: 'goals', strGetter: 'getName', getter: 'getGoals', pred: 'isTopPlayer', op: '>=', limit: 5,
      intro: 'המחלקה <code>Player</code> מתארת שחקן בחוג ספורט. לכל עצם שתי תכונות: <code>name</code> (שם השחקן) ו-<code>goals</code> (מספר השערים שהבקיע).',
      predText: 'מחזירה <code>true</code> אם השחקן הבקיע לפחות 5 שערים, ואחרת <code>false</code>.',
      sample: ['Dan', 2], sample2: 11, predCases: [[5, true], [4, false], [12, true], [0, false]],
      holder: 'TeamMember', holderFieldType: 'int', holderField: 'shirtNumber', objField: 'player', holderPred: 'hasTopPlayer', holderSample: '10', yesVal: 7, noVal: 2,
      holderText: 'נתונה המחלקה <code>TeamMember</code> עם שתי תכונות: מספר החולצה ועצם מסוג <code>Player</code>. השלימו את הבנאי ואת השיטה <code>hasTopPlayer</code>, המחזירה <code>true</code> אם השחקן הוא שחקן מצטיין.',
      mainText: 'צרו שני שחקנים: <code>"Dan"</code> עם 2 שערים ו-<code>"Noam"</code> עם 7 שערים. הדפיסו את שם השחקן הראשון ואת התוצאה של <code>isTopPlayer</code> עבור השני.',
      mainSolution: `public static void main(String[] args) {
    Player p1 = new Player("Dan", 2);
    Player p2 = new Player("Noam", 7);
    System.out.println(p1.getName());
    System.out.println(p2.isTopPlayer());
}`,
      mainOut: ['Dan', 'true']
    },
    q2: {
      intro: 'נתון מערך של מספרים שלמים המייצג את מספר הצעדים שנמדדו בחמישה ימים:', decl: 'int[] steps = {4000, 6000, 3000, 8000, 5000};',
      parts: [
        { name: 'countActiveDays', sig: 'public static int countActiveDays(int[] steps)', text: 'השיטה מחזירה בכמה ימים נמדדו לפחות 5000 צעדים.',
          body: `    int count = 0;
    for (int i = 0; i < steps.length; i++) {
        if (steps[i] >= 5000) {
            count++;
        }
    }
    return count;`,
          cases: [['{4000, 6000, 3000, 8000, 5000}', 3], ['{4999, 5000}', 1], ['{100}', 0], ['{}', 0]] },
        { name: 'maxSteps', sig: 'public static int maxSteps(int[] steps)', text: 'השיטה מחזירה את מספר הצעדים הגדול ביותר. אפשר להניח שהמערך אינו ריק.',
          body: `    int max = steps[0];
    for (int i = 1; i < steps.length; i++) {
        if (steps[i] > max) {
            max = steps[i];
        }
    }
    return max;`,
          cases: [['{4000, 6000, 3000, 8000, 5000}', 8000], ['{9000, 1, 2}', 9000], ['{1, 2, 9500}', 9500], ['{700}', 700]] }
      ]
    },
    q3: {
      item: 'Runner', num: 'laps', getter: 'getLaps', box: 'RunningClub', arr: 'runners',
      intro: 'נתונה המחלקה <code>Runner</code>, המייצגת רץ. יש לה שתי תכונות: שם הרץ ומספר ההקפות שהשלים. נתונה גם המחלקה <code>RunningClub</code>, המחזיקה מערך של עצמים מסוג <code>Runner</code>.',
      parts: [
        { name: 'countFinishers', sig: 'public int countFinishers', text: 'היא מחזירה את מספר הרצים שהשלימו לפחות 3 הקפות.',
          body: `        int count = 0;
        for (int i = 0; i < size; i++) {
            if (runners[i].getLaps() >= 3) {
                count++;
            }
        }
        return count;`,
          cases: [[[['Dan', 3], ['Noa', 2], ['Avi', 8]], 2], [[['Dan', 1]], 0], [[], 0]] },
        { name: 'firstBeginner', sig: 'public String firstBeginner', text: 'היא מחזירה את שם הרץ הראשון שהשלים פחות מ-3 הקפות; אם אין כזה, היא מחזירה <code>"None"</code>.',
          body: `        for (int i = 0; i < size; i++) {
            if (runners[i].getLaps() < 3) {
                return runners[i].getName();
            }
        }
        return "None";`,
          cases: [[[['Dan', 5], ['Noa', 2], ['Avi', 1]], 'Noa'], [[['Dan', 3], ['Noa', 4]], 'None'], [[['Dan', 0]], 'Dan'], [[], 'None']] },
        { name: 'totalLaps', sig: 'public int totalLaps', text: 'היא מחזירה את סך ההקפות של כל הרצים.',
          body: `        int sum = 0;
        for (int i = 0; i < size; i++) {
            sum += runners[i].getLaps();
        }
        return sum;`,
          cases: [[[['Dan', 3], ['Noa', 2], ['Avi', 8]], 13], [[['Dan', 4]], 4], [[], 0]] }
      ]
    },
    q4: {
      code: `public static int foo(int[] a) {
    int max = a[0];
    for (int i = 1; i < a.length; i++) {
        if (a[i] > max) {
            max = a[i];
        }
    }
    return max;
}`,
      call1: ['{4, 9, 2, 6}', 9, 'השיטה מחזירה את האיבר הגדול ביותר במערך.'],
      call2: ['{8, 3, 12, 5}', 12, 'האיבר הגדול ביותר הוא 12.'],
      condText: 'שנו את סימן ההשוואה בתנאי <code>if</code> כך שהשיטה תחזיר את המספר <b>הקטן ביותר</b> במערך במקום הגדול ביותר.',
      oldCond: 'a[i] > max', newCond: 'a[i] < max',
      wrapBefore: '    int max = a[0];\n    for (int i = 1; i < a.length; i++) {', wrapInside: '            max = a[i];', wrapAfter: '    return max;',
      condCases: [['{4, 9, 2, 6}', 2], ['{8, 3, 12, 5}', 3], ['{5}', 5], ['{7, 7, 1}', 1], ['{1, 9, 8}', 1]]
    }
  }));
})();
