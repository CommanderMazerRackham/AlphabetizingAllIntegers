//Helper functions
function arrDiff(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
}
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

//------------------- POWER SEGMENT START -------------------
//"ni"
const ni  		= { text: "ni",		val: 0,		validNexts: [] };

//"thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"
const thousand    = { text: "thousand", val: 0, validNexts: [] };
const million     = { text: "million",  val: 1,  validNexts: [] };
const billion     = { text: "billion",  val: 2,  validNexts: [] };
const trillion    = { text: "trillion", val: 3,  validNexts: [] };
const quadrillion = { text: "quadrillion", val: 4,  validNexts: [] };
const quintillion = { text: "quintillion", val: 5,  validNexts: [] };
const sextillion  = { text: "sextillion",  val: 6,  validNexts: [] };
const septillion  = { text: "septillion",  val: 7,  validNexts: [] };
const octillion   = { text: "octillion",   val: 8,  validNexts: [] };
const nonillion   = { text: "nonillion",   val: 9,  validNexts: [] };

//"un", "duo", "tre", "quattuor", "quin", "se", "septe", "octo", "nove"
const un		= { text: "un",		val: 1,		validNexts: [] };
const duo		= { text: "duo",	val: 2,		validNexts: [] };
const tre		= { text: "tre",	val: 3,		validNexts: [] };
const quattuor	= { text: "quattuor",val: 4,	validNexts: [] };
const quin		= { text: "quin",	val: 5,		validNexts: [] };
const se		= { text: "se",		val: 6,		validNexts: [] };
const septe		= { text: "septe",	val: 7,		validNexts: [] };
const octo		= { text: "octo",	val: 8,		validNexts: [] };
const nove		= { text: "nove",	val: 9,		validNexts: [] };

//"deci", "viginti", "triginta", "quadraginta", "quinquaginta", "sexaginta", "septuaginta", "octoginta", "nonaginta"
const deci		    = { text: "deci",   		val: 10,	validNexts: [] };
const viginti		= { text: "viginti",		val: 20,	validNexts: [] };
const triginta		= { text: "trigint",		val: 30,	validNexts: [] };
const quadraginta	= { text: "quadragint",	val: 40,	validNexts: [] };
const quinquaginta	= { text: "quinquagint",	val: 50,	validNexts: [] };
const sexaginta		= { text: "sexagint",		val: 60,	validNexts: [] };
const septuaginta	= { text: "septuagint",	val: 70,	validNexts: [] };
const octoginta		= { text: "octogint",		val: 80,	validNexts: [] };
const nonaginta		= { text: "nonagint",		val: 90,	validNexts: [] };

//"centi", "ducenti", "trecenti", "quadringenti", "quingenti", "sescenti", "septingenti", "octingenti", "nongenti"
const centi		    = { text: "centi",  		val: 100,	validNexts: [] };
const ducenti		= { text: "ducenti",		val: 200,	validNexts: [] };
const trecenti		= { text: "trecenti",		val: 300,	validNexts: [] };
const quadringenti	= { text: "quadringenti",	val: 400,	validNexts: [] };
const quingenti		= { text: "quingenti",		val: 500,	validNexts: [] };
const sescenti		= { text: "sescenti",		val: 600,	validNexts: [] };
const septingenti	= { text: "septingenti",	val: 700,	validNexts: [] };
const octingenti	= { text: "octingenti",		val: 800,	validNexts: [] };
const nongenti		= { text: "nongenti",		val: 900,	validNexts: [] };

//Flags
const powerStart	    = { text: "",	val: 0,	validNexts: [] };
const powerPseudoEnd	= { text: "lli",	val: 0,	validNexts: [] };
const powerEnd		    = { text: "on",	val: 0,	validNexts: [] };
const powerEndLittles		    = { text: "",	val: 0,	validNexts: [] };
const powerGetCoeff          = { text: " ", val: 0, validNexts: [] };
//"s", "x", "m", "n"
const sPower	= { text: "s",	val: 0,	validNexts: [] };
const xPower	= { text: "x",	val: 0,	validNexts: [] };
const mPower	= { text: "m",	val: 0,	validNexts: [] };
const nPower	= { text: "n",	val: 0,	validNexts: [] };
const sPowerTre	= { text: "s",	val: 0,	validNexts: [] };
const aPower	= { text: "a",	val: 0,	validNexts: [] };
const iPower	= { text: "i",	val: 0,	validNexts: [] };
//-------------------- POWER SEGMENT END --------------------

