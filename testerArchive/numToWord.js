// Conway-Wechsler number system

class NumToWord {
    constructor() {
        this.ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        this.teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
        this.tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        
        this.small_illions = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"];
        this.one_illions = ["", "un", "duo", "tre", "quattuor", "quin", "se", "septe", "octo", "nove"];
        this.ten_illions = ["", "deci", "viginti", "triginta", "quadraginta", "quinquaginta", "sexaginta", "septuaginta", "octoginta", "nonaginta"];
        this.hundred_illions = ["", "centi", "ducenti", "trecenti", "quadringenti", "quingenti", "sescenti", "septingenti", "octingenti", "nongenti"];
        
        this.one_illion_joins = ["", "", "", "", "", "", "sx", "mn", "", "mn"];
        this.ten_illion_joins = ["", "n", "ms", "ns", "ns", "ns", "n", "n", "mx", ""];
        this.hundred_illion_joins = ["", "nx", "n", "ns", "ns", "ns", "n", "n", "mx", ""];
        
        this.vowels = "aeiou";
    }

    convert(s) {
        if (s === "0") return "zero";
        if (!/^\d+$/.test(s)) return "";
        
        while (s.length % 3 !== 0) {
            s = "0" + s;
        }
        
        const prefixes = [];
        for (let i = 0; i < s.length; i += 3) {
            prefixes.push(this.threeDigitNumberToWord(parseInt(s.substring(i, i + 3))));
        }
        
        let word = "";
        for (let i = 0; i < prefixes.length; i++) {
            if (prefixes[i] !== "") {
                word += prefixes[i] + " " + this.threeDigitIllionToWord(prefixes.length - i - 2) + " ";
            }
        }
        return word.trim();
    }

    threeDigitNumberToWord(n) {
        if (n === 0) {
            return "";
        }
        
        let word = "";
        if (this.ones[Math.floor(n / 100)] !== "") {
            word += this.ones[Math.floor(n / 100)] + " hundred";
            n %= 100;
        }
        
        if (n >= 10 && n <= 19) {
            if (word.length > 0) {
                word += " ";
            }
            word += this.teens[n - 10];
        } else {
            if (word.length > 0 && this.tens[Math.floor(n / 10)] !== "") {
                word += " ";
            }
            word += this.tens[Math.floor(n / 10)];
            n %= 10;
            if (word.length > 0 && this.ones[n] !== "") {
                word += " ";
            }
            word += this.ones[n];
        }
        return word;
    }

    // Note: n = -1 returns "", n = 0 returns "thousand"
    threeDigitIllionToWord(n) {
        if (n < 10) return this.small_illions[n + 1];
        if (n >= 1000) {
            let suffix = "nillion";
            if (n % 1000 !== 0) {
                suffix = this.threeDigitIllionToWord(n % 1000);
            }
            return this.threeDigitIllionToWord(Math.floor(n / 1000)).slice(0, -2) + suffix;
        }
        
        let word = "";
        let o = n % 10;
        n = Math.floor(n / 10);
        let t = n % 10;
        n = Math.floor(n / 10);
        let h = n % 10;
        
        word += this.one_illions[o];
        
        for (let c of this.one_illion_joins[o]) {
            if (this.ten_illion_joins[t].includes(c)) {
                word += c;
                break;
            }
        }
        
        if (o === 3 && (this.ten_illion_joins[t].includes("x") || this.ten_illion_joins[t].includes("s"))) {
            word += "s"; // tre -> tres
        }
        
        word += this.ten_illions[t];
        
        if (t === 0) {
            for (let c of this.one_illion_joins[o]) {
                if (this.hundred_illion_joins[h].includes(c)) {
                    word += c;
                    break;
                }
            }
        }
        
        if (t === 0 && o === 3 && (this.hundred_illion_joins[h].includes("x") || this.hundred_illion_joins[h].includes("s"))) {
            word += "s"; // tre -> tres
        }
        
        word += this.hundred_illions[h];
        
        while (this.vowels.includes(word[word.length - 1])) {
            word = word.slice(0, -1);
        }
        
        word += "illion";
        return word;
    }
}

const numToWord = new NumToWord();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.NumToWord = NumToWord;
    window.numToWord = numToWord;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NumToWord, numToWord };
}

// For direct script loading, make available globally
if (typeof global !== 'undefined') {
    global.NumToWord = NumToWord;
    global.numToWord = numToWord;
}
