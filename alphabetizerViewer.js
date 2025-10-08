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
    const lineExp = - trueBottom.minus(trueTop).minus(minCoordHeight).e;
    lineLevel = trueTop.toDecimalPlaces(lineExp, Decimal.ROUND_DOWN);
    while (lineLevel.lt(trueTop)) {
        lineLevel = lineLevel.plus(getTenPower(lineExp));
    }
    while (lineLevel.lte(trueBottom)) {
        const yPixel = canvas.height * (lineLevel.minus(trueTop).div(trueBottom.minus(trueTop)).toNumber());
        ctx.strokeStyle = "white";
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(0, yPixel);
        ctx.lineTo(canvas.width, yPixel);
        ctx.stroke();
        lineLevel = lineLevel.plus(getTenPower(lineExp));
    }
}

let trueTop = new Decimal(0);
let trueBottom = new Decimal(1);
const minPixelHeight = 1.0;
let minCoordHeight = new Decimal(0);
const strictness = 0.1; //0.5 seems to be good
function calcViewDependentVars() {
    const denominator = trueBottom.minus(trueTop);
    minCoordHeight = denominator.times(minPixelHeight).div(canvas.height);
    Decimal.set({ precision: Math.ceil(strictness * canvas.width / minPixelHeight) });
}
calcViewDependentVars();

function drawLeftAlignedText(text, topHeight, bottomHeight, leftMargin = 0, fontFamily = "monospace", color = txtColor, drawLine = false) {
    if (bottomHeight.minus(topHeight).lessThan(minCoordHeight)) {
        return; // Too small to draw
    }
    const denominator = trueBottom.minus(trueTop);
    const topPixel = canvas.height * (topHeight.minus(trueTop).div(denominator).toNumber());
    const bottomPixel = canvas.height * (bottomHeight.minus(trueTop).div(denominator).toNumber());
    const availableHeight = bottomPixel - topPixel;
    let fontSize = availableHeight;
    let font = `${fontSize}px ${fontFamily}`;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    // text = text.toUpperCase();
    ctx.fillText(text, leftMargin, topPixel);
    
    // Only draw the line when fractal details are being skipped
    if (drawLine) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, topPixel);
        ctx.lineTo(canvas.width, topPixel);
        ctx.stroke();
    }
}
const base = 25;
const letters = " abcdefghilmnopqrstuvwxyz";
const letterRank = {
    " ": 0, "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8, "i": 9, "l": 10, 
    "m": 11, "n": 12, "o": 13, "p": 14, "q": 15, "r": 16, "s": 17, "t": 18, "u": 19, "v": 20, 
    "w": 21, "x": 22, "y": 23, "z": 24
}
const basePow = [new Decimal(1)]; 
const tenPow = [new Decimal(1)];
const digitDict = [[]];
//NOTE: Indexing is a bit weird here, because we want 1/base to be at position 1, not position 0
function getBasePower(position) {
    while (basePow.length <= position) {
        basePow.push(basePow[basePow.length - 1].div(base));
    }
    return basePow[position];
}
function getTenPower(position) {
    while (tenPow.length <= position) {
        tenPow.push(tenPow[tenPow.length - 1].div(10));
    }
    return tenPow[position];
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
function appearsIn(wordLong, wordShort) { return wordLong.numberText.indexOf(wordShort.numberText) !== -1;}

function getWordedNumberAbove(lowerLimit = new Decimal(0)) {
    const words = [new WordedNumber()];
    words[0].coord = new Decimal(0);
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
            if (extensions[i].coord.gte(lowerLimit)) {
                words.push(extensions[i]);
            }
        }
        let minWord = {coord: new Decimal(1)};
        for (let i = 0; i < words.length; i++) {
            if (words[i].coord.lte(minWord.coord)) {
                minWord = words[i];
            }
        }
        for (let i = 0; i < words.length; i++) {
            if (!appearsIn(minWord, words[i])) {
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
            return [words[0].numberText, words[0].coord, false];
        }
        //We are assuming that the upperLimit is the bottom of the word
        const lettersHeldOnScreen = Math.ceil(
            ((trueBottom.minus(trueTop).times(canvas.width).times(4)).
            div((words[0].coord).minus(lowerLimit.minus(minCoordHeight)).times(canvas.height)))
            .toNumber());
        const maxLetterShift = getBasePower(words[0].numberText.length);
        if (lettersHeldOnScreen < words[0].numberText.length && maxLetterShift.lessThan(minCoordHeight)) {
            // console.log("Too big:", words[0].numberText, words[0].coord.toString(), upperLimit.toString());
            return [words[0].numberText, words[0].coord, true]; // true = fractal details skipped
        }
    }
}

