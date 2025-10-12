const canvas = document.getElementById('alphabetizerCanvas');
const txtColor = "#FF8C28";
const bkgColor = "#0C0C0C";
const grdColor = "#AAAAAA";
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';
canvas.style.display = 'block';
canvas.style.margin = '0';
canvas.style.padding = '0';
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function fillBackground() {
    ctx.fillStyle = bkgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const lineExp = - trueBottom.minus(trueTop).minus(minCoordHeight).e;
    let lineLevel = trueTop.toDecimalPlaces(lineExp, Decimal.ROUND_DOWN);
    let lineInc = canvas.height * getTenPower(lineExp).div(trueBottom.minus(trueTop)).toNumber();
    while (lineLevel.lt(trueTop)) {
        lineLevel = lineLevel.plus(getTenPower(lineExp));
    }
    let lineRow = canvas.height * (lineLevel.minus(trueTop).div(trueBottom.minus(trueTop)).toNumber());
    ctx.strokeStyle = grdColor;
    ctx.lineWidth = 0.1;
    while (lineRow < canvas.height) {
        ctx.beginPath();
        ctx.moveTo(0, lineRow);
        ctx.lineTo(canvas.width, lineRow);
        ctx.stroke();
        lineRow += lineInc;
    }
    let lineCol = lineInc;
    while (lineCol < canvas.width) {
        ctx.beginPath();
        ctx.moveTo(lineCol, 0);
        ctx.lineTo(lineCol, canvas.height);
        ctx.stroke();
        lineCol += lineInc;
    }
}
let trueTop = new Decimal(0);
let trueBottom = new Decimal(1);
const minPixelHeight = 2.0;
let minCoordHeight = new Decimal(0);
let strictness = 0.25; //0.5 seems to be good
function calcViewDependentVars() {
    const denominator = trueBottom.minus(trueTop);
    minCoordHeight = denominator.times(minPixelHeight).div(canvas.height);
    Decimal.set({ precision: Math.ceil(strictness * canvas.width / minPixelHeight) });
}
const fontScale = 1.15;
function drawLeftAlignedText(text, topHeight, bottomHeight, leftMargin = 0, fontFamily = "monospace", color = txtColor, drawLine = false) {
    if (bottomHeight.minus(topHeight).lessThan(minCoordHeight)) return; 
    const denominator = trueBottom.minus(trueTop);
    const topPixel = canvas.height * (topHeight.minus(trueTop).div(denominator).toNumber());
    const bottomPixel = canvas.height * (bottomHeight.minus(trueTop).div(denominator).toNumber());
    const availableHeight = bottomPixel - topPixel;
    let fontSize = availableHeight * fontScale;
    let font = `${fontSize}px ${fontFamily}`;
    ctx.font = font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = color;
    // ctx.shadowBlur = fontSize * 0.5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = color;
    ctx.fillText(text, leftMargin, topPixel);
    ctx.shadowBlur = 0;
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
function getCoord(word) {
    let coord = new Decimal(0);
    for (let i = 0; i < word.length; i++) {
        coord = coord.plus(getDigit(word[i].toLowerCase(), i+1));
    }
    return coord;
}
function extendWord(wordNumber, segment) {
    const extendedWord = wordNumber.extend(segment);
    let newCoord = wordNumber.coord;
    for (let i = 0; i < segment.text.length; i++) {
        newCoord = newCoord.plus(getDigit(segment.text[i], wordNumber.numberText.length + i + 1));
    }
    extendedWord.coord = newCoord;
    return extendedWord;
}

function isTooLong(word) {
    return word.numberText.length > 300;
}

function getShortestUnfinishedWordIndex(wordPool, goingDown) {
    let shortestWordIndex = -1;
    let shortestWord = null;
    
    for (let i = 0; i < wordPool.length; i++) {
        if (wordPool[i].isTerminated) continue;
        
        if (!shortestWord || 
            wordPool[i].numberText.length < shortestWord.numberText.length ||
            (wordPool[i].numberText.length === shortestWord.numberText.length &&
             ((wordPool[i].coord.gt(shortestWord.coord) && goingDown) ||
              (wordPool[i].coord.lt(shortestWord.coord) && !goingDown)))) {
            shortestWord = wordPool[i];
            shortestWordIndex = i;
        }
    }
    
    return shortestWordIndex;
}
function getClosestWord(wordPool, limit) {
    if (wordPool.length === 0) { return null; }
    let closestWord = wordPool[0];
    for (let i = 1; i < wordPool.length; i++) {
        if (wordPool[i].coord.minus(limit).abs().lt(
        closestWord.coord.minus(limit).abs())) {
            closestWord = wordPool[i];
        }
    }
    return closestWord;
}

function isValidTextExtension(wordStr, checkStr, goingDown) {
    for (let i = 0; i < Math.min(wordStr.length, checkStr.length); i++) {
        if (wordStr[i] === checkStr[i]) { continue; }
        return (letterRank[wordStr[i]] > letterRank[checkStr[i]]) == goingDown;
    }
    return true;
}

function getExtensions(word, closestWord, limit, goingDown) {
    const extensions = [];
    const agreementText = closestWord.numberText.substring(word.numberText.length);
    const validNexts = word.getValidNexts();
    for (let i = 0; i < validNexts.length; i++) {
        if (isValidTextExtension(validNexts[i].text, agreementText, goingDown)) {
            const newWord = extendWord(word, validNexts[i]);
            if ((newWord.coord.gt(limit) && goingDown) ||
                (newWord.coord.lt(limit) && !goingDown)) {
                continue;
            }
            extensions.push(newWord);
        }
    }
    return extensions;
}

function getWordedNumber(limit, goingDown = true) {
    let wordPool = [new WordedNumber()];
    wordPool[0].coord = new Decimal(0);
    let searching = true;
    let searchCount = 0;
    while (searching && searchCount < 100) {
        searchCount++;
        if (wordPool.length === 0) { return null; }
        const closestWord = getClosestWord(wordPool, limit);
        const newWordPool = [];
        for (let i = 0; i < wordPool.length; i++) {
            const textIndex = Math.min(closestWord.numberText.length, wordPool[i].numberText.length);
            if (closestWord.numberText.substring(0, textIndex) === wordPool[i].numberText.substring(0, textIndex)) {
                newWordPool.push(wordPool[i]);
            }
        }
        wordPool = newWordPool;
        const shortestWordIndex = getShortestUnfinishedWordIndex(wordPool, goingDown);
        // console.log("closestWord", closestWord)
        // console.log("wordPool", wordPool)
        // console.log("shortestWordIndex", shortestWordIndex)
        if (shortestWordIndex === -1) { break; }
        const shortestWord = wordPool.splice(shortestWordIndex, 1)[0];
        // console.log("shortestWord", shortestWord)
        const extensions = getExtensions(shortestWord, closestWord, limit, goingDown);
        // console.log("extensions", extensions)
        for (let i = 0; i < extensions.length; i++) {
            wordPool.push(extensions[i]);
        }
        // console.log("new wordPool", wordPool)
        searching = false;
        for (let i = 0; i < wordPool.length; i++) {
            if (!wordPool[i].isTerminated && !isTooLong(wordPool[i])) {
                searching = true;
                break;
            }
        }
    }
    // console.log("return")
    if (wordPool.length === 0) { return null; }
    let bestWord = wordPool[wordPool.length - 1];
    return [bestWord.numberText, bestWord.coord, !bestWord.isTerminated];
}

const title = "Integers:"
const drawBottom = new Decimal(1);
let trueWords = [];
function calcWords() {
    trueWords = [];
    let lowerLimit = trueTop;
    let upperLimit = trueBottom;
    while (true) {
        const nextWord = getWordedNumber(upperLimit, true);
        if (!nextWord) { break; }
        trueWords.unshift(nextWord);
        upperLimit = nextWord[1].minus(minCoordHeight);
        if (nextWord[1].lt(lowerLimit)) break;
    }
    trueWords.unshift([title, new Decimal(0), false]);
    lastWord = getWordedNumber(trueBottom, false);
    if (lastWord) { trueWords.push(lastWord); }
    // console.log("words: ", trueWords.map(w => "-" + w[0].substring(0, 30) + " @ " + w[1].toString().substring(0, 30)).join(",\n"));

}

function draw() {
    fillBackground();
    for (let i = 0; i < trueWords.length - 1; i++) {
        const shouldDrawLine = trueWords[i].length > 2 && trueWords[i][2] === true;
        drawLeftAlignedText(trueWords[i][0], trueWords[i][1], trueWords[i+1][1], 0, "monospace", txtColor, shouldDrawLine);
    }
    if (trueWords.length > 1 && trueWords[trueWords.length - 1][0] == "zero") {
        const shouldDrawLine = trueWords[trueWords.length - 1].length > 2 && trueWords[trueWords.length - 1][2] === true;
        drawLeftAlignedText(trueWords[trueWords.length - 1][0], trueWords[trueWords.length - 1][1], drawBottom, 0, "monospace", txtColor, shouldDrawLine);
    }
}

// Update canvas size when window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calcViewDependentVars();
    draw();
});

