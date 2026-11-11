// 11203 מבחן מסכם 01
(function () {
  function personPet(opt) {
    opt = opt || {};
    return `static class Person {
    public static final String DEF_PHONE = "0000000000";
    private String _name;
    private String _phone;
    public Person(String name, String phone) {
        _name = name;
        ${opt.badCtor ? '_phone = phone;' : 'if (isValidPhone(phone)) _phone = phone; else _phone = DEF_PHONE;'}
    }
    public Person(Person other) { _name = other._name; _phone = other._phone; }
    public String getName() { return _name; }
    public void setName(String name) { _name = name; }
    public String getPhone() { return _phone; }
    public void setPhone(String phone) { if (isValidPhone(phone)) _phone = phone; }
    public String toString() { return _name + " " + _phone; }
    public boolean equals(Person other) { return _name.equals(other._name) && _phone.equals(other._phone); }
    private boolean isValidPhone(String phone) {
        if (phone.length() != 10) return false;
        for (int i = 0; i < phone.length(); i++) if (phone.charAt(i) < '0' || phone.charAt(i) > '9') return false;
        return true;
    }
}
static class Pet {
    private Person _owner; private String _name; private int _id; private String _type;
    public Pet(String name, int id, String type, Person owner) { _name = name; _id = id; _type = type; _owner = new Person(owner); }
    public Person getOwner() { return ${opt.badGetOwner ? '_owner' : 'new Person(_owner)'}; }
    public void setOwner(Person owner) { _owner = new Person(owner); }
    public boolean equals(Pet other) { return _owner.equals(other._owner) && _name.equals(other._name) && _id == other._id && _type.equals(other._type); }
    public boolean before(Pet other) { return _id < other._id; }
    public boolean after(Pet other) { return other.before(this); }
    public String toString() { return _name + " (" + _type + ")"; }
}`;
  }
  var personOnly = personPet().split('static class Pet')[0];
  var songClass = `static class Song {
    private String _name; private String _artist; private int _length;
    public Song(String name, String artist, int length) { _name = name; _artist = artist; _length = length; }
    public String getName() { return _name; }
    public String getArtist() { return _artist; }
    public int getLength() { return _length; }
    public String toString() { return _name + " / " + _artist + " (" + _length + "s)"; }
}`;
  var playListHead = `public class PlayList {
    private Song[] _songs;
    private int _size; // מספר השירים שנמצאים בפועל במערך

    public PlayList(int maxSongs) {
        _songs = new Song[maxSongs];
        _size = 0;
    }

    public boolean addSong(Song s) { // מוסיפה את השיר בסוף המערך
        if (_size == _songs.length) return false;
        _songs[_size] = s;
        _size++;
        return true;
    }
`;
  var runUpSupport = `public static int runUp(int[] a, int i) {
    int len = 1;
    while (i + len < a.length && a[i + len] > a[i + len - 1]) len++;
    return len;
}`;

  (window.EXAMS = window.EXAMS || []).push({
    id: 'm01',
    title: 'מבחן מסכם 01 (11203)',
    subtitle: '11203 – מבוא למדעי המחשב ושפת Java א, מבחן מסכם 01',
    intro: 'במבחן 4 שאלות, יש לענות על כל השאלות.',
    questions: [
      {
        num: 1, points: 27, title: 'המחלקות Person ו-Pet',
        parts: [
          {
            id: 'm01-1a', title: 'סעיף א – המחלקה Person', points: 9, type: 'java',
            html: `<p>המחלקה <code>Person</code> מייצגת אדם שיש לו את התכונות <code>_name</code> (שם) ו-<code>_phone</code> (מספר טלפון). השלימו את קוד המחלקה לפי ההוראות הבאות:</p>
<ol>
<li>השיטה <code>isValidPhone(..)</code> מקבלת מחרוזת ומחזירה <code>true</code> רק כאשר המחרוזת מייצגת מספר טלפון, אחרת היא מחזירה <code>false</code>. עבורנו, מחרוזת מייצגת מספר טלפון אם היא מכילה בדיוק 10 תווים וכל אחד מהם הוא ספרה. (3 נק')</li>
<li>הבנאי – ודאו שהתכונה <code>_phone</code> מקבלת ערך חוקי. אם <code>phone</code> אינו חוקי יש להציב <code>DEF_PHONE</code>. השתמשו בשיטה <code>isValidPhone(..)</code> כדי לבדוק את חוקיות הפרמטר. (3 נק')</li>
<li>השיטה <code>equals(..)</code> צריכה להחזיר <code>true</code> כאשר לכל התכונות של האובייקט הנוכחי יש אותו ערך בדיוק כמו בתכונות של האובייקט שהתקבל בפרמטר, אחרת היא תחזיר <code>false</code>. (3 נק')</li>
</ol>`,
            starter: `public class Person {
    public static final String DEF_PHONE = "0000000000";
    private String _name;
    private String _phone;

    public Person(String name, String phone) {
        _name = name;
        //2

    }

    public Person(Person other) { _name = other._name; _phone = other._phone; }
    public String getName() { return _name; }
    public void setName(String name) { _name = name; }
    public String getPhone() { return _phone; }
    public String toString() { return _name + " " + _phone; }

    public boolean equals(Person other) {
        //3

    }

    private boolean isValidPhone(String phone) {
        if (phone.length() != 10) {
            return false;
        }
        for (int i = 0; i < phone.length(); i++) {
            //1

        }
        return true;
    }
}`,
            solution: `public class Person {
    public static final String DEF_PHONE = "0000000000";
    private String _name;
    private String _phone;

    public Person(String name, String phone) {
        _name = name;
        if (isValidPhone(phone)) {
            _phone = phone;
        } else {
            _phone = DEF_PHONE;
        }
    }

    public Person(Person other) { _name = other._name; _phone = other._phone; }
    public String getName() { return _name; }
    public void setName(String name) { _name = name; }
    public String getPhone() { return _phone; }
    public String toString() { return _name + " " + _phone; }

    public boolean equals(Person other) {
        return _name.equals(other._name) && _phone.equals(other._phone);
    }

    private boolean isValidPhone(String phone) {
        if (phone.length() != 10) {
            return false;
        }
        for (int i = 0; i < phone.length(); i++) {
            char c = phone.charAt(i);
            if (c < '0' || c > '9') {
                return false;
            }
        }
        return true;
    }
}`,
            tests: [
              ['isValidPhone', String.raw`Person p = new Person("A", "0501234567");
                T.eq("isValidPhone(\"0501234567\")", true, p.isValidPhone("0501234567"));
                T.eq("isValidPhone(\"050123456a\")", false, p.isValidPhone("050123456a"));
                T.eq("isValidPhone(\"050-123456\")", false, p.isValidPhone("050-123456"));
                T.eq("isValidPhone(\"a501234567\")", false, p.isValidPhone("a501234567"));
                T.eq("isValidPhone(\"0501234\")", false, p.isValidPhone("0501234"));`],
              ['בנאי', String.raw`T.eq("טלפון חוקי נשמר", "0501234567", new Person("Alice", "0501234567").getPhone());
                T.eq("טלפון לא חוקי מוחלף ב-DEF_PHONE", Person.DEF_PHONE, new Person("Alice", "0501234").getPhone());
                T.eq("טלפון עם אות מוחלף ב-DEF_PHONE", Person.DEF_PHONE, new Person("Alice", "05O1234567").getPhone());
                T.eq("השם נשמר", "Alice", new Person("Alice", "0501234567").getName());`],
              ['equals', String.raw`Person p = new Person("Alice", "0501234567");
                T.eq("אנשים זהים בערכים", true, p.equals(new Person(new String("Alice"), new String("0501234567"))));
                T.eq("שם שונה", false, p.equals(new Person("Bob", "0501234567")));
                T.eq("טלפון שונה", false, p.equals(new Person("Alice", "0501234568")));`]
            ]
          },
          {
            id: 'm01-1b', title: 'סעיף ב – המחלקה Pet', points: 10, type: 'java',
            html: `<p>המחלקה <code>Pet</code> מייצגת חיית בית שיש לה את התכונות: בעלים (<code>_owner</code>) מסוג <code>Person</code>, מספר זיהוי <code>_id</code>, שם <code>_name</code> וסוג <code>_type</code>. השלימו את קוד המחלקה לפי ההוראות הבאות. ניתן להשתמש בכל שיטות <code>Person</code> ללא צורך לממש אותן.</p>
<ol>
<li>השיטה <code>setOwner(Person owner)</code> מעדכנת את ה-owner (הבעלים של החיה). ניתן להניח שהפרמטר <code>owner</code> אינו <code>null</code>, אבל יש להימנע מ-aliasing. (3 נק')</li>
<li>השיטה <code>equals(Pet other)</code> מחזירה <code>true</code> כאשר התכונות של החיה עליה הופעלה השיטה זהות לתכונות החיה שהתקבלה כפרמטר (בהשוואות יש להתחשב בסוג התכונה). (4 נק')</li>
<li>השיטה <code>after(Pet other)</code> מחזירה <code>true</code> כאשר החיה עליה מופעלת השיטה נמצאת אחרי החיה שהתקבלה כפרמטר. למימוש שיטה זו השתמשו <b>אך ורק</b> בשיטה <code>before</code> שקיימת במחלקה. (3 נק')</li>
</ol>`,
            starter: `public class Pet {
    private Person _owner;
    private String _name;
    private int _id;
    private String _type; // e.g., "dog" or "cat"

    public Pet(String name, int id, String type, Person owner) {
        _name = name; _id = id; _type = type; _owner = new Person(owner);
    }

    public Person getOwner() { return new Person(_owner); }

    public void setOwner(Person owner) {
        //1

    }

    public boolean equals(Pet other) {
        //2

    }

    // נתונה – אין לשנות
    public boolean before(Pet other) { return _id < other._id; }

    public boolean after(Pet other) {
        //3

    }

    public String toString() { return _name + " (" + _type + ")"; }
}`,
            solution: `public class Pet {
    private Person _owner;
    private String _name;
    private int _id;
    private String _type; // e.g., "dog" or "cat"

    public Pet(String name, int id, String type, Person owner) {
        _name = name; _id = id; _type = type; _owner = new Person(owner);
    }

    public Person getOwner() { return new Person(_owner); }

    public void setOwner(Person owner) {
        _owner = new Person(owner);
    }

    public boolean equals(Pet other) {
        return _owner.equals(other._owner) && _name.equals(other._name)
                && _id == other._id && _type.equals(other._type);
    }

    public boolean before(Pet other) { return _id < other._id; }

    public boolean after(Pet other) {
        return other.before(this);
    }

    public String toString() { return _name + " (" + _type + ")"; }
}`,
            support: personOnly,
            sourceChecks: [{ label: 'השיטה after משתמשת בשיטה before', re: /after\s*\([^)]*\)\s*\{[^}]*before\s*\(/ }],
            tests: [
              ['setOwner', String.raw`Pet pet = new Pet("Kitty", 123456, "cat", new Person("Alice", "0501234567"));
                Person bob = new Person("Bob", "0529999999");
                pet.setOwner(bob);
                T.ok("setOwner מעדכנת את הבעלים", pet._owner != null && pet._owner.equals(bob), "הבעלים: " + T.show(pet._owner));
                T.ok("setOwner נמנעת מ-aliasing", pet._owner != bob, "התכונה מצביעה על האובייקט שהתקבל");`],
              ['equals', String.raw`Person o = new Person("Alice", "0501234567");
                Pet pet = new Pet("Kitty", 123456, "cat", o);
                T.eq("חיות זהות בערכים", true, pet.equals(new Pet(new String("Kitty"), 123456, new String("cat"), new Person("Alice", "0501234567"))));
                T.eq("בעלים שונה", false, pet.equals(new Pet("Kitty", 123456, "cat", new Person("Bob", "0501234567"))));
                T.eq("שם שונה", false, pet.equals(new Pet("Mitzi", 123456, "cat", o)));
                T.eq("מספר זיהוי שונה", false, pet.equals(new Pet("Kitty", 123457, "cat", o)));
                T.eq("סוג שונה", false, pet.equals(new Pet("Kitty", 123456, "dog", o)));`],
              ['after', String.raw`Person o = new Person("Alice", "0501234567");
                Pet a = new Pet("A", 5, "cat", o), b = new Pet("B", 9, "dog", o), c = new Pet("C", 5, "dog", o);
                T.eq("חיה 9 אחרי חיה 5", true, b.after(a));
                T.eq("חיה 5 לא אחרי חיה 9", false, a.after(b));
                T.eq("שתי חיות במקום שווה – after מחזירה false", false, a.after(c));`]
            ]
          },
          {
            id: 'm01-1c', title: 'סעיף ג – טסטר', points: 8, type: 'java',
            html: `<p>במחלקה <code>Tester</code> ריכזנו בדיקות עבור המחלקות <code>Person</code> ו-<code>Pet</code>. עליכם להשלים חלק מהבדיקות לפי הפירוט הבא:</p>
<ol>
<li>השלימו את תנאי בדיקת הבנאי. בבדיקה זו יש לבדוק שהבנאי שומר על תקינות מספר הטלפון של האובייקט. במקרה שלנו, הבנאי קיבל מספר טלפון לא חוקי. תזכורת – מותר להשתמש ב-<code>Person.DEF_PHONE</code> לקבלת ברירת המחדל של מספר הטלפון. (3 נק')</li>
<li>השלימו את תנאי בדיקת ה-aliasing של השיטה <code>getOwner()</code>. (5 נק')</li>
</ol>
<p class="note">בתיבה נמצא גוף השיטה <code>main</code>. הבדיקה מריצה את הטסטר שלכם על מחלקות תקינות (צריך להדפיס Pass) ועל מחלקות עם באג (הבדיקה המתאימה צריכה להדפיס Error).</p>`,
            variants: [
              { name: 'Good', support: personPet() },
              { name: 'BadCtor', support: personPet({ badCtor: true }) },
              { name: 'BadGetOwner', support: personPet({ badGetOwner: true }) }
            ],
            starter: `// Create owners
Person p1 = new Person("Alice", "0501234"); // מספר הטלפון לא חוקי

// Person valid phone test
if (________________) { //1
    System.out.println("Pass");
} else {
    System.out.println("Error");
}

// Create pets and run tests
Pet cat = new Pet("Kitty", 123456, "cat", p1);

// getOwner() Aliasing test
Person tmpP = cat.getOwner();
tmpP.setName("ABC");
if (________________) { //2
    System.out.println("Error");
} else {
    System.out.println("Pass");
}`,
            solution: `// Create owners
Person p1 = new Person("Alice", "0501234"); // מספר הטלפון לא חוקי

// Person valid phone test
if (p1.getPhone().equals(Person.DEF_PHONE)) { //1
    System.out.println("Pass");
} else {
    System.out.println("Error");
}

// Create pets and run tests
Pet cat = new Pet("Kitty", 123456, "cat", p1);

// getOwner() Aliasing test
Person tmpP = cat.getOwner();
tmpP.setName("ABC");
if (cat.getOwner().getName().equals("ABC")) { //2
    System.out.println("Error");
} else {
    System.out.println("Pass");
}`,
            tests: [
              ['מחלקות תקינות', String.raw`T.eq("על מחלקות תקינות שתי הבדיקות מדפיסות Pass", "[Pass, Pass]", java.util.Arrays.toString(T.capture(Good::run)));`],
              ['בנאי שגוי', String.raw`String[] o = T.capture(BadCtor::run);
                T.ok("בדיקה 1 מזהה בנאי שלא בודק את מספר הטלפון", o.length > 0 && o[0].equals("Error"), "הפלט: " + java.util.Arrays.toString(o));`],
              ['getOwner עם aliasing', String.raw`String[] o = T.capture(BadGetOwner::run);
                T.ok("בדיקה 2 מזהה aliasing ב-getOwner", o.length > 1 && o[1].equals("Error"), "הפלט: " + java.util.Arrays.toString(o));`]
            ]
          }
        ]
      },
      {
        num: 2, points: 30, title: 'מערך חד-ממדי – תת-מערך עולה',
        parts: [
          {
            id: 'm01-2a', title: 'סעיף א – מציאת תת-מערך מקסימלי', points: 12, type: 'java',
            html: `<p>כתבו את השיטה הסטטית <code>public static int runUp(int[] a, int i)</code> המקבלת מערך של מספרים שלמים <code>a</code> ואינדקס <code>i</code> שבגבולות המערך. השיטה מחזירה את אורך תת-המערך העולה המקסימלי שמתחיל באינדקס <code>i</code>.</p>
<p><b>תת-מערך</b> – קטע רציף של איברים מתוך המערך. <b>תת-מערך עולה</b> – תת-מערך שבו הערכים מסודרים מהקטן לגדול.</p>
<p>דוגמאות, עבור המערך <code>a = {3, 5, 7, 2, 5, 9, 11, 3}</code>:</p>
<ol>
<li><code>runUp(a, 0) ==> 3</code> – תת-המערך העולה המקסימלי המתחיל באינדקס 0 הוא <code>{3, 5, 7}</code></li>
<li><code>runUp(a, 2) ==> 1</code> – תת-המערך העולה המקסימלי המתחיל באינדקס 2 הוא <code>{7}</code></li>
<li><code>runUp(a, 5) ==> 2</code> – תת-המערך העולה המקסימלי המתחיל באינדקס 5 הוא <code>{9, 11}</code></li>
</ol>`,
            starter: `public static int runUp(int[] a, int i) {

}`,
            solution: `public static int runUp(int[] a, int i) {
    int len = 1;
    while (i + len < a.length && a[i + len] > a[i + len - 1]) {
        len++;
    }
    return len;
}`,
            support: `static final int[] A = {3, 5, 7, 2, 5, 9, 11, 3};`,
            tests: [
              ['דוגמה 1', String.raw`T.eq("runUp(a, 0)", 3, runUp(A, 0));`],
              ['דוגמה 2', String.raw`T.eq("runUp(a, 2)", 1, runUp(A, 2));`],
              ['דוגמה 3', String.raw`T.eq("runUp(a, 5)", 2, runUp(A, 5));`],
              ['רצף מאינדקס 3', String.raw`T.eq("runUp(a, 3)", 4, runUp(A, 3));`],
              ['האיבר האחרון', String.raw`T.eq("runUp(a, 7)", 1, runUp(A, 7));`],
              ['רצף עד סוף המערך', String.raw`T.eq("runUp({1, 2, 3, 4}, 1)", 3, runUp(new int[]{1, 2, 3, 4}, 1));`]
            ]
          },
          {
            id: 'm01-2b', title: 'סעיף ב – הצהרה על שיטה', points: 6, type: 'static',
            html: `<p>כתבו הצהרה מלאה והערה למשתמש (API) עבור שיטה סטטית בשם <code>runUpVal(…)</code>. השיטה מחזירה את אורך תת-המערך העולה המקסימלי המתחיל בערך (לא אינדקס) מסוים שמתקבל כפרמטר.</p>
<p>דוגמאות עבור המערך <code>a = {3, 5, 7, 2, 5, 9, 11}</code>:</p>
<ol>
<li>אורך תת-המערך העולה המקסימלי המתחיל מהערך 2 הוא 4, כי תת-המערך הוא <code>{2, 5, 9, 11}</code>.</li>
<li>אורך תת-המערך העולה המקסימלי המתחיל מהערך 5 הוא 3, כי תת-המערך הוא <code>{5, 9, 11}</code>. קיים תת-מערך נוסף המתחיל בערך 5, <code>{5, 7}</code>, אבל הוא קצר יותר.</li>
<li>אורך תת-המערך העולה המקסימלי המתחיל בערך 4 הוא 0, כי הערך 4 לא נמצא במערך כלל.</li>
<li>אורך תת-המערך העולה המקסימלי המתחיל בערך 7 הוא 1, כי תת-המערך הוא <code>{7}</code>.</li>
</ol>
<p>בהערת ה-API יש לכלול את הפרטים הבאים: הסבר כללי, שמות הפרמטרים ותפקידם, ומה משמעות הערך המוחזר. את ההערה ניתן לכתוב בעברית.</p>
<p class="note">כאן אין הרצה – הבדיקה מוודאת שיש הערת <code>/** ... */</code> עם התיאורים הנדרשים ושההצהרה תקינה. השוו גם לפתרון לדוגמה.</p>`,
            starter: `/**
 * כאן יש לכתוב את ההערה למשתמש
 */
// כאן יש לכתוב את הצהרת השיטה
`,
            solution: `/**
 * השיטה מחזירה את אורך תת-המערך העולה המקסימלי
 * המתחיל בערך val במערך a.
 * @param a   מערך של מספרים שלמים
 * @param val הערך שממנו מתחיל תת-המערך העולה
 * @return אורך תת-המערך העולה הארוך ביותר שמתחיל בערך val,
 *         או 0 אם val לא נמצא במערך
 */
public static int runUpVal(int[] a, int val)`,
            check: function (code) {
              var problems = [];
              var c = String(code || '');
              var cm = /\/\*\*([\s\S]*?)\*\//.exec(c);
              var sig = /public\s+static\s+int\s+runUpVal\s*\(\s*int\s*(\[\s*\])?\s*(\w+)\s*(\[\s*\])?\s*,\s*int\s+(\w+)\s*\)/.exec(c);
              var res = [];
              res.push({ ok: !!cm, label: 'יש הערת API בפורמט /** ... */' });
              res.push({ ok: !!sig && (!!sig[1] !== !!sig[3]), label: 'הצהרה: public static int runUpVal(int[] ..., int ...)' });
              if (cm && sig) {
                var body = cm[1];
                var arr = sig[2], val = sig[4];
                var plain = body.replace(/[*@\s]|param|return/g, '');
                res.push({ ok: plain.length > 15, label: 'ההערה כוללת הסבר כללי' });
                res.push({ ok: new RegExp('\\b' + arr + '\\b').test(body), label: 'ההערה מתארת את הפרמטר ' + arr });
                res.push({ ok: new RegExp('\\b' + val + '\\b').test(body), label: 'ההערה מתארת את הפרמטר ' + val });
                res.push({ ok: /@return|מחזיר|ערך מוחזר|הערך המוחזר/.test(body), label: 'ההערה מתארת את הערך המוחזר (@return)' });
              }
              var allOk = res.every(function (r) { return r.ok; }) && res.length === 6;
              return { ok: allOk, tests: res };
            }
          },
          {
            id: 'm01-2c', title: 'סעיף ג – תת-מערך לפי ערך התחלתי', points: 12, type: 'java',
            html: `<p>ממשו את השיטה בהתאם להצהרה מסעיף ב. השיטה צריכה להחזיר את אורך תת-המערך העולה המקסימלי המתחיל בערך שהתקבל כפרמטר. שיטה זו צריכה להשתמש בשיטה <code>runUp</code> שהוגדרה בסעיף א (ניתן להשתמש בה גם אם לא מימשתם אותה).</p>
<p class="note">הבדיקה מניחה את ההצהרה <code>public static int runUpVal(int[] a, int val)</code> – המערך ראשון והערך שני.</p>`,
            starter: `public static int runUpVal(int[] a, int val) {

}`,
            solution: `public static int runUpVal(int[] a, int val) {
    int max = 0;
    for (int i = 0; i < a.length; i++) {
        if (a[i] == val) {
            int len = runUp(a, i);
            if (len > max) {
                max = len;
            }
        }
    }
    return max;
}`,
            support: runUpSupport + `\nstatic final int[] A = {3, 5, 7, 2, 5, 9, 11};`,
            sourceChecks: [{ label: 'השיטה משתמשת ב-runUp', re: /runUp\s*\(/ }],
            tests: [
              ['ערך 2', String.raw`T.eq("runUpVal(a, 2)", 4, runUpVal(A, 2));`],
              ['ערך 5 – מופיע פעמיים', String.raw`T.eq("runUpVal(a, 5)", 3, runUpVal(A, 5));`],
              ['ערך 4 – לא קיים', String.raw`T.eq("runUpVal(a, 4)", 0, runUpVal(A, 4));`],
              ['ערך 7', String.raw`T.eq("runUpVal(a, 7)", 1, runUpVal(A, 7));`],
              ['ערך 3 – ראשון במערך', String.raw`T.eq("runUpVal(a, 3)", 3, runUpVal(A, 3));`],
              ['מערך ריק', String.raw`T.eq("runUpVal({}, 1)", 0, runUpVal(new int[]{}, 1));`]
            ]
          }
        ]
      },
      {
        num: 3, points: 27, title: 'מערך של אובייקטים מסוג Song',
        intro: `<p>ברשימת השמעה <code>PlayList</code> כל שיר הוא אובייקט מסוג <code>Song</code>. המחלקה <code>PlayList</code> שומרת אוסף של שירים במערך ומבצעת פעולות על רשימת השירים. נתונה המחלקה <code>Song</code> (ניתן להשתמש בשיטותיה מבלי לממש אותן):</p>
<pre class="code">public class Song {
    private String _name;
    private String _artist; // האומן המבצע, הזמר
    private int _length;    // in seconds אורך השיר בשניות
    public Song(String name, String artist, int length) {...}
    public String getName() {...}
    public String getArtist() {...}
    public int getLength() {...}
    public String toString() {...}
}</pre>`,
        parts: [
          {
            id: 'm01-3a', title: 'סעיף א – מחיקת שיר לפי שם', points: 12, type: 'java',
            html: `<p>השלימו את השיטה <code>public boolean removeSong(String name)</code> המקבלת שם של שיר ומוציאה את השיר המתאים ממערך השירים. הערך המוחזר מתאר הצלחה או כישלון: <code>true</code> בהצלחה (השיר נמצא והוצא מהמערך) ו-<code>false</code> בכישלון (השיר לא נמצא במערך). יש לזכור שמערך השירים צריך להישאר ללא "חורים" גם לאחר פעולת השיטה.</p>`,
            starter: playListHead + `
    public boolean removeSong(String name) {

    }
}`,
            solution: playListHead + `
    public boolean removeSong(String name) {
        for (int i = 0; i < _size; i++) {
            if (_songs[i].getName().equals(name)) {
                for (int j = i; j < _size - 1; j++) {
                    _songs[j] = _songs[j + 1];
                }
                _songs[_size - 1] = null;
                _size--;
                return true;
            }
        }
        return false;
    }
}`,
            support: songClass + `
static PlayList make() {
    PlayList p = new PlayList(6);
    p.addSong(new Song("Yesterday", "Beatles", 125));
    p.addSong(new Song("Imagine", "Lennon", 183));
    p.addSong(new Song("Help", "Beatles", 138));
    p.addSong(new Song("Hallelujah", "Cohen", 280));
    return p;
}
static String names(PlayList p) {
    String[] n = new String[p._size];
    for (int i = 0; i < p._size; i++) n[i] = p._songs[i] == null ? "null" : p._songs[i].getName();
    java.util.Arrays.sort(n);
    return java.util.Arrays.toString(n);
}`,
            tests: [
              ['שיר באמצע', String.raw`PlayList p = make();
                T.eq("removeSong(\"Imagine\") מחזירה true", true, p.removeSong("Imagine"));
                T.eq("_size ירד ל-3", 3, p._size);
                T.eq("השירים שנשארו ברצף מתחילת המערך", "[Hallelujah, Help, Yesterday]", names(p));`],
              ['שיר ראשון', String.raw`PlayList p = make();
                T.eq("removeSong(\"Yesterday\") מחזירה true", true, p.removeSong("Yesterday"));
                T.eq("השירים שנשארו ברצף", "[Hallelujah, Help, Imagine]", names(p));`],
              ['שיר אחרון', String.raw`PlayList p = make();
                T.eq("removeSong(\"Hallelujah\") מחזירה true", true, p.removeSong("Hallelujah"));
                T.eq("השירים שנשארו ברצף", "[Help, Imagine, Yesterday]", names(p));`],
              ['שיר שלא קיים', String.raw`PlayList p = make();
                T.eq("removeSong(\"Thriller\") מחזירה false", false, p.removeSong("Thriller"));
                T.eq("_size לא השתנה", 4, p._size);`],
              ['השוואת שם לפי ערך', String.raw`PlayList p = make();
                T.eq("removeSong(new String(\"Help\")) מוצאת את השיר", true, p.removeSong(new String("Help")));`],
              ['רשימה ריקה', String.raw`T.eq("removeSong ברשימה ריקה מחזירה false", false, new PlayList(3).removeSong("Help"));`]
            ]
          },
          {
            id: 'm01-3b', title: 'סעיף ב – מציאת השיר הארוך ביותר של זמר מסוים', points: 15, type: 'java',
            html: `<p>השלימו את השיטה <code>public Song longestSongByArtist(String artist)</code> המקבלת שם של זמר, <code>artist</code>, ומחזירה את השיר (אובייקט מהמחלקה <code>Song</code>) הארוך ביותר (אורך בשניות) של הזמר שהתקבל בפרמטר. אם אין במערך שירים של הזמר, השיטה תחזיר <code>null</code>.</p>`,
            starter: playListHead + `
    public Song longestSongByArtist(String artist) {

    }
}`,
            solution: playListHead + `
    public Song longestSongByArtist(String artist) {
        Song best = null;
        for (int i = 0; i < _size; i++) {
            if (_songs[i].getArtist().equals(artist)) {
                if (best == null || _songs[i].getLength() > best.getLength()) {
                    best = _songs[i];
                }
            }
        }
        return best;
    }
}`,
            support: songClass + `
static PlayList make() {
    PlayList p = new PlayList(10);
    p.addSong(new Song("Yesterday", "Beatles", 125));
    p.addSong(new Song("Imagine", "Lennon", 183));
    p.addSong(new Song("Hey Jude", "Beatles", 431));
    p.addSong(new Song("Help", "Beatles", 138));
    p.addSong(new Song("Hallelujah", "Cohen", 280));
    return p;
}
static String nm(Song s) { return s == null ? null : s.getName(); }`,
            tests: [
              ['Beatles', String.raw`T.eq("longestSongByArtist(\"Beatles\")", "Hey Jude", nm(make().longestSongByArtist("Beatles")));`],
              ['זמר עם שיר אחד', String.raw`T.eq("longestSongByArtist(\"Lennon\")", "Imagine", nm(make().longestSongByArtist("Lennon")));`],
              ['שיר אחרון במערך', String.raw`T.eq("longestSongByArtist(\"Cohen\")", "Hallelujah", nm(make().longestSongByArtist("Cohen")));`],
              ['זמר שלא קיים', String.raw`T.eq("longestSongByArtist(\"Queen\") מחזירה null", null, nm(make().longestSongByArtist("Queen")));`],
              ['השוואת שם לפי ערך', String.raw`T.eq("longestSongByArtist(new String(\"Beatles\"))", "Hey Jude", nm(make().longestSongByArtist(new String("Beatles"))));`],
              ['רשימה ריקה', String.raw`T.eq("רשימה ריקה מחזירה null", null, nm(new PlayList(3).longestSongByArtist("Beatles")));`]
            ]
          }
        ]
      },
      {
        num: 4, points: 16, title: 'ניתוח קוד',
        intro: `<p>נתונה השיטה <code>foo(…)</code> הבאה:</p>
<pre class="code numbered">1.  public static String foo(String s) {
2.      if (s.length() &lt;= 1) {
3.          return s;
4.      }
5.      char ch = s.charAt(s.length() - 1);
6.      String str = "";
7.      for (int i = 0; i &lt; s.length() - 1; i++) {
8.          str += s.charAt(i);
9.      }
10.     return ch + str;
11. }</pre>`,
        parts: [
          {
            id: 'm01-4a', title: 'סעיף א', points: 4, type: 'text',
            html: `<p>מה תהיה ההדפסה שתתקבל מהרצת הפקודה הבאה?</p><pre class="code">System.out.println(foo("abcde"));</pre>`,
            placeholder: 'כתבו כאן את הפלט',
            check: function (s) { return Checks.exact(s, 'eabcd'); },
            solution: 'eabcd'
          },
          {
            id: 'm01-4b', title: 'סעיף ב', points: 4, type: 'text',
            html: `<p>התקבלה ההדפסה <code>openu</code>. מה הייתה מחרוזת הקלט של השיטה?</p><pre class="code">System.out.println(foo("________"));</pre>`,
            placeholder: 'כתבו כאן את מחרוזת הקלט',
            check: function (s) {
              return Checks.byRun(s, function (x) { return x.length <= 1 ? x : x[x.length - 1] + x.slice(0, -1); }, 'openu');
            },
            solution: 'penuo'
          },
          {
            id: 'm01-4c', title: 'סעיף ג', points: 8, type: 'java',
            html: `<p>הציעו שינוי או שינויים כך שבהרצת הפקודה <code>System.out.println(foo("abcde"));</code> תתקבל ההדפסה של המחרוזת <code>bcdea</code>. עבור כל שינוי, ציינו את מספר השורה ואת נוסח השורה המתוקן.</p>
<p class="note">בתיבה נמצאת השיטה המקורית – שנו בה את מה שצריך. הבדיקה מריצה את השיטה המעודכנת.</p>`,
            starter: `public static String foo(String s) {
    if (s.length() <= 1) {
        return s;
    }
    char ch = s.charAt(s.length() - 1);
    String str = "";
    for (int i = 0; i < s.length() - 1; i++) {
        str += s.charAt(i);
    }
    return ch + str;
}`,
            solution: `public static String foo(String s) {
    if (s.length() <= 1) {
        return s;
    }
    char ch = s.charAt(0);                    // שורה 5
    String str = "";
    for (int i = 1; i < s.length(); i++) {    // שורה 7
        str += s.charAt(i);
    }
    return str + ch;                          // שורה 10
}`,
            tests: [
              ['abcde', String.raw`T.eq("foo(\"abcde\")", "bcdea", foo("abcde"));`],
              ['xy', String.raw`T.eq("foo(\"xy\")", "yx", foo("xy"));`],
              ['openu', String.raw`T.eq("foo(\"openu\")", "penuo", foo("openu"));`],
              ['תו יחיד', String.raw`T.eq("foo(\"a\")", "a", foo("a"));`]
            ]
          }
        ]
      }
    ]
  });
})();
