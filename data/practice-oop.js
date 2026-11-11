// תרגול מחלקות ואובייקטים – 10 תרגילים מהקל לקשה
(function () {
  function ex(num, level, title, html, starter, solution, tests, extra) {
    var part = { id: 'oop-' + num, title: title, points: 10, type: 'java', html: html, starter: starter, solution: solution, tests: tests };
    Object.keys(extra || {}).forEach(function (k) { part[k] = extra[k]; });
    return { num: num, points: 10, title: title, level: level, parts: [part] };
  }
  var pointClass = `static class Point {
    private int _x, _y;
    public Point(int x, int y) { _x = x; _y = y; }
    public Point(Point other) { _x = other._x; _y = other._y; }
    public int getX() { return _x; }
    public int getY() { return _y; }
    public void setX(int x) { _x = x; }
    public void setY(int y) { _y = y; }
    public boolean equals(Point other) { return _x == other._x && _y == other._y; }
    public String toString() { return "(" + _x + ", " + _y + ")"; }
}`;
  var pupilClass = `static class Pupil {
    private String _name; private int _grade;
    public Pupil(String name, int grade) { _name = name; _grade = grade; }
    public String getName() { return _name; }
    public int getGrade() { return _grade; }
    public String toString() { return _name + " " + _grade; }
}`;
  var playerClass = `static class Player {
    private String _name; private int _age;
    public Player(String name, int age) { _name = name; _age = age; }
    public String getName() { return _name; }
    public int getAge() { return _age; }
    public boolean equals(Player other) { return _name.equals(other._name) && _age == other._age; }
    public String toString() { return _name + " " + _age; }
}`;
  var classRoomHead = `public class ClassRoom {
    private Pupil[] _pupils;
    private int _size;

    public ClassRoom(int max) {
        _pupils = new Pupil[max];
        _size = 0;
    }

    public boolean add(Pupil p) {
        if (_size == _pupils.length) return false;
        _pupils[_size] = p;
        _size++;
        return true;
    }
`;

  (window.EXAMS = window.EXAMS || []).push({
    id: 'oop',
    kind: 'practice',
    title: 'תרגול מחלקות ואובייקטים',
    subtitle: '10 תרגילים מדורגים: מחלקה ראשונה, בנאים, equals, aliasing ומערך של אובייקטים',
    intro: 'התרגילים מסודרים מהקל לקשה. בכל תרגיל כתבו את המחלקה בתיבה ולחצו "בדוק". שמות התכונות (עם קו תחתון) חייבים להיות בדיוק כמו בהוראות, כי הבדיקות משתמשות בהם.',
    qLabel: 'תרגיל',
    questions: [
      ex(1, 'קל', 'מחלקה ראשונה – נקודה',
        `<p>כתבו את המחלקה <code>Point</code> המייצגת נקודה במישור. למחלקה שתי תכונות פרטיות מסוג <code>int</code>: <code>_x</code> ו-<code>_y</code>.</p>
<ol>
<li>בנאי <code>Point(int x, int y)</code> המאתחל את שתי התכונות.</li>
<li>שיטות <code>getX()</code> ו-<code>getY()</code> המחזירות את ערכי התכונות.</li>
</ol>
<pre class="code">Point p = new Point(3, 4);
p.getX()  ==> 3
p.getY()  ==> 4</pre>`,
        `public class Point {
    private int _x;
    private int _y;

    // בנאי

    // getX

    // getY

}`,
        `public class Point {
    private int _x;
    private int _y;

    public Point(int x, int y) {
        _x = x;
        _y = y;
    }

    public int getX() {
        return _x;
    }

    public int getY() {
        return _y;
    }
}`,
        [
          ['בנאי ו-getters', String.raw`Point p = new Point(3, 4);
            T.eq("new Point(3, 4).getX()", 3, p.getX());
            T.eq("new Point(3, 4).getY()", 4, p.getY());`],
          ['ערכים שליליים', String.raw`Point p = new Point(-7, 0);
            T.eq("new Point(-7, 0).getX()", -7, p.getX());
            T.eq("new Point(-7, 0).getY()", 0, p.getY());`],
          ['שני אובייקטים נפרדים', String.raw`Point a = new Point(1, 2), b = new Point(5, 6);
            T.ok("לכל אובייקט ערכים משלו", a.getX() == 1 && b.getX() == 5, "a.getX()=" + a.getX() + ", b.getX()=" + b.getX() + " – האם התכונות הוגדרו static בטעות?");`]
        ]),

      ex(2, 'קל', 'setters ו-toString',
        `<p>הרחיבו את המחלקה <code>Point</code>:</p>
<ol>
<li>שיטות <code>setX(int x)</code> ו-<code>setY(int y)</code> המשנות את ערכי התכונות.</li>
<li>שיטה <code>toString()</code> המחזירה מחרוזת בפורמט <code>"(x, y)"</code> – למשל <code>"(3, 4)"</code>.</li>
<li>שיטה <code>move(int dx, int dy)</code> המזיזה את הנקודה: מוסיפה <code>dx</code> ל-x ו-<code>dy</code> ל-y.</li>
</ol>
<pre class="code">Point p = new Point(3, 4);
p.move(1, -2);
System.out.println(p);   // (4, 2)</pre>`,
        `public class Point {
    private int _x;
    private int _y;

    public Point(int x, int y) { _x = x; _y = y; }
    public int getX() { return _x; }
    public int getY() { return _y; }

    // setX, setY

    // toString

    // move

}`,
        `public class Point {
    private int _x;
    private int _y;

    public Point(int x, int y) { _x = x; _y = y; }
    public int getX() { return _x; }
    public int getY() { return _y; }

    public void setX(int x) { _x = x; }
    public void setY(int y) { _y = y; }

    public String toString() {
        return "(" + _x + ", " + _y + ")";
    }

    public void move(int dx, int dy) {
        _x += dx;
        _y += dy;
    }
}`,
        [
          ['setX / setY', String.raw`Point p = new Point(0, 0);
            p.setX(8); p.setY(-3);
            T.eq("אחרי setX(8)", 8, p.getX());
            T.eq("אחרי setY(-3)", -3, p.getY());`],
          ['toString', String.raw`T.eq("new Point(3, 4).toString()", "(3, 4)", new Point(3, 4).toString());
            T.eq("new Point(-1, 0).toString()", "(-1, 0)", new Point(-1, 0).toString());`],
          ['move', String.raw`Point p = new Point(3, 4);
            p.move(1, -2);
            T.eq("אחרי move(1, -2)", "(4, 2)", p.toString());
            p.move(0, 0);
            T.eq("אחרי move(0, 0)", "(4, 2)", p.toString());`]
        ]),

      ex(3, 'קל', 'מלבן – שיטות שמחשבות',
        `<p>כתבו את המחלקה <code>Rectangle</code> עם התכונות הפרטיות <code>_width</code> ו-<code>_height</code> (מסוג <code>int</code>):</p>
<ol>
<li>בנאי <code>Rectangle(int width, int height)</code>.</li>
<li><code>area()</code> – מחזירה את השטח (רוחב כפול גובה).</li>
<li><code>perimeter()</code> – מחזירה את ההיקף.</li>
<li><code>isSquare()</code> – מחזירה <code>true</code> אם הרוחב שווה לגובה.</li>
</ol>
<pre class="code">Rectangle r = new Rectangle(3, 5);
r.area()       ==> 15
r.perimeter()  ==> 16
r.isSquare()   ==> false</pre>`,
        `public class Rectangle {
    private int _width;
    private int _height;

}`,
        `public class Rectangle {
    private int _width;
    private int _height;

    public Rectangle(int width, int height) {
        _width = width;
        _height = height;
    }

    public int area() {
        return _width * _height;
    }

    public int perimeter() {
        return 2 * (_width + _height);
    }

    public boolean isSquare() {
        return _width == _height;
    }
}`,
        [
          ['area', String.raw`T.eq("new Rectangle(3, 5).area()", 15, new Rectangle(3, 5).area());`],
          ['perimeter', String.raw`T.eq("new Rectangle(3, 5).perimeter()", 16, new Rectangle(3, 5).perimeter());
            T.eq("new Rectangle(1, 1).perimeter()", 4, new Rectangle(1, 1).perimeter());`],
          ['isSquare', String.raw`T.eq("new Rectangle(3, 5).isSquare()", false, new Rectangle(3, 5).isSquare());
            T.eq("new Rectangle(4, 4).isSquare()", true, new Rectangle(4, 4).isSquare());`]
        ]),

      ex(4, 'בינוני', 'בדיקת חוקיות וקבועים',
        `<p>כתבו את המחלקה <code>Student</code> עם התכונות <code>_name</code> (מחרוזת) ו-<code>_grade</code> (ציון, <code>int</code>), והקבועים:</p>
<pre class="code">public static final int MIN_GRADE = 0;
public static final int MAX_GRADE = 100;
public static final int PASS = 55;</pre>
<ol>
<li>שיטה פרטית <code>isValidGrade(int g)</code> – מחזירה <code>true</code> אם <code>g</code> בין <code>MIN_GRADE</code> ל-<code>MAX_GRADE</code> (כולל).</li>
<li>בנאי <code>Student(String name, int grade)</code> – אם הציון לא חוקי יש להציב <code>MIN_GRADE</code>. השתמשו ב-<code>isValidGrade</code>.</li>
<li><code>getGrade()</code>, ו-<code>setGrade(int g)</code> שמשנה את הציון רק אם הוא חוקי.</li>
<li><code>isPassing()</code> – מחזירה <code>true</code> אם הציון גדול או שווה ל-<code>PASS</code>.</li>
</ol>`,
        `public class Student {
    public static final int MIN_GRADE = 0;
    public static final int MAX_GRADE = 100;
    public static final int PASS = 55;

    private String _name;
    private int _grade;

}`,
        `public class Student {
    public static final int MIN_GRADE = 0;
    public static final int MAX_GRADE = 100;
    public static final int PASS = 55;

    private String _name;
    private int _grade;

    public Student(String name, int grade) {
        _name = name;
        if (isValidGrade(grade)) {
            _grade = grade;
        } else {
            _grade = MIN_GRADE;
        }
    }

    public int getGrade() {
        return _grade;
    }

    public void setGrade(int g) {
        if (isValidGrade(g)) {
            _grade = g;
        }
    }

    public boolean isPassing() {
        return _grade >= PASS;
    }

    private boolean isValidGrade(int g) {
        return g >= MIN_GRADE && g <= MAX_GRADE;
    }
}`,
        [
          ['isValidGrade', String.raw`Student s = new Student("Dana", 80);
            T.eq("isValidGrade(0)", true, s.isValidGrade(0));
            T.eq("isValidGrade(100)", true, s.isValidGrade(100));
            T.eq("isValidGrade(101)", false, s.isValidGrade(101));
            T.eq("isValidGrade(-1)", false, s.isValidGrade(-1));`],
          ['בנאי', String.raw`T.eq("new Student(\"Dana\", 80).getGrade()", 80, new Student("Dana", 80).getGrade());
            T.eq("new Student(\"Dana\", 120).getGrade() – לא חוקי", 0, new Student("Dana", 120).getGrade());
            T.eq("new Student(\"Dana\", -5).getGrade() – לא חוקי", 0, new Student("Dana", -5).getGrade());`],
          ['setGrade', String.raw`Student s = new Student("Dana", 80);
            s.setGrade(95);
            T.eq("setGrade(95)", 95, s.getGrade());
            s.setGrade(150);
            T.eq("setGrade(150) לא משנה", 95, s.getGrade());`],
          ['isPassing', String.raw`T.eq("ציון 55 עובר", true, new Student("A", 55).isPassing());
            T.eq("ציון 54 לא עובר", false, new Student("A", 54).isPassing());
            T.eq("ציון 100 עובר", true, new Student("A", 100).isPassing());`]
        ]),

      ex(5, 'בינוני', 'השיטה equals',
        `<p>כתבו את המחלקה <code>Book</code> עם התכונות <code>_title</code> ו-<code>_author</code> (מחרוזות) ו-<code>_pages</code> (<code>int</code>):</p>
<ol>
<li>בנאי <code>Book(String title, String author, int pages)</code>.</li>
<li><code>equals(Book other)</code> – מחזירה <code>true</code> אם כל התכונות שוות. זכרו: מחרוזות משווים עם <code>equals</code>, ולא עם <code>==</code>.</li>
<li><code>longerThan(Book other)</code> – מחזירה <code>true</code> אם בספר הנוכחי יש יותר עמודים.</li>
</ol>`,
        `public class Book {
    private String _title;
    private String _author;
    private int _pages;

}`,
        `public class Book {
    private String _title;
    private String _author;
    private int _pages;

    public Book(String title, String author, int pages) {
        _title = title;
        _author = author;
        _pages = pages;
    }

    public boolean equals(Book other) {
        return _title.equals(other._title) && _author.equals(other._author) && _pages == other._pages;
    }

    public boolean longerThan(Book other) {
        return _pages > other._pages;
    }
}`,
        [
          ['equals – ספרים שווים', String.raw`Book a = new Book("Dune", "Herbert", 412);
            T.eq("ספרים עם אותם ערכים (מחרוזות שנוצרו בנפרד)", true, a.equals(new Book(new String("Dune"), new String("Herbert"), 412)));`],
          ['equals – ספרים שונים', String.raw`Book a = new Book("Dune", "Herbert", 412);
            T.eq("כותר שונה", false, a.equals(new Book("Emma", "Herbert", 412)));
            T.eq("סופר שונה", false, a.equals(new Book("Dune", "Austen", 412)));
            T.eq("מספר עמודים שונה", false, a.equals(new Book("Dune", "Herbert", 413)));`],
          ['longerThan', String.raw`Book a = new Book("A", "X", 300), b = new Book("B", "Y", 200);
            T.eq("300 מול 200", true, a.longerThan(b));
            T.eq("200 מול 300", false, b.longerThan(a));
            T.eq("300 מול 300", false, a.longerThan(new Book("C", "Z", 300)));`]
        ]),

      ex(6, 'בינוני', 'בנאי העתקה והשוואת סדר',
        `<p>כתבו את המחלקה <code>Time</code> המייצגת שעה ביום, עם התכונות <code>_hours</code> (0–23) ו-<code>_minutes</code> (0–59). אפשר להניח שהערכים חוקיים.</p>
<ol>
<li>בנאי <code>Time(int hours, int minutes)</code> ובנאי העתקה <code>Time(Time other)</code>.</li>
<li><code>before(Time other)</code> – מחזירה <code>true</code> אם השעה הנוכחית מוקדמת יותר מ-<code>other</code>.</li>
<li><code>after(Time other)</code> – השתמשו <b>רק</b> ב-<code>before</code>.</li>
<li><code>toString()</code> – בפורמט <code>"HH:MM"</code> עם אפס מוביל, למשל <code>"09:05"</code>.</li>
</ol>`,
        `public class Time {
    private int _hours;
    private int _minutes;

}`,
        `public class Time {
    private int _hours;
    private int _minutes;

    public Time(int hours, int minutes) {
        _hours = hours;
        _minutes = minutes;
    }

    public Time(Time other) {
        _hours = other._hours;
        _minutes = other._minutes;
    }

    public boolean before(Time other) {
        return _hours < other._hours || (_hours == other._hours && _minutes < other._minutes);
    }

    public boolean after(Time other) {
        return other.before(this);
    }

    public String toString() {
        String h = (_hours < 10 ? "0" : "") + _hours;
        String m = (_minutes < 10 ? "0" : "") + _minutes;
        return h + ":" + m;
    }
}`,
        [
          ['בנאי העתקה', String.raw`Time a = new Time(9, 5);
            Time b = new Time(a);
            T.ok("נוצר אובייקט חדש", b != a, "בנאי ההעתקה החזיר את אותו אובייקט");
            T.eq("עם אותם ערכים", "09:05", b.toString());`],
          ['toString', String.raw`T.eq("new Time(9, 5)", "09:05", new Time(9, 5).toString());
            T.eq("new Time(14, 30)", "14:30", new Time(14, 30).toString());
            T.eq("new Time(0, 0)", "00:00", new Time(0, 0).toString());`],
          ['before', String.raw`T.eq("09:05 לפני 10:00", true, new Time(9, 5).before(new Time(10, 0)));
            T.eq("10:15 לפני 10:20", true, new Time(10, 15).before(new Time(10, 20)));
            T.eq("10:20 לא לפני 10:15", false, new Time(10, 20).before(new Time(10, 15)));
            T.eq("12:00 לא לפני 12:00", false, new Time(12, 0).before(new Time(12, 0)));`],
          ['after', String.raw`T.eq("11:00 אחרי 10:59", true, new Time(11, 0).after(new Time(10, 59)));
            T.eq("12:00 לא אחרי 12:00", false, new Time(12, 0).after(new Time(12, 0)));`]
        ],
        { sourceChecks: [{ label: 'השיטה after משתמשת ב-before', re: /after\s*\([^)]*\)\s*\{[^}]*before\s*\(/ }] }),

      ex(7, 'בינוני-קשה', 'הכלה ו-aliasing',
        `<p>המחלקה <code>Point</code> נתונה (עם בנאי העתקה, getters, setters, <code>equals</code> ו-<code>toString</code>). כתבו את המחלקה <code>Circle</code> עם התכונות <code>_center</code> (מסוג <code>Point</code>) ו-<code>_radius</code> (<code>int</code>):</p>
<ol>
<li>בנאי <code>Circle(Point center, int radius)</code> – יש להימנע מ-aliasing.</li>
<li><code>getCenter()</code> – יש להימנע מ-aliasing.</li>
<li><code>setCenter(Point p)</code> – יש להימנע מ-aliasing.</li>
<li><code>contains(Point p)</code> – מחזירה <code>true</code> אם הנקודה בתוך המעגל או על ההיקף שלו (המרחק מהמרכז קטן או שווה לרדיוס). רמז: השוו את ריבוע המרחק <code>dx*dx + dy*dy</code> ל-<code>radius*radius</code>.</li>
</ol>
<p class="note"><b>aliasing</b> – מצב שבו שני משתנים מצביעים על אותו אובייקט. אם המחלקה שומרת את האובייקט שקיבלה, מי שמחזיק בו מבחוץ יכול לשנות את המעגל. הפתרון: ליצור עותק עם <code>new Point(…)</code>.</p>`,
        `public class Circle {
    private Point _center;
    private int _radius;

}`,
        `public class Circle {
    private Point _center;
    private int _radius;

    public Circle(Point center, int radius) {
        _center = new Point(center);
        _radius = radius;
    }

    public Point getCenter() {
        return new Point(_center);
    }

    public void setCenter(Point p) {
        _center = new Point(p);
    }

    public boolean contains(Point p) {
        int dx = p.getX() - _center.getX();
        int dy = p.getY() - _center.getY();
        return dx * dx + dy * dy <= _radius * _radius;
    }
}`,
        [
          ['בנאי', String.raw`Point p = new Point(1, 2);
            Circle c = new Circle(p, 5);
            T.ok("המרכז נשמר", c._center != null && c._center.equals(p), "המרכז: " + T.show(c._center));
            T.ok("הבנאי נמנע מ-aliasing", c._center != p, "התכונה מצביעה על הנקודה שהתקבלה");`],
          ['getCenter', String.raw`Circle c = new Circle(new Point(1, 2), 5);
            Point g = c.getCenter();
            T.ok("getCenter מחזירה את המרכז", g != null && g.equals(new Point(1, 2)), "התקבל " + T.show(g));
            T.ok("getCenter נמנעת מ-aliasing", g != c._center, "הוחזרה הפניה לתכונה");`],
          ['setCenter', String.raw`Circle c = new Circle(new Point(1, 2), 5);
            Point q = new Point(7, 7);
            c.setCenter(q);
            T.ok("setCenter משנה את המרכז", c._center.equals(q), "המרכז: " + T.show(c._center));
            T.ok("setCenter נמנעת מ-aliasing", c._center != q, "התכונה מצביעה על הנקודה שהתקבלה");`],
          ['contains', String.raw`Circle c = new Circle(new Point(0, 0), 5);
            T.eq("(3, 4) – על ההיקף", true, c.contains(new Point(3, 4)));
            T.eq("(1, 1) – בפנים", true, c.contains(new Point(1, 1)));
            T.eq("(4, 4) – בחוץ", false, c.contains(new Point(4, 4)));
            T.eq("(-5, 0) – על ההיקף", true, c.contains(new Point(-5, 0)));
            T.eq("מעגל שמרכזו (10, 10), נקודה (12, 10)", true, new Circle(new Point(10, 10), 2).contains(new Point(12, 10)));`]
        ],
        { support: pointClass }),

      ex(8, 'קשה', 'חשבון בנק – שיטות שמשנות שני אובייקטים',
        `<p>כתבו את המחלקה <code>BankAccount</code> עם התכונות <code>_owner</code> (מחרוזת) ו-<code>_balance</code> (יתרה, <code>int</code>):</p>
<ol>
<li>בנאי <code>BankAccount(String owner)</code> – היתרה מתחילה ב-0.</li>
<li><code>getBalance()</code>.</li>
<li><code>deposit(int amount)</code> – מפקידה רק סכום חיובי; מחזירה <code>true</code> אם ההפקדה בוצעה.</li>
<li><code>withdraw(int amount)</code> – מושכת רק סכום חיובי שלא גדול מהיתרה; מחזירה <code>true</code> אם המשיכה בוצעה.</li>
<li><code>transfer(BankAccount other, int amount)</code> – מעבירה <code>amount</code> מהחשבון הנוכחי לחשבון <code>other</code>, רק אם אפשר למשוך את הסכום. השתמשו ב-<code>withdraw</code> וב-<code>deposit</code>. מחזירה <code>true</code> אם ההעברה בוצעה.</li>
</ol>`,
        `public class BankAccount {
    private String _owner;
    private int _balance;

}`,
        `public class BankAccount {
    private String _owner;
    private int _balance;

    public BankAccount(String owner) {
        _owner = owner;
        _balance = 0;
    }

    public int getBalance() {
        return _balance;
    }

    public boolean deposit(int amount) {
        if (amount <= 0) {
            return false;
        }
        _balance += amount;
        return true;
    }

    public boolean withdraw(int amount) {
        if (amount <= 0 || amount > _balance) {
            return false;
        }
        _balance -= amount;
        return true;
    }

    public boolean transfer(BankAccount other, int amount) {
        if (!withdraw(amount)) {
            return false;
        }
        other.deposit(amount);
        return true;
    }
}`,
        [
          ['deposit', String.raw`BankAccount a = new BankAccount("Noa");
            T.eq("יתרה התחלתית", 0, a.getBalance());
            T.eq("deposit(100) מחזירה true", true, a.deposit(100));
            T.eq("deposit(-5) מחזירה false", false, a.deposit(-5));
            T.eq("deposit(0) מחזירה false", false, a.deposit(0));
            T.eq("היתרה 100", 100, a.getBalance());`],
          ['withdraw', String.raw`BankAccount a = new BankAccount("Noa");
            a.deposit(100);
            T.eq("withdraw(30) מחזירה true", true, a.withdraw(30));
            T.eq("withdraw(80) – יותר מהיתרה", false, a.withdraw(80));
            T.eq("withdraw(-1)", false, a.withdraw(-1));
            T.eq("היתרה 70", 70, a.getBalance());
            T.eq("withdraw(70) – כל היתרה", true, a.withdraw(70));`],
          ['transfer', String.raw`BankAccount a = new BankAccount("Noa"), b = new BankAccount("Tal");
            a.deposit(100);
            T.eq("transfer(b, 40) מחזירה true", true, a.transfer(b, 40));
            T.eq("ל-a נשארו 60", 60, a.getBalance());
            T.eq("ל-b יש 40", 40, b.getBalance());
            T.eq("transfer(b, 500) – אין מספיק", false, a.transfer(b, 500));
            T.eq("אחרי העברה שנכשלה ל-a עדיין 60", 60, a.getBalance());
            T.eq("ול-b עדיין 40", 40, b.getBalance());`]
        ],
        { sourceChecks: [{ label: 'transfer משתמשת ב-withdraw וב-deposit', re: /transfer\s*\([^)]*\)\s*\{(?=[\s\S]*withdraw\s*\()(?=[\s\S]*deposit\s*\()/ }] }),

      ex(9, 'קשה – רמת מבחן', 'מערך של אובייקטים – הוספה וממוצע',
        `<p>המחלקה <code>Player</code> נתונה: לשחקן שם וגיל, עם השיטות <code>getName()</code>, <code>getAge()</code> ו-<code>equals(Player other)</code>.</p>
<p>השלימו את המחלקה <code>Team</code> השומרת את השחקנים במערך <code>_players</code>, ו-<code>_size</code> הוא מספר השחקנים בפועל. השחקנים שמורים ברצף מתחילת המערך, ללא "חורים".</p>
<ol>
<li><code>addPlayer(Player p)</code> – מוסיפה את השחקן בסוף. אין להוסיף שחקן שכבר קיים (לפי <code>equals</code>), ואין לחרוג מגודל המערך. מחזירה <code>true</code> אם השחקן נוסף.</li>
<li><code>averageAge()</code> – מחזירה (כ-<code>double</code>) את ממוצע הגילים של השחקנים, או 0 אם אין שחקנים.</li>
<li><code>countOlderThan(int age)</code> – מחזירה כמה שחקנים מבוגרים מ-<code>age</code>.</li>
</ol>`,
        `public class Team {
    private Player[] _players;
    private int _size;

    public Team(int max) {
        _players = new Player[max];
        _size = 0;
    }

    public boolean addPlayer(Player p) {

    }

    public double averageAge() {

    }

    public int countOlderThan(int age) {

    }
}`,
        `public class Team {
    private Player[] _players;
    private int _size;

    public Team(int max) {
        _players = new Player[max];
        _size = 0;
    }

    public boolean addPlayer(Player p) {
        if (_size == _players.length) {
            return false;
        }
        for (int i = 0; i < _size; i++) {
            if (_players[i].equals(p)) {
                return false;
            }
        }
        _players[_size] = p;
        _size++;
        return true;
    }

    public double averageAge() {
        if (_size == 0) {
            return 0;
        }
        int sum = 0;
        for (int i = 0; i < _size; i++) {
            sum += _players[i].getAge();
        }
        return (double) sum / _size;
    }

    public int countOlderThan(int age) {
        int count = 0;
        for (int i = 0; i < _size; i++) {
            if (_players[i].getAge() > age) {
                count++;
            }
        }
        return count;
    }
}`,
        [
          ['addPlayer', String.raw`Team t = new Team(3);
            T.eq("הוספת שחקן ראשון", true, t.addPlayer(new Player("Avi", 20)));
            T.eq("הוספת שחקן קיים (אובייקט אחר, אותם ערכים)", false, t.addPlayer(new Player(new String("Avi"), 20)));
            T.eq("הוספת שחקן שני", true, t.addPlayer(new Player("Ben", 25)));
            T.eq("הוספת שחקן שלישי", true, t.addPlayer(new Player("Gil", 30)));
            T.eq("המערך מלא – false", false, t.addPlayer(new Player("Dor", 22)));
            T.eq("_size הוא 3", 3, t._size);
            T.ok("השחקנים שמורים ברצף", t._players[0] != null && t._players[1] != null && t._players[2] != null, "יש חור במערך");`],
          ['averageAge', String.raw`Team t = new Team(5);
            T.eq("קבוצה ריקה", 0.0, t.averageAge());
            t.addPlayer(new Player("Avi", 20)); t.addPlayer(new Player("Ben", 25));
            T.eq("גילים 20, 25 – ממוצע 22.5 (שימו לב לחלוקה בשלמים)", 22.5, t.averageAge());`],
          ['countOlderThan', String.raw`Team t = new Team(5);
            t.addPlayer(new Player("Avi", 20)); t.addPlayer(new Player("Ben", 25)); t.addPlayer(new Player("Gil", 30));
            T.eq("countOlderThan(24)", 2, t.countOlderThan(24));
            T.eq("countOlderThan(25) – 25 לא מבוגר מ-25", 1, t.countOlderThan(25));
            T.eq("countOlderThan(40)", 0, t.countOlderThan(40));`]
        ],
        { support: playerClass }),

      ex(10, 'קשה – רמת מבחן', 'מערך של אובייקטים – מחיקה וחיפוש',
        `<p>המחלקה <code>Pupil</code> נתונה: לתלמיד שם (<code>getName()</code>) וציון (<code>getGrade()</code>). המחלקה <code>ClassRoom</code> שומרת תלמידים במערך <code>_pupils</code> ברצף מתחילת המערך, ו-<code>_size</code> הוא מספר התלמידים. השיטה <code>add</code> נתונה.</p>
<ol>
<li><code>removePupil(String name)</code> – מוציאה מהמערך את התלמיד הראשון עם השם הזה. המערך חייב להישאר ללא "חורים" (אין חשיבות לסדר). מחזירה <code>true</code> אם תלמיד הוצא, ו-<code>false</code> אם לא נמצא.</li>
<li><code>topPupil()</code> – מחזירה את התלמיד עם הציון הגבוה ביותר (אם יש כמה, הראשון שבהם), או <code>null</code> אם הכיתה ריקה.</li>
<li><code>aboveAverage()</code> – מחזירה כמה תלמידים קיבלו ציון גבוה מממוצע הכיתה (0 לכיתה ריקה).</li>
</ol>`,
        classRoomHead + `
    public boolean removePupil(String name) {

    }

    public Pupil topPupil() {

    }

    public int aboveAverage() {

    }
}`,
        classRoomHead + `
    public boolean removePupil(String name) {
        for (int i = 0; i < _size; i++) {
            if (_pupils[i].getName().equals(name)) {
                for (int j = i; j < _size - 1; j++) {
                    _pupils[j] = _pupils[j + 1];
                }
                _pupils[_size - 1] = null;
                _size--;
                return true;
            }
        }
        return false;
    }

    public Pupil topPupil() {
        if (_size == 0) {
            return null;
        }
        Pupil best = _pupils[0];
        for (int i = 1; i < _size; i++) {
            if (_pupils[i].getGrade() > best.getGrade()) {
                best = _pupils[i];
            }
        }
        return best;
    }

    public int aboveAverage() {
        if (_size == 0) {
            return 0;
        }
        int sum = 0;
        for (int i = 0; i < _size; i++) {
            sum += _pupils[i].getGrade();
        }
        double avg = (double) sum / _size;
        int count = 0;
        for (int i = 0; i < _size; i++) {
            if (_pupils[i].getGrade() > avg) {
                count++;
            }
        }
        return count;
    }
}`,
        [
          ['removePupil', String.raw`ClassRoom c = make();
            T.eq("removePupil(\"Ben\")", true, c.removePupil("Ben"));
            T.eq("_size ירד ל-3", 3, c._size);
            T.eq("התלמידים שנשארו ברצף", "[Avi, Gil, Noa]", names(c));
            T.eq("removePupil(\"Zoe\") – לא קיים", false, c.removePupil("Zoe"));
            T.eq("removePupil(new String(\"Noa\")) – האחרון", true, c.removePupil(new String("Noa")));
            T.eq("נשארו", "[Avi, Gil]", names(c));`],
          ['topPupil', String.raw`T.eq("topPupil", "Gil", nm(make().topPupil()));
            ClassRoom c = new ClassRoom(5);
            T.eq("כיתה ריקה – null", null, nm(c.topPupil()));
            c.add(new Pupil("A", 90)); c.add(new Pupil("B", 90));
            T.eq("שוויון – הראשון", "A", nm(c.topPupil()));`],
          ['aboveAverage', String.raw`T.eq("ציונים 70, 85, 95, 50 (ממוצע 75)", 2, make().aboveAverage());
            ClassRoom c = new ClassRoom(5);
            T.eq("כיתה ריקה", 0, c.aboveAverage());
            c.add(new Pupil("A", 80)); c.add(new Pupil("B", 81));
            T.eq("ציונים 80, 81 (ממוצע 80.5) – שימו לב לחלוקה בשלמים", 1, c.aboveAverage());`]
        ],
        { support: pupilClass + `
static ClassRoom make() {
    ClassRoom c = new ClassRoom(6);
    c.add(new Pupil("Avi", 70)); c.add(new Pupil("Ben", 85)); c.add(new Pupil("Gil", 95)); c.add(new Pupil("Noa", 50));
    return c;
}
static String nm(Pupil p) { return p == null ? null : p.getName(); }
static String names(ClassRoom c) {
    String[] n = new String[c._size];
    for (int i = 0; i < c._size; i++) n[i] = c._pupils[i] == null ? "null" : c._pupils[i].getName();
    java.util.Arrays.sort(n);
    return java.util.Arrays.toString(n);
}` })
    ]
  });
})();
