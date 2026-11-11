// לימוד: מחלקות ואובייקטים
(window.LESSONS = window.LESSONS || []).push({
  id: 'learn-oop',
  title: 'לימוד מחלקות ואובייקטים',
  subtitle: 'מה זה מחלקה, ממה היא בנויה, ואיך כותבים אותה נכון – עם דוגמאות שאפשר להריץ ולשנות',
  practice: 'oop',
  sections: [
    {
      id: 'what', title: 'מחלקה ואובייקט',
      blocks: [
        `<p><b>מחלקה</b> (class) היא <b>תבנית</b> שמתארת סוג של דבר: אילו נתונים יש לו ומה אפשר לעשות איתו. <b>אובייקט</b> (object) הוא <b>מופע</b> מסוים שנוצר מהתבנית.</p>
<p>דוגמה: המחלקה <code>Dog</code> אומרת שלכל כלב יש שם וגיל, ושהוא יודע לנבוח. "רקס בן 3" ו"לאסי בת 5" הם שני אובייקטים מהמחלקה <code>Dog</code> – לכל אחד ערכים משלו.</p>
<ul>
<li><b>תכונות</b> (attributes / fields) – הנתונים של כל אובייקט.</li>
<li><b>בנאי</b> (constructor) – קוד שרץ כשיוצרים אובייקט עם <code>new</code>, ומאתחל את התכונות.</li>
<li><b>שיטות</b> (methods) – הפעולות שאפשר לבצע על האובייקט.</li>
</ul>`,
        { run: `class Dog {
    private String _name;
    private int _age;

    public Dog(String name, int age) {   // בנאי
        _name = name;
        _age = age;
    }

    public void bark() {                  // שיטה
        System.out.println(_name + " says: Woof!");
    }

    public int getAge() {
        return _age;
    }
}

public class Main {
    public static void main(String[] args) {
        Dog rex = new Dog("Rex", 3);      // יצירת אובייקט
        Dog lassie = new Dog("Lassie", 5);
        rex.bark();
        lassie.bark();
        System.out.println("Lassie is " + lassie.getAge());
    }
}` },
        `<p class="note">בקובץ Java אמיתי כל מחלקה ציבורית נמצאת בקובץ משלה. כאן, כדי שאפשר יהיה להריץ, כל המחלקות של הדוגמה כתובות יחד.</p>`
      ]
    },
    {
      id: 'fields', title: 'תכונות ו-private',
      blocks: [
        `<p>את התכונות מגדירים בראש המחלקה, בדרך כלל עם <code>private</code>: רק קוד בתוך המחלקה יכול לגשת אליהן ישירות. זה נקרא <b>הסתרת מידע</b> (encapsulation) – המחלקה שומרת שהנתונים שלה יהיו תמיד תקינים, ומי שמשתמש בה עובר דרך השיטות.</p>
<p>בקורס נהוג לתת לתכונות שמות שמתחילים בקו תחתון (<code>_name</code>), כדי להבדיל ביניהן לבין פרמטרים ומשתנים מקומיים (<code>name</code>).</p>
<pre class="code">public class Student {
    private String _name;   // תכונה – לכל אובייקט ערך משלו
    private int _grade;
    ...
}</pre>
<p>מחוץ למחלקה <code>s._grade = 200;</code> לא יעבור קומפילציה, ולכן אי אפשר "לקלקל" את האובייקט.</p>`
      ]
    },
    {
      id: 'ctor', title: 'בנאי (constructor)',
      blocks: [
        `<p>הבנאי נקרא בשם המחלקה, <b>אין לו טיפוס מוחזר</b> (גם לא <code>void</code>), והוא רץ פעם אחת – ברגע היצירה עם <code>new</code>. אפשר לכתוב כמה בנאים עם פרמטרים שונים.</p>`,
        { run: `class Rectangle {
    private int _width;
    private int _height;

    public Rectangle(int width, int height) {
        _width = width;
        _height = height;
    }

    public Rectangle(int side) {     // בנאי נוסף – ריבוע
        _width = side;
        _height = side;
    }

    public int area() {
        return _width * _height;
    }
}

public class Main {
    public static void main(String[] args) {
        Rectangle r = new Rectangle(3, 5);
        Rectangle sq = new Rectangle(4);
        System.out.println("שטח המלבן: " + r.area());
        System.out.println("שטח הריבוע: " + sq.area());
    }
}` }
      ]
    },
    {
      id: 'methods', title: 'שיטות: get, set ושיטות פעולה',
      blocks: [
        `<ul>
<li><b>getter</b> – מחזירה ערך של תכונה: <code>public int getAge() { return _age; }</code></li>
<li><b>setter</b> – משנה ערך של תכונה, ובודקת שהערך חוקי: <code>public void setAge(int age) {...}</code></li>
<li><b>שיטות פעולה</b> – מחשבות או משנות משהו (<code>area()</code>, <code>deposit(...)</code>).</li>
</ul>
<p>שיטה שמחזירה ערך מצהירה על הטיפוס שלו ומסתיימת ב-<code>return</code>. שיטה שלא מחזירה ערך מוגדרת <code>void</code>.</p>`,
        { run: `class Counter {
    private int _value;

    public Counter() {
        _value = 0;
    }

    public int getValue() {          // getter
        return _value;
    }

    public void setValue(int v) {    // setter עם בדיקה
        if (v >= 0) {
            _value = v;
        }
    }

    public void increment() {        // שיטת פעולה
        _value++;
    }
}

public class Main {
    public static void main(String[] args) {
        Counter c = new Counter();
        c.increment();
        c.increment();
        System.out.println(c.getValue());
        c.setValue(-5);              // לא חוקי – לא ישתנה
        System.out.println(c.getValue());
        c.setValue(10);
        System.out.println(c.getValue());
    }
}` }
      ]
    },
    {
      id: 'tostring', title: 'toString',
      blocks: [
        `<p>השיטה <code>public String toString()</code> מחזירה מחרוזת שמתארת את האובייקט. Java קוראת לה <b>אוטומטית</b> כשמדפיסים אובייקט או מחברים אותו למחרוזת. בלי <code>toString</code> מודפס משהו כמו <code>Point@1b6d3586</code>.</p>`,
        { run: `class Point {
    private int _x, _y;

    public Point(int x, int y) {
        _x = x;
        _y = y;
    }

    public String toString() {
        return "(" + _x + ", " + _y + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Point p = new Point(3, 4);
        System.out.println(p);                // toString נקראת אוטומטית
        System.out.println("הנקודה היא " + p);
    }
}` },
        `<p class="note">במבחנים מבקשים פורמט מדויק – רווח אחד או נקודה-פסיק חסרים ייחשבו טעות. העתיקו את הפורמט מהדוגמה בשאלה תו-תו.</p>`
      ]
    },
    {
      id: 'valid', title: 'קבועים ובדיקת חוקיות',
      blocks: [
        `<p><b>קבוע</b> מוגדר עם <code>public static final</code>, ונהוג לכתוב את שמו באותיות גדולות. <code>static</code> אומר שהוא שייך למחלקה ולא לכל אובייקט, ו-<code>final</code> אומר שאי אפשר לשנות אותו. משתמשים בו מבחוץ כך: <code>Battery.MAX_CHARGE</code>.</p>
<p>תבנית שחוזרת בכל מבחן: שיטה פרטית <code>isValid…</code> שבודקת ערך, ובנאי ו-setter שמשתמשים בה. בבנאי, ערך לא חוקי מוחלף בערך ברירת מחדל; ב-setter, ערך לא חוקי פשוט לא משנה כלום.</p>`,
        { run: `class Battery {
    public static final int MIN_CHARGE = 0;
    public static final int MAX_CHARGE = 100;
    public static final int DEF_CHARGE = 50;

    private int _charge;

    public Battery(int charge) {
        if (isValidCharge(charge)) {
            _charge = charge;
        } else {
            _charge = DEF_CHARGE;       // ערך ברירת מחדל
        }
    }

    public void setCharge(int charge) {
        if (isValidCharge(charge)) {    // לא חוקי – לא משנים
            _charge = charge;
        }
    }

    public int getCharge() { return _charge; }

    private boolean isValidCharge(int charge) {
        return charge >= MIN_CHARGE && charge <= MAX_CHARGE;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Battery(80).getCharge());
        System.out.println(new Battery(150).getCharge());
        Battery b = new Battery(30);
        b.setCharge(-7);
        System.out.println(b.getCharge());
        System.out.println("המקסימום: " + Battery.MAX_CHARGE);
    }
}` }
      ]
    },
    {
      id: 'refs', title: 'הפניות, null ו-==',
      blocks: [
        `<p>משתנה מטיפוס של מחלקה לא מכיל את האובייקט, אלא <b>הפניה</b> אליו. לכן:</p>
<ul>
<li><code>Point q = p;</code> לא יוצר אובייקט חדש – שני המשתנים מצביעים על אותו אובייקט.</li>
<li><code>p == q</code> בודק אם זה <b>אותו אובייקט</b>, ולא אם הערכים שווים.</li>
<li><code>null</code> פירושו "לא מצביע על שום אובייקט". קריאה לשיטה על <code>null</code> גורמת ל-<code>NullPointerException</code>.</li>
</ul>`,
        { run: `class Point {
    private int _x, _y;
    public Point(int x, int y) { _x = x; _y = y; }
    public void setX(int x) { _x = x; }
    public String toString() { return "(" + _x + ", " + _y + ")"; }
}

public class Main {
    public static void main(String[] args) {
        Point p = new Point(1, 2);
        Point q = p;                 // אותו אובייקט!
        q.setX(100);
        System.out.println("p = " + p);

        Point r = new Point(100, 2); // אובייקט אחר עם אותם ערכים
        System.out.println("p == q ? " + (p == q));
        System.out.println("p == r ? " + (p == r));
    }
}` }
      ]
    },
    {
      id: 'equals', title: 'השיטה equals',
      blocks: [
        `<p>כדי לבדוק אם שני אובייקטים <b>שווים בערכים</b>, כותבים שיטה <code>equals</code> שמשווה תכונה-תכונה:</p>
<ul>
<li>תכונה מטיפוס פרימיטיבי (<code>int</code>, <code>double</code>, <code>char</code>, <code>boolean</code>) – משווים עם <code>==</code>.</li>
<li>תכונה שהיא אובייקט (<code>String</code>, <code>Point</code>, …) – משווים עם <code>equals</code> של המחלקה שלה.</li>
</ul>
<p>שימו לב: בתוך המחלקה מותר לגשת לתכונות הפרטיות של אובייקט אחר מאותה מחלקה (<code>other._name</code>).</p>`,
        { run: `class Book {
    private String _title;
    private int _pages;

    public Book(String title, int pages) {
        _title = title;
        _pages = pages;
    }

    public boolean equals(Book other) {
        return _title.equals(other._title) && _pages == other._pages;
    }
}

public class Main {
    public static void main(String[] args) {
        Book a = new Book("Dune", 412);
        Book b = new Book(new String("Dune"), 412);
        Book c = new Book("Dune", 300);
        System.out.println("a == b ? " + (a == b));
        System.out.println("a.equals(b) ? " + a.equals(b));
        System.out.println("a.equals(c) ? " + a.equals(c));

        String s1 = "Hi", s2 = new String("Hi");
        System.out.println("s1 == s2 ? " + (s1 == s2) + "   s1.equals(s2) ? " + s1.equals(s2));
    }
}` }
      ]
    },
    {
      id: 'copy', title: 'בנאי העתקה',
      blocks: [
        `<p><b>בנאי העתקה</b> מקבל אובייקט מאותה מחלקה ויוצר אובייקט <b>חדש</b> עם אותם ערכים. משתמשים בו כדי להימנע מ-aliasing (בסעיף הבא).</p>
<pre class="code">public Point(Point other) {
    _x = other._x;
    _y = other._y;
}</pre>`,
        { run: `class Point {
    private int _x, _y;
    public Point(int x, int y) { _x = x; _y = y; }
    public Point(Point other) {      // בנאי העתקה
        _x = other._x;
        _y = other._y;
    }
    public void setX(int x) { _x = x; }
    public String toString() { return "(" + _x + ", " + _y + ")"; }
}

public class Main {
    public static void main(String[] args) {
        Point p = new Point(1, 2);
        Point copy = new Point(p);   // אובייקט חדש
        copy.setX(50);
        System.out.println("p = " + p + ", copy = " + copy);
    }
}` }
      ]
    },
    {
      id: 'aliasing', title: 'aliasing – הצבעה כפולה',
      blocks: [
        `<p>כשמחלקה מכילה תכונה שהיא אובייקט, צריך להיזהר: אם הבנאי שומר את ההפניה שהתקבלה, או ש-getter מחזיר את ההפניה לתכונה, אז מישהו מבחוץ מחזיק הפניה לאותו אובייקט ויכול לשנות את הפנים של המחלקה בלי לעבור דרך השיטות שלה. זה נקרא <b>aliasing</b>.</p>
<p>הפתרון: <b>ליצור עותק</b> בכל מקום שבו אובייקט נכנס למחלקה (בנאי, setter) או יוצא ממנה (getter): <code>new Point(center)</code>.</p>`,
        { run: `class Point {
    private int _x, _y;
    public Point(int x, int y) { _x = x; _y = y; }
    public Point(Point other) { _x = other._x; _y = other._y; }
    public void setX(int x) { _x = x; }
    public String toString() { return "(" + _x + ", " + _y + ")"; }
}

class BadCircle {                    // עם aliasing
    private Point _center;
    public BadCircle(Point c) { _center = c; }
    public Point getCenter() { return _center; }
}

class GoodCircle {                   // בלי aliasing
    private Point _center;
    public GoodCircle(Point c) { _center = new Point(c); }
    public Point getCenter() { return new Point(_center); }
}

public class Main {
    public static void main(String[] args) {
        Point p = new Point(0, 0);
        BadCircle bad = new BadCircle(p);
        GoodCircle good = new GoodCircle(p);

        p.setX(999);                       // משנים את p מבחוץ
        System.out.println("bad:  " + bad.getCenter());
        System.out.println("good: " + good.getCenter());

        good.getCenter().setX(-1);         // מנסים לשנות דרך ה-getter
        System.out.println("good: " + good.getCenter());
    }
}` },
        `<p class="note">מחרוזות (<code>String</code>) אי אפשר לשנות אחרי שנוצרו, ולכן לא צריך להעתיק אותן. aliasing הוא בעיה רק באובייקטים שיש להם setters.</p>`
      ]
    },
    {
      id: 'has-a', title: 'הכלה – מחלקה שמשתמשת במחלקה אחרת',
      blocks: [
        `<p>מחלקה יכולה להחזיק תכונה מטיפוס של מחלקה אחרת (מכונית <b>יש לה</b> מנוע). שיטות של המחלקה החיצונית קוראות לשיטות של התכונה – למשל <code>_engine.stronger(other._engine)</code>. כך כל מחלקה אחראית לחלק שלה.</p>`,
        { run: `class Engine {
    private int _hp;
    public Engine(int hp) { _hp = hp; }
    public Engine(Engine other) { _hp = other._hp; }
    public boolean stronger(Engine other) { return _hp > other._hp; }
    public String toString() { return _hp + " HP"; }
}

class Car {
    private String _model;
    private Engine _engine;

    public Car(String model, Engine engine) {
        _model = model;
        _engine = new Engine(engine);      // בלי aliasing
    }

    public boolean strongerThan(Car other) {
        return _engine.stronger(other._engine);   // מאצילים למחלקה Engine
    }

    public String toString() { return _model + " (" + _engine + ")"; }
}

public class Main {
    public static void main(String[] args) {
        Car a = new Car("Mazda", new Engine(150));
        Car b = new Car("Tesla", new Engine(300));
        System.out.println(a + " stronger than " + b + "? " + a.strongerThan(b));
        System.out.println(b + " stronger than " + a + "? " + b.strongerThan(a));
    }
}` }
      ]
    },
    {
      id: 'reuse', title: 'שימוש בשיטה אחת לכתיבת שיטה אחרת',
      blocks: [
        `<p>שאלות במבחן אומרות לפעמים "השתמשו <b>אך ורק</b> בשיטה <code>before</code>". למשל, A אחרי B בדיוק כאשר B לפני A, ולכן:</p>
<pre class="code">public boolean after(Pet other) {
    return other.before(this);   // this = האובייקט הנוכחי
}</pre>
<p class="note">טעות נפוצה: <code>return !before(other);</code> – זה נותן <code>true</code> גם כששני האובייקטים שווים, ואז "אחרי" לא נכון.</p>`
      ]
    },
    {
      id: 'array-of-objects', title: 'מערך של אובייקטים',
      blocks: [
        `<p>שאלה 3 בכל מבחן: מחלקה שמנהלת מערך של אובייקטים ומשתנה <code>_size</code> שסופר כמה תאים בשימוש. האובייקטים שמורים <b>ברצף מתחילת המערך, בלי חורים</b>. מכאן כמה כללים:</p>
<ul>
<li>עוברים על <code>i &lt; _size</code> ולא על <code>i &lt; _arr.length</code> (שאר התאים הם <code>null</code>).</li>
<li><b>הוספה</b>: בודקים שיש מקום (<code>_size &lt; _arr.length</code>), מכניסים ל-<code>_arr[_size]</code>, ומגדילים את <code>_size</code>.</li>
<li><b>מחיקה</b>: מוצאים את האיבר, מזיזים את כל מה שאחריו מקום אחד אחורה (או מעבירים את האחרון למקומו, אם הסדר לא חשוב), מאפסים את התא האחרון ל-<code>null</code> ומקטינים את <code>_size</code>.</li>
</ul>`,
        { run: `class Song {
    private String _name;
    private int _length;
    public Song(String name, int length) { _name = name; _length = length; }
    public String getName() { return _name; }
    public int getLength() { return _length; }
    public String toString() { return _name; }
}

class PlayList {
    private Song[] _songs;
    private int _size;

    public PlayList(int max) {
        _songs = new Song[max];
        _size = 0;
    }

    public boolean add(Song s) {
        if (_size == _songs.length) {
            return false;               // אין מקום
        }
        _songs[_size] = s;
        _size++;
        return true;
    }

    public boolean remove(String name) {
        for (int i = 0; i < _size; i++) {
            if (_songs[i].getName().equals(name)) {
                for (int j = i; j < _size - 1; j++) {
                    _songs[j] = _songs[j + 1];   // הזזה אחורה
                }
                _songs[_size - 1] = null;
                _size--;
                return true;
            }
        }
        return false;
    }

    public Song longest() {
        if (_size == 0) return null;
        Song best = _songs[0];
        for (int i = 1; i < _size; i++) {
            if (_songs[i].getLength() > best.getLength()) {
                best = _songs[i];
            }
        }
        return best;
    }

    public void print() {
        for (int i = 0; i < _size; i++) {
            System.out.print(_songs[i] + "  ");
        }
        System.out.println("(" + _size + " songs)");
    }
}

public class Main {
    public static void main(String[] args) {
        PlayList p = new PlayList(3);
        p.add(new Song("Help", 138));
        p.add(new Song("Imagine", 183));
        p.add(new Song("Yesterday", 125));
        System.out.println("עוד אחד? " + p.add(new Song("Hey Jude", 431)));
        p.print();
        System.out.println("הארוך ביותר: " + p.longest());
        p.remove("Help");
        p.print();
    }
}` }
      ]
    },
    {
      id: 'tester', title: 'טסטר – בדיקת המחלקה',
      blocks: [
        `<p>במבחנים יש שאלה שבה משלימים <b>תנאי בדיקה</b> במחלקת טסטר. הרעיון: יוצרים מצב שבו מחלקה תקינה ומחלקה עם באג מתנהגות אחרת, ובודקים את התוצאה.</p>
<ul>
<li><b>בדיקת בנאי</b>: יוצרים אובייקט עם ערך לא חוקי, ובודקים שהתקבל ערך ברירת המחדל: <code>b.getCharge() == Battery.DEF_CHARGE</code>.</li>
<li><b>בדיקת aliasing ב-getter</b>: מקבלים את התכונה, משנים אותה מבחוץ, ובודקים שהאובייקט <b>לא</b> השתנה.</li>
<li><b>בדיקת aliasing ב-setter או בבנאי</b>: מעבירים אובייקט, משנים אותו אחרי הקריאה, ובודקים שבתוך המחלקה נשמר הערך הישן.</li>
</ul>`,
        { run: `class Point {
    private int _x, _y;
    public Point(int x, int y) { _x = x; _y = y; }
    public Point(Point o) { _x = o._x; _y = o._y; }
    public int getX() { return _x; }
    public void setX(int x) { _x = x; }
}

class Circle {
    private Point _center;
    public Circle(Point c) { _center = new Point(c); }
    public Point getCenter() { return new Point(_center); }
}

public class Main {
    public static void main(String[] args) {
        Circle c = new Circle(new Point(1, 1));

        // בדיקת aliasing של getCenter
        Point tmp = c.getCenter();
        tmp.setX(500);
        if (c.getCenter().getX() == 500) {
            System.out.println("Error – aliasing ב-getCenter");
        } else {
            System.out.println("Pass");
        }

        // בדיקת aliasing של הבנאי
        Point outside = new Point(7, 7);
        Circle d = new Circle(outside);
        outside.setX(0);
        if (d.getCenter().getX() == 7) {
            System.out.println("Pass");
        } else {
            System.out.println("Error – aliasing בבנאי");
        }
    }
}` }
      ]
    }
  ]
});
