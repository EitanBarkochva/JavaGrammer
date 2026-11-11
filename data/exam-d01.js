// מבחן דוגמה 01 – מבוא למדעי המחשב ושפת Java א
(window.EXAMS = window.EXAMS || []).push({
  id: 'd01',
  title: 'מבחן דוגמה 01',
  subtitle: 'דוגמה למבחן מסכם לקורס מבוא למדעי המחשב ושפת Java א',
  intro: 'במבחן זה 4 שאלות, יש לענות על כל השאלות.',
  questions: [
    {
      num: 1, points: 30, title: 'מחלקות Person ו-Car',
      parts: [
        {
          id: 'd01-1a', title: 'סעיף א – המחלקה Person', points: 8, type: 'java',
          html: `<p>המחלקה <code>Person</code> מייצגת אדם שיש לו שם ומספר זהות. השלימו את המחלקה לפי ההוראות הבאות:</p>
<ol>
<li>הגדירו קבוע ברירת מחדל עבור תכונת <code>_id</code> – מחרוזת ובה 9 ספרות, למשל <code>"123456789"</code>. שם הקבוע צריך להתאים לשימוש שיש בו בבנאי. (2 נק')</li>
<li>השיטה <code>toString</code> מחזירה מחרוזת המייצגת את האובייקט של המחלקה לפי הדוגמה הבאה: <code>"Dan - 234562462"</code> (השם Dan ומספר הזהות 234562462). (3 נק')</li>
<li>השיטה הפרטית <code>isValidId</code> מחזירה <code>true</code> אם הפרמטר <code>id</code> הוא מחרוזת ובה 9 ספרות, אחרת מחזירה <code>false</code>. (3 נק')</li>
</ol>
<p class="note">שימו לב – במחלקה כתובים בנאי העתקה והשיטה <code>equals</code> וניתן להשתמש בהם.</p>`,
          starter: `public class Person {
    //1  public static ...

    private String _name;
    private String _id;

    public Person(String name, String id) {
        _name = name;
        if (isValidId(id)) {
            _id = id;
        } else {
            _id = DEF_ID;
        }
    }

    // copy constructor – נתון
    public Person(Person p) { _name = p._name; _id = p._id; }

    public boolean equals(Person other) {
        return _name.equals(other._name) && _id.equals(other._id);
    }

    public String toString() {
        //2

    }

    private boolean isValidId(String id) {
        //3

    }
}`,
          solution: `public class Person {
    public static final String DEF_ID = "123456789";

    private String _name;
    private String _id;

    public Person(String name, String id) {
        _name = name;
        if (isValidId(id)) {
            _id = id;
        } else {
            _id = DEF_ID;
        }
    }

    public Person(Person p) { _name = p._name; _id = p._id; }

    public boolean equals(Person other) {
        return _name.equals(other._name) && _id.equals(other._id);
    }

    public String toString() {
        return _name + " - " + _id;
    }

    private boolean isValidId(String id) {
        if (id.length() != 9) {
            return false;
        }
        for (int i = 0; i < id.length(); i++) {
            if (id.charAt(i) < '0' || id.charAt(i) > '9') {
                return false;
            }
        }
        return true;
    }
}`,
          tests: [
            ['הקבוע DEF_ID הוא מחרוזת של 9 ספרות', String.raw`T.ok("הקבוע DEF_ID הוא מחרוזת של 9 ספרות", Person.DEF_ID != null && Person.DEF_ID.matches("[0-9]{9}"), "DEF_ID = " + T.show(Person.DEF_ID));`],
            ['הקבוע DEF_ID מוגדר final', String.raw`T.ok("הקבוע DEF_ID מוגדר final", java.lang.reflect.Modifier.isFinal(Person.class.getDeclaredField("DEF_ID").getModifiers()), "חסרה המילה final");`],
            ['toString', String.raw`T.eq("toString עבור Dan ו-234562462", "Dan - 234562462", T.dash(new Person("Dan", "234562462").toString()));`],
            ['isValidId', String.raw`Person p = new Person("A", "123456789");
              T.eq("isValidId(\"123456789\")", true, p.isValidId("123456789"));
              T.eq("isValidId(\"987654321\")", true, p.isValidId("987654321"));
              T.eq("isValidId(\"12345678\") – 8 ספרות", false, p.isValidId("12345678"));
              T.eq("isValidId(\"1234567890\") – 10 ספרות", false, p.isValidId("1234567890"));
              T.eq("isValidId(\"12345678a\") – תו שאינו ספרה", false, p.isValidId("12345678a"));
              T.eq("isValidId(\"1234-5678\")", false, p.isValidId("1234-5678"));
              T.eq("isValidId(\"\") – מחרוזת ריקה", false, p.isValidId(""));`],
            ['בנאי עם ת"ז לא חוקית', String.raw`T.eq("בנאי עם ת\"ז לא חוקית מציב את DEF_ID", "Dan - " + Person.DEF_ID, T.dash(new Person("Dan", "345678").toString()));`]
          ]
        },
        {
          id: 'd01-1b', title: 'סעיף ב – המחלקה Car', points: 16, type: 'java',
          html: `<p>המחלקה <code>Car</code> מדמה מכונית. השלימו את המחלקה לפי ההוראות הבאות:</p>
<ol>
<li>הבנאי – אין צורך לבדוק את הפרמטרים אבל יש להימנע מהצבעה כפולה (aliasing). (4 נק')</li>
<li>השיטה <code>getOwner</code> מחזירה אובייקט מסוג <code>Person</code> המייצג את ה-owner. יש להימנע מהצבעה כפולה (aliasing). (3 נק')</li>
<li>השיטה <code>newer</code> מקבלת אובייקט מהמחלקה <code>Car</code> ומחזירה <code>true</code> אם האובייקט הנוכחי חדש יותר מהאובייקט שהתקבל כפרמטר. במימוש השיטה השתמשו <b>אך ורק</b> בשיטה <code>older</code>. הניחו שהשיטה <code>older</code> כתובה ומחזירה <code>true</code> כאשר האובייקט הנוכחי ישן יותר מאובייקט הפרמטר. (3 נק')</li>
<li>השיטה <code>equals</code> מקבלת אובייקט מהמחלקה <code>Car</code> ומחזירה <code>true</code> אם האובייקט הנוכחי ואובייקט הפרמטר שווים בערכי תכונותיהם, אחרת מחזירה <code>false</code>. (3 נק')</li>
<li>השיטה <code>toString</code> מחזירה מחרוזת המייצגת את האובייקט לפי הדוגמה: <code>"Owner: Dan - 345678; Manufacturer: Ford; Year: 2008"</code>. הקפידו ליצור מחרוזת מדויקת. (3 נק')</li>
</ol>
<p class="note">המחלקה <code>Person</code> מסעיף א זמינה לכם (כולל בנאי העתקה, <code>equals</code> ו-<code>toString</code> בפורמט <code>"Dan - 345678"</code>).</p>`,
          starter: `public class Car {
    private Person _owner;
    private String _manufacturer;
    private int _year;

    public Car(Person owner, String manufacturer, int year) {
        //1

    }

    public Person getOwner() {
        //2

    }

    // נתונה – אין לשנות
    public boolean older(Car other) { return _year < other._year; }

    public boolean newer(Car other) {
        //3

    }

    public boolean equals(Car other) {
        //4

    }

    public String toString() {
        //5

    }
}`,
          solution: `public class Car {
    private Person _owner;
    private String _manufacturer;
    private int _year;

    public Car(Person owner, String manufacturer, int year) {
        _owner = new Person(owner);
        _manufacturer = manufacturer;
        _year = year;
    }

    public Person getOwner() {
        return new Person(_owner);
    }

    public boolean older(Car other) { return _year < other._year; }

    public boolean newer(Car other) {
        return other.older(this);
    }

    public boolean equals(Car other) {
        return _owner.equals(other._owner) && _manufacturer.equals(other._manufacturer)
                && _year == other._year;
    }

    public String toString() {
        return "Owner: " + _owner + "; Manufacturer: " + _manufacturer + "; Year: " + _year;
    }
}`,
          support: `static class Person {
    private String _name;
    private String _id;
    public Person(String name, String id) { _name = name; _id = id; }
    public Person(Person p) { _name = p._name; _id = p._id; }
    public boolean equals(Person other) { return _name.equals(other._name) && _id.equals(other._id); }
    public String toString() { return _name + " - " + _id; }
}`,
          sourceChecks: [
            { label: 'השיטה newer משתמשת בשיטה older', re: /newer\s*\([^)]*\)\s*\{[^}]*older\s*\(/ }
          ],
          tests: [
            ['בנאי – aliasing', String.raw`Person p = new Person("Dan", "345678");
              Car c = new Car(p, "Ford", 2008);
              T.ok("הבנאי מאתחל את הבעלים (ערכים שווים)", c._owner != null && c._owner.equals(p), "הבעלים לא אותחל נכון");
              T.ok("הבנאי נמנע מ-aliasing (יוצר עותק של Person)", c._owner != p, "התכונה _owner מצביעה על אותו אובייקט שהתקבל בפרמטר");
              T.eq("הבנאי מאתחל יצרן", "Ford", c._manufacturer);
              T.eq("הבנאי מאתחל שנה", 2008, c._year);`],
            ['getOwner', String.raw`Car c = new Car(new Person("Dan", "345678"), "Ford", 2008);
              Person o = c.getOwner();
              T.ok("getOwner מחזירה בעלים עם אותם ערכים", o != null && o.equals(new Person("Dan", "345678")), "התקבל " + T.show(o));
              T.ok("getOwner נמנעת מ-aliasing (מחזירה עותק)", o != c._owner, "הוחזרה הפניה לתכונה עצמה");`],
            ['newer', String.raw`Car a = new Car(new Person("A", "1"), "Ford", 2008);
              Car b = new Car(new Person("B", "2"), "Fiat", 2005);
              Car c = new Car(new Person("C", "3"), "Kia", 2008);
              T.eq("2008 חדשה יותר מ-2005", true, a.newer(b));
              T.eq("2005 אינה חדשה יותר מ-2008", false, b.newer(a));
              T.eq("שתי מכוניות מאותה שנה – newer מחזירה false", false, a.newer(c));`],
            ['equals', String.raw`Car a = new Car(new Person("Dan", "345678"), "Ford", 2008);
              T.eq("מכוניות זהות בערכים (אובייקטים שונים)", true, a.equals(new Car(new Person("Dan", "345678"), "Ford", 2008)));
              T.eq("בעלים שונה", false, a.equals(new Car(new Person("Ron", "345678"), "Ford", 2008)));
              T.eq("יצרן שונה", false, a.equals(new Car(new Person("Dan", "345678"), "Fiat", 2008)));
              T.eq("שנה שונה", false, a.equals(new Car(new Person("Dan", "345678"), "Ford", 2009)));
              T.eq("השוואת יצרן לפי ערך (new String)", true, a.equals(new Car(new Person("Dan", "345678"), new String("Ford"), 2008)));`],
            ['toString', String.raw`T.eq("toString", "Owner: Dan - 345678; Manufacturer: Ford; Year: 2008", T.dash(new Car(new Person("Dan", "345678"), "Ford", 2008).toString()));`]
          ]
        },
        {
          id: 'd01-1c', title: 'סעיף ג – המחלקה CarDemo', points: 6, type: 'java',
          html: `<p>המחלקה <code>CarDemo</code> מדמה שימוש במחלקות <code>Person</code> ו-<code>Car</code>. השלימו אותה לפי ההוראות הבאות:</p>
<ol>
<li>יצירת אובייקט <code>Person</code> בשם Dan ומספר זהות 345678. (2 נק')</li>
<li>יצירת אובייקט של המחלקה <code>Car</code>: בעלים Dan, יצרן Ford ושנת ייצור 2008. (2 נק')</li>
<li>השלימו את התנאי על ידי זימון השיטה המתאימה להדפסה שבאה אחרי התנאי. (2 נק')</li>
</ol>
<p class="note">בתיבה נמצא <b>גוף</b> השיטה <code>main</code>. את <code>p2</code> ו-<code>c2</code> (שבמבחן מסומנים ב-...) השלמנו בשבילכם.</p>`,
          wrap: `static Object[] studentMain() {
%%CODE%%
return new Object[] { p1, c1 };
}`,
          starter: `Person p1 = new ________________ ; //1
Person p2 = new Person("Ron", "567890");

Car c1 = new ________________ ; //2
Car c2 = new Car(p2, "Mazda", 2005);

if (________________) { //3
    System.out.println("c1 is newer than c2");
}`,
          solution: `Person p1 = new Person("Dan", "345678"); //1
Person p2 = new Person("Ron", "567890");

Car c1 = new Car(p1, "Ford", 2008); //2
Car c2 = new Car(p2, "Mazda", 2005);

if (c1.newer(c2)) { //3
    System.out.println("c1 is newer than c2");
}`,
          support: `static class Person {
    private String _name;
    private String _id;
    public Person(String name, String id) { _name = name; _id = id; }
    public Person(Person p) { _name = p._name; _id = p._id; }
    public boolean equals(Person other) { return _name.equals(other._name) && _id.equals(other._id); }
    public String toString() { return _name + " - " + _id; }
}
static class Car {
    private Person _owner; private String _manufacturer; private int _year;
    public Car(Person owner, String manufacturer, int year) { _owner = new Person(owner); _manufacturer = manufacturer; _year = year; }
    public Person getOwner() { return new Person(_owner); }
    public boolean older(Car other) { return _year < other._year; }
    public boolean newer(Car other) { return other.older(this); }
    public boolean equals(Car other) { return _owner.equals(other._owner) && _manufacturer.equals(other._manufacturer) && _year == other._year; }
    public String toString() { return "Owner: " + _owner + "; Manufacturer: " + _manufacturer + "; Year: " + _year; }
}`,
          sourceChecks: [
            { label: 'התנאי משתמש בשיטה newer או older', re: /if\s*\([^)]*\.\s*(newer|older)\s*\(/ }
          ],
          tests: [
            ['הרצת main', String.raw`final Object[][] r = new Object[1][];
              String[] out = T.capture(new Runnable() { public void run() { r[0] = studentMain(); } });
              T.eq("p1 הוא Dan עם מספר זהות 345678", "Dan - 345678", String.valueOf(r[0][0]));
              T.eq("c1 – בעלים Dan, יצרן Ford, שנת 2008", "Owner: Dan - 345678; Manufacturer: Ford; Year: 2008", String.valueOf(r[0][1]));
              T.ok("מודפס c1 is newer than c2", out.length == 1 && out[0].trim().equals("c1 is newer than c2"), "הפלט היה: " + java.util.Arrays.toString(out));`]
          ]
        }
      ]
    },
    {
      num: 2, points: 28, title: 'הסרת ערך כפול ממערך',
      intro: `<p>נתון מערך של מספרים טבעיים (שלמים חיוביים). במערך זה ייתכן שאחד הערכים חוזר על עצמו פעמיים. משימתכם ליצור מערך חדש בו כל ערך מופיע בדיוק פעם אחת.</p>`,
      parts: [
        {
          id: 'd01-2a', title: 'סעיף א – מציאת הערך המופיע פעמיים במערך', points: 13, type: 'java',
          html: `<p>כתבו את השיטה הסטטית <code>private static int getDuplicate(int[] a)</code> המקבלת מערך של מספרים חיוביים ומחזירה את הערך שמופיע פעמיים. אם אין ערך כזה השיטה תחזיר <code>-1</code>. ניתן להניח שבמערך לכל היותר ערך אחד המופיע פעמיים. דוגמאות:</p>
<ol>
<li>עבור המערך <code>{2, 4, 1, 6, 2, 5}</code> יוחזר הערך 2 שמופיע פעמיים במערך.</li>
<li>עבור המערך <code>{2, 4, 1, 6, 5}</code> יוחזר הערך <code>-1</code> כי אין איברים שמופיעים פעמיים.</li>
</ol>`,
          starter: `private static int getDuplicate(int[] a) {

}`,
          solution: `private static int getDuplicate(int[] a) {
    for (int i = 0; i < a.length; i++) {
        for (int j = i + 1; j < a.length; j++) {
            if (a[i] == a[j]) {
                return a[i];
            }
        }
    }
    return -1;
}`,
          tests: [
            ['דוגמה 1', String.raw`T.eq("getDuplicate({2, 4, 1, 6, 2, 5})", 2, getDuplicate(new int[]{2, 4, 1, 6, 2, 5}));`],
            ['דוגמה 2', String.raw`T.eq("getDuplicate({2, 4, 1, 6, 5})", -1, getDuplicate(new int[]{2, 4, 1, 6, 5}));`],
            ['כפילות בסוף', String.raw`T.eq("getDuplicate({1, 2, 3, 4, 5, 5})", 5, getDuplicate(new int[]{1, 2, 3, 4, 5, 5}));`],
            ['כפילות בקצוות', String.raw`T.eq("getDuplicate({9, 3, 4, 9})", 9, getDuplicate(new int[]{9, 3, 4, 9}));`],
            ['איבר יחיד', String.raw`T.eq("getDuplicate({7})", -1, getDuplicate(new int[]{7}));`],
            ['מערך ריק', String.raw`T.eq("getDuplicate({})", -1, getDuplicate(new int[]{}));`]
          ]
        },
        {
          id: 'd01-2b', title: 'סעיף ב – הסרת כפילות מהמערך', points: 15, type: 'java',
          html: `<p>כתבו את השיטה <code>public static int[] removeDuplicate(int[] a)</code> המקבלת מערך של מספרים חיוביים שבו ייתכן שאחד הערכים מופיע פעמיים. השיטה מחזירה מערך בו כל אחד מערכי מערך הפרמטר <code>a</code> מופיע בדיוק פעם אחת. דוגמאות:</p>
<ol>
<li>עבור המערך <code>{2, 4, 1, 6, 2, 5}</code> יוחזר המערך <code>{2, 4, 1, 6, 5}</code>.</li>
<li>עבור המערך <code>{2, 4, 1, 6, 5}</code> יוחזר המערך <code>{2, 4, 1, 6, 5}</code>.</li>
</ol>
<p>השיטה <code>removeDuplicate</code> צריכה להשתמש בשיטה <code>getDuplicate</code> מסעיף א. תוכלו להניח שיש לכם את השיטה גם אם לא עניתם על סעיף א.</p>`,
          starter: `public static int[] removeDuplicate(int[] a) {

}`,
          solution: `public static int[] removeDuplicate(int[] a) {
    int dup = getDuplicate(a);
    if (dup == -1) {
        int[] copy = new int[a.length];
        for (int i = 0; i < a.length; i++) {
            copy[i] = a[i];
        }
        return copy;
    }
    int[] res = new int[a.length - 1];
    boolean seen = false;
    int k = 0;
    for (int i = 0; i < a.length; i++) {
        if (a[i] == dup) {
            if (seen) {
                continue; // מדלגים על המופע השני
            }
            seen = true;
        }
        res[k] = a[i];
        k++;
    }
    return res;
}`,
          support: `private static int getDuplicate(int[] a) {
    for (int i = 0; i < a.length; i++) for (int j = i + 1; j < a.length; j++) if (a[i] == a[j]) return a[i];
    return -1;
}`,
          sourceChecks: [{ label: 'השיטה משתמשת ב-getDuplicate', re: /getDuplicate\s*\(/ }],
          tests: [
            ['דוגמה 1', String.raw`T.eq("removeDuplicate({2, 4, 1, 6, 2, 5})", new int[]{2, 4, 1, 6, 5}, removeDuplicate(new int[]{2, 4, 1, 6, 2, 5}));`],
            ['דוגמה 2', String.raw`T.eq("removeDuplicate({2, 4, 1, 6, 5})", new int[]{2, 4, 1, 6, 5}, removeDuplicate(new int[]{2, 4, 1, 6, 5}));`],
            ['כפילות בקצוות', String.raw`T.eq("removeDuplicate({5, 1, 5})", new int[]{5, 1}, removeDuplicate(new int[]{5, 1, 5}));`],
            ['כפילות צמודה', String.raw`T.eq("removeDuplicate({3, 3})", new int[]{3}, removeDuplicate(new int[]{3, 3}));`],
            ['המערך המקורי לא משתנה', String.raw`int[] a = {2, 4, 1, 6, 2, 5};
              removeDuplicate(a);
              T.eq("המערך שהתקבל כפרמטר לא השתנה", new int[]{2, 4, 1, 6, 2, 5}, a);`]
          ]
        }
      ]
    },
    {
      num: 3, points: 24, title: 'סכום העמודה של האיבר הקטן ביותר',
      intro: `<p>יש לחשב את סכום העמודה בה נמצא האיבר בעל הערך הקטן ביותר במערך דו-ממדי. בדוגמאות נשתמש במערך:</p>
<table class="grid"><tr><td>3</td><td>2</td><td>5</td><td>5</td></tr><tr><td>6</td><td>3</td><td>4</td><td>0</td></tr><tr><td>4</td><td>5</td><td class="hl">-3</td><td>2</td></tr></table>`,
      parts: [
        {
          id: 'd01-3a', title: 'סעיף א – מציאת העמודה של האיבר הקטן ביותר', points: 12, type: 'java',
          html: `<p>כתבו את השיטה <code>public static int minElementColumn(int[][] a)</code> המקבלת מערך דו-ממדי של מספרים שלמים ומחזירה את האינדקס של <b>העמודה</b> שבה נמצא הערך הקטן ביותר (ניתן להניח שיש רק אחד כזה).</p>
<p>לדוגמה, עבור המערך שלמעלה השיטה תחזיר 2, שהוא אינדקס העמודה של הערך <code>-3</code> שהוא הקטן ביותר מבין ערכי המערך.</p>`,
          starter: `public static int minElementColumn(int[][] a) {

}`,
          solution: `public static int minElementColumn(int[][] a) {
    int minRow = 0, minCol = 0;
    for (int i = 0; i < a.length; i++) {
        for (int j = 0; j < a[i].length; j++) {
            if (a[i][j] < a[minRow][minCol]) {
                minRow = i;
                minCol = j;
            }
        }
    }
    return minCol;
}`,
          tests: [
            ['דוגמה', String.raw`T.eq("המערך מהדוגמה", 2, minElementColumn(new int[][]{{3, 2, 5, 5}, {6, 3, 4, 0}, {4, 5, -3, 2}}));`],
            ['מינימום בפינה', String.raw`T.eq("{{-9, 2}, {3, 4}}", 0, minElementColumn(new int[][]{{-9, 2}, {3, 4}}));`],
            ['מינימום בעמודה האחרונה', String.raw`T.eq("{{5, 6, 7}, {8, 9, 1}}", 2, minElementColumn(new int[][]{{5, 6, 7}, {8, 9, 1}}));`],
            ['כל הערכים חיוביים וגדולים', String.raw`T.eq("{{100, 50}, {70, 80}, {90, 60}}", 1, minElementColumn(new int[][]{{100, 50}, {70, 80}, {90, 60}}));`],
            ['איבר יחיד', String.raw`T.eq("{{4}}", 0, minElementColumn(new int[][]{{4}}));`]
          ]
        },
        {
          id: 'd01-3b', title: 'סעיף ב – חישוב סכום העמודה בה נמצא האיבר הקטן ביותר', points: 12, type: 'java',
          html: `<p>כתבו את השיטה <code>public static int minColumnSum(int[][] a)</code> המקבלת מערך דו-ממדי של מספרים שלמים ומחזירה את סכום האיברים של העמודה בה נמצא הערך הקטן ביותר. יש להשתמש בשיטה <code>minElementColumn</code> מסעיף א למציאת אינדקס העמודה, גם אם לא פתרתם את סעיף א.</p>
<p>לדוגמה, עבור המערך שלמעלה השיטה תחזיר את הערך 6, שהוא סכום העמודה באינדקס 2 בה נמצא הערך הקטן ביותר <code>-3</code>: <code>5+4+(-3)=6</code>.</p>`,
          starter: `public static int minColumnSum(int[][] a) {

}`,
          solution: `public static int minColumnSum(int[][] a) {
    int col = minElementColumn(a);
    int sum = 0;
    for (int i = 0; i < a.length; i++) {
        sum += a[i][col];
    }
    return sum;
}`,
          support: `public static int minElementColumn(int[][] a) {
    int r = 0, c = 0;
    for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) if (a[i][j] < a[r][c]) { r = i; c = j; }
    return c;
}`,
          sourceChecks: [{ label: 'השיטה משתמשת ב-minElementColumn', re: /minElementColumn\s*\(/ }],
          tests: [
            ['דוגמה', String.raw`T.eq("המערך מהדוגמה", 6, minColumnSum(new int[][]{{3, 2, 5, 5}, {6, 3, 4, 0}, {4, 5, -3, 2}}));`],
            ['עמודה 0', String.raw`T.eq("{{-9, 2}, {3, 4}}", -6, minColumnSum(new int[][]{{-9, 2}, {3, 4}}));`],
            ['שורה אחת', String.raw`T.eq("{{5, 1, 7}}", 1, minColumnSum(new int[][]{{5, 1, 7}}));`],
            ['עמודה אחרונה', String.raw`T.eq("{{5, 6, 7}, {8, 9, 1}, {2, 3, 10}}", 18, minColumnSum(new int[][]{{5, 6, 7}, {8, 9, 1}, {2, 3, 10}}));`]
          ]
        }
      ]
    },
    {
      num: 4, points: 18, title: 'ניתוח קוד',
      intro: `<p>נתונה השיטה הבאה:</p>
<pre class="code numbered">1.  public static String foo(String str) {
2.      String result = "";
3.      for (int i = str.length() - 1; i >= 0; i--) {
4.          char ch = str.charAt(i);
5.          if (ch == ' ') {
6.              result += '_';
7.          } else {
8.              result += ch;
9.          }
10.     }
11.     return result;
12. }</pre>`,
      parts: [
        {
          id: 'd01-4a', title: 'סעיף א – פלט השיטה', points: 5, type: 'text',
          html: `<p>מה תהיה ההדפסה שתתקבל מהרצת הפקודה הבאה?</p><pre class="code">System.out.println(foo("red blue"));</pre>`,
          placeholder: 'כתבו כאן את הפלט',
          check: function (s) { return Checks.exact(s, 'eulb_der'); },
          solution: 'eulb_der'
        },
        {
          id: 'd01-4b', title: 'סעיף ב – קלט השיטה', points: 5, type: 'text',
          html: `<p>התקבלה ההדפסה <code>owt_eno</code>. מה הייתה מחרוזת הקלט של השיטה?</p><pre class="code">System.out.println(foo("________"));</pre>`,
          placeholder: 'כתבו כאן את מחרוזת הקלט',
          check: function (s) {
            return Checks.byRun(s, function (str) {
              var r = '';
              for (var i = str.length - 1; i >= 0; i--) r += str[i] === ' ' ? '_' : str[i];
              return r;
            }, 'owt_eno');
          },
          solution: 'one two'
        },
        {
          id: 'd01-4c', title: 'סעיף ג – עדכון השיטה', points: 7, type: 'java',
          html: `<p>הציעו שינוי או שינויים כך שבהרצת הפקודה <code>System.out.println(foo("next line"));</code> תתקבל ההדפסה <code>next_line</code>. ציינו את מספר השורה שתרצו לשנות וכתבו אותה בצורתה המעודכנת.</p>
<p class="note">בתיבה נמצאת השיטה המקורית – שנו בה את מה שצריך. הבדיקה מריצה את השיטה המעודכנת.</p>`,
          starter: `public static String foo(String str) {
    String result = "";
    for (int i = str.length() - 1; i >= 0; i--) {
        char ch = str.charAt(i);
        if (ch == ' ') {
            result += '_';
        } else {
            result += ch;
        }
    }
    return result;
}`,
          solution: `// שינוי בשורה 3:
public static String foo(String str) {
    String result = "";
    for (int i = 0; i < str.length(); i++) {   // שורה 3
        char ch = str.charAt(i);
        if (ch == ' ') {
            result += '_';
        } else {
            result += ch;
        }
    }
    return result;
}`,
          tests: [
            ['next line', String.raw`T.eq("foo(\"next line\")", "next_line", foo("next line"));`],
            ['a b c', String.raw`T.eq("foo(\"a b c\")", "a_b_c", foo("a b c"));`],
            ['abc', String.raw`T.eq("foo(\"abc\")", "abc", foo("abc"));`]
          ]
        }
      ]
    }
  ]
});