function normalizeBounds() {
    if (trueTop.lt(0)) {
        trueBottom = trueBottom.minus(trueTop);
        trueTop = new Decimal(0);
        if (trueBottom.gt(1)) trueBottom = new Decimal(1);
    } else if (trueBottom.gt(1)) {
        trueTop = trueTop.minus(trueBottom);
        trueBottom = new Decimal(1);
        if (trueTop.lt(0)) trueTop = new Decimal(0);
    }
}
function zoom(lowerLimit, upperLimit, recordZoom = true) {
    trueTop = lowerLimit;
    trueBottom = upperLimit;
    if (recordZoom) {
        histZoomTop.push(trueTop);
        histZoomBottom.push(trueBottom);
    }
    normalizeBounds();
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
    if (e.button !== 0) return;
    isDragging = true;
    dragStartY = e.offsetY;
    dragStartCoord = pixelToCoord(dragStartY);
});
canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) { return; }
    draw();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, Math.min(dragStartY, e.offsetY), (Math.abs(e.offsetY - dragStartY)*canvas.width/canvas.height), Math.abs(e.offsetY - dragStartY));
});
canvas.addEventListener('mouseup', (e) => {
    if (!isDragging) { return; }
    isDragging = false;
    const dragEndY = e.offsetY;
    if (Math.abs(dragEndY - dragStartY) < dragIgnoreWidth) {
        draw();
        return;
    }
    const dragEndCoord = pixelToCoord(dragEndY);
    const topCoord = dragStartCoord.lt(dragEndCoord) ? dragStartCoord : dragEndCoord;
    const bottomCoord = dragStartCoord.gt(dragEndCoord) ? dragStartCoord : dragEndCoord;
    zoom(topCoord, bottomCoord);
});
canvas.addEventListener('mouseleave', (e) => {
    if (isDragging) {
        isDragging = false;
        draw(); // Redraw to remove selection rectangle
    }
});