const powerLittles = [thousand, million, billion, trillion, quadrillion, quintillion, sextillion, septillion, octillion, nonillion];
const power1 = [un, duo, tre, quattuor, quin, se, septe, octo, nove];
const power10 = [deci, viginti, triginta, quadraginta, quinquaginta, sexaginta, septuaginta, octoginta, nonaginta];
const power100 = [centi, ducenti, trecenti, quadringenti, quingenti, sescenti, septingenti, octingenti, nongenti];
const power10n = [deci, triginta, quadraginta, quinquaginta, sexaginta, septuaginta];
const power10m = [viginti, octoginta];
const power10s = [viginti, triginta, quadraginta, quinquaginta];
const power10x = [octoginta];
const power100s = [trecenti, quadringenti, quingenti]
const power100m = [octingenti];
const power100n = [centi, ducenti, trecenti, quadringenti, quingenti, sescenti, septingenti, nongenti];
const power100x = [centi, octingenti];

powerStart.validNexts = [
    ...power1, ...power10, ...power100,
    thousand, million, billion, trillion, quadrillion, quintillion, sextillion, septillion, octillion, nonillion
];
powerPseudoEnd.validNexts = [powerEnd, powerStart, ni];
ni.validNexts = [powerPseudoEnd];

un.validNexts = [...power10, ...power100];
duo.validNexts = [...power10, ...power100];
tre.validNexts = [
    sPowerTre,
    ...arrDiff(arrDiff(power10, power10s), power10x),
    ...arrDiff(arrDiff(power100, power100s), power100x)
];
quattuor.validNexts = [...power10, ...power100];
quin.validNexts = [...power10, ...power100];
se.validNexts = [
    sPower, xPower,
    ...arrDiff(arrDiff(power10, power10s), power10x),
    ...arrDiff(arrDiff(power100, power100s), power100x)
];
septe.validNexts = [
    mPower, nPower,
    ...arrDiff(arrDiff(power10, power10m), power10n),
    ...arrDiff(arrDiff(power100, power100m), power100n)
];
octo.validNexts = [...power10, ...power100];
nove.validNexts = [
    mPower, nPower,
    ...arrDiff(arrDiff(power10, power10m), power10n),
    ...arrDiff(arrDiff(power100, power100m), power100n)
];
sPower.validNexts =         [...power10s, ...power100s];
xPower.validNexts =         [...power10x, ...power100x];
mPower.validNexts =         [...power10m, ...power100m];
nPower.validNexts =         [...power10n, ...power100n];
sPowerTre.validNexts =      [...power10s, ...power100s, ...power10x, ...power100x];
for (const power of powerLittles) {
    power.validNexts = [powerEndLittles];
}
deci.validNexts =           [...power100, powerPseudoEnd];
viginti.validNexts =        [...power100, powerPseudoEnd];
triginta.validNexts =       [aPower, iPower];
quadraginta.validNexts =    [aPower, iPower];
quinquaginta.validNexts =   [aPower, iPower];
sexaginta.validNexts =      [aPower, iPower];
septuaginta.validNexts =    [aPower, iPower];
octoginta.validNexts =      [aPower, iPower];
nonaginta.validNexts =      [aPower, iPower];
aPower.validNexts =         [...power100];
iPower.validNexts =         [powerPseudoEnd];
for (const power of power100) {
    power.validNexts = [powerPseudoEnd];
}

//------------------- COEFFICIENT SEGMENT START -------------------
//"nine hundred", "eight hundred", "seven hundred", "six hundred", "five hundred", "four hundred", "three hundred", "two hundred",
const nine_hundred	= { text: "nine hundred",	val: 900,	validNexts: [] };
const eight_hundred	= { text: "eight hundred",	val: 800,	validNexts: [] };
const seven_hundred	= { text: "seven hundred",	val: 700,	validNexts: [] };
const six_hundred	= { text: "six hundred",	val: 600,	validNexts: [] };
const five_hundred	= { text: "five hundred",	val: 500,	validNexts: [] };
const four_hundred	= { text: "four hundred",	val: 400,	validNexts: [] };
const three_hundred	= { text: "three hundred",	val: 300,	validNexts: [] };
const two_hundred	= { text: "two hundred",	val: 200,	validNexts: [] };
const one_hundred	= { text: "one hundred",	val: 100,	validNexts: [] };

