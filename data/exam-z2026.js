// בחינת גמר 11203 – מועד א, 19.10.2026
(function () {
  var batteryClass = `static class Battery {
    public static final int DEF_CHARGE = 50;
    public static final int MIN_CHARGE = 0;
    public static final int MAX_CHARGE = 100;
    private int _charge; private int _capacity;
    public Battery(int charge, int capacity) { _charge = isValidCharge(charge) ? charge : DEF_CHARGE; _capacity = capacity; }
    public Battery(Battery other) { _charge = other._charge; _capacity = other._capacity; }
    public int getCharge() { return _charge; }
    public int getCapacity() { return _capacity; }
    public boolean equals(Battery other) { return _charge == other._charge && _capacity == other._capacity; }
    public String toString() { return _charge + "% of " + _capacity + "Wh"; }
    public boolean hasMoreCharge(Battery other) { return _charge > other._charge; }
    private boolean isValidCharge(int charge) { return charge >= MIN_CHARGE && charge <= MAX_CHARGE; }
}`;
  var bikeClass = `static class ElectricBike {
    private String _code; private int _km; private Battery _bat;
    public ElectricBike(String code, int km, Battery bat) { _code = code; _km = km; _bat = new Battery(bat); }
    public String getCode() { return _code; }
    public int getKm() { return _km; }
    public Battery getBat() { return new Battery(_bat); }
    public boolean equals(ElectricBike other) { return _code.equals(other._code) && _km == other._km && _bat.equals(other._bat); }
    public boolean preferredForRental(ElectricBike other) { return _bat.hasMoreCharge(other._bat) || (_bat.getCharge() == other._bat.getCharge() && _km < other._km); }
    public String toString() { return _code; }
}`;
  var visitClass = `static class Visit {
    private String _doc; private int _dur;
    public Visit(String doc, int dur) { _doc = doc; _dur = dur; }
    public String getDoc() { return _doc; }
    public int getDur() { return _dur; }
    public boolean equals(Visit other) { return _doc.equals(other._doc) && _dur == other._dur; }
    public String toString() { return _doc + " " + _dur; }
}
static Schedule make(Object... dv) {
    Schedule s = new Schedule(10);
    for (int i = 0; i < dv.length; i += 2) s.add(new Visit((String) dv[i], (Integer) dv[i + 1]));
    return s;
}`;
  var schedHead = `public class Schedule {
    private Visit[] _visits;
    private int _size;

    public Schedule(int maxVisits) {
        _visits = new Visit[maxVisits];
        _size = 0;
    }

    public boolean add(Visit visit) {
        if (_size == _visits.length) return false;
        _visits[_size] = visit;
        _size++;
        return true;
    }
`;
  var fooJs = function (s) {
    var r = '', take = true;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === ' ') take = true;
      else if (take) { r += ch; take = false; }
    }
    return r;
  };

  (window.EXAMS = window.EXAMS || []).push({
    id: 'z2026',
    title: 'בחינת גמר – מועד א 19.10.2026',
    subtitle: '11203 – מבוא למדעי המחשב ו-Java א במסלול תיכון, שאלון 603, מועד 85 (סמסטר 2026ג)',
    intro: 'משך הבחינה: 2.5 שעות. בבחינה 4 שאלות, יש לענות על כל השאלות. חומר עזר: שני ספרי הקורס.',
    questions: [
      {
        num: 1, points: 28, title: 'מערכת השכרת אופניים חשמליים',
        intro: `<p>חברה עירונית מפעילה מערכת להשכרת אופניים חשמליים. במערכת מוגדרות המחלקה <code>ElectricBike</code> המייצגת אופניים חשמליים והמחלקה <code>Battery</code> המייצגת את הסוללה. בשאלה זו עליכם להשלים את המחלקות ותוכנית דמו המדגימה את השימוש במחלקות.</p>`,
        parts: [
          {
            id: 'z2026-1a', title: 'סעיף א – המחלקה Battery', points: 10, type: 'java',
            html: `<p>המחלקה <code>Battery</code> מייצגת סוללה של אופניים חשמליים. לסוללה שתי תכונות: <code>_charge</code> – אחוז הטעינה של הסוללה, ו-<code>_capacity</code> – קיבולת הסוללה ביחידות Wh. אחוז טעינה חוקי הוא מספר בין <code>MIN_CHARGE</code> לבין <code>MAX_CHARGE</code> כולל ערכי הקצה. השלימו את המחלקה לפי ההוראות הבאות:</p>
<ol>
<li>השיטה הפרטית <code>isValidCharge</code> מקבלת אחוז טעינה <code>charge</code> ומחזירה <code>true</code> אם הערך חוקי ו-<code>false</code> אחרת. בבדיקת החוקיות יש להשתמש בקבועים <code>MIN_CHARGE</code> ו-<code>MAX_CHARGE</code>. (3 נק')</li>
<li>הבנאי מקבל ערכים עבור שתי תכונות הסוללה, <code>charge</code> ו-<code>capacity</code>, ומאתחל אותן. עבור התכונה <code>_charge</code>: אם ערך הפרמטר <code>charge</code> חוקי יש להציב אותו בתכונה, אחרת יש להציב את קבוע ברירת המחדל <code>DEF_CHARGE</code>. לבדיקת החוקיות יש להשתמש בשיטה <code>isValidCharge</code> מסעיף 1, גם אם לא מימשתם אותה. (4 נק')</li>
<li>השיטה <code>hasMoreCharge</code> מקבלת כפרמטר סוללה אחרת, <code>other</code>, ומחזירה <code>true</code> אם אחוז הטעינה של הסוללה הנוכחית גבוה מאחוז הטעינה של הסוללה <code>other</code>, ו-<code>false</code> אחרת. (3 נק')</li>
</ol>`,
            starter: `public class Battery {
    public static final int DEF_CHARGE = 50;
    public static final int MIN_CHARGE = 0;
    public static final int MAX_CHARGE = 100;
    private int _charge;
    private int _capacity;

    public Battery(int charge, int capacity) {

        _capacity = capacity;
    }

    public Battery(Battery other) { _charge = other._charge; _capacity = other._capacity; } // copy constructor
    public int getCharge() { return _charge; }
    public int getCapacity() { return _capacity; }

    public boolean hasMoreCharge(Battery other) {

    }

    private boolean isValidCharge(int charge) {

    }
}`,
            solution: `public class Battery {
    public static final int DEF_CHARGE = 50;
    public static final int MIN_CHARGE = 0;
    public static final int MAX_CHARGE = 100;
    private int _charge;
    private int _capacity;

    public Battery(int charge, int capacity) {
        if (isValidCharge(charge)) {
            _charge = charge;
        } else {
            _charge = DEF_CHARGE;
        }
        _capacity = capacity;
    }

    public Battery(Battery other) { _charge = other._charge; _capacity = other._capacity; }
    public int getCharge() { return _charge; }
    public int getCapacity() { return _capacity; }

    public boolean hasMoreCharge(Battery other) {
        return _charge > other._charge;
    }

    private boolean isValidCharge(int charge) {
        return charge >= MIN_CHARGE && charge <= MAX_CHARGE;
    }
}`,
            sourceChecks: [{ label: 'isValidCharge משתמשת בקבועים MIN_CHARGE ו-MAX_CHARGE', re: /isValidCharge\s*\(\s*int\s+\w+\s*\)\s*\{(?=[^}]*MIN_CHARGE)(?=[^}]*MAX_CHARGE)/ }],
            tests: [
              ['isValidCharge', String.raw`Battery b = new Battery(50, 500);
                T.eq("isValidCharge(0) – ערך קצה", true, b.isValidCharge(0));
                T.eq("isValidCharge(100) – ערך קצה", true, b.isValidCharge(100));
                T.eq("isValidCharge(73)", true, b.isValidCharge(73));
                T.eq("isValidCharge(-1)", false, b.isValidCharge(-1));
                T.eq("isValidCharge(101)", false, b.isValidCharge(101));`],
              ['בנאי', String.raw`T.eq("new Battery(80, 500) – טעינה 80", 80, new Battery(80, 500).getCharge());
                T.eq("new Battery(120, 500) – טעינה DEF_CHARGE", Battery.DEF_CHARGE, new Battery(120, 500).getCharge());
                T.eq("new Battery(-3, 500) – טעינה DEF_CHARGE", Battery.DEF_CHARGE, new Battery(-3, 500).getCharge());
                T.eq("new Battery(0, 500) – טעינה 0", 0, new Battery(0, 500).getCharge());
                T.eq("הקיבולת נשמרת", 500, new Battery(80, 500).getCapacity());`],
              ['hasMoreCharge', String.raw`Battery a = new Battery(80, 500), b = new Battery(40, 700), c = new Battery(80, 300);
                T.eq("80% מול 40%", true, a.hasMoreCharge(b));
                T.eq("40% מול 80%", false, b.hasMoreCharge(a));
                T.eq("80% מול 80%", false, a.hasMoreCharge(c));`]
            ]
          },
          {
            id: 'z2026-1b', title: 'סעיף ב – המחלקה ElectricBike', points: 12, type: 'java',
            html: `<p>המחלקה <code>ElectricBike</code> מייצגת אופניים חשמליים. במחלקה הוגדרו התכונות הבאות: קוד זיהוי <code>_code</code>, מספר ק"מ שנסעו עד כה <code>_km</code>, והסוללה <code>_bat</code>. עליכם להשלים את המחלקה לפי ההוראות הבאות. ניתן להשתמש בכל שיטות <code>Battery</code> ללא צורך לממש אותן.</p>
<ol>
<li>השיטה <code>getBat()</code> מחזירה את הסוללה של האופניים. יש להימנע מהצבעה כפולה – aliasing. (3 נק')</li>
<li>השיטה <code>equals(ElectricBike other)</code> מחזירה <code>true</code> כאשר התכונות של האופניים עליהם הופעלה השיטה זהות לתכונות האופניים שהתקבלו כפרמטר (בהשוואות יש להתחשב בסוג התכונה). (4 נק')</li>
<li>השיטה <code>preferredForRental(ElectricBike other)</code> מחזירה <code>true</code> אם עדיף להציע להשכרה את האופניים הנוכחיים על פני האופניים שהתקבלו כפרמטר. זוג אופניים עדיף אם אחוז הטעינה שלו גבוה יותר, ואם אחוז הטעינה שווה – עדיפים האופניים שעברו פחות קילומטרים. (5 נק')</li>
</ol>`,
            starter: `public class ElectricBike {
    private String _code;
    private int _km;
    private Battery _bat;

    public ElectricBike(String code, int km, Battery bat) { _code = code; _km = km; _bat = new Battery(bat); }
    public String getCode() { return _code; }
    public int getKm() { return _km; }

    public Battery getBat() {

    }

    public boolean equals(ElectricBike other) {

    }

    public boolean preferredForRental(ElectricBike other) {

    }

    public String toString() { return _code; }
}`,
            solution: `public class ElectricBike {
    private String _code;
    private int _km;
    private Battery _bat;

    public ElectricBike(String code, int km, Battery bat) { _code = code; _km = km; _bat = new Battery(bat); }
    public String getCode() { return _code; }
    public int getKm() { return _km; }

    public Battery getBat() {
        return new Battery(_bat);
    }

    public boolean equals(ElectricBike other) {
        return _code.equals(other._code) && _km == other._km && _bat.equals(other._bat);
    }

    public boolean preferredForRental(ElectricBike other) {
        if (_bat.getCharge() != other._bat.getCharge()) {
            return _bat.hasMoreCharge(other._bat);
        }
        return _km < other._km;
    }

    public String toString() { return _code; }
}`,
            support: batteryClass,
            tests: [
              ['getBat', String.raw`ElectricBike b = new ElectricBike("EB1", 120, new Battery(80, 500));
                Battery x = b.getBat();
                T.ok("getBat מחזירה סוללה עם אותם ערכים", x != null && x.equals(new Battery(80, 500)), "התקבל " + T.show(x));
                T.ok("getBat נמנעת מ-aliasing", x != b._bat, "הוחזרה הפניה לתכונה");`],
              ['equals', String.raw`ElectricBike b = new ElectricBike("EB1", 120, new Battery(80, 500));
                T.eq("אופניים זהים בערכים", true, b.equals(new ElectricBike(new String("EB1"), 120, new Battery(80, 500))));
                T.eq("קוד שונה", false, b.equals(new ElectricBike("EB2", 120, new Battery(80, 500))));
                T.eq("ק\"מ שונה", false, b.equals(new ElectricBike("EB1", 121, new Battery(80, 500))));
                T.eq("סוללה שונה", false, b.equals(new ElectricBike("EB1", 120, new Battery(79, 500))));`],
              ['preferredForRental', String.raw`ElectricBike hi = new ElectricBike("A", 500, new Battery(90, 500));
                ElectricBike lo = new ElectricBike("B", 10, new Battery(60, 500));
                ElectricBike sameLess = new ElectricBike("C", 100, new Battery(90, 400));
                T.eq("טעינה 90% מול 60% (גם אם נסעו יותר)", true, hi.preferredForRental(lo));
                T.eq("טעינה 60% מול 90%", false, lo.preferredForRental(hi));
                T.eq("טעינה שווה, 100 ק\"מ מול 500 ק\"מ", true, sameLess.preferredForRental(hi));
                T.eq("טעינה שווה, 500 ק\"מ מול 100 ק\"מ", false, hi.preferredForRental(sameLess));
                T.eq("טעינה שווה וק\"מ שווה", false, hi.preferredForRental(new ElectricBike("D", 500, new Battery(90, 300))));`]
            ]
          },
          {
            id: 'z2026-1c', title: 'סעיף ג – דמו BikeDemo', points: 6, type: 'java',
            html: `<p>המחלקה <code>BikeDemo</code> מדמה חלק מפעילותה של החברה. בתחילת התוכנית נוצרו שלוש סוללות ושלושה זוגות אופניים חשמליים <code>b1, b2, b3</code>, ולכל זוג אופניים משויכת אחת הסוללות. ניתן להשתמש בכל השיטות שהוגדרו במחלקות <code>Battery</code> ו-<code>ElectricBike</code>.</p>
<p>זוג אופניים נדרש להטענה דחופה אם אחוז הטעינה של הסוללה שלו נמוך מאחוז הטעינה של סוללת ביקורת <code>referenceBattery</code> שהוגדרה בתוכנית. השלימו את הקוד כך שהמשתנה <code>count</code> יכיל את מספר זוגות האופניים, מבין <code>b1, b2</code> ו-<code>b3</code>, שנדרשים להטענה דחופה. בבדיקה יש להשתמש בשיטה <code>hasMoreCharge</code> של המחלקה <code>Battery</code>. (6 נק')</p>
<pre class="code">// Create batteries
Battery bat1 = new Battery(...);  Battery bat2 = new Battery(...);  Battery bat3 = new Battery(...);
// Create bikes
ElectricBike b1 = new ElectricBike(..., bat1);
ElectricBike b2 = new ElectricBike(..., bat2);
ElectricBike b3 = new ElectricBike(..., bat3);
Battery referenceBattery = new Battery(. . .);
int count = 0;
<b>... הקוד שלכם ...</b>
System.out.println("Bikes requiring urgent charging: " + count);</pre>
<p class="note">בתיבה כתבו רק את החלק שמחשב את <code>count</code>. הבדיקה מריצה אותו עם אופניים וסוללות שונים.</p>`,
            wrap: `static int countUrgent(ElectricBike b1, ElectricBike b2, ElectricBike b3, Battery referenceBattery) {
int count = 0;
%%CODE%%
return count;
}`,
            starter: `// int count = 0;  (כבר מוגדר)
`,
            solution: `if (referenceBattery.hasMoreCharge(b1.getBat())) {
    count++;
}
if (referenceBattery.hasMoreCharge(b2.getBat())) {
    count++;
}
if (referenceBattery.hasMoreCharge(b3.getBat())) {
    count++;
}`,
            support: batteryClass + '\n' + bikeClass + `
static void check(int c1, int c2, int c3, int ref, int expect) {
    int got = countUrgent(new ElectricBike("b1", 10, new Battery(c1, 500)), new ElectricBike("b2", 20, new Battery(c2, 500)),
                          new ElectricBike("b3", 30, new Battery(c3, 500)), new Battery(ref, 500));
    T.eq("טעינות " + c1 + "%, " + c2 + "%, " + c3 + "% מול ביקורת " + ref + "%", expect, got);
}`,
            sourceChecks: [{ label: 'הקוד משתמש בשיטה hasMoreCharge', re: /hasMoreCharge\s*\(/ }],
            tests: [
              ['שניים דורשים הטענה', String.raw`check(20, 80, 30, 50, 2);`],
              ['אף אחד', String.raw`check(60, 70, 90, 50, 0);`],
              ['כולם', String.raw`check(10, 20, 30, 40, 3);`],
              ['טעינה שווה לביקורת אינה דחופה', String.raw`check(50, 50, 49, 50, 1);`]
            ]
          }
        ]
      },
      {
        num: 2, points: 26, title: 'מערך חד-ממדי – עומס בחניון',
        intro: `<p>בחניון עירוני סופרים פעם בשעה את מספר המכוניות הנמצאות בחניון. תוצאות הספירה נשמרות במערך של מספרים שלמים, לפי סדר השעות. לדוגמה, המערך <code>cars</code> מציין את ספירת המכוניות בחניון:</p>
<pre class="code">int[] cars = {32, 50, 55, 57, 41, 60, 63, 48, 20};</pre>
<p>בשעה הראשונה היו בחניון 32 מכוניות, בשעה השנייה 50 מכוניות, בשעה השלישית 55 מכוניות, וכך הלאה.</p>`,
        parts: [
          {
            id: 'z2026-2a', title: 'סעיף א – אורך רצף עומס', points: 12, type: 'java',
            html: `<p>כתבו את השיטה הסטטית <code>public static int busyRunLength(int[] cars, int stIdx, int minCars)</code> המקבלת מערך של כמות המכוניות <code>cars</code>, אינדקס התחלתי <code>stIdx</code> ומספר מינימלי של מכוניות <code>minCars</code>. ניתן להניח ש-<code>stIdx</code> הוא אינדקס חוקי במערך. השיטה מחזירה את מספר השעות הרצופות, החל בשעה שנמצאת באינדקס <code>stIdx</code>, שבהן מספר המכוניות בחניון היה גדול או שווה ל-<code>minCars</code>. אם כבר בשעה שבאינדקס <code>stIdx</code> מספר המכוניות היה קטן מ-<code>minCars</code>, השיטה תחזיר 0. דוגמאות עבור המערך <code>cars</code>:</p>
<ol>
<li><code>busyRunLength(cars, 1, 50) ==> 3</code> – כי החל מאינדקס 1 מתחיל רצף של 3 ספירות (50 55 57) שבחניון יש לפחות 50 מכוניות</li>
<li><code>busyRunLength(cars, 4, 45) ==> 0</code> – כי באינדקס 4 יש 41 מכוניות, שזה פחות מ-45 מכוניות</li>
<li><code>busyRunLength(cars, 5, 53) ==> 2</code> – כי החל מאינדקס 5 מתחיל רצף של 2 ספירות (60 63) שבחניון יש לפחות 53 מכוניות</li>
</ol>`,
            starter: `public static int busyRunLength(int[] cars, int stIdx, int minCars) {

}`,
            solution: `public static int busyRunLength(int[] cars, int stIdx, int minCars) {
    int len = 0;
    for (int i = stIdx; i < cars.length && cars[i] >= minCars; i++) {
        len++;
    }
    return len;
}`,
            support: `static final int[] CARS = {32, 50, 55, 57, 41, 60, 63, 48, 20};`,
            tests: [
              ['דוגמה 1', String.raw`T.eq("busyRunLength(cars, 1, 50)", 3, busyRunLength(CARS, 1, 50));`],
              ['דוגמה 2', String.raw`T.eq("busyRunLength(cars, 4, 45)", 0, busyRunLength(CARS, 4, 45));`],
              ['דוגמה 3', String.raw`T.eq("busyRunLength(cars, 5, 53)", 2, busyRunLength(CARS, 5, 53));`],
              ['רצף עד סוף המערך', String.raw`T.eq("busyRunLength(cars, 0, 10)", 9, busyRunLength(CARS, 0, 10));`],
              ['האיבר האחרון', String.raw`T.eq("busyRunLength(cars, 8, 20)", 1, busyRunLength(CARS, 8, 20));`],
              ['שווה בדיוק ל-minCars', String.raw`T.eq("busyRunLength(cars, 6, 48)", 2, busyRunLength(CARS, 6, 48));`]
            ]
          },
          {
            id: 'z2026-2b', title: 'סעיף ב – תחילת רצף העומס הארוך ביותר', points: 14, type: 'java',
            html: `<p>כתבו את השיטה הסטטית <code>public static int longestBusyRunIdx(int[] cars, int minCars)</code> המקבלת מערך של כמות המכוניות <code>cars</code> ומספר מינימלי של מכוניות <code>minCars</code>. השיטה מחזירה את האינדקס של השעה שבה מתחיל הרצף הארוך ביותר של שעות שבהן מספר המכוניות בחניון הוא לפחות (גדול או שווה ל-) <code>minCars</code>. אם יש יותר מרצף אחד כזה, יש להחזיר את האינדקס של הרצף הראשון. אם אין במערך אף שעה שבה מספר המכוניות הוא לפחות <code>minCars</code>, השיטה תחזיר <code>-1</code>. במימוש השיטה יש להשתמש בשיטה <code>busyRunLength</code> מסעיף א, גם אם לא מימשתם אותה. דוגמאות:</p>
<ol>
<li><code>cars1 = {35, 40, 30, 19, 36, 42, 47, 25}</code><br><code>longestBusyRunIdx(cars1, 35) ==> 4</code> – באינדקס 4 מתחיל הרצף הארוך ביותר (אורך 3) של לפחות 35 מכוניות. גם באינדקס 0 מתחיל רצף כזה, אבל הוא קצר יותר (אורך 2).</li>
<li><code>cars2 = {12, 28, 31, 15, 33, 36, 20}</code><br><code>longestBusyRunIdx(cars2, 25) ==> 1</code> – באינדקס 1 וגם באינדקס 4 מתחיל רצף באורך 2. מוחזר 1 כי בו מתחיל הרצף הראשון.</li>
<li><code>cars3 = {14, 19, 23, 17, 21}</code><br><code>longestBusyRunIdx(cars3, 30) ==> -1</code> – אין אפילו ספירה אחת בה היו לפחות 30 מכוניות.</li>
<li><code>cars4 = { }</code><br><code>longestBusyRunIdx(cars4, 17) ==> -1</code> – המערך ריק.</li>
</ol>`,
            starter: `public static int longestBusyRunIdx(int[] cars, int minCars) {

}`,
            solution: `public static int longestBusyRunIdx(int[] cars, int minCars) {
    int bestIdx = -1;
    int bestLen = 0;
    for (int i = 0; i < cars.length; i++) {
        int len = busyRunLength(cars, i, minCars);
        if (len > bestLen) {
            bestLen = len;
            bestIdx = i;
        }
    }
    return bestIdx;
}`,
            support: `public static int busyRunLength(int[] cars, int stIdx, int minCars) {
    int len = 0;
    for (int i = stIdx; i < cars.length && cars[i] >= minCars; i++) len++;
    return len;
}`,
            sourceChecks: [{ label: 'השיטה משתמשת ב-busyRunLength', re: /busyRunLength\s*\(/ }],
            tests: [
              ['דוגמה 1', String.raw`T.eq("longestBusyRunIdx(cars1, 35)", 4, longestBusyRunIdx(new int[]{35, 40, 30, 19, 36, 42, 47, 25}, 35));`],
              ['דוגמה 2 – שני רצפים שווים', String.raw`T.eq("longestBusyRunIdx(cars2, 25)", 1, longestBusyRunIdx(new int[]{12, 28, 31, 15, 33, 36, 20}, 25));`],
              ['דוגמה 3 – אין רצף', String.raw`T.eq("longestBusyRunIdx(cars3, 30)", -1, longestBusyRunIdx(new int[]{14, 19, 23, 17, 21}, 30));`],
              ['דוגמה 4 – מערך ריק', String.raw`T.eq("longestBusyRunIdx({}, 17)", -1, longestBusyRunIdx(new int[]{}, 17));`],
              ['רצף בסוף', String.raw`T.eq("longestBusyRunIdx({5, 60, 1, 70, 80, 90}, 50)", 3, longestBusyRunIdx(new int[]{5, 60, 1, 70, 80, 90}, 50));`],
              ['כל המערך', String.raw`T.eq("longestBusyRunIdx({40, 41, 42}, 40)", 0, longestBusyRunIdx(new int[]{40, 41, 42}, 40));`]
            ]
          }
        ]
      },
      {
        num: 3, points: 30, title: 'מערך של תורים במרפאה',
        intro: `<p>נתונה המחלקה <code>Visit</code> המייצגת תור במרפאה. לכל תור שתי תכונות: שם הרופא <code>_doc</code> ואורך התור בדקות <code>_dur</code>.</p>
<pre class="code">public class Visit {
    private String _doc;
    private int _dur;
    public Visit(String doc, int dur) { ... }
    public String getDoc() { ... }
    public int getDur() { ... }
    public boolean equals(Visit other) { ... }
    public String toString() { ... }
}</pre>
<p>כמו כן נתונה התחלה של המחלקה <code>Schedule</code> שתפקידה לנהל את התורים. למחלקה שתי תכונות: <code>_visits</code> – מערך של תורים, ו-<code>_size</code> שמציין את מספר התורים שנמצאים בפועל במערך. התורים נשמרים במערך מתחילתו ברצף ללא "חורים", ואין חשיבות לסדר התורים במערך.</p>`,
        parts: [
          {
            id: 'z2026-3a', title: 'סעיף א – מספר התורים לפי שם רופא', points: 7, type: 'java',
            html: `<p>השלימו את השיטה <code>public int countVisits(String doc)</code> המקבלת שם של רופא <code>doc</code> ומחזירה את מספר התורים שיש לו במערך.</p>`,
            starter: schedHead + `
    public int countVisits(String doc) {

    }
}`,
            solution: schedHead + `
    public int countVisits(String doc) {
        int count = 0;
        for (int i = 0; i < _size; i++) {
            if (_visits[i].getDoc().equals(doc)) {
                count++;
            }
        }
        return count;
    }
}`,
            support: visitClass,
            tests: [
              ['ספירה', String.raw`Schedule s = make("Cohen", 15, "Levi", 30, "Cohen", 20, "Mizrahi", 10, "Cohen", 5);
                T.eq("countVisits(\"Cohen\")", 3, s.countVisits("Cohen"));
                T.eq("countVisits(\"Levi\")", 1, s.countVisits("Levi"));
                T.eq("countVisits(\"Katz\")", 0, s.countVisits("Katz"));
                T.eq("countVisits(new String(\"Mizrahi\"))", 1, s.countVisits(new String("Mizrahi")));`],
              ['מערך ריק', String.raw`T.eq("countVisits ביומן ריק", 0, new Schedule(5).countVisits("Cohen"));`]
            ]
          },
          {
            id: 'z2026-3b', title: 'סעיף ב – מחיקת תור', points: 10, type: 'java',
            html: `<p>השלימו את השיטה <code>public boolean removeVisit(Visit visit)</code> המקבלת תור <code>visit</code> ומוציאה מהמערך את התור הראשון שזהה לו. השיטה מחזירה <code>true</code> אם נמצא תור זהה והוצא מהמערך, ו-<code>false</code> אם לא נמצא במערך תור זהה. על המערך להישאר ללא "חורים" גם לאחר הוצאת התור המבוקש. למציאת התור ניתן להשתמש בשיטה <code>equals</code> של המחלקה <code>Visit</code>.</p>`,
            starter: schedHead + `
    public boolean removeVisit(Visit visit) {

    }
}`,
            solution: schedHead + `
    public boolean removeVisit(Visit visit) {
        for (int i = 0; i < _size; i++) {
            if (_visits[i].equals(visit)) {
                _visits[i] = _visits[_size - 1]; // אין חשיבות לסדר
                _visits[_size - 1] = null;
                _size--;
                return true;
            }
        }
        return false;
    }
}`,
            support: visitClass + `
static String content(Schedule s) {
    String[] n = new String[s._size];
    for (int i = 0; i < s._size; i++) n[i] = String.valueOf(s._visits[i]);
    java.util.Arrays.sort(n);
    return java.util.Arrays.toString(n);
}`,
            tests: [
              ['הוצאת תור קיים', String.raw`Schedule s = make("Cohen", 15, "Levi", 30, "Cohen", 20);
                T.eq("removeVisit(Levi 30) מחזירה true", true, s.removeVisit(new Visit("Levi", 30)));
                T.eq("_size ירד ל-2", 2, s._size);
                T.eq("התורים שנשארו ברצף", "[Cohen 15, Cohen 20]", content(s));`],
              ['תור כפול – מוצא רק אחד', String.raw`Schedule s = make("Cohen", 15, "Levi", 30, "Cohen", 15);
                s.removeVisit(new Visit("Cohen", 15));
                T.eq("נשאר תור Cohen 15 אחד", "[Cohen 15, Levi 30]", content(s));`],
              ['תור שלא קיים', String.raw`Schedule s = make("Cohen", 15, "Levi", 30);
                T.eq("removeVisit(Cohen 30) מחזירה false", false, s.removeVisit(new Visit("Cohen", 30)));
                T.eq("_size לא השתנה", 2, s._size);`],
              ['התור האחרון', String.raw`Schedule s = make("Cohen", 15, "Levi", 30);
                T.eq("removeVisit(Levi 30)", true, s.removeVisit(new Visit("Levi", 30)));
                T.eq("נשאר Cohen 15", "[Cohen 15]", content(s));`],
              ['יומן ריק', String.raw`T.eq("removeVisit ביומן ריק", false, new Schedule(3).removeVisit(new Visit("Cohen", 15)));`]
            ]
          },
          {
            id: 'z2026-3c', title: 'סעיף ג – הרופא העמוס ביותר', points: 13, type: 'java',
            html: `<p>השלימו את השיטה <code>public String busiestDoc()</code> המחזירה את שם הרופא העסוק ביותר. הרופא העסוק ביותר הוא זה שסכום אורכי כל התורים שלו הוא הגדול ביותר (סה"כ הדקות של כל התורים שלו הוא הגדול ביותר). אם יש יותר מרופא אחד כזה, יוחזר השם הראשון שנמצא. ניתן להניח שיש לפחות תור אחד במערך.</p>`,
            starter: schedHead + `
    public String busiestDoc() {

    }
}`,
            solution: schedHead + `
    public String busiestDoc() {
        String best = _visits[0].getDoc();
        int bestSum = 0;
        for (int i = 0; i < _size; i++) {
            int sum = 0;
            for (int j = 0; j < _size; j++) {
                if (_visits[j].getDoc().equals(_visits[i].getDoc())) {
                    sum += _visits[j].getDur();
                }
            }
            if (sum > bestSum) {
                bestSum = sum;
                best = _visits[i].getDoc();
            }
        }
        return best;
    }
}`,
            support: visitClass,
            tests: [
              ['סכום ולא מספר תורים', String.raw`T.eq("Cohen 15+20+5=40, Levi 45 → Levi", "Levi", make("Cohen", 15, "Levi", 45, "Cohen", 20, "Mizrahi", 10, "Cohen", 5).busiestDoc());`],
              ['הרבה תורים קצרים', String.raw`T.eq("Cohen 15+20+25=60, Levi 45 → Cohen", "Cohen", make("Cohen", 15, "Levi", 45, "Cohen", 20, "Cohen", 25).busiestDoc());`],
              ['שוויון – הראשון', String.raw`T.eq("Katz 30, Levi 30 → Katz", "Katz", make("Katz", 10, "Levi", 30, "Katz", 20).busiestDoc());`],
              ['תור יחיד', String.raw`T.eq("תור יחיד", "Cohen", make("Cohen", 15).busiestDoc());`],
              ['שם משווה לפי ערך', String.raw`Schedule s = new Schedule(5);
                s.add(new Visit(new String("Amar"), 10)); s.add(new Visit("Levi", 15)); s.add(new Visit(new String("Amar"), 10));
                T.eq("Amar 10+10 (מחרוזות נפרדות), Levi 15 → Amar", "Amar", s.busiestDoc());`]
            ]
          }
        ]
      },
      {
        num: 4, points: 16, title: 'ניתוח קוד',
        intro: `<p>נתונה השיטה <code>foo(…)</code> הבאה:</p>
<pre class="code numbered">1.  public static String foo(String s) {
2.      String result = "";
3.      boolean take = true;
4.
5.      for (int i = 0; i &lt; s.length(); i++) {
6.          char ch = s.charAt(i);
7.
8.          if (ch == ' ') {
9.              take = true;
10.         } else if (take) {
11.             result += ch;
12.             take = false;
13.         }
14.     }
15.
16.     return result;
17. }</pre>`,
        parts: [
          {
            id: 'z2026-4a', title: 'סעיף א', points: 5, type: 'text',
            html: `<p>מה תהיה ההדפסה שתתקבל מהרצת הפקודה הבאה?</p><pre class="code">System.out.println(foo("Red Green Blue"));</pre>`,
            placeholder: 'כתבו כאן את הפלט',
            check: function (s) { return Checks.exact(s, 'RGB'); },
            solution: 'RGB'
          },
          {
            id: 'z2026-4b', title: 'סעיף ב', points: 5, type: 'text',
            html: `<p>לאחר הרצת הפקודה הבאה התקבל הפלט <code>JshT</code>. כתבו מחרוזת קלט אפשרית שהעברתה כפרמטר לשיטה תגרום לקבלת הפלט הנתון. ישנן אפשרויות רבות.</p><pre class="code">System.out.println(foo("________"));</pre>`,
            placeholder: 'כתבו כאן מחרוזת קלט',
            check: function (s) {
              // כאן לא מסירים רווחים מההתחלה והסוף – הם משמעותיים
              var raw = String(s == null ? '' : s).replace(/\r|\n/g, '');
              var m = /^\s*["“”](.*)["“”]\s*$/.exec(raw);
              if (m) raw = m[1];
              if (!raw.trim()) return { ok: false, msg: 'לא נכתבה תשובה.' };
              var got = fooJs(raw);
              if (got === 'JshT') return { ok: true, msg: 'נכון! עבור הקלט "' + raw + '" השיטה מחזירה "JshT".' };
              return { ok: false, msg: 'לא נכון. עבור הקלט "' + raw + '" השיטה מחזירה "' + got + '".' };
            },
            solution: 'Java sharp has Tests  (כל מחרוזת עם ארבע מילים שמתחילות ב-J, s, h, T)'
            , testAnswer: 'Java sharp has Tests'
          },
          {
            id: 'z2026-4c', title: 'סעיף ג – שדרוג השיטה', points: 6, type: 'java',
            html: `<p>הציעו שינויים או תוספות לשיטה <code>foo</code> כך שתתקבל השיטה <code>public static String fooDots(String s)</code>. השיטה החדשה תפעל באותו אופן, אך תוסיף נקודה בין כל שתי אותיות בפלט. לדוגמה, אם <code>foo</code> מחזירה <code>JSP</code> עבור מחרוזת כלשהי <code>s</code>, אז <code>fooDots</code> תחזיר עבור אותה מחרוזת את הפלט <code>J.S.P</code>:</p>
<pre class="code">foo(s)     ==> "JSP"
fooDots(s) ==> "J.S.P"</pre>
<p>עבור כל שינוי או תוספת ציינו את מספר השורה ואת הקוד שיש להוסיף או לשנות.</p>
<p class="note">בתיבה נמצאת השיטה המקורית בשם <code>fooDots</code> – שנו בה את מה שצריך.</p>`,
            starter: `public static String fooDots(String s) {
    String result = "";
    boolean take = true;

    for (int i = 0; i < s.length(); i++) {
        char ch = s.charAt(i);

        if (ch == ' ') {
            take = true;
        } else if (take) {
            result += ch;
            take = false;
        }
    }

    return result;
}`,
            solution: `public static String fooDots(String s) {
    String result = "";
    boolean take = true;

    for (int i = 0; i < s.length(); i++) {
        char ch = s.charAt(i);

        if (ch == ' ') {
            take = true;
        } else if (take) {
            if (result.length() > 0) {   // תוספת אחרי שורה 10
                result += '.';
            }
            result += ch;
            take = false;
        }
    }

    return result;
}`,
            tests: [
              ['Red Green Blue', String.raw`T.eq("fooDots(\"Red Green Blue\")", "R.G.B", fooDots("Red Green Blue"));`],
              ['מילה אחת', String.raw`T.eq("fooDots(\"Java\")", "J", fooDots("Java"));`],
              ['רווחים כפולים', String.raw`T.eq("fooDots(\"  Java   Server  Pages \")", "J.S.P", fooDots("  Java   Server  Pages "));`],
              ['מחרוזת ריקה', String.raw`T.eq("fooDots(\"\")", "", fooDots(""));`],
              ['רק רווחים', String.raw`T.eq("fooDots(\"   \")", "", fooDots("   "));`]
            ]
          }
        ]
      }
    ]
  });
})();