const zoomWheelFactor = 1.4; // Zoom in/out factor per wheel event
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const mouseY = e.offsetY;
    const mouseCoord = pixelToCoord(mouseY);
    const zoomFactor = e.deltaY > 0 ? zoomWheelFactor : 1 / zoomWheelFactor;
    const currentRange = trueBottom.minus(trueTop);
    const newRange = currentRange.times(zoomFactor);
    const mouseRelativePosition = mouseCoord.minus(trueTop).div(currentRange);
    const newTop = mouseCoord.minus(newRange.times(mouseRelativePosition));
    const newBottom = newTop.plus(newRange);
    zoom(newTop, newBottom, false);
});
function zoomToWord(word) {
    const wordTop = getCoord(word);
    const wordBottom = wordTop.plus(getBasePower(word.length + 1));
    zoom(wordTop, wordBottom);
}

// Ctrl+Z to undo zoom
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z' && histZoomTop.length > 1) {
        e.preventDefault();
        histZoomTop.pop();
        histZoomBottom.pop();
        const prevTop = histZoomTop[histZoomTop.length - 1];
        const prevBottom = histZoomBottom[histZoomBottom.length - 1];
        zoom(prevTop, prevBottom, false);
    }
});

const startTop = new Decimal(0) 
    // new Decimal("0.3117108853300605457130859349360471833532425609697088177919451673740825169883367752926928174086872039538151736902273444055539819878298438045862730336928253350940773142579067810020102958598201296721363796327365095739181827229684490643159821376432614865299394455875267398961597167303839272547210464128115223588823199334886961002700752491556175574137936373568602218596031187536756682522624");
const startBottom = new Decimal(1) 
    // new Decimal("0.4401752804118130780191373194736594203767532508900088085674557666154373513966332469213585452870185375013207361087058030195134552354774061899105675583872023228491713625328206746836800572559272373645541769851335943756427903351118539967781431415272374938035758153218242739876825519147264612774272672134132053022753028057133273081009649908640263883529244552745507588660943571536756682522624");
const histZoomTop = [startTop];
const histZoomBottom = [startBottom];


calcViewDependentVars();
draw();
zoom(startTop, startBottom);