//"ninety", "eighty", "seventy", "sixty", "fifty", "forty", "thirty", "twenty"
const ninety       = { text: "ninety",  val: 90, validNexts: [] };
const eighty       = { text: "eighty",  val: 80, validNexts: [] };
const seventy      = { text: "seventy", val: 70, validNexts: [] };
const sixty        = { text: "sixty",   val: 60, validNexts: [] };
const fifty        = { text: "fifty",   val: 50, validNexts: [] };
const forty        = { text: "forty",   val: 40, validNexts: [] };
const thirty       = { text: "thirty",  val: 30, validNexts: [] };
const twenty       = { text: "twenty",  val: 20, validNexts: [] };

//"nineteen", "eighteen", "seventeen", "sixteen", "fifteen", "fourteen", "thirteen", "twelve", "eleven", "ten"
const nineteen      = { text: "nineteen",   val: 19, validNexts: [] };
const eighteen      = { text: "eighteen",   val: 18, validNexts: [] };
const seventeen     = { text: "seventeen",  val: 17, validNexts: [] };
const sixteen       = { text: "sixteen",    val: 16, validNexts: [] };
const fifteen       = { text: "fifteen",    val: 15, validNexts: [] };
const fourteen      = { text: "fourteen",   val: 14, validNexts: [] };
const thirteen      = { text: "thirteen",   val: 13, validNexts: [] };
const twelve        = { text: "twelve",     val: 12, validNexts: [] };
const eleven        = { text: "eleven",     val: 11, validNexts: [] };
const ten           = { text: "ten",        val: 10, validNexts: [] };

//"nine", "eight", "seven", "six", "five", "four", "three", "two", "one"
const nine        = { text: "nine",  val: 9, validNexts: [] };
const eight       = { text: "eight", val: 8, validNexts: [] };
const seven       = { text: "seven", val: 7, validNexts: [] };
const six         = { text: "six",   val: 6, validNexts: [] };
const five        = { text: "five",  val: 5, validNexts: [] };
const four        = { text: "four",  val: 4, validNexts: [] };
const three       = { text: "three", val: 3, validNexts: [] };
const two         = { text: "two",   val: 2, validNexts: [] };
const one         = { text: "one",   val: 1, validNexts: [] };

//"zero"
const zero          = { text: "zero",	val: 0,	validNexts: [] };

//Flags
const coeffStart        = { text: "", val: 0, validNexts: [] };
const coeffEnd    = { text: "", val: 0, validNexts: [] };
const coeffGetPower          = { text: " ", val: 0, validNexts: [] };
//" "
const space100   = { text: " ",	val: 0,	validNexts: [] };
const space10    = { text: " ",	val: 0,	validNexts: [] };
//-------------------- COEFFICIENT SEGMENT END --------------------

const coeff100 = [one_hundred, two_hundred, three_hundred, four_hundred, five_hundred, six_hundred, seven_hundred, eight_hundred, nine_hundred];
const coeff10 = [ninety, eighty, seventy, sixty, fifty, forty, thirty, twenty];
const coeffTeens = [nineteen, eighteen, seventeen, sixteen, fifteen, fourteen, thirteen, twelve, eleven, ten];
const coeff1 = [nine, eight, seven, six, five, four, three, two, one];

coeffStart.validNexts = [...coeff100, ...coeff10, ...coeffTeens, ...coeff1];
for (const coeff of coeff100) {
    coeff.validNexts = [space100, coeffEnd];
}
space100.validNexts = [...coeff10, ...coeffTeens, ...coeff1];
for (const coeff of coeff10) {
    coeff.validNexts = [space10, coeffEnd];
}
space10.validNexts = [...coeff1];
for (const coeff of coeffTeens) {
    coeff.validNexts = [coeffEnd];
}
for (const coeff of coeff1) {
    coeff.validNexts = [coeffEnd];
}

const integerEnd    = { text: "", val: 0, validNexts: [] };
const integerStart  = { text: "", val: 0, validNexts: [] };

zero.validNexts = [integerEnd];
coeffGetPower.validNexts = [powerStart];
powerGetCoeff.validNexts = [coeffStart];

integerStart.validNexts = [coeffStart, zero];
coeffEnd.validNexts = [integerEnd, coeffGetPower];
powerEnd.validNexts = [integerEnd, powerGetCoeff];
powerEndLittles.validNexts = [integerEnd, powerGetCoeff];

function getTestNumber() {
    numberText = "";
    numberSegment = integerStart;
    while (numberSegment !== integerEnd) {
        numberText += numberSegment.text;
        numberSegment = randElement(numberSegment.validNexts);
    }
    console.log(numberText);
}