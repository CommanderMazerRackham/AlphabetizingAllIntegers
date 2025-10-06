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
    calcMinCoordHeight();
    draw();
});
function fillBackground() {
    ctx.fillStyle = bkgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const divPrecision = 20;
Decimal.set({ precision: divPrecision });

let trueTop = new Decimal(0);
let trueBottom = new Decimal(1);
const minPixelHeight = 0.1;
let minCoordHeight = new Decimal(0);
function calcMinCoordHeight() {
    const denominator = trueBottom.minus(trueTop);
    minCoordHeight = denominator.times(minPixelHeight).div(canvas.height);
}

calcMinCoordHeight();
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
function getDigit(letter, position) {
    while (basePow.length <= position) {
        basePow.push(basePow[basePow.length - 1].div(base));
        digitDict.push([]);
        for (let i = 0; i < base; i++) {
            digitDict[digitDict.length - 1].push(basePow[basePow.length - 1].times(i));
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

const segmentedWordedNumbers = [new WordedNumber()];
segmentedWordedNumbers[0].coord = new Decimal(0);
const completedWordedNumbers = [["Integers:", new Decimal(0)]];
const extendBatchSize = 5000;


function extendWordedNumbers() {
    const segmentsToExtend = segmentedWordedNumbers.splice(0, Math.min(extendBatchSize, segmentedWordedNumbers.length));
    for (let i = 0; i < segmentsToExtend.length; i++) {
        const wn = segmentsToExtend[i];
        for (const nextSegment of wn.getValidNexts()) {
            const extension = wn.extend(nextSegment);
            let newCoord = wn.coord;
            for (let j = 0; j < nextSegment.text.length; j++) {
                newCoord = newCoord.plus(getDigit(nextSegment.text[j], wn.numberText.length + j + 1));
            }
            extension.coord = newCoord;

            let left = 0, right = completedWordedNumbers.length;
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                if (extension.coord.lessThan(completedWordedNumbers[mid][1])) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
            const insertionPoint = left;
            if (extension.isTerminated) {
                completedWordedNumbers.splice(insertionPoint, 0, [extension.numberText, extension.coord]);
            } else {
                if (insertionPoint < completedWordedNumbers.length && 
                    completedWordedNumbers[insertionPoint][1].minus(minCoordHeight).lessThan(extension.coord)) {
                    continue; // Skip this extension, it's too close to an existing completed number
                }
                let left = 0, right = segmentedWordedNumbers.length;
                while (left < right) {
                    const mid = Math.floor((left + right) / 2);
                    if (extension.coord.greaterThan(segmentedWordedNumbers[mid].coord)) {
                        right = mid;
                    } else {
                        left = mid + 1;
                    }
                }
                const segInsertionPoint = left;
                segmentedWordedNumbers.splice(segInsertionPoint, 0, extension);
            }
        }
    }
    console.log("Segmented:", segmentedWordedNumbers.length, " Completed:", completedWordedNumbers.length);
}
const drawBottom = new Decimal(1);
function draw() {
    fillBackground();
    if (completedWordedNumbers.length == 0) {
        return;
    }
    for (let i = 0; i < completedWordedNumbers.length - 1; i++) {
        drawLeftAlignedText(completedWordedNumbers[i][0], completedWordedNumbers[i][1], completedWordedNumbers[i+1][1]);
    }
    drawLeftAlignedText(completedWordedNumbers[completedWordedNumbers.length - 1][0], 
        completedWordedNumbers[completedWordedNumbers.length - 1][1], drawBottom);
}
let maxSteps = 20;
function step() {
    extendWordedNumbers();
    draw();
    maxSteps--;
    if (maxSteps > 0) {
        requestAnimationFrame(step);
    }
}
requestAnimationFrame(step);