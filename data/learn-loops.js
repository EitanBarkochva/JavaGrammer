// לימוד: לולאות ומערכים
(window.LESSONS = window.LESSONS || []).push({
  id: 'learn-loops',
  title: 'לימוד לולאות ומערכים',
  subtitle: 'מהלולאה הראשונה ועד מערך דו-ממדי, עם דוגמאות שאפשר להריץ ולשנות',
  practice: 'loops',
  sections: [
    {
      id: 'why', title: 'למה צריך לולאות?',
      blocks: [
        `<p>נניח שרוצים להדפיס את המספרים 1 עד 5. אפשר לכתוב חמש פקודות הדפסה, אבל מה אם צריך עד 1000? <b>לולאה</b> היא פקודה שחוזרת על קטע קוד שוב ושוב, כל עוד תנאי מסוים מתקיים.</p>
<p>בכל לולאה יש שלושה חלקים, וכדאי לזהות אותם תמיד:</p>
<ol>
<li><b>אתחול</b> – נותנים ערך התחלתי למשתנה הלולאה (למשל <code>i = 1</code>).</li>
<li><b>תנאי</b> – כל עוד הוא <code>true</code>, הלולאה ממשיכה (למשל <code>i &lt;= 5</code>).</li>
<li><b>קידום</b> – משנים את המשתנה כך שבסוף התנאי ייעשה <code>false</code> (למשל <code>i++</code>). בלי קידום – הלולאה אינסופית.</li>
</ol>`
      ]
    },
    {
      id: 'while', title: 'לולאת while',
      blocks: [
        `<p>לולאת <code>while</code> בודקת את התנאי <b>לפני</b> כל סיבוב. אם התנאי <code>false</code> כבר בהתחלה, הגוף לא ירוץ אף פעם.</p>
<pre class="code">while (תנאי) {
    // הפקודות שחוזרות
}</pre>`,
        { run: `public class Main {
    public static void main(String[] args) {
        int i = 1;              // אתחול
        while (i <= 5) {        // תנאי
            System.out.println("i = " + i);
            i++;                // קידום
        }
        System.out.println("אחרי הלולאה i = " + i);
    }
}` },
        `<p class="note">שימו לב: אחרי הלולאה <code>i</code> שווה 6 – זה הערך הראשון שבו התנאי נכשל. <code>while</code> מתאימה במיוחד כשלא יודעים מראש כמה סיבובים יהיו, למשל כשמפרקים מספר לספרות:</p>`,
        { run: `public class Main {
    public static void main(String[] args) {
        int num = 4072;
        int sum = 0;
        while (num > 0) {
            int digit = num % 10;   // הספרה הימנית
            sum += digit;
            num = num / 10;         // מורידים את הספרה הימנית
        }
        System.out.println("סכום הספרות: " + sum);
    }
}` }
      ]
    },
    {
      id: 'for', title: 'לולאת for',
      blocks: [
        `<p>לולאת <code>for</code> מרכזת את שלושת החלקים בשורה אחת. משתמשים בה כשיודעים כמה פעמים צריך לחזור – למשל כשעוברים על מערך.</p>
<pre class="code">for (אתחול; תנאי; קידום) {
    // הפקודות שחוזרות
}</pre>`,
        { run: `public class Main {
    public static void main(String[] args) {
        // מ-0 עד 4
        for (int i = 0; i < 5; i++) {
            System.out.print(i + " ");
        }
        System.out.println();

        // בקפיצות של 3
        for (int i = 1; i <= 20; i += 3) {
            System.out.print(i + " ");
        }
        System.out.println();

        // סופרים לאחור
        for (int i = 10; i > 0; i--) {
            System.out.print(i + " ");
        }
        System.out.println();
    }
}` },
        `<p class="note">המשתנה <code>i</code> שהוגדר בתוך ה-<code>for</code> קיים רק בתוך הלולאה. אחריה אי אפשר להשתמש בו.</p>`
      ]
    },
    {
      id: 'dowhile', title: 'לולאת do-while',
      blocks: [
        `<p>ב-<code>do-while</code> התנאי נבדק <b>אחרי</b> כל סיבוב, ולכן הגוף רץ לפחות פעם אחת. שימו לב לנקודה-פסיק בסוף.</p>`,
        { run: `public class Main {
    public static void main(String[] args) {
        int n = 0;
        int count = 0;
        do {
            count++;
            n = n / 10;
        } while (n != 0);
        System.out.println("במספר 0 יש " + count + " ספרות");
    }
}` },
        `<p>בדוגמה הזו <code>do-while</code> נותנת את התשובה הנכונה גם עבור 0 (ספרה אחת), כי הגוף רץ לפחות פעם אחת.</p>`
      ]
    },
    {
      id: 'patterns', title: 'תבניות חשובות: צובר, מונה ודגל',
      blocks: [
        `<p>רוב התרגילים בלולאות בנויים מכמה תבניות קבועות:</p>
<ul>
<li><b>צובר</b> – משתנה שמתחיל ב-0 ומוסיפים לו בכל סיבוב (<code>sum += x</code>).</li>
<li><b>מונה</b> – משתנה שמתחיל ב-0 ומגדילים אותו ב-1 כשתנאי מתקיים (<code>count++</code>).</li>
<li><b>מקסימום/מינימום</b> – מתחילים מהאיבר הראשון, ומעדכנים כשמוצאים איבר גדול/קטן יותר.</li>
<li><b>דגל</b> – משתנה <code>boolean</code> שמסמן אם קרה משהו (למשל "מצאתי").</li>
</ul>`,
        { run: `public class Main {
    public static void main(String[] args) {
        int sum = 0;          // צובר
        int countEven = 0;    // מונה
        boolean found7 = false; // דגל
        for (int i = 1; i <= 10; i++) {
            sum += i;
            if (i % 2 == 0) {
                countEven++;
            }
            if (i == 7) {
                found7 = true;
            }
        }
        System.out.println("סכום 1..10 = " + sum);
        System.out.println("מספרים זוגיים: " + countEven);
        System.out.println("מצאנו 7? " + found7);
    }
}` }
      ]
    },
    {
      id: 'nested', title: 'לולאות מקוננות',
      blocks: [
        `<p>לולאה בתוך לולאה: על כל סיבוב של הלולאה החיצונית, הלולאה הפנימית רצה <b>מההתחלה ועד הסוף</b>. זו הדרך לעבור על מערך דו-ממדי, או להשוות כל איבר לכל איבר אחר.</p>`,
        { run: `public class Main {
    public static void main(String[] args) {
        // לוח כפל קטן
        for (int row = 1; row <= 4; row++) {
            for (int col = 1; col <= 4; col++) {
                System.out.print(row * col + "\\t");
            }
            System.out.println();   // מעבר שורה אחרי כל שורה
        }
    }
}` },
        `<p class="note">כאן הפקודה בלולאה הפנימית רצה 4 × 4 = 16 פעמים.</p>`
      ]
    },
    {
      id: 'arrays', title: 'מערכים – מה זה ואיך יוצרים',
      blocks: [
        `<p><b>מערך</b> הוא אוסף של משתנים מאותו טיפוס, שנמצאים ברצף ולכל אחד יש <b>אינדקס</b> (מספר מקום). האינדקס הראשון הוא <b>0</b> והאחרון הוא <code>length - 1</code>.</p>
<pre class="code">int[] a = new int[5];          // מערך של 5 שלמים, כולם 0
int[] b = {7, 3, 9};           // יצירה עם ערכים
String[] names = new String[3]; // כולם null
a[0] = 10;                     // כתיבה לתא הראשון
int x = b[2];                  // קריאה מהתא האחרון (9)
int len = b.length;            // 3 – בלי סוגריים!</pre>
<ul>
<li>ערכי ברירת מחדל: <code>0</code> למספרים, <code>false</code> ל-<code>boolean</code>, <code>null</code> לאובייקטים ומחרוזות.</li>
<li>גודל המערך נקבע ביצירה ולא משתנה.</li>
<li>גישה לאינדקס שלא קיים (למשל <code>b[3]</code>) גורמת לשגיאה <code>ArrayIndexOutOfBoundsException</code>.</li>
</ul>`,
        { run: `public class Main {
    public static void main(String[] args) {
        int[] grades = {85, 92, 70, 64};
        System.out.println("מספר הציונים: " + grades.length);
        System.out.println("הציון הראשון: " + grades[0]);
        System.out.println("הציון האחרון: " + grades[grades.length - 1]);

        grades[2] = 75;   // שינוי ערך
        System.out.println("אחרי השינוי: " + grades[2]);

        boolean[] flags = new boolean[3];
        System.out.println("ערך ברירת מחדל של boolean: " + flags[0]);
    }
}` }
      ]
    },
    {
      id: 'loop-array', title: 'מעבר על מערך בלולאה',
      blocks: [
        `<p>התבנית הבסיסית: <code>for (int i = 0; i &lt; a.length; i++)</code>. שימו לב לתנאי <code>&lt;</code> ולא <code>&lt;=</code>, כי האינדקס האחרון הוא <code>length - 1</code>.</p>`,
        { run: `public class Main {
    public static void main(String[] args) {
        int[] a = {4, -2, 9, 7, 0};

        // הדפסה
        for (int i = 0; i < a.length; i++) {
            System.out.print(a[i] + " ");
        }
        System.out.println();

        // סכום
        int sum = 0;
        for (int i = 0; i < a.length; i++) {
            sum += a[i];
        }
        System.out.println("סכום: " + sum);

        // מקסימום – מתחילים מהאיבר הראשון!
        int max = a[0];
        for (int i = 1; i < a.length; i++) {
            if (a[i] > max) {
                max = a[i];
            }
        }
        System.out.println("מקסימום: " + max);

        // הדפסה מהסוף להתחלה
        for (int i = a.length - 1; i >= 0; i--) {
            System.out.print(a[i] + " ");
        }
        System.out.println();
    }
}` },
        `<p class="note">למה <code>max</code> מתחיל מ-<code>a[0]</code> ולא מ-0? כי אם כל האיברים שליליים, המקסימום יהיה שלילי, ו-0 ייתן תשובה שגויה.</p>`
      ]
    },
    {
      id: 'search', title: 'חיפוש במערך והשוואת איברים סמוכים',
      blocks: [
        `<p>בחיפוש מחזירים את האינדקס ברגע שמוצאים, ואם הלולאה הסתיימה בלי למצוא, מחזירים <code>-1</code>. בהשוואת איברים סמוכים (<code>a[i]</code> מול <code>a[i+1]</code>) צריך לעצור אחד לפני הסוף, כדי לא לחרוג מהמערך.</p>`,
        { run: `public class Main {
    public static int indexOf(int[] a, int value) {
        for (int i = 0; i < a.length; i++) {
            if (a[i] == value) {
                return i;      // נמצא – יוצאים מיד
            }
        }
        return -1;             // לא נמצא
    }

    public static boolean isSorted(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {   // עד length - 1!
            if (a[i] > a[i + 1]) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        int[] a = {5, 8, 12, 20};
        System.out.println("indexOf 12: " + indexOf(a, 12));
        System.out.println("indexOf 7: " + indexOf(a, 7));
        System.out.println("ממוין? " + isSorted(a));
        System.out.println("ממוין? " + isSorted(new int[]{3, 1, 2}));
    }
}` }
      ]
    },
    {
      id: 'ref', title: 'מערך הוא הפניה',
      blocks: [
        `<p>משתנה מערך לא מכיל את המערך עצמו, אלא <b>הפניה</b> (כתובת) אליו. לכן:</p>
<ul>
<li><code>int[] b = a;</code> לא מעתיק – שני המשתנים מצביעים על אותו מערך.</li>
<li>שיטה שמקבלת מערך כפרמטר יכולה לשנות את המערך המקורי.</li>
<li>כדי להעתיק באמת, יוצרים מערך חדש ומעתיקים איבר-איבר.</li>
<li><code>a == b</code> בודק אם זה <b>אותו מערך</b>, לא אם התוכן שווה.</li>
</ul>`,
        { run: `public class Main {
    public static void doubleAll(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            arr[i] = arr[i] * 2;
        }
    }

    public static int[] copy(int[] arr) {
        int[] res = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            res[i] = arr[i];
        }
        return res;
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = a;          // אותו מערך!
        b[0] = 99;
        System.out.println("a[0] = " + a[0]);

        doubleAll(a);         // השיטה משנה את המערך המקורי
        System.out.println("a[1] = " + a[1]);

        int[] c = copy(a);    // מערך חדש
        c[2] = -1;
        System.out.println("a[2] = " + a[2] + ", c[2] = " + c[2]);
        System.out.println("a == c? " + (a == c));
    }
}` }
      ]
    },
    {
      id: 'new-array', title: 'בניית מערך חדש בגודל לא ידוע מראש',
      blocks: [
        `<p>שאלה נפוצה במבחנים: "החזירו מערך חדש עם האיברים ש...". כיוון שגודל המערך נקבע ביצירה, עושים <b>שני מעברים</b>: הראשון סופר כמה איברים יהיו, והשני ממלא. משתנה נפרד (<code>k</code>) שומר את המקום הבא למילוי במערך החדש.</p>`,
        { run: `public class Main {
    public static int[] onlyPositive(int[] a) {
        int count = 0;
        for (int i = 0; i < a.length; i++) {      // מעבר 1: ספירה
            if (a[i] > 0) count++;
        }
        int[] res = new int[count];
        int k = 0;
        for (int i = 0; i < a.length; i++) {      // מעבר 2: מילוי
            if (a[i] > 0) {
                res[k] = a[i];
                k++;
            }
        }
        return res;
    }

    public static void main(String[] args) {
        int[] r = onlyPositive(new int[]{3, -1, 0, 8, -5, 2});
        for (int i = 0; i < r.length; i++) {
            System.out.print(r[i] + " ");
        }
        System.out.println();
    }
}` }
      ]
    },
    {
      id: '2d', title: 'מערך דו-ממדי',
      blocks: [
        `<p>מערך דו-ממדי הוא "מערך של מערכים" – טבלה עם שורות ועמודות. <code>a[r][c]</code> הוא האיבר בשורה <code>r</code> ובעמודה <code>c</code>.</p>
<pre class="code">int[][] a = new int[3][4];   // 3 שורות, 4 עמודות
int[][] b = {{1, 2, 3},
             {4, 5, 6}};     // 2 שורות, 3 עמודות
b.length       // מספר השורות: 2
b[0].length    // מספר העמודות בשורה 0: 3
b[1][2]        // 6</pre>
<p>מעבר על כל הטבלה = לולאה על השורות, ובתוכה לולאה על העמודות. כדי לסכם <b>עמודה</b> אחת, מקבעים את העמודה ועוברים על השורות.</p>`,
        { run: `public class Main {
    public static void main(String[] args) {
        int[][] a = {{3, 2, 5, 5},
                     {6, 3, 4, 0},
                     {4, 5, -3, 2}};

        // הדפסת הטבלה
        for (int r = 0; r < a.length; r++) {
            for (int c = 0; c < a[r].length; c++) {
                System.out.print(a[r][c] + "\\t");
            }
            System.out.println();
        }

        // סכום שורה 1
        int rowSum = 0;
        for (int c = 0; c < a[1].length; c++) {
            rowSum += a[1][c];
        }
        System.out.println("סכום שורה 1: " + rowSum);

        // סכום עמודה 2
        int colSum = 0;
        for (int r = 0; r < a.length; r++) {
            colSum += a[r][2];
        }
        System.out.println("סכום עמודה 2: " + colSum);
    }
}` }
      ]
    },
    {
      id: 'mistakes', title: 'טעויות נפוצות',
      blocks: [
        `<ul>
<li><b>חריגה מהמערך</b> – <code>i &lt;= a.length</code> במקום <code>i &lt; a.length</code>, או <code>a[i+1]</code> בלולאה שמגיעה עד הסוף.</li>
<li><b>לולאה אינסופית</b> – שכחתם לקדם את המשתנה ב-<code>while</code>.</li>
<li><b>אתחול בתוך הלולאה</b> – <code>int sum = 0</code> שנמצא בתוך הלולאה מתאפס בכל סיבוב.</li>
<li><b>מקסימום שמתחיל מ-0</b> – שגוי כשכל הערכים שליליים. התחילו מ-<code>a[0]</code>.</li>
<li><b><code>return</code> בתוך הלולאה במקום אחריה</b> – למשל <code>else return false</code> בחיפוש, שעוצר אחרי האיבר הראשון.</li>
<li><b>חלוקה בשלמים</b> – <code>7 / 2</code> הוא 3. לממוצע עשרוני: <code>(double) sum / count</code>.</li>
<li><b>השוואת מערכים עם <code>==</code></b> – משווה הפניות, לא תוכן.</li>
</ul>`
      ]
    }
  ]
});
