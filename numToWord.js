// Conway-Wechsler number system

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function numToWord(s) {
    if (s === "0") return "zero";
    if (!/^\d+$/.test(s)) return "";
    
    while (s.length % 3 !== 0) {
        s = "0" + s;
    }
    
    const prefixes = [];
    for (let i = 0; i < s.length; i += 3) {
        prefixes.push(threeDigitNumberToWord(parseInt(s.substring(i, i + 3))));
    }
    
    let word = "";
    for (let i = 0; i < prefixes.length; i++) {
        if (prefixes[i] !== "") {
            word += prefixes[i] + " " + threeDigitIllionToWord(prefixes.length - i - 2) + " ";
        }
    }
    return word.trim();
}

function threeDigitNumberToWord(n) {
    if (n === 0) {
        return "";
    }
    
    let word = "";
    if (ones[Math.floor(n / 100)] !== "") {
        word += ones[Math.floor(n / 100)] + " hundred";
        n %= 100;
    }
    
    if (n >= 10 && n <= 19) {
        if (word.length > 0) {
            word += " ";
        }
        word += teens[n - 10];
    } else {
        if (word.length > 0 && tens[Math.floor(n / 10)] !== "") {
            word += " ";
        }
        word += tens[Math.floor(n / 10)];
        n %= 10;
        if (word.length > 0 && ones[n] !== "") {
            word += " ";
        }
        word += ones[n];
    }
    return word;
}

const small_illions = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"];
const one_illions = ["", "un", "duo", "tre", "quattuor", "quin", "se", "septe", "octo", "nove"];
const ten_illions = ["", "deci", "viginti", "triginta", "quadraginta", "quinquaginta", "sexaginta", "septuaginta", "octoginta", "nonaginta"];
const hundred_illions = ["", "centi", "ducenti", "trecenti", "quadringenti", "quingenti", "sescenti", "septingenti", "octingenti", "nongenti"];

const one_illion_joins = ["", "", "", "", "", "", "sx", "mn", "", "mn"];
const ten_illion_joins = ["", "n", "ms", "ns", "ns", "ns", "n", "n", "mx", ""];
const hundred_illion_joins = ["", "nx", "n", "ns", "ns", "ns", "n", "n", "mx", ""];

const vowels = "aeiou";

// Note: n = -1 returns "", n = 0 returns "thousand"
function threeDigitIllionToWord(n) {
    if (n < 10) return small_illions[n + 1];
    if (n >= 1000) {
        let suffix = "nillion";
        if (n % 1000 !== 0) {
            suffix = threeDigitIllionToWord(n % 1000);
        }
        return threeDigitIllionToWord(Math.floor(n / 1000)).slice(0, -2) + suffix;
    }
    
    let word = "";
    let o = n % 10;
    n = Math.floor(n / 10);
    let t = n % 10;
    n = Math.floor(n / 10);
    let h = n % 10;
    
    word += one_illions[o];
    
    for (let c of one_illion_joins[o]) {
        if (ten_illion_joins[t].includes(c)) {
            word += c;
            break;
        }
    }
    
    if (o === 3 && (ten_illion_joins[t].includes("x") || ten_illion_joins[t].includes("s"))) {
        word += "s"; // tre -> tres
    }
    
    word += ten_illions[t];
    
    if (t === 0) {
        for (let c of one_illion_joins[o]) {
            if (hundred_illion_joins[h].includes(c)) {
                word += c;
                break;
            }
        }
    }
    
    if (t === 0 && o === 3 && (hundred_illion_joins[h].includes("x") || hundred_illion_joins[h].includes("s"))) {
        word += "s"; // tre -> tres
    }
    
    word += hundred_illions[h];
    
    while (vowels.includes(word[word.length - 1])) {
        word = word.slice(0, -1);
    }
    
    word += "illion";
    return word;
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        numToWord
    };
}