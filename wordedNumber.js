//Helper functions
function arrDiff(arr1, arr2) {
    if (arr2.length === 0) return arr1; // Fast path
    if (arr2.length === 1) return arr1.filter(item => item !== arr2[0]); // Single item
    if (arr2.length === 2) return arr1.filter(item => item !== arr2[0] && item !== arr2[1]); // Two items
    if (arr2.length === 3) return arr1.filter(item => item !== arr2[0] && item !== arr2[1] && item !== arr2[2]); // Three items
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
}
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

//------------------- POWER SEGMENT START -------------------
//"ni"
const ni  		= { id: "ni", text: "ni",		val: 0,		validNexts: [] };

//"thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"
const thousand    = { id: "thousand", text: "thousand", val: 0, validNexts: [] };
const million     = { id: "million", text: "mi",  val: 1,  validNexts: [] };
const billion     = { id: "billion", text: "bi",  val: 2,  validNexts: [] };
const trillion    = { id: "trillion", text: "tri", val: 3,  validNexts: [] };
const quadrillion = { id: "quadrillion", text: "quadri", val: 4,  validNexts: [] };
const quintillion = { id: "quintillion", text: "quinti", val: 5,  validNexts: [] };
const sextillion  = { id: "sextillion", text: "sexti",  val: 6,  validNexts: [] };
const septillion  = { id: "septillion", text: "septi",  val: 7,  validNexts: [] };
const octillion   = { id: "octillion", text: "octi",   val: 8,  validNexts: [] };
const nonillion   = { id: "nonillion", text: "noni",   val: 9,  validNexts: [] };

//"un", "duo", "tre", "quattuor", "quin", "se", "septe", "octo", "nove"
const un		= { id: "un", text: "un",		val: 1,		validNexts: [] };
const duo		= { id: "duo", text: "duo",	val: 2,		validNexts: [] };
const tre		= { id: "tre", text: "tre",	val: 3,		validNexts: [] };
const quattuor	= { id: "quattuor", text: "quattuor",val: 4,	validNexts: [] };
const quin		= { id: "quin", text: "quin",	val: 5,		validNexts: [] };
const se		= { id: "se", text: "se",		val: 6,		validNexts: [] };
const septe		= { id: "septe", text: "septe",	val: 7,		validNexts: [] };
const octo		= { id: "octo", text: "octo",	val: 8,		validNexts: [] };
const nove		= { id: "nove", text: "nove",	val: 9,		validNexts: [] };

//"deci", "viginti", "triginta", "quadraginta", "quinquaginta", "sexaginta", "septuaginta", "octoginta", "nonaginta"
const deci		    = { id: "deci", text: "deci",   		val: 10,	validNexts: [] };
const viginti		= { id: "viginti", text: "viginti",		val: 20,	validNexts: [] };
const triginta		= { id: "triginta", text: "trigint",		val: 30,	validNexts: [] };
const quadraginta	= { id: "quadraginta", text: "quadragint",	val: 40,	validNexts: [] };
const quinquaginta	= { id: "quinquaginta", text: "quinquagint",	val: 50,	validNexts: [] };
const sexaginta		= { id: "sexaginta", text: "sexagint",		val: 60,	validNexts: [] };
const septuaginta	= { id: "septuaginta", text: "septuagint",	val: 70,	validNexts: [] };
const octoginta		= { id: "octoginta", text: "octogint",		val: 80,	validNexts: [] };
const nonaginta		= { id: "nonaginta", text: "nonagint",		val: 90,	validNexts: [] };

//"centi", "ducenti", "trecenti", "quadringenti", "quingenti", "sescenti", "septingenti", "octingenti", "nongenti"
const centi		    = { id: "centi", text: "centi",  		val: 100,	validNexts: [] };
const ducenti		= { id: "ducenti", text: "ducenti",		val: 200,	validNexts: [] };
const trecenti		= { id: "trecenti", text: "trecenti",		val: 300,	validNexts: [] };
const quadringenti	= { id: "quadringenti", text: "quadringenti",	val: 400,	validNexts: [] };
const quingenti		= { id: "quingenti", text: "quingenti",		val: 500,	validNexts: [] };
const sescenti		= { id: "sescenti", text: "sescenti",		val: 600,	validNexts: [] };
const septingenti	= { id: "septingenti", text: "septingenti",	val: 700,	validNexts: [] };
const octingenti	= { id: "octingenti", text: "octingenti",		val: 800,	validNexts: [] };
const nongenti		= { id: "nongenti", text: "nongenti",		val: 900,	validNexts: [] };