function getWordedNumberUnder(upperLimit = new Decimal(1)) {
    const words = [new WordedNumber()];
    words[0].coord = new Decimal(0);
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
            return [words[0].numberText, words[0].coord, false];
        }
        //We are assuming that the upperLimit is the bottom of the word
        const lettersHeldOnScreen = Math.ceil(
            ((trueBottom.minus(trueTop).times(canvas.width).times(4)).
            div((upperLimit.plus(minCoordHeight)).minus(words[0].coord).times(canvas.height)))
            .toNumber());
        const maxLetterShift = getBasePower(words[0].numberText.length);
        if (lettersHeldOnScreen < words[0].numberText.length && maxLetterShift.lessThan(minCoordHeight)) {
            // console.log("Too big:", words[0].numberText, words[0].coord.toString(), upperLimit.toString());
            return [words[0].numberText, words[0].coord, true]; // true = fractal details skipped
        }
    }
}


const title = "Integers:"
const drawBottom = new Decimal(1);
let words = [];
function calcWords() {
    words = [];
    let lowerLimit = trueTop;
    let upperLimit = trueBottom;
    while (true) {
        const nextWord = getWordedNumberUnder(upperLimit);
        if (!nextWord) break;
        words.unshift(nextWord);
        upperLimit = nextWord[1].minus(minCoordHeight);
        if (nextWord[1].lt(lowerLimit)) break;
    }
    words.unshift([title, new Decimal(0), false]);
    lastWord = getWordedNumberAbove(trueBottom);
    if (lastWord) words.push(lastWord);
    //Logging
    let l = "###\n\n"
    for (let i = 0; i < words.length; i++) {
        l += words[i][0].substring(0, 50) + " " + words[i][2] + "\n";
    }
    l += "\n\n###";
    console.log(l);
}

function draw() {
    fillBackground();

    for (let i = 0; i < words.length - 1; i++) {
        // Draw line only if fractal details are being skipped
        const shouldDrawLine = words[i].length > 2 && words[i][2] === true;
        drawLeftAlignedText(words[i][0], words[i][1], words[i+1][1], 0, "monospace", txtColor, shouldDrawLine);
    }
    if (words[words.length - 1][0] == "zero") {
        const shouldDrawLine = words[words.length - 1].length > 2 && words[words.length - 1][2] === true;
        drawLeftAlignedText(words[words.length - 1][0], words[words.length - 1][1], drawBottom, 0, "monospace", txtColor, shouldDrawLine);
    }
}
calcWords();
draw();

function zoom(lowerLimit, upperLimit) {
    trueTop = lowerLimit;
    trueBottom = upperLimit;
    calcViewDependentVars();
    calcWords();
    draw();
}
function pixelToCoord(pixelY) {
    const denominator = trueBottom.minus(trueTop);
    const relativeY = pixelY / canvas.height;
    return trueTop.plus(denominator.times(relativeY));
}
let isDragging = false;
let dragStartY = 0;
let dragStartCoord = null;
let dragIgnoreWidth = 10; // Pixels
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartY = e.offsetY;
    dragStartCoord = pixelToCoord(dragStartY);
});
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    draw();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, Math.min(dragStartY, e.offsetY), (Math.abs(e.offsetY - dragStartY)*canvas.width/canvas.height), Math.abs(e.offsetY - dragStartY));
});
canvas.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dragEndY = e.offsetY;
    if (Math.abs(dragEndY - dragStartY) < dragIgnoreWidth) {
        return; // Ignore small drags
    }
    const dragEndCoord = pixelToCoord(dragEndY);
    const topCoord = dragStartCoord.lt(dragEndCoord) ? dragStartCoord : dragEndCoord;
    const bottomCoord = dragStartCoord.gt(dragEndCoord) ? dragStartCoord : dragEndCoord;
    zoom(topCoord, bottomCoord);
});
canvas.addEventListener('mouseleave', (e) => {
    isDragging = false;
});

