// מבחן דוגמה 02 – מבוא למדעי המחשב ושפת Java א
(function () {
  // מחלקות Lace ו-Shoe מלאות. הדגלים מאפשרים לייצר גרסאות שגויות לבדיקת הטסטר.
  function laceShoe(opt) {
    opt = opt || {};
    return `static class Lace {
    public static final int DEF_LENGTH = 60;
    public static final int MIN_LENGTH = 20;
    public static final int MAX_LENGTH = 150;
    private int _length;
    private String _color;
    public Lace(int length, String color) {
        ${opt.badCtor ? '_length = length;' : 'if (isValidLength(length)) _length = length; else _length = DEF_LENGTH;'}
        _color = color;
    }
    public Lace(Lace other) { _length = other._length; _color = other._color; }
    public int getLength() { return _length; }
    public String getColor() { return _color; }
    public void setLength(int length) { if (isValidLength(length)) _length = length; }
    public void setColor(String color) { _color = color; }
    private boolean isValidLength(int length) { return length >= MIN_LENGTH && length <= MAX_LENGTH; }
    public boolean before(Lace other) { return _length < other._length || (_length == other._length && _color.compareTo(other._color) < 0); }
    public boolean equals(Lace other) { return _length == other._length && _color.equals(other._color); }
    public String toString() { return _color + " lace, " + _length + " cm"; }
}
static class Shoe {
    private String _brand;
    private int _size;
    private Lace _lace;
    public Shoe(String brand, int size, Lace lace) { _brand = brand; _size = size; _lace = new Lace(lace); }
    public String getBrand() { return _brand; }
    public int getSize() { return _size; }
    public Lace getLace() { return new Lace(_lace); }
    public void setLace(Lace lace) { _lace = ${opt.badAlias ? 'lace' : 'new Lace(lace)'}; }
    public boolean equals(Shoe other) { return _brand.equals(other._brand) && _size == other._size && _lace.equals(other._lace); }
    public boolean before(Shoe other) { return ${opt.badBefore ? '_size > other._size' : '_size < other._size || (_size == other._size && _lace.before(other._lace))'}; }
    public String toString() { return _brand + " " + _size + " (" + _lace + ")"; }
}`;
  }
  var laceOnly = laceShoe().split('static class Shoe')[0];

  (window.EXAMS = window.EXAMS || []).push({
    id: 'd02',
    title: 'מבחן דוגמה 02',
    subtitle: 'דוגמה 02 למבחן סיום בקורס מבוא למדעי המחשב ושפת Java א',
    intro: 'במבחן 4 שאלות, יש לענות על כל השאלות.',
    questions: [
      {
        num: 1, points: 29, title: 'המחלקות Lace ו-Shoe',
        parts: [
          {
            id: 'd02-1a', title: 'סעיף א – המחלקה שרוך Lace', points: 9, type: 'java',
            html: `<p>המחלקה <code>Lace</code> מייצגת שרוך נעל שיש לו שם צבע (מחרוזת) ואורך בס"מ (מספר שלם). השלימו את המחלקה לפי ההוראות הבאות:</p>
<ol>
<li>השיטה <code>isValidLength</code> מחזירה <code>true</code> רק אם אורך השרוך חוקי – נמצא בין המינימום והמקסימום שהוגדרו בראש המחלקה, אחרת היא מחזירה <code>false</code>. (3 נק')</li>
<li>הבנאי – יש לוודא שערך תכונת האורך יהיה חוקי. השתמשו בשיטה <code>isValidLength</code> כדי לבדוק חוקיות ובקבוע ברירת המחדל. ניתן להשתמש בשיטה גם אם לא עניתם על סעיף 1. (3 נק')</li>
<li>השיטה <code>setLength</code> קובעת אורך חדש בתנאי שהאורך החדש חוקי. לבדיקת החוקיות יש להשתמש בשיטה <code>isValidLength</code>. (3 נק')</li>
</ol>
<p class="note">ניתן להניח ששאר המחלקה כתובה באופן מלא. במבחן ערכי הקבועים מסומנים ב-...; כאן נתנו להם ערכים כדי שאפשר יהיה להריץ.</p>`,
            starter: `public class Lace {
    public static final int DEF_LENGTH = 60;  // ברירת המחדל של האורך
    public static final int MIN_LENGTH = 20;  // מינימום
    public static final int MAX_LENGTH = 150; // מקסימום
    private int _length; // in cm
    private String _color;

    public Lace(int length, String color) {
        //2

        _color = color;
    }

    public Lace(Lace other) { _length = other._length; _color = other._color; }
    public int getLength() { return _length; }
    public String getColor() { return _color; }

    public void setLength(int length) {
        //3

    }

    public void setColor(String color) { _color = color; }

    private boolean isValidLength(int length) {
        //1

    }
}`,
            solution: `public class Lace {
    public static final int DEF_LENGTH = 60;
    public static final int MIN_LENGTH = 20;
    public static final int MAX_LENGTH = 150;
    private int _length; // in cm
    private String _color;

    public Lace(int length, String color) {
        if (isValidLength(length)) {
            _length = length;
        } else {
            _length = DEF_LENGTH;
        }
        _color = color;
    }

    public Lace(Lace other) { _length = other._length; _color = other._color; }
    public int getLength() { return _length; }
    public String getColor() { return _color; }

    public void setLength(int length) {
        if (isValidLength(length)) {
            _length = length;
        }
    }

    public void setColor(String color) { _color = color; }

    private boolean isValidLength(int length) {
        return length >= MIN_LENGTH && length <= MAX_LENGTH;
    }
}`,
            tests: [
              ['isValidLength', String.raw`Lace l = new Lace(60, "red");
                T.eq("isValidLength(100)", true, l.isValidLength(100));
                T.eq("isValidLength(MIN_LENGTH)", true, l.isValidLength(Lace.MIN_LENGTH));
                T.eq("isValidLength(MAX_LENGTH)", true, l.isValidLength(Lace.MAX_LENGTH));
                T.eq("isValidLength(MIN_LENGTH - 1)", false, l.isValidLength(Lace.MIN_LENGTH - 1));
                T.eq("isValidLength(MAX_LENGTH + 1)", false, l.isValidLength(Lace.MAX_LENGTH + 1));
                T.eq("isValidLength(-100)", false, l.isValidLength(-100));`],
              ['בנאי עם אורך חוקי', String.raw`Lace l = new Lace(100, "green");
                T.eq("new Lace(100, \"green\").getLength()", 100, l.getLength());
                T.eq("הצבע נשמר", "green", l.getColor());`],
              ['בנאי עם אורך לא חוקי', String.raw`T.eq("new Lace(-100, \"blue\").getLength() הוא DEF_LENGTH", Lace.DEF_LENGTH, new Lace(-100, "blue").getLength());
                T.eq("new Lace(1000, \"blue\").getLength() הוא DEF_LENGTH", Lace.DEF_LENGTH, new Lace(1000, "blue").getLength());`],
              ['setLength', String.raw`Lace l = new Lace(100, "green");
                l.setLength(120);
                T.eq("setLength(120) משנה את האורך", 120, l.getLength());
                l.setLength(-5);
                T.eq("setLength(-5) לא משנה את האורך", 120, l.getLength());
                l.setLength(Lace.MAX_LENGTH + 10);
                T.eq("setLength(MAX_LENGTH + 10) לא משנה את האורך", 120, l.getLength());`]
            ]
          },
          {
            id: 'd02-1b', title: 'סעיף ב – המחלקה נעל Shoe', points: 9, type: 'java',
            html: `<p>המחלקה <code>Shoe</code> מייצגת נעל שיש לה מותג (מחרוזת), מידה (מספר שלם) ושרוך (אובייקט של <code>Lace</code>). השלימו את קוד המחלקה לפי ההוראות הבאות. ניתן להשתמש בכל שיטות <code>Lace</code> ללא צורך לממש אותן.</p>
<ol>
<li>השיטה <code>getLace()</code> מחזירה את השרוך של הנעל עליה הופעלה השיטה. יש להימנע מ-aliasing. (3 נק')</li>
<li>השיטה <code>equals(Shoe other)</code> מחזירה <code>true</code> כאשר התכונות של הנעל עליה הופעלה השיטה זהות לתכונות הנעל שהתקבלה כפרמטר (יש להשוות כל תכונה לפי אופן ההשוואה המתאים לה). (3 נק')</li>
<li>השיטה <code>before(Shoe other)</code> מחזירה <code>true</code> כאשר הנעל עליה מופעלת השיטה נמצאת לפני הנעל שהתקבלה כפרמטר. נעל A נמצאת לפני נעל B אם המידה של A קטנה מהמידה של B, או שהן באותה מידה והשרוך של A לפני השרוך של B (ניתן להשתמש בכל שיטות השרוך). (3 נק')</li>
</ol>`,
            starter: `public class Shoe {
    private String _brand;
    private int _size;
    private Lace _lace;

    public Shoe(String brand, int size, Lace lace) { _brand = brand; _size = size; _lace = new Lace(lace); }
    public String getBrand() { return _brand; }
    public int getSize() { return _size; }

    public Lace getLace() {
        //1

    }

    public void setLace(Lace lace) { _lace = new Lace(lace); }

    public boolean equals(Shoe other) {
        //2

    }

    public boolean before(Shoe other) {
        //3

    }

    public String toString() { return _brand + " " + _size + " (" + _lace + ")"; }
}`,
            solution: `public class Shoe {
    private String _brand;
    private int _size;
    private Lace _lace;

    public Shoe(String brand, int size, Lace lace) { _brand = brand; _size = size; _lace = new Lace(lace); }
    public String getBrand() { return _brand; }
    public int getSize() { return _size; }

    public Lace getLace() {
        return new Lace(_lace);
    }

    public void setLace(Lace lace) { _lace = new Lace(lace); }

    public boolean equals(Shoe other) {
        return _brand.equals(other._brand) && _size == other._size && _lace.equals(other._lace);
    }

    public boolean before(Shoe other) {
        return _size < other._size || (_size == other._size && _lace.before(other._lace));
    }

    public String toString() { return _brand + " " + _size + " (" + _lace + ")"; }
}`,
            support: laceOnly,
            tests: [
              ['getLace', String.raw`Shoe s = new Shoe("Nike", 42, new Lace(80, "red"));
                Lace l = s.getLace();
                T.ok("getLace מחזירה שרוך עם אותם ערכים", l != null && l.equals(new Lace(80, "red")), "התקבל " + T.show(l));
                T.ok("getLace נמנעת מ-aliasing", l != s._lace, "הוחזרה הפניה לתכונה עצמה");`],
              ['equals', String.raw`Shoe s = new Shoe("Nike", 42, new Lace(80, "red"));
                T.eq("נעליים זהות בערכים", true, s.equals(new Shoe(new String("Nike"), 42, new Lace(80, new String("red")))));
                T.eq("מותג שונה", false, s.equals(new Shoe("Adidas", 42, new Lace(80, "red"))));
                T.eq("מידה שונה", false, s.equals(new Shoe("Nike", 43, new Lace(80, "red"))));
                T.eq("שרוך שונה", false, s.equals(new Shoe("Nike", 42, new Lace(90, "red"))));`],
              ['before', String.raw`Lace a = new Lace(50, "red"), b = new Lace(90, "red");
                T.eq("מידה 40 לפני מידה 42", true, new Shoe("X", 40, b).before(new Shoe("Y", 42, a)));
                T.eq("מידה 42 לא לפני מידה 40", false, new Shoe("X", 42, a).before(new Shoe("Y", 40, b)));
                T.eq("אותה מידה, השרוך הראשון לפני השני", true, new Shoe("X", 41, a).before(new Shoe("Y", 41, b)));
                T.eq("אותה מידה, השרוך הראשון אחרי השני", false, new Shoe("X", 41, b).before(new Shoe("Y", 41, a)));
                T.eq("אותה מידה ואותו שרוך", false, new Shoe("X", 41, a).before(new Shoe("Y", 41, a)));`]
            ]
          },
          {
            id: 'd02-1c', title: 'סעיף ג – טסטר', points: 11, type: 'java',
            html: `<p>במחלקה <code>Tester</code> בדיקות עבור המחלקות <code>Lace</code> ו-<code>Shoe</code>. עליכם להשלים חלק מהבדיקות לפי הפירוט הבא:</p>
<ol>
<li>יצרנו את השרוך <code>l1</code> עם אורך לא חוקי. השלימו את הבדיקה של תפקוד הבנאי להתמודדות עם אורך לא תקין שהתקבל בפרמטר. זכרו שמותר להשתמש בקבועים של המחלקה <code>Lace</code>, למשל <code>Lace.MAX_LENGTH</code> זה האורך המקסימלי של השרוך. (3 נק')</li>
<li>לבדיקת השיטה <code>before</code> של <code>Shoe</code> יצרנו שתי נעליים <code>s1</code> ו-<code>s2</code>. השלימו את התנאי לבדיקת תפקוד השיטה. התנאי צריך להיות כתוב כך שאם השיטה <code>before</code> כתובה נכון יודפס <code>"Pass"</code>. (3 נק')</li>
<li>השלימו את תנאי בדיקת ה-aliasing של השיטה <code>setLace(…)</code>. (5 נק')</li>
</ol>
<p class="note">בתיבה נמצא גוף השיטה <code>main</code>. הבדיקה מריצה את הטסטר שלכם גם על מחלקות תקינות (צריך להדפיס Pass) וגם על מחלקות עם באג (הבדיקה המתאימה צריכה להדפיס Fail).</p>`,
            variants: [
              { name: 'Good', support: laceShoe() },
              { name: 'BadCtor', support: laceShoe({ badCtor: true }) },
              { name: 'BadBefore', support: laceShoe({ badBefore: true }) },
              { name: 'BadAlias', support: laceShoe({ badAlias: true }) }
            ],
            starter: `Lace l1 = new Lace(-100, "blue"); // invalid length
if (l1.getLength() ________________) { //1
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}

Lace l2 = new Lace(100, "green");
Shoe s1 = new Shoe("Nike", 42, l1);
Shoe s2 = new Shoe("Adidas", 40, l2);
if (________.before(________)) { //2
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}

Lace external = new Lace(60, "red");
s1.setLace(external);
external.setColor("black");
if (s1.getLace().getColor().equals("________")) { //3
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}`,
            solution: `Lace l1 = new Lace(-100, "blue"); // invalid length
if (l1.getLength() == Lace.DEF_LENGTH) { //1
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}

Lace l2 = new Lace(100, "green");
Shoe s1 = new Shoe("Nike", 42, l1);
Shoe s2 = new Shoe("Adidas", 40, l2);
if (s2.before(s1)) { //2
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}

Lace external = new Lace(60, "red");
s1.setLace(external);
external.setColor("black");
if (s1.getLace().getColor().equals("red")) { //3
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}`,
            tests: [
              ['מחלקות תקינות', String.raw`T.eq("על מחלקות תקינות כל הבדיקות מדפיסות Pass", "[Pass, Pass, Pass]", java.util.Arrays.toString(T.capture(Good::run)));`],
              ['בנאי שגוי', String.raw`String[] o = T.capture(BadCtor::run);
                T.ok("בדיקה 1 מזהה בנאי שלא מטפל באורך לא חוקי", o.length > 0 && o[0].equals("Fail"), "הפלט: " + java.util.Arrays.toString(o));`],
              ['before שגויה', String.raw`String[] o = T.capture(BadBefore::run);
                T.ok("בדיקה 2 מזהה before שגויה", o.length > 1 && o[1].equals("Fail"), "הפלט: " + java.util.Arrays.toString(o));`],
              ['setLace עם aliasing', String.raw`String[] o = T.capture(BadAlias::run);
                T.ok("בדיקה 3 מזהה aliasing ב-setLace", o.length > 2 && o[2].equals("Fail"), "הפלט: " + java.util.Arrays.toString(o));`]
            ]
          }
        ]
      },
      {
        num: 2, points: 28, title: 'מערך חד-ממדי – תתי מערכים',
        parts: [
          {
            id: 'd02-2a', title: 'סעיף א – מציאת אינדקס התחלתי של תת-מערך', points: 18, type: 'java',
            html: `<p>נאמר שמערך <code>b</code> הוא תת-מערך של מערך <code>a</code> אם כל איברי <code>b</code> מופיעים ברצף ולפי הסדר בתוך <code>a</code>. לדוגמה, המערך <code>{8, 7, 5}</code> הוא תת-מערך של המערך <code>{9, 8, 7, 5, 3}</code>, אבל המערך <code>{8, 5}</code> לא תת-מערך שלו (לא ברצף) וגם <code>{7, 8}</code> לא תת-מערך שלו (לא באותו הסדר).</p>
<p>כתבו את השיטה הסטטית <code>public static int idxOfSubFrom(int[] main, int[] sub, int from)</code> המקבלת שני מערכים <code>main</code> ו-<code>sub</code> ואינדקס התחלתי <code>from</code>, ומחזירה את המיקום הראשון ב-<code>main</code>, החל מ-<code>from</code>, שבו מתחיל <code>sub</code>. אפשר להניח ש-<code>from</code> נמצא בין גבולות המערך וש-<code>sub</code> לא מערך ריק. אם אין אינדקס כזה השיטה תחזיר <code>-1</code>. דוגמאות:</p>
<pre class="code">1. idxOfSubFrom({3, 5, 7, 8, 9}, {7, 8}, 1) ==> 2
2. idxOfSubFrom({3, 5, 7, 8, 9, 7, 8, 1}, {7, 8}, 3) ==> 5
3. idxOfSubFrom({3, 5, 7, 8, 9, 7, 8, 1}, {7, 8, 1}, 1) ==> 5
4. idxOfSubFrom({3, 5, 7, 8, 9, 7, 8}, {7, 8}, 3) ==> 5
5. idxOfSubFrom({3, 5, 7, 8, 9, 7, 8}, {5, 7, 8}, 2) ==> -1
6. idxOfSubFrom({1, 2, 3, 1, 2, 1, 2}, {1, 2}, 1) ==> 3</pre>`,
            starter: `public static int idxOfSubFrom(int[] main, int[] sub, int from) {

}`,
            solution: `public static int idxOfSubFrom(int[] main, int[] sub, int from) {
    for (int i = from; i <= main.length - sub.length; i++) {
        boolean match = true;
        for (int j = 0; j < sub.length && match; j++) {
            if (main[i + j] != sub[j]) {
                match = false;
            }
        }
        if (match) {
            return i;
        }
    }
    return -1;
}`,
            tests: [
              ['דוגמה 1', String.raw`T.eq("idxOfSubFrom({3,5,7,8,9}, {7,8}, 1)", 2, idxOfSubFrom(new int[]{3, 5, 7, 8, 9}, new int[]{7, 8}, 1));`],
              ['דוגמה 2', String.raw`T.eq("idxOfSubFrom({3,5,7,8,9,7,8,1}, {7,8}, 3)", 5, idxOfSubFrom(new int[]{3, 5, 7, 8, 9, 7, 8, 1}, new int[]{7, 8}, 3));`],
              ['דוגמה 3', String.raw`T.eq("idxOfSubFrom({3,5,7,8,9,7,8,1}, {7,8,1}, 1)", 5, idxOfSubFrom(new int[]{3, 5, 7, 8, 9, 7, 8, 1}, new int[]{7, 8, 1}, 1));`],
              ['דוגמה 4 – תת-מערך בסוף', String.raw`T.eq("idxOfSubFrom({3,5,7,8,9,7,8}, {7,8}, 3)", 5, idxOfSubFrom(new int[]{3, 5, 7, 8, 9, 7, 8}, new int[]{7, 8}, 3));`],
              ['דוגמה 5', String.raw`T.eq("idxOfSubFrom({3,5,7,8,9,7,8}, {5,7,8}, 2)", -1, idxOfSubFrom(new int[]{3, 5, 7, 8, 9, 7, 8}, new int[]{5, 7, 8}, 2));`],
              ['דוגמה 6', String.raw`T.eq("idxOfSubFrom({1,2,3,1,2,1,2}, {1,2}, 1)", 3, idxOfSubFrom(new int[]{1, 2, 3, 1, 2, 1, 2}, new int[]{1, 2}, 1));`],
              ['התחלה חלקית בסוף המערך', String.raw`T.eq("idxOfSubFrom({1,2,3,7}, {7,8}, 0)", -1, idxOfSubFrom(new int[]{1, 2, 3, 7}, new int[]{7, 8}, 0));`],
              ['sub ארוך מ-main', String.raw`T.eq("idxOfSubFrom({1,2}, {1,2,3}, 0)", -1, idxOfSubFrom(new int[]{1, 2}, new int[]{1, 2, 3}, 0));`],
              ['התאמה מ-from בדיוק', String.raw`T.eq("idxOfSubFrom({4,4,4}, {4}, 2)", 2, idxOfSubFrom(new int[]{4, 4, 4}, new int[]{4}, 2));`]
            ]
          },
          {
            id: 'd02-2b', title: 'סעיף ב – ספירת תתי מערכים', points: 10, type: 'java',
            html: `<p>כתבו את השיטה הסטטית <code>public static int countSubarray(int[] main, int[] sub)</code> המקבלת את המערכים <code>main</code> ו-<code>sub</code> ומחזירה את מספר הפעמים שהמערך <code>sub</code> מופיע כתת-מערך של המערך <code>main</code>. ניתן להשתמש בשיטה <code>idxOfSubFrom</code> מסעיף א גם אם לא כתבתם אותה. דוגמאות:</p>
<pre class="code">1. countSubarray({1, 2, 1, 2, 1, 2, 1}, {1, 2, 1, 2}) ==> 2
2. countSubarray({1, 2, 1, 2, 1}, {1}) ==> 3
3. countSubarray({1, 2, 1, 2, 1}, {1, 2, 3}) ==> 0
4. countSubarray({1, 2, 3}, {1, 2, 3}) ==> 1</pre>`,
            starter: `public static int countSubarray(int[] main, int[] sub) {

}`,
            solution: `public static int countSubarray(int[] main, int[] sub) {
    int count = 0;
    int idx = idxOfSubFrom(main, sub, 0);
    while (idx != -1) {
        count++;
        if (idx + 1 >= main.length) {
            return count;
        }
        idx = idxOfSubFrom(main, sub, idx + 1);
    }
    return count;
}`,
            support: `public static int idxOfSubFrom(int[] main, int[] sub, int from) {
    if (from < 0 || from >= main.length) return -1;
    for (int i = from; i <= main.length - sub.length; i++) {
        boolean ok = true;
        for (int j = 0; j < sub.length && ok; j++) if (main[i + j] != sub[j]) ok = false;
        if (ok) return i;
    }
    return -1;
}`,
            tests: [
              ['דוגמה 1 – הופעות חופפות', String.raw`T.eq("countSubarray({1,2,1,2,1,2,1}, {1,2,1,2})", 2, countSubarray(new int[]{1, 2, 1, 2, 1, 2, 1}, new int[]{1, 2, 1, 2}));`],
              ['דוגמה 2', String.raw`T.eq("countSubarray({1,2,1,2,1}, {1})", 3, countSubarray(new int[]{1, 2, 1, 2, 1}, new int[]{1}));`],
              ['דוגמה 3', String.raw`T.eq("countSubarray({1,2,1,2,1}, {1,2,3})", 0, countSubarray(new int[]{1, 2, 1, 2, 1}, new int[]{1, 2, 3}));`],
              ['דוגמה 4', String.raw`T.eq("countSubarray({1,2,3}, {1,2,3})", 1, countSubarray(new int[]{1, 2, 3}, new int[]{1, 2, 3}));`],
              ['כל האיברים זהים', String.raw`T.eq("countSubarray({5,5,5,5}, {5,5})", 3, countSubarray(new int[]{5, 5, 5, 5}, new int[]{5, 5}));`]
            ]
          }
        ]
      },
      {
        num: 3, points: 25, title: 'מערך של אובייקטים מסוג Product',
        intro: `<p>בחנות כל מוצר הוא אובייקט מהמחלקה <code>Product</code>. המחלקה <code>ProductList</code> מאפשרת לחנות לנהל את רשימת המוצרים שהיא מוכרת. נתונה המחלקה <code>Product</code> (ניתן להשתמש בשיטותיה מבלי לממש אותן):</p>
<pre class="code">public class Product {
    private String _name;
    private double _price;
    public Product(String name, double price) {...}
    public String getName() {...}
    public double getPrice() {...}
    public boolean equals(Product other) {...}
    public String toString() {...}
}</pre>
<p>למחלקה <code>ProductList</code> שתי תכונות: <code>_products</code> – מערך של מוצרים מסוג <code>Product</code>, ו-<code>_size</code> – מספר המוצרים שיש בפועל במערך. המוצרים מסודרים ברצף מתחילת המערך כך שאין "חורים" במערך.</p>`,
        parts: [
          {
            id: 'd02-3a', title: 'סעיף א – הוספת מוצר', points: 10, type: 'java',
            html: `<p>השלימו את השיטה <code>public boolean addProduct(Product p)</code> המקבלת מוצר <code>p</code> ומוסיפה אותו לרשימת המוצרים. השיטה מחזירה <code>true</code> אם המוצר נוסף לרשימה ו-<code>false</code> אם לא ניתן היה להוסיף אותו. ברשימת המוצרים כל מוצר מופיע פעם אחת בלבד ואין להוסיף לרשימה מוצר שקיים בה. בהוספת איבר למערך יש לשמור עליו רציף ללא חורים. אין צורך להתחשב ב-aliasing אבל צריך להימנע מחריגה מתחום המערך.</p>`,
            starter: `public static class ProductList {
    private Product[] _products;
    private int _size;

    public ProductList(int capacity) { // בנאי היוצר מערך בגודל capacity
        _products = new Product[capacity];
        _size = 0;
    }

    public boolean addProduct(Product p) {

    }
}`,
            solution: `public static class ProductList {
    private Product[] _products;
    private int _size;

    public ProductList(int capacity) {
        _products = new Product[capacity];
        _size = 0;
    }

    public boolean addProduct(Product p) {
        if (_size == _products.length) {
            return false;
        }
        for (int i = 0; i < _size; i++) {
            if (_products[i].equals(p)) {
                return false;
            }
        }
        _products[_size] = p;
        _size++;
        return true;
    }
}`,
            support: `static class Product {
    private String _name; private double _price;
    public Product(String name, double price) { _name = name; _price = price; }
    public String getName() { return _name; }
    public double getPrice() { return _price; }
    public boolean equals(Product other) { return _name.equals(other._name) && _price == other._price; }
    public String toString() { return _name + " " + _price; }
}`,
            tests: [
              ['הוספה רגילה', String.raw`ProductList l = new ProductList(3);
                T.eq("הוספת מוצר לרשימה ריקה מחזירה true", true, l.addProduct(new Product("Milk", 6.5)));
                T.eq("_size גדל ל-1", 1, l._size);
                T.ok("המוצר נשמר בתא 0", l._products[0] != null && l._products[0].getName().equals("Milk"), "תא 0: " + T.show(l._products[0]));
                l.addProduct(new Product("Bread", 9.9));
                T.ok("המוצר השני נשמר בתא 1 (ללא חורים)", l._products[1] != null && l._products[1].getName().equals("Bread"), "תא 1: " + T.show(l._products[1]));`],
              ['מוצר קיים', String.raw`ProductList l = new ProductList(5);
                l.addProduct(new Product("Milk", 6.5));
                l.addProduct(new Product("Bread", 9.9));
                T.eq("הוספת מוצר זהה (אובייקט אחר עם אותם ערכים) מחזירה false", false, l.addProduct(new Product("Bread", 9.9)));
                T.eq("_size לא השתנה", 2, l._size);
                T.eq("מוצר עם אותו שם ומחיר אחר נוסף", true, l.addProduct(new Product("Bread", 12.0)));`],
              ['רשימה מלאה', String.raw`ProductList l = new ProductList(2);
                l.addProduct(new Product("A", 1));
                l.addProduct(new Product("B", 2));
                T.eq("הוספה לרשימה מלאה מחזירה false (בלי חריגה)", false, l.addProduct(new Product("C", 3)));
                T.eq("_size נשאר 2", 2, l._size);`]
            ]
          },
          {
            id: 'd02-3b', title: 'סעיף ב – מציאת המחיר השכיח', points: 15, type: 'java',
            html: `<p>השלימו את השיטה <code>public double mostFrequentPrice()</code> המחזירה את המחיר השכיח ביותר, כלומר המחיר שמספר הופעותיו הוא הגבוה ביותר מבין כל המחירים. במקרה שיש יותר ממחיר אחד כזה יש להחזיר את המחיר הראשון.</p>
<p class="note">בתיבה המחלקה כולל השיטה <code>addProduct</code> כפתרון מסעיף א.</p>`,
            starter: `public static class ProductList {
    private Product[] _products;
    private int _size;

    public ProductList(int capacity) {
        _products = new Product[capacity];
        _size = 0;
    }

    public boolean addProduct(Product p) {
        if (_size == _products.length) return false;
        for (int i = 0; i < _size; i++) {
            if (_products[i].equals(p)) return false;
        }
        _products[_size++] = p;
        return true;
    }

    public double mostFrequentPrice() {

    }
}`,
            solution: `public static class ProductList {
    private Product[] _products;
    private int _size;

    public ProductList(int capacity) {
        _products = new Product[capacity];
        _size = 0;
    }

    public boolean addProduct(Product p) {
        if (_size == _products.length) return false;
        for (int i = 0; i < _size; i++) {
            if (_products[i].equals(p)) return false;
        }
        _products[_size++] = p;
        return true;
    }

    public double mostFrequentPrice() {
        double best = _products[0].getPrice();
        int bestCount = 0;
        for (int i = 0; i < _size; i++) {
            int count = 0;
            for (int j = 0; j < _size; j++) {
                if (_products[j].getPrice() == _products[i].getPrice()) {
                    count++;
                }
            }
            if (count > bestCount) {
                bestCount = count;
                best = _products[i].getPrice();
            }
        }
        return best;
    }
}`,
            support: `static class Product {
    private String _name; private double _price;
    public Product(String name, double price) { _name = name; _price = price; }
    public String getName() { return _name; }
    public double getPrice() { return _price; }
    public boolean equals(Product other) { return _name.equals(other._name) && _price == other._price; }
    public String toString() { return _name + " " + _price; }
}
static ProductList list(Object... np) {
    ProductList l = new ProductList(10);
    for (int i = 0; i < np.length; i += 2) l.addProduct(new Product((String) np[i], ((Number) np[i + 1]).doubleValue()));
    return l;
}`,
            tests: [
              ['מחיר שכיח ברור', String.raw`T.eq("מחירים 5, 7, 7, 3 → 7", 7.0, list("A", 5, "B", 7, "C", 7, "D", 3).mostFrequentPrice());`],
              ['שוויון – המחיר הראשון', String.raw`T.eq("מחירים 4, 9, 9, 4 → 4 (הראשון)", 4.0, list("A", 4, "B", 9, "C", 9, "D", 4).mostFrequentPrice());`],
              ['כל המחירים שונים', String.raw`T.eq("מחירים 2.5, 3.5, 1.5 → 2.5", 2.5, list("A", 2.5, "B", 3.5, "C", 1.5).mostFrequentPrice());`],
              ['מוצר יחיד', String.raw`T.eq("מוצר יחיד במחיר 12.9", 12.9, list("A", 12.9).mostFrequentPrice());`],
              ['תאים ריקים במערך', String.raw`T.eq("מחירים 1, 2, 2, 2, 1 → 2", 2.0, list("A", 1, "B", 2, "C", 2, "D", 2, "E", 1).mostFrequentPrice());`]
            ]
          }
        ]
      },
      {
        num: 4, points: 18, title: 'ניתוח קוד',
        intro: `<p>נתונה השיטה <code>foo(…)</code> הבאה:</p>
<pre class="code">public static void foo(boolean[] a) {
    int i = 0;
    int j = a.length - 1;
    while (i &lt; j) {
        while (i &lt; j &amp;&amp; a[i]) {
            i++;
        }
        while (i &lt; j &amp;&amp; !a[j]) {
            j--;
        }
        if (i &lt; j) {
            boolean temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
    }
}</pre>`,
        parts: [
          {
            id: 'd02-4a', title: 'סעיף א', points: 4, type: 'text',
            html: `<pre class="code">boolean[] a = {true, false, true, false, false, true, false};
foo(a);</pre><p>רשמו את איברי המערך <code>a</code> לאחר הרצת השיטה.</p>`,
            placeholder: 'למשל: true, false, ...',
            check: function (s) {
              var v = Checks.list(Checks.stripAssign(s)).map(function (x) { return x.toLowerCase(); });
              if (!v.length) return { ok: false, msg: 'לא נכתבה תשובה.' };
              var exp = ['true', 'true', 'true', 'false', 'false', 'false', 'false'];
              if (v.length !== 7) return { ok: false, msg: 'במערך צריכים להיות 7 איברים, וכתבתם ' + v.length + '.' };
              return v.join() === exp.join() ? { ok: true, msg: 'נכון!' } : { ok: false, msg: 'לא נכון. עקבו אחרי ערכי i ו-j בכל סיבוב של הלולאה החיצונית.' };
            },
            solution: '{true, true, true, false, false, false, false}'
          },
          {
            id: 'd02-4b', title: 'סעיף ב', points: 2, type: 'text',
            html: `<p>נתונה ההתחלה של המערך <code>b</code>:</p><pre class="code">boolean[] b = {false, ________________};</pre>
<p>השלימו את המערך <code>b</code> כך שלאחר ריצת הפקודה <code>foo(b)</code> איברי המערך <code>b</code> יהיו מסודרים כך:</p>
<pre class="code">b = {true, false, false, false, false};</pre><p>(ניתן להשלים את המערך במספר דרכים.) כתבו רק את האיברים שאחרי <code>false</code> הראשון.</p>`,
            placeholder: 'למשל: true, false, ...',
            check: function (s) {
              var v = Checks.list(s).map(function (x) { return x.toLowerCase(); });
              if (!v.length) return { ok: false, msg: 'לא נכתבה תשובה.' };
              if (v.some(function (x) { return x !== 'true' && x !== 'false'; })) return { ok: false, msg: 'יש לכתוב רק ערכי true / false מופרדים בפסיקים.' };
              var a = [false].concat(v.map(function (x) { return x === 'true'; }));
              var i = 0, j = a.length - 1;
              while (i < j) {
                while (i < j && a[i]) i++;
                while (i < j && !a[j]) j--;
                if (i < j) { var t = a[i]; a[i] = a[j]; a[j] = t; }
              }
              var got = '{' + a.join(', ') + '}';
              if (got === '{true, false, false, false, false}') return { ok: true, msg: 'נכון! אחרי foo המערך הוא ' + got + '.' };
              return { ok: false, msg: 'לא נכון. עבור המערך שכתבתם, אחרי foo מתקבל ' + got + '.' };
            },
            solution: 'true, false, false, false  (כלומר b = {false, true, false, false, false} – כל מערך עם true אחד בדיוק מתאים)',
            testAnswer: 'true, false, false, false'
          },
          {
            id: 'd02-4c', title: 'סעיף ג', points: 12, type: 'java',
            html: `<p>השיטה <code>foo</code> משנה את המערך שהתקבל כפרמטר ולא מחזירה ערך. כתבו גרסה חדשה לשיטה, <code>public static boolean[] foo2(boolean[] a)</code>. הגרסה החדשה לא משנה את המערך <code>a</code> שהתקבל כפרמטר; היא יוצרת מערך חדש, בונה אותו לפי הלוגיקה של השיטה <code>foo</code> המקורית ומחזירה אותו כערך מוחזר. כלומר, עבור מערך בוליאני כלשהו <code>a</code>, לאחר שתי הפקודות הבאות המערכים <code>b</code> ו-<code>a</code> יהיו זהים:</p>
<pre class="code">boolean[] b = foo2(a);
foo(a);</pre>`,
            starter: `public static boolean[] foo2(boolean[] a) {
    boolean[] b = ________________;

}`,
            solution: `public static boolean[] foo2(boolean[] a) {
    boolean[] b = new boolean[a.length];
    for (int k = 0; k < a.length; k++) {
        b[k] = a[k];
    }
    int i = 0;
    int j = b.length - 1;
    while (i < j) {
        while (i < j && b[i]) {
            i++;
        }
        while (i < j && !b[j]) {
            j--;
        }
        if (i < j) {
            boolean temp = b[i];
            b[i] = b[j];
            b[j] = temp;
        }
    }
    return b;
}`,
            support: `public static void foo(boolean[] a) {
    int i = 0, j = a.length - 1;
    while (i < j) {
        while (i < j && a[i]) i++;
        while (i < j && !a[j]) j--;
        if (i < j) { boolean t = a[i]; a[i] = a[j]; a[j] = t; }
    }
}
static void checkFoo2(String label, boolean[] a) {
    boolean[] orig = a.clone();
    boolean[] b = foo2(a);
    T.eq(label + " – a לא השתנה", orig, a);
    T.ok(label + " – הוחזר מערך חדש", b != a, "הוחזר אותו מערך שהתקבל");
    foo(a);
    T.eq(label + " – התוצאה זהה ל-foo", a, b);
}`,
            tests: [
              ['מערך מסעיף א', String.raw`checkFoo2("{T,F,T,F,F,T,F}", new boolean[]{true, false, true, false, false, true, false});`],
              ['כולו false', String.raw`checkFoo2("{F,F,F}", new boolean[]{false, false, false});`],
              ['מתחיל ב-false', String.raw`checkFoo2("{F,F,T,T,F,T}", new boolean[]{false, false, true, true, false, true});`],
              ['מערך ריק', String.raw`checkFoo2("{}", new boolean[]{});`]
            ]
          }
        ]
      }
    ]
  });
})();