//Flags
const powerPseudoStart	    = { id: "powerPseudoStart", text: "",	val: 0,	validNexts: [] };
const powerStart	    = { id: "powerStart", text: "",	val: 0,	validNexts: [] };
const powerPseudoEnd	= { id: "powerPseudoEnd", text: "lli",	val: 0,	validNexts: [] };
const powerEnd		    = { id: "powerEnd", text: "on",	val: 0,	validNexts: [] };
const powerGetCoeff     = { id: "powerGetCoeff", text: " ", val: 0, validNexts: [] };
//"s", "x", "m", "n"
const sPower	= { id: "sPower", text: "s",	val: 0,	validNexts: [] };
const xPower	= { id: "xPower", text: "x",	val: 0,	validNexts: [] };
const mPower	= { id: "mPower", text: "m",	val: 0,	validNexts: [] };
const nPower	= { id: "nPower", text: "n",	val: 0,	validNexts: [] };
const sPowerTre	= { id: "sPowerTre", text: "s",	val: 0,	validNexts: [] };
const aPower	= { id: "aPower", text: "a",	val: 0,	validNexts: [] };
const iPower	= { id: "iPower", text: "i",	val: 0,	validNexts: [] };
//-------------------- POWER SEGMENT END --------------------

const powerLittles = [million, billion, trillion, quadrillion, quintillion, sextillion, septillion, octillion, nonillion];
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

powerStart.validNexts = [...power1, ...power10, ...power100, ...powerLittles, thousand];
powerPseudoStart.validNexts = [ni, ...power1, ...power10, ...power100, ...powerLittles];
powerPseudoEnd.validNexts = [powerEnd, powerPseudoStart];
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
    power.validNexts = [powerPseudoEnd];
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
const nine_hundred	= { id: "nine_hundred", text: "nine hundred",	val: 900,	validNexts: [] };
const eight_hundred	= { id: "eight_hundred", text: "eight hundred",	val: 800,	validNexts: [] };
const seven_hundred	= { id: "seven_hundred", text: "seven hundred",	val: 700,	validNexts: [] };
const six_hundred	= { id: "six_hundred", text: "six hundred",	val: 600,	validNexts: [] };
const five_hundred	= { id: "five_hundred", text: "five hundred",	val: 500,	validNexts: [] };
const four_hundred	= { id: "four_hundred", text: "four hundred",	val: 400,	validNexts: [] };
const three_hundred	= { id: "three_hundred", text: "three hundred",	val: 300,	validNexts: [] };
const two_hundred	= { id: "two_hundred", text: "two hundred",	val: 200,	validNexts: [] };
const one_hundred	= { id: "one_hundred", text: "one hundred",	val: 100,	validNexts: [] };

//"ninety", "eighty", "seventy", "sixty", "fifty", "forty", "thirty", "twenty"
const ninety       = { id: "ninety", text: "ninety",  val: 90, validNexts: [] };
const eighty       = { id: "eighty", text: "eighty",  val: 80, validNexts: [] };
const seventy      = { id: "seventy", text: "seventy", val: 70, validNexts: [] };
const sixty        = { id: "sixty", text: "sixty",   val: 60, validNexts: [] };
const fifty        = { id: "fifty", text: "fifty",   val: 50, validNexts: [] };
const forty        = { id: "forty", text: "forty",   val: 40, validNexts: [] };
const thirty       = { id: "thirty", text: "thirty",  val: 30, validNexts: [] };
const twenty       = { id: "twenty", text: "twenty",  val: 20, validNexts: [] };

//"nineteen", "eighteen", "seventeen", "sixteen", "fifteen", "fourteen", "thirteen", "twelve", "eleven", "ten"
const nineteen      = { id: "nineteen", text: "nineteen",   val: 19, validNexts: [] };
const eighteen      = { id: "eighteen", text: "eighteen",   val: 18, validNexts: [] };
const seventeen     = { id: "seventeen", text: "seventeen",  val: 17, validNexts: [] };
const sixteen       = { id: "sixteen", text: "sixteen",    val: 16, validNexts: [] };
const fifteen       = { id: "fifteen", text: "fifteen",    val: 15, validNexts: [] };
const fourteen      = { id: "fourteen", text: "fourteen",   val: 14, validNexts: [] };
const thirteen      = { id: "thirteen", text: "thirteen",   val: 13, validNexts: [] };
const twelve        = { id: "twelve", text: "twelve",     val: 12, validNexts: [] };
const eleven        = { id: "eleven", text: "eleven",     val: 11, validNexts: [] };
const ten           = { id: "ten", text: "ten",        val: 10, validNexts: [] };

//"nine", "eight", "seven", "six", "five", "four", "three", "two", "one"
const nine        = { id: "nine", text: "nine",  val: 9, validNexts: [] };
const eight       = { id: "eight", text: "eight", val: 8, validNexts: [] };
const seven       = { id: "seven", text: "seven", val: 7, validNexts: [] };
const six         = { id: "six", text: "six",   val: 6, validNexts: [] };
const five        = { id: "five", text: "five",  val: 5, validNexts: [] };
const four        = { id: "four", text: "four",  val: 4, validNexts: [] };
const three       = { id: "three", text: "three", val: 3, validNexts: [] };
const two         = { id: "two", text: "two",   val: 2, validNexts: [] };
const one         = { id: "one", text: "one",   val: 1, validNexts: [] };

//"zero"
const zero          = { id: "zero", text: "zero",	val: 0,	validNexts: [] };

