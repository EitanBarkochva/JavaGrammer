// 11203 מבחן מסכם 02
(function () {
  var engineClass = `static class Engine {
    public static final int DEF_HP = 100;
    private int _horsePower;
    private String _type;
    public Engine(int horsePower, String type) { _type = type; _horsePower = isValidHorsePower(horsePower) ? horsePower : DEF_HP; }
    public Engine(Engine other) { _horsePower = other._horsePower; _type = other._type; }
    public String getType() { return _type; }
    public void setType(String type) { _type = type; }
    public int getHorsePower() { return _horsePower; }
    public void setHorsePower(int hp) { if (isValidHorsePower(hp)) _horsePower = hp; }
    public boolean stronger(Engine other) { return _horsePower > other._horsePower; }
    public String toString() { return _type + " engine - " + _horsePower + " HP"; }
    private boolean isValidHorsePower(int hp) { return hp > 0 && hp <= 1500; }
    public boolean equals(Engine other) { return _horsePower == other._horsePower && _type.equals(other._type); }
}`;
  var carClass = `static class Car {
    private String _model; private int _year; private Engine _engine;
    public Car(String model, int year, Engine engine) { _model = model; _year = year; _engine = new Engine(engine); }
    public Engine getEngine() { return new Engine(_engine); }
    public void setEngine(Engine engine) { _engine = new Engine(engine); }
    public int getYear() { return _year; }
    public boolean equals(Car other) { return _model.equals(other._model) && _year == other._year && _engine.equals(other._engine); }
    public boolean before(Car other) { return _year < other._year || (_year == other._year && _engine.stronger(other._engine)); }
    public String toString() { return _model + " " + _year + " (" + _engine + ")"; }
}`;
  var grid = `<table class="grid"><tr><td>5</td><td>8</td><td>7</td><td>4</td><td>3</td></tr><tr><td>2</td><td>5</td><td>2</td><td>1</td><td>5</td></tr><tr><td>1</td><td class="hl">4</td><td>3</td><td>2</td><td>3</td></tr><tr><td>8</td><td>7</td><td>3</td><td>1</td><td>2</td></tr></table>`;
  var gridJava = `static final int[][] A = {{5, 8, 7, 4, 3}, {2, 5, 2, 1, 5}, {1, 4, 3, 2, 3}, {8, 7, 3, 1, 2}};`;

  (window.EXAMS = window.EXAMS || []).push({
    id: 'm02',
    title: 'מבחן מסכם 02 (11203)',
    subtitle: '11203 – מבוא למדעי המחשב ושפת Java א, מבחן מסכם 02',
    intro: 'במבחן 4 שאלות, יש לענות על כל השאלות.',
    questions: [
      {
        num: 1, points: 27, title: 'המחלקות Engine ו-Car',
        parts: [
          {
            id: 'm02-1a', title: 'סעיף א – המחלקה Engine', points: 12, type: 'java',
            html: `<p>המחלקה <code>Engine</code> מייצגת מנוע של מכונית שיש לו את התכונות: כוח סוס (<code>_horsePower</code>) וסוג המנוע (<code>_type</code> – בנזין, סולר, היברידי, חשמלי). השלימו את קוד המחלקה לפי ההוראות הבאות:</p>
<ol>
<li>את הבנאי: הפרמטר <code>type</code> חוקי ואין צורך לבדוק זאת, אבל יש לוודא שהתכונה <code>_horsePower</code> מקבלת ערך חוקי. אם ערך הפרמטר <code>horsePower</code> אינו חוקי יש להציב <code>DEF_HP</code>. לבדיקת חוקיות הפרמטר השתמשו בשיטה <code>isValidHorsePower</code> שנמצאת במחלקה (אין צורך לממש אותה). (3 נק')</li>
<li>השיטה <code>setHorsePower(int hp)</code> מקבלת בפרמטר ערך חדש של כוח סוס (<code>hp</code>) ומעדכנת את התכונה <code>_horsePower</code> רק אם ערך הפרמטר חוקי. את החוקיות יש לבדוק בעזרת השיטה <code>isValidHorsePower</code>. (3 נק')</li>
<li>השיטה <code>stronger(Engine other)</code> מחזירה <code>true</code> אם המנוע הנוכחי חזק יותר מהמנוע שהתקבל כפרמטר, אחרת מחזירה <code>false</code>. מנוע X חזק יותר ממנוע Y אם למנוע X יש יותר כוחות סוס משל מנוע Y. (3 נק')</li>
<li>השיטה <code>toString()</code> מחזירה מחרוזת המייצגת את המנוע לפי הדוגמאות הבאות (3 נק'):<br>
מנוע חשמלי (Electric) ובו 150 כוחות סוס: <code>"Electric engine - 150 HP"</code><br>
מנוע מסוג דיזל (Diesel) ולו 120 כוחות סוס: <code>"Diesel engine - 120 HP"</code></li>
</ol>`,
            starter: `public class Engine {
    public static final int DEF_HP = 100;
    private int _horsePower;
    private String _type; // "Electric" or "Gasoline" or "Diesel"

    public Engine(int horsePower, String type) {
        //1

        _type = type;
    }

    public Engine(Engine other) { _horsePower = other._horsePower; _type = other._type; } // copy constructor
    public String getType() { return _type; }
    public void setType(String type) { _type = type; }
    public int getHorsePower() { return _horsePower; }

    public void setHorsePower(int hp) {
        //2

    }

    public boolean stronger(Engine other) {
        //3

    }

    public String toString() {
        //4

    }

    // נתונה – אין צורך לממש
    private boolean isValidHorsePower(int hp) { return hp > 0 && hp <= 1500; }
}`,
            solution: `public class Engine {
    public static final int DEF_HP = 100;
    private int _horsePower;
    private String _type; // "Electric" or "Gasoline" or "Diesel"

    public Engine(int horsePower, String type) {
        if (isValidHorsePower(horsePower)) {
            _horsePower = horsePower;
        } else {
            _horsePower = DEF_HP;
        }
        _type = type;
    }

    public Engine(Engine other) { _horsePower = other._horsePower; _type = other._type; }
    public String getType() { return _type; }
    public void setType(String type) { _type = type; }
    public int getHorsePower() { return _horsePower; }

    public void setHorsePower(int hp) {
        if (isValidHorsePower(hp)) {
            _horsePower = hp;
        }
    }

    public boolean stronger(Engine other) {
        return _horsePower > other._horsePower;
    }

    public String toString() {
        return _type + " engine - " + _horsePower + " HP";
    }

    private boolean isValidHorsePower(int hp) { return hp > 0 && hp <= 1500; }
}`,
            tests: [
              ['בנאי', String.raw`T.eq("new Engine(150, \"Electric\") – כוח סוס 150", 150, new Engine(150, "Electric").getHorsePower());
                T.eq("new Engine(-5, \"Diesel\") – כוח סוס DEF_HP", Engine.DEF_HP, new Engine(-5, "Diesel").getHorsePower());
                T.eq("new Engine(5000, \"Diesel\") – כוח סוס DEF_HP", Engine.DEF_HP, new Engine(5000, "Diesel").getHorsePower());
                T.eq("הסוג נשמר", "Diesel", new Engine(120, "Diesel").getType());`],
              ['setHorsePower', String.raw`Engine e = new Engine(150, "Electric");
                e.setHorsePower(200);
                T.eq("setHorsePower(200)", 200, e.getHorsePower());
                e.setHorsePower(-1);
                T.eq("setHorsePower(-1) לא משנה", 200, e.getHorsePower());`],
              ['stronger', String.raw`Engine a = new Engine(150, "Electric"), b = new Engine(120, "Diesel"), c = new Engine(150, "Gasoline");
                T.eq("150 חזק מ-120", true, a.stronger(b));
                T.eq("120 לא חזק מ-150", false, b.stronger(a));
                T.eq("150 לא חזק מ-150", false, a.stronger(c));`],
              ['toString', String.raw`T.eq("toString – Electric 150", "Electric engine - 150 HP", T.dash(new Engine(150, "Electric").toString()));
                T.eq("toString – Diesel 120", "Diesel engine - 120 HP", T.dash(new Engine(120, "Diesel").toString()));`]
            ]
          },
          {
            id: 'm02-1b', title: 'סעיף ב – המחלקה Car', points: 9, type: 'java',
            html: `<p>המחלקה <code>Car</code> מייצגת מכונית שיש לה את התכונות: מודל (<code>_model</code>), שנת ייצור (<code>_year</code>) ומנוע (<code>_engine</code>) מסוג <code>Engine</code>. השלימו את קוד המחלקה לפי ההוראות הבאות. ניתן להשתמש בכל שיטות <code>Engine</code> ללא צורך לממש אותן.</p>
<ol>
<li>בנאי – מאתחל את כל התכונות של המחלקה בהתאם לפרמטרים. אפשר להניח שכל הפרמטרים חוקיים ואין צורך לבדוק אותם, אבל יש להימנע מ-aliasing. (3 נק')</li>
<li>השיטה <code>getEngine()</code> מחזירה את תכונת המנוע. יש להימנע מ-aliasing. (2 נק')</li>
<li>השיטה <code>before(Car other)</code> מחזירה <code>true</code> כאשר המכונית עליה מופעלת השיטה נמצאת לפני המכונית שהתקבלה כפרמטר. מכונית x נמצאת לפני מכונית y אם היא נוצרה לפני מכונית y (שנת ייצור), או שהיא מאותה שנת ייצור אך חזקה יותר (יש להשתמש בשיטה <code>stronger</code> של <code>Engine</code>). (4 נק')</li>
</ol>`,
            starter: `public class Car {
    private String _model;
    private int _year;
    private Engine _engine;

    public Car(String model, int year, Engine engine) {
        //1

    }

    public Engine getEngine() {
        //2

    }

    public void setEngine(Engine engine) { _engine = new Engine(engine); }
    public int getYear() { return _year; }

    public boolean before(Car other) {
        //3

    }

    public String toString() { return _model + " " + _year + " (" + _engine + ")"; }
}`,
            solution: `public class Car {
    private String _model;
    private int _year;
    private Engine _engine;

    public Car(String model, int year, Engine engine) {
        _model = model;
        _year = year;
        _engine = new Engine(engine);
    }

    public Engine getEngine() {
        return new Engine(_engine);
    }

    public void setEngine(Engine engine) { _engine = new Engine(engine); }
    public int getYear() { return _year; }

    public boolean before(Car other) {
        return _year < other._year || (_year == other._year && _engine.stronger(other._engine));
    }

    public String toString() { return _model + " " + _year + " (" + _engine + ")"; }
}`,
            support: engineClass,
            sourceChecks: [{ label: 'השיטה before משתמשת ב-stronger', re: /before\s*\([^)]*\)\s*\{[\s\S]*stronger\s*\(/ }],
            tests: [
              ['בנאי', String.raw`Engine e = new Engine(150, "Electric");
                Car c = new Car("Tesla", 2020, e);
                T.eq("מודל", "Tesla", c._model);
                T.eq("שנה", 2020, c._year);
                T.ok("המנוע אותחל עם אותם ערכים", c._engine != null && c._engine.equals(e), "המנוע: " + T.show(c._engine));
                T.ok("הבנאי נמנע מ-aliasing של המנוע", c._engine != e, "התכונה מצביעה על המנוע שהתקבל");`],
              ['getEngine', String.raw`Car c = new Car("Tesla", 2020, new Engine(150, "Electric"));
                Engine g = c.getEngine();
                T.ok("getEngine מחזירה מנוע עם אותם ערכים", g != null && g.equals(new Engine(150, "Electric")), "התקבל " + T.show(g));
                T.ok("getEngine נמנעת מ-aliasing", g != c._engine, "הוחזרה הפניה לתכונה");`],
              ['before', String.raw`Engine strong = new Engine(300, "Gasoline"), weak = new Engine(90, "Diesel");
                T.eq("2015 לפני 2020", true, new Car("A", 2015, weak).before(new Car("B", 2020, strong)));
                T.eq("2020 לא לפני 2015", false, new Car("A", 2020, strong).before(new Car("B", 2015, weak)));
                T.eq("אותה שנה, הראשונה חזקה יותר", true, new Car("A", 2018, strong).before(new Car("B", 2018, weak)));
                T.eq("אותה שנה, הראשונה חלשה יותר", false, new Car("A", 2018, weak).before(new Car("B", 2018, strong)));
                T.eq("אותה שנה ואותו כוח", false, new Car("A", 2018, weak).before(new Car("B", 2018, weak)));`]
            ]
          },
          {
            id: 'm02-1c', title: 'סעיף ג – דמו CarDemo', points: 6, type: 'java',
            html: `<p>במחלקה <code>CarDemo</code> נדגים שימוש במחלקות <code>Engine</code> ו-<code>Car</code>. בתחילת ההדגמה יוצרים שלושה מנועים ושלוש מכוניות (<code>c1, c2, c3</code>). לכל מכונית משויך מנוע, אבל לא ידוע איזה. נרצה להציג את המכונית החזקה ביותר – המכונית בעלת המנוע החזק ביותר. עליכם להשלים את התוכנית למציאת המכונית החזקה ביותר. לנוחיותכם הגדרנו משתנה מסוג מכונית (<code>strongest</code>), ובסוף התוכנית יש קוד להדפסת המכונית <code>strongest</code>. ניתן להשתמש בכל השיטות שהוגדרו במחלקות <code>Engine</code> ו-<code>Car</code>.</p>
<pre class="code">// יצירת 3 מנועים
Engine e1 = new Engine(...);  Engine e2 = new Engine(...);  Engine e3 = new Engine(...);
// יצירת 3 מכוניות
Car c1 = new Car(...);  Car c2 = new Car(...);  Car c3 = new Car(...);
// FIND THE STRONGEST CAR
<b>... הקוד שלכם ...</b>
System.out.println("Strongest car: " + strongest);</pre>
<p class="note">בתיבה כתבו רק את החלק שמוצא את המכונית החזקה ביותר. הבדיקה מריצה אותו עם מכוניות שונות.</p>`,
            wrap: `static Car findStrongest(Car c1, Car c2, Car c3) {
%%CODE%%
return strongest;
}`,
            starter: `// FIND THE STRONGEST CAR
Car strongest;
`,
            solution: `// FIND THE STRONGEST CAR
Car strongest = c1;
if (c2.getEngine().stronger(strongest.getEngine())) {
    strongest = c2;
}
if (c3.getEngine().stronger(strongest.getEngine())) {
    strongest = c3;
}`,
            support: engineClass + '\n' + carClass + `
static Car car(String m, int hp) { return new Car(m, 2020, new Engine(hp, "Gasoline")); }
static void check(int h1, int h2, int h3, String expect) {
    Car a = car("c1", h1), b = car("c2", h2), c = car("c3", h3);
    Car s = findStrongest(a, b, c);
    T.eq("כוחות סוס " + h1 + ", " + h2 + ", " + h3, expect, s == null ? null : s._model);
}`,
            tests: [
              ['החזקה היא c1', String.raw`check(300, 150, 200, "c1");`],
              ['החזקה היא c2', String.raw`check(150, 300, 200, "c2");`],
              ['החזקה היא c3', String.raw`check(150, 200, 300, "c3");`],
              ['c3 חזקה, c1 חלשה מ-c2', String.raw`check(100, 250, 400, "c3");`]
            ]
          }
        ]
      },
      {
        num: 2, points: 30, title: 'ייצוג מספר במערך ספרות',
        parts: [
          {
            id: 'm02-2a', title: 'סעיף א – מציאת מספר ספרות במספר שלם', points: 10, type: 'java',
            html: `<p>כתבו את השיטה הסטטית <code>public static int numDigits(int num)</code> המקבלת מספר שלם כלשהו <code>num</code> ומחזירה את מספר הספרות שלו. במימוש השיטה יש להשתמש בחלוקה ושארית ואין להמיר את המספר למחרוזת. דוגמאות:</p>
<ol>
<li><code>numDigits(1234) ==> 4</code> – במספר 1234 יש 4 ספרות</li>
<li><code>numDigits(-101) ==> 3</code> – במספר -101 יש 3 ספרות, סימן המינוס אינו נספר כספרה</li>
<li><code>numDigits(0) ==> 1</code> – במספר 0 יש ספרה אחת</li>
</ol>`,
            starter: `public static int numDigits(int num) {

}`,
            solution: `public static int numDigits(int num) {
    int count = 1;
    num = num / 10;
    while (num != 0) {
        count++;
        num = num / 10;
    }
    return count;
}`,
            sourceChecks: [{ label: 'אין המרה למחרוזת', re: /^(?![\s\S]*(String\.valueOf|toString|""\s*\+|\+\s*""|Integer\.toString))/ }],
            tests: [
              ['1234', String.raw`T.eq("numDigits(1234)", 4, numDigits(1234));`],
              ['-101', String.raw`T.eq("numDigits(-101)", 3, numDigits(-101));`],
              ['0', String.raw`T.eq("numDigits(0)", 1, numDigits(0));`],
              ['7', String.raw`T.eq("numDigits(7)", 1, numDigits(7));`],
              ['-9', String.raw`T.eq("numDigits(-9)", 1, numDigits(-9));`],
              ['1000000', String.raw`T.eq("numDigits(1000000)", 7, numDigits(1000000));`]
            ]
          },
          {
            id: 'm02-2b', title: 'סעיף ב – ייצוג מספר על ידי מערך ספרות', points: 13, type: 'java',
            html: `<p>כתבו את השיטה הסטטית <code>public static int[] num2arr(int num)</code> המקבלת מספר שלם אי-שלילי כלשהו <code>num</code> ומחזירה מערך של שלמים בו כל תא מייצג ספרה של המספר. שימו לב לכיוון הספרות במערך. במימוש שיטה זו עליכם להשתמש בשיטה <code>numDigits</code> מסעיף א גם אם לא מימשתם אותה. אפשר להניח ש-<code>num &gt;= 0</code> ואין צורך לבדוק זאת. דוגמאות:</p>
<ol>
<li><code>num2arr(123) ==> [1, 2, 3]</code> – הוחזר מערך בו האיבר הראשון הוא 1, אח"כ 2, ואחרון 3</li>
<li><code>num2arr(1001) ==> [1, 0, 0, 1]</code></li>
<li><code>num2arr(0) ==> [0]</code></li>
</ol>`,
            starter: `public static int[] num2arr(int num) {

}`,
            solution: `public static int[] num2arr(int num) {
    int[] arr = new int[numDigits(num)];
    for (int i = arr.length - 1; i >= 0; i--) {
        arr[i] = num % 10;
        num = num / 10;
    }
    return arr;
}`,
            support: `public static int numDigits(int num) { int c = 1; num /= 10; while (num != 0) { c++; num /= 10; } return c; }`,
            sourceChecks: [{ label: 'השיטה משתמשת ב-numDigits', re: /numDigits\s*\(/ }],
            tests: [
              ['123', String.raw`T.eq("num2arr(123)", new int[]{1, 2, 3}, num2arr(123));`],
              ['1001', String.raw`T.eq("num2arr(1001)", new int[]{1, 0, 0, 1}, num2arr(1001));`],
              ['0', String.raw`T.eq("num2arr(0)", new int[]{0}, num2arr(0));`],
              ['50', String.raw`T.eq("num2arr(50)", new int[]{5, 0}, num2arr(50));`],
              ['987654', String.raw`T.eq("num2arr(987654)", new int[]{9, 8, 7, 6, 5, 4}, num2arr(987654));`]
            ]
          },
          {
            id: 'm02-2c', title: 'סעיף ג – שדרוג השיטה', points: 7, type: 'java',
            html: `<p>שדרגו את השיטה <code>num2arr</code> כך שתוכל להתמודד גם עם מספרים שליליים. במערך שיוחזר, האיבר הראשון יכיל את הערך 1 עבור מספר אי-שלילי (חיובי או 0) ואת הערך <code>-1</code> עבור מספר שלילי. שאר איברי המערך ייצגו את הספרות כמו בשיטה המקורית. דוגמאות:</p>
<ol>
<li><code>num2arr(-123) ==> [-1, 1, 2, 3]</code> – המספר שלילי לכן האיבר הראשון הוא -1, ולאחריו הספרות 123</li>
<li><code>num2arr(50) ==> [1, 5, 0]</code> – המספר חיובי לכן האיבר הראשון 1 ואחריו ספרות המספר 50</li>
<li><code>num2arr(0) ==> [1, 0]</code> – המספר הוא 0, אי-שלילי, לכן האיבר הראשון 1 ואחריו הספרה 0</li>
</ol>
<p>ציינו את השינויים והתוספות בשיטה, או כתבו אותה מחדש.</p>`,
            starter: `public static int[] num2arr(int num) {
    int[] arr = new int[numDigits(num)];
    for (int i = arr.length - 1; i >= 0; i--) {
        arr[i] = num % 10;
        num = num / 10;
    }
    return arr;
}`,
            solution: `public static int[] num2arr(int num) {
    int sign = 1;
    if (num < 0) {
        sign = -1;
        num = -num;
    }
    int[] arr = new int[numDigits(num) + 1];
    arr[0] = sign;
    for (int i = arr.length - 1; i >= 1; i--) {
        arr[i] = num % 10;
        num = num / 10;
    }
    return arr;
}`,
            support: `public static int numDigits(int num) { int c = 1; num /= 10; while (num != 0) { c++; num /= 10; } return c; }`,
            tests: [
              ['-123', String.raw`T.eq("num2arr(-123)", new int[]{-1, 1, 2, 3}, num2arr(-123));`],
              ['50', String.raw`T.eq("num2arr(50)", new int[]{1, 5, 0}, num2arr(50));`],
              ['0', String.raw`T.eq("num2arr(0)", new int[]{1, 0}, num2arr(0));`],
              ['-7', String.raw`T.eq("num2arr(-7)", new int[]{-1, 7}, num2arr(-7));`],
              ['1001', String.raw`T.eq("num2arr(1001)", new int[]{1, 1, 0, 0, 1}, num2arr(1001));`]
            ]
          }
        ]
      },
      {
        num: 3, points: 27, title: 'חיפוש אוכף במערך דו-ממדי של גבהים',
        intro: `<p>בדוגמאות נשתמש במערך הדו-ממדי <code>a</code> הבא:</p>${grid}`,
        parts: [
          {
            id: 'm02-3a', title: 'סעיף א – מציאת אינדקס איבר מינימלי בעמודה', points: 12, type: 'java',
            html: `<p>כתבו את השיטה הסטטית <code>public static int idxOfMin(int[][] a, int col)</code> המקבלת מערך דו-ממדי של מספרים שלמים חיוביים (<code>a</code>) ומספר עמודה (<code>col</code>) שנמצאת במערך. השיטה מחזירה את אינדקס השורה של האיבר הקטן ביותר בעמודה <code>col</code> (אם נמצאו כמה איברים קטנים ביותר יוחזר האינדקס הראשון שנמצא). דוגמאות עבור המערך <code>a</code>:</p>
<ol>
<li><code>idxOfMin(a, 1) ==> 2</code> – בעמודה 1 הערך הקטן ביותר הוא 4 שנמצא באינדקס 2</li>
<li><code>idxOfMin(a, 3) ==> 1</code> – בעמודה 3 הערך הקטן ביותר (1) הראשון נמצא באינדקס 1</li>
<li><code>idxOfMin(a, 0) ==> 2</code> – בעמודה 0 הערך הקטן ביותר הוא 1 שנמצא באינדקס 2</li>
<li><code>idxOfMin(a, 4) ==> 3</code> – בעמודה 4 הערך הקטן ביותר הוא 2 שנמצא באינדקס 3</li>
</ol>`,
            starter: `public static int idxOfMin(int[][] a, int col) {

}`,
            solution: `public static int idxOfMin(int[][] a, int col) {
    int idx = 0;
    for (int i = 1; i < a.length; i++) {
        if (a[i][col] < a[idx][col]) {
            idx = i;
        }
    }
    return idx;
}`,
            support: gridJava,
            tests: [
              ['עמודה 1', String.raw`T.eq("idxOfMin(a, 1)", 2, idxOfMin(A, 1));`],
              ['עמודה 3 – מינימום כפול', String.raw`T.eq("idxOfMin(a, 3)", 1, idxOfMin(A, 3));`],
              ['עמודה 0', String.raw`T.eq("idxOfMin(a, 0)", 2, idxOfMin(A, 0));`],
              ['עמודה 4', String.raw`T.eq("idxOfMin(a, 4)", 3, idxOfMin(A, 4));`],
              ['עמודה 2 – מינימום בשורה 1', String.raw`T.eq("idxOfMin(a, 2)", 1, idxOfMin(A, 2));`],
              ['שורה אחת', String.raw`T.eq("idxOfMin({{4, 9}}, 1)", 0, idxOfMin(new int[][]{{4, 9}}, 1));`]
            ]
          },
          {
            id: 'm02-3b', title: 'סעיף ב – מציאת אוכף', points: 15, type: 'java',
            html: `<p>הניחו שהשיטה <code>public static int idxOfMax(int[][] a, int row)</code> נתונה ועומדת לרשותכם. שיטה זו מקבלת מערך דו-ממדי של מספרים שלמים חיוביים (<code>a</code>) ומספר שורה (<code>row</code>) שנמצאת במערך, ומחזירה את אינדקס העמודה של האיבר הגדול ביותר בשורה <code>row</code>. דוגמאות: <code>idxOfMax(a, 2) ==> 1</code> (בשורה 2 הערך הגדול ביותר הוא 4), <code>idxOfMax(a, 3) ==> 0</code> (בשורה 3 הערך הגדול ביותר הוא 8).</p>
<p>השתמשו בשתי השיטות <code>idxOfMax</code> ו-<code>idxOfMin</code> כדי לכתוב שיטה למציאת ערכו של אוכף במערך דו-ממדי. נגדיר <b>אוכף</b> כאיבר שהוא המינימלי בעמודה שלו והמקסימלי בשורה שלו. לדוגמה, במערך <code>a</code> הנתון האיבר שערכו 4, שנמצא בשורה 2 ובעמודה 1, הוא אוכף, כי 4 הוא האיבר הגדול ביותר בשורה 2 והקטן ביותר בעמודה 1.</p>
<p>כתבו את השיטה הסטטית <code>public static int saddleValue(int[][] a)</code> המקבלת מערך דו-ממדי של שלמים חיוביים ומחזירה את ערכו של איבר האוכף הראשון שהיא מוצאת. אם אין במערך אוכף השיטה תחזיר <code>-1</code>. לדוגמה, במערך <code>a</code> הנתון השיטה תחזיר את הערך 4.</p>`,
            starter: `public static int saddleValue(int[][] a) {

}`,
            solution: `public static int saddleValue(int[][] a) {
    for (int row = 0; row < a.length; row++) {
        int col = idxOfMax(a, row);
        if (idxOfMin(a, col) == row) {
            return a[row][col];
        }
    }
    return -1;
}`,
            support: gridJava + `
public static int idxOfMin(int[][] a, int col) { int k = 0; for (int i = 1; i < a.length; i++) if (a[i][col] < a[k][col]) k = i; return k; }
public static int idxOfMax(int[][] a, int row) { int k = 0; for (int j = 1; j < a[row].length; j++) if (a[row][j] > a[row][k]) k = j; return k; }`,
            sourceChecks: [{ label: 'השיטה משתמשת ב-idxOfMax וב-idxOfMin', re: /^(?=[\s\S]*idxOfMax\s*\()(?=[\s\S]*idxOfMin\s*\()/ }],
            tests: [
              ['המערך מהדוגמה', String.raw`T.eq("saddleValue(a)", 4, saddleValue(A));`],
              ['אין אוכף', String.raw`T.eq("saddleValue({{1, 2}, {2, 1}})", -1, saddleValue(new int[][]{{1, 2}, {2, 1}}));`],
              ['אוכף בשורה האחרונה', String.raw`T.eq("saddleValue({{5, 9}, {1, 7}})", 7, saddleValue(new int[][]{{5, 9}, {1, 7}}));`],
              ['איבר יחיד', String.raw`T.eq("saddleValue({{3}})", 3, saddleValue(new int[][]{{3}}));`],
              ['אוכף בשורה הראשונה', String.raw`T.eq("saddleValue({{6, 8, 7}, {9, 10, 12}, {11, 9, 20}})", 8, saddleValue(new int[][]{{6, 8, 7}, {9, 10, 12}, {11, 9, 20}}));`]
            ]
          }
        ]
      },
      {
        num: 4, points: 16, title: 'ניתוח קוד',
        intro: `<p>נתונה השיטה <code>foo(…)</code> הבאה:</p>
<pre class="code numbered">1:  public static boolean foo(String a, int b) {
2:      int c = 0;
3:      int i = 0, j = a.length() - 1;
4:      while (i &lt; j) {
5:          if (a.charAt(i) != a.charAt(j)) {
6:              c++;
7:              if (c &gt; b) {
8:                  return false;
9:              }
10:         }
11:         i++;
12:         j--;
13:     }
14:     return true;
15: }</pre>`,
        parts: [
          {
            id: 'm02-4a', title: 'סעיף א', points: 4, type: 'text',
            html: `<p>מה יהיה הערך המוחזר מהקריאה <code>foo("ABDBCEDFA", 1)</code>?</p>`,
            placeholder: 'true או false',
            check: function (s) { return Checks.exact(Checks.norm(s).toLowerCase(), 'false'); },
            solution: 'false'
          },
          {
            id: 'm02-4b', title: 'סעיף ב', points: 4, type: 'text',
            html: `<p>הערך המוחזר מהקריאה <code>foo("abedefa", b)</code> היה <code>true</code>. מהו ערכו המינימלי של הפרמטר <code>b</code>?</p>`,
            placeholder: 'מספר',
            check: function (s) { return Checks.exact(Checks.norm(s).replace(/^b\s*=+>?\s*/, ''), '1'); },
            solution: '1'
          },
          {
            id: 'm02-4c', title: 'סעיף ג', points: 8, type: 'java',
            html: `<p>הציעו שינוי/תוספת לשיטה כך שהתוצאה המוחזרת לא תושפע מהופעת התו <code>'a'</code> במחרוזת. כל תו <code>'a'</code> צריך להיחשב כאילו הוא לא קיים, כלומר יש לדלג עליו בחישוב. לאחר השינוי, הערך המוחזר עבור כל אחת מהמחרוזות הבאות יהיה זהה:</p>
<pre class="code">"aabcdaadcba", "bcdadcb", "bcddcb", "abcdadcb"</pre>
<p class="note">בתיבה נמצאת השיטה המקורית – שנו בה את מה שצריך. הבדיקה מריצה את השיטה המעודכנת.</p>`,
            starter: `public static boolean foo(String a, int b) {
    int c = 0;
    int i = 0, j = a.length() - 1;
    while (i < j) {
        if (a.charAt(i) != a.charAt(j)) {
            c++;
            if (c > b) {
                return false;
            }
        }
        i++;
        j--;
    }
    return true;
}`,
            solution: `public static boolean foo(String a, int b) {
    int c = 0;
    int i = 0, j = a.length() - 1;
    while (i < j) {
        if (a.charAt(i) == 'a') {          // תוספת: דילוג על 'a' משמאל
            i++;
        } else if (a.charAt(j) == 'a') {   // תוספת: דילוג על 'a' מימין
            j--;
        } else {
            if (a.charAt(i) != a.charAt(j)) {
                c++;
                if (c > b) {
                    return false;
                }
            }
            i++;
            j--;
        }
    }
    return true;
}`,
            tests: [
              ['ארבע המחרוזות מהשאלה', String.raw`String[] s = {"aabcdaadcba", "bcdadcb", "bcddcb", "abcdadcb"};
                for (String x : s) T.eq("foo(\"" + x + "\", 0)", true, foo(x, 0));`],
              ['מחרוזת שאינה פלינדרום', String.raw`T.eq("foo(\"abca\", 0) – כמו \"bc\"", false, foo("abca", 0));
                T.eq("foo(\"xay\", 0)", false, foo("xay", 0));
                T.eq("foo(\"xay\", 1)", true, foo("xay", 1));`],
              ['שתי אי-התאמות', String.raw`T.eq("foo(\"aaxyzwa\", 1) – כמו \"xyzw\"", false, foo("aaxyzwa", 1));
                T.eq("foo(\"aaxyzwa\", 2)", true, foo("aaxyzwa", 2));`],
              ['רק a', String.raw`T.eq("foo(\"aaaa\", 0)", true, foo("aaaa", 0));`],
              ['ללא a – התנהגות מקורית', String.raw`T.eq("foo(\"ABDBCEDFA\", 1)", false, foo("ABDBCEDFA", 1));
                T.eq("foo(\"abedefa\", 1)", true, foo("abedefa", 1));`]
            ]
          }
        ]
      }
    ]
  });
})();
