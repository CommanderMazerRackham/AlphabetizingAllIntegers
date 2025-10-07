const canvas = document.getElementById('alphabetizerCanvas');

const txtColor = "#FF8C28";
const bkgColor = "#0C0C0C";

// Remove default page margins/padding and prevent scrollbars
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';
canvas.style.display = 'block';
canvas.style.margin = '0';
canvas.style.padding = '0';

// Get the 2D context for drawing
const ctx = canvas.getContext('2d');
// Set canvas dimensions to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update canvas size when window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calcViewDependentVars();
    draw();
});
function fillBackground() {
    ctx.fillStyle = bkgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let trueTop = new Decimal(0);
let trueBottom = new Decimal(1);
const minPixelHeight = 0.5;
let minCoordHeight = new Decimal(0);
const strictness = 0.08; //0.8 seems to be good
function calcViewDependentVars() {
    const denominator = trueBottom.minus(trueTop);
    minCoordHeight = denominator.times(minPixelHeight).div(canvas.height);
    Decimal.set({ precision: Math.ceil(strictness * canvas.width / minPixelHeight) });
}
calcViewDependentVars();

function drawLeftAlignedText(text, topHeight, bottomHeight, leftMargin = 0, fontFamily = "monospace", color = txtColor) {
    if (bottomHeight.minus(topHeight).lessThan(minCoordHeight)) {
        return; // Too small to draw
    }
    const denominator = trueBottom.minus(trueTop);
    const topPixel = canvas.height * (topHeight.minus(trueTop).div(denominator).toNumber());
    const bottomPixel = canvas.height * (bottomHeight.minus(trueTop).div(denominator).toNumber());
    const availableHeight = bottomPixel - topPixel;
    if (availableHeight <= minPixelHeight)  {
        console.error("Redundant check failed");
        return; // Too small to draw (should be redundant due to earlier check)
    }
    let fontSize = availableHeight;
    let font = `${fontSize}px ${fontFamily}`;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const metrics = ctx.measureText(text);
    let actualHeight = fontSize;
    if (metrics.fontBoundingBoxAscent !== undefined && metrics.fontBoundingBoxDescent !== undefined) {
        actualHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }
    if (actualHeight !== availableHeight) {
        fontSize = (fontSize * availableHeight) / actualHeight;
        font = `${fontSize}px ${fontFamily}`;
        ctx.font = font;
    }
    ctx.fillText(text, leftMargin, topPixel);
}
const base = 25;
const letters = " abcdefghilmnopqrstuvwxyz";
const letterRank = {
    " ": 0, "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8, "i": 9, "l": 10, 
    "m": 11, "n": 12, "o": 13, "p": 14, "q": 15, "r": 16, "s": 17, "t": 18, "u": 19, "v": 20, 
    "w": 21, "x": 22, "y": 23, "z": 24
}
const basePow = [new Decimal(1)]; 
const digitDict = [[]];
//NOTE: Indexing is a bit weird here, because we want 1/base to be at position 1, not position 0
function getBasePower(position) {
    while (basePow.length <= position) {
        basePow.push(basePow[basePow.length - 1].div(base));
    }
    return basePow[position];
}
function getDigit(letter, position) {
    while (basePow.length <= position) {
        digitDict.push([]);
        for (let i = 0; i < base; i++) {
            digitDict[digitDict.length - 1].push(getBasePower(digitDict.length - 1).times(i));
        }
    }
    return digitDict[position][letterRank[letter] || 0];
}
// function getCoord(word) {
//     let coord = new Decimal(0);
//     for (let i = 0; i < word.length; i++) {
//         coord = coord.plus(getDigit(word[i].toLowerCase(), i+1));
//     }
//     return coord;
// }
function extendWord(wordNumber, segment) {
    const extendedWord = wordNumber.extend(segment);
    let newCoord = wordNumber.coord;
    for (let i = 0; i < segment.text.length; i++) {
        newCoord = newCoord.plus(getDigit(segment.text[i], wordNumber.numberText.length + i + 1));
    }
    extendedWord.coord = newCoord;
    return extendedWord;
}
function getAllExtensions(wordNumber) {
    const extensions = [];
    for (const segment of wordNumber.getValidNexts()) {
        if (segment.text === "") {
            const blankExtension = getAllExtensions(extendWord(wordNumber, segment));
            for (let i = 0; i < blankExtension.length; i++) {
                extensions.push(blankExtension[i]);
            }
        } else {
            extensions.push(extendWord(wordNumber, segment));
        }
    }
    return extensions;
}

function getWordedNumber(upperLimit = new Decimal(1)) {
    const words = [new WordedNumber()];
    words[0].coord = new Decimal(0);
    // function upper(word) { return word.coord.plus(basePow[word.numberText.length]);}
    function appearsIn(wordLong, wordShort) { return wordLong.numberText.indexOf(wordShort.numberText) !== -1;}
    while (true) {
        let word = null;
        for (let i = 0; i < words.length; i++) {
            if (!words[i].isTerminated) {
                word = words.splice(i, 1)[0];
                break;
            }
        }
        if (!word) {
            return null; 
        }
        const extensions = getAllExtensions(word);
        for (let i = 0; i < extensions.length; i++) {
            if (extensions[i].coord.lte(upperLimit)) {
                words.push(extensions[i]);
            }
        }
        let maxWord = {coord: new Decimal(0)};
        for (let i = 0; i < words.length; i++) {
            if (words[i].coord.gte(maxWord.coord)) {
                maxWord = words[i];
            }
        }
        for (let i = 0; i < words.length; i++) {
            if (!appearsIn(maxWord, words[i])) {
                words.splice(i, 1);
                i--;
            }
        }
        words.sort((a, b) => a.coord.minus(b.coord).toNumber());
        if (words.length !== 1) {
            continue;
        }
        if (words[0].isTerminated) {
            // console.log("Terminated:", words[0].numberText);
            return [words[0].numberText, words[0].coord];
        }
        //We are assuming that the upperLimit is the bottom of the word
        const lettersHeldOnScreen = Math.ceil(
            ((trueBottom.minus(trueTop).times(canvas.width).times(4)).
            div((upperLimit.plus(minCoordHeight)).minus(words[0].coord).times(canvas.height)))
            .toNumber());
        const maxLetterShift = getBasePower(words[0].numberText.length);
        if (lettersHeldOnScreen < words[0].numberText.length && maxLetterShift.lessThan(minCoordHeight)) {
            // console.log("Too big:", words[0].numberText, words[0].coord.toString(), upperLimit.toString());
            return [words[0].numberText, words[0].coord];
        }
    }
}

function getAllWordedNumbers() {
    const wordedNumbers = [];
    let limit = new Decimal(1);
    while (true) {
        const nextWord = getWordedNumber(limit);
        if (!nextWord) break;
        wordedNumbers.unshift(nextWord);
        limit = nextWord[1].minus(minCoordHeight);
    }
    return wordedNumbers;
}

const title = "Integers:"
const drawBottom = new Decimal(1);
function draw() {
    fillBackground();
    const words = getAllWordedNumbers();
    words.unshift([title, new Decimal(0)]);
    for (let i = 0; i < words.length - 1; i++) {
        drawLeftAlignedText(words[i][0], words[i][1], words[i+1][1]);
    }
    drawLeftAlignedText(words[words.length - 1][0], words[words.length - 1][1], drawBottom);
}
draw();