//Flags
const coeffStart        = { id: "coeffStart", text: "", val: 0, validNexts: [] };
const coeffEnd    = { id: "coeffEnd", text: "", val: 0, validNexts: [] };
const coeffGetPower          = { id: "coeffGetPower", text: " ", val: 0, validNexts: [] };
//" "
const space100   = { id: "space100", text: " ",	val: 0,	validNexts: [] };
const space10    = { id: "space10", text: " ",	val: 0,	validNexts: [] };
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

const integerEnd    = { id: "integerEnd", text: "", val: 0, validNexts: [] };
const integerStart  = { id: "integerStart", text: "", val: 0, validNexts: [] };

zero.validNexts = [integerEnd];
coeffGetPower.validNexts = [powerStart];
powerGetCoeff.validNexts = [coeffStart];

integerStart.validNexts = [coeffStart, zero];
coeffEnd.validNexts = [integerEnd, coeffGetPower];
powerEnd.validNexts = [integerEnd, powerGetCoeff];
thousand.validNexts = [integerEnd, powerGetCoeff];

const allPossibleNexts = [
    // Special flags and control segments
    ni, powerPseudoStart, powerStart, powerPseudoEnd, powerEnd, powerGetCoeff,
    sPower, xPower, mPower, nPower, sPowerTre, aPower, iPower,
    coeffStart, coeffEnd, coeffGetPower, space100, space10,
    integerStart, integerEnd, zero,
    
    // Power segments
    thousand, ...powerLittles, ...power1, ...power10, ...power100,
    
    // Coefficient segments
    ...coeff100, ...coeff10, ...coeffTeens, ...coeff1
]

class WordedNumber {
    constructor(
        segmentHead = integerStart, 
        segments = [integerStart], 
        numberText = "", 
        isTerminated = false, 
        isPowerSegment = false,
        largestPower = Infinity,
        currentPower = 0,
    ) {
        this.segmentHead = segmentHead;
        this.segments = segments;
        this.numberText = numberText + segmentHead.text;
        this.isTerminated = isTerminated;
        this.isPowerSegment = isPowerSegment;
        //Update power tracking
        this.largestPower = largestPower;
        this.currentPower = currentPower;
        if (this.segmentHead === powerStart) {
            this.isPowerSegment = true;
            this.currentPower = 0;
        } else if (this.segmentHead === powerEnd || this.segmentHead === thousand) {
            this.isPowerSegment = false;
            this.largestPower = this.currentPower;
        } else if (this.isPowerSegment) {
            if (this.segmentHead === powerPseudoStart) {
                this.currentPower *= 1000;
            } else {
                this.currentPower += segmentHead.val;
            }
        }
        if (segmentHead === integerEnd) {
            this.isTerminated = true;
        }
        this._validNextsCache = null;
    }
    extend(segment) {
        if (this.isTerminated) {
            return this; // No further extension allowed
        }
        const nextWord = new WordedNumber(
            segment, 
            [...this.segments, segment], 
            this.numberText,
            this.isTerminated,
            this.isPowerSegment,
            this.largestPower,
            this.currentPower);
        if (nextWord.getValidNexts().length === 1) {
            return nextWord.extend(nextWord.getValidNexts()[0]);
        }
        return nextWord;
    }
    getValidNexts() {
        if (this._validNextsCache !== null) {
            return this._validNextsCache;
        }
        let validNexts = this.segmentHead.validNexts;
        if (0 >= this.largestPower) {
            validNexts = arrDiff(validNexts, [coeffGetPower]);
        }
        //Handle descending nature of powers
        if (!this.isPowerSegment) {
            this._validNextsCache = validNexts;
            return validNexts;
        }
        let invalidNexts = [];
        if (this.currentPower * 1000 >= this.largestPower) {
            invalidNexts.push(powerPseudoStart);
        }
        //The smallest "a" implies "centi"
        if (this.currentPower + 100 >= this.largestPower) {
            invalidNexts.push(aPower);
        }
        //The smallest "x" implies octoginta
        if (this.currentPower + 80 >= this.largestPower) {
            invalidNexts.push(xPower);
        }
        //The smallest "m, s" implies viginti
        if (this.currentPower + 20 >= this.largestPower) {
            invalidNexts.push(mPower, sPower, sPowerTre);
        }
        //The smallest "n" implies deci, but we handle that implicitly below
        //Make sure we don't use a power1 when we should be using a powerLittle
        let min10added = 100;
        for (const power of power10) {
            if (!invalidNexts.includes(power) && validNexts.includes(power)) {
                min10added = Math.min(min10added, power.val);
            }
        }
        for (const power of power1) {
            if (power.val + min10added >= this.largestPower - this.currentPower) {
                invalidNexts.push(power);
            }
        }
        for (const next of validNexts) {
            if (next.val + this.currentPower >= this.largestPower) {
                invalidNexts.push(next);
            }
        }
        validNexts = arrDiff(validNexts, invalidNexts);
        this._validNextsCache = validNexts;
        return validNexts;
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.WordedNumber = WordedNumber;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WordedNumber };
}

// For direct script loading, make available globally
if (typeof global !== 'undefined') {
    global.WordedNumber = WordedNumber;
}