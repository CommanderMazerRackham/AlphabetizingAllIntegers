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
});
function fillBackground() {
    ctx.fillStyle = bkgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const ignoreHeight = 0.0005;
function drawLeftAlignedText(text, topHeight, bottomHeight, leftMargin = 0, fontFamily = "monospace", color = txtColor) {
    if (bottomHeight - topHeight <= ignoreHeight)  {
        //Don't draw if it's less than a tenth of a pixel
        return;
    }
    const topPixel = topHeight * canvas.height;
    const bottomPixel = bottomHeight * canvas.height;
    const availableHeight = bottomPixel - topPixel;
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
    " ": 0, "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8, "i": 9, "l": 10, "m": 11, "n": 12, "o": 13, "p": 14, "q": 15, "r": 16, "s": 17, "t": 18, "u": 19, "v": 20, "w": 21, "x": 22, "y": 23, "z": 24
}
const spaces        = "                                                                                                ";
const zzzzzz        = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
let topLetters      = spaces;
let bottomLetters   = zzzzzz;
function getTopLetter(index) {
    if (index < topLetters.length) {
        return topLetters[index];
    } else {
        return " ";
    }
}
function getBottomLetter(index) {
    if (index < bottomLetters.length) {
        return bottomLetters[index];
    } else {
        return " ";
    }
}
function getCoord(word) {
    let i = 0;
    while (i < word.length && word[i] === getTopLetter(i) && word[i] === getBottomLetter(i)) {
        i++;
    }
    let lengthWT = 0.0;
    let place = 1.0;
    for (let j = i; j < Math.max(word.length, topLetters.length); j++) {
        let letter = " ";
        if (j < word.length) {
            letter = word[j].toLowerCase();
        }
        const rankW = (letterRank[letter] || 0);
        const rankT = (letterRank[getTopLetter(j)] || 0);
        place /= base;
        if (place == 0) {break;}
        lengthWT += (rankW - rankT) * place;
    }
    let lengthBT = 0.0;
    place = 1.0;
    for (let j = i; j < Math.max(bottomLetters.length, topLetters.length); j++) {
        const rankB = (letterRank[getBottomLetter(j)] || 0);
        const rankT = (letterRank[getTopLetter(j)] || 0);
        place /= base;
        if (place == 0) {break;}
        lengthBT += (rankB - rankT) * place;
    }
    return lengthWT / lengthBT;
}

const segmentedWordedNumbers = [new WordedNumber()];
const completedWordedNumbers = [];
const extendBatchSize = 5000;
function extendWordedNumbers() {
    const segmentsToExtend = segmentedWordedNumbers.splice(0, Math.min(extendBatchSize, segmentedWordedNumbers.length));
    for (let i = 0; i < segmentsToExtend.length; i++) {
        const wn = segmentsToExtend[i];
        for (const nextSegment of wn.getValidNexts()) {
            const extension = wn.extend(nextSegment);
            if (extension.isTerminated) {
                completedWordedNumbers.push([extension.numberText, getCoord(extension.numberText)]);
            } else {
                segmentedWordedNumbers.push(extension);
            }
        }
    }
    console.log("Segmented:", segmentedWordedNumbers.length, " Completed:", completedWordedNumbers.length);
}
const title = ["Integers:", 0];
let bottom = 1.0;
function draw() {
    fillBackground();
    completedWordedNumbers.sort((a, b) => a[1] - b[1]);
    if (completedWordedNumbers.length == 0) {
        return;
    }
    drawLeftAlignedText(title[0], title[1], completedWordedNumbers[0][1]);
    for (let i = 0; i < completedWordedNumbers.length - 1; i++) {
        drawLeftAlignedText(completedWordedNumbers[i][0], completedWordedNumbers[i][1], completedWordedNumbers[i+1][1]);
    }
    drawLeftAlignedText(completedWordedNumbers[completedWordedNumbers.length - 1][0], completedWordedNumbers[completedWordedNumbers.length - 1][1], bottom);
}
let maxSteps = 60;
function step() {
    extendWordedNumbers();
    draw();
    maxSteps--;
    if (maxSteps > 0) {
        requestAnimationFrame(step);
    }
}
requestAnimationFrame(step);