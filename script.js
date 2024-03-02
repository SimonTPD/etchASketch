const PAD_SQUARE_BORDER_WIDTH_PX = 1;
const MIN_PAD_SQUARE_LENGTH = 6;
const GAP_BETWEEN_PAD_SQUARES = 1;
const PAD_SQUARE_CLASS_NAME = 'pad-square';

let sketchPad = document.querySelector('div.pad');
let numSquaresPerRow = 30;

drawPad(numSquaresPerRow);
activatePad();

function drawPad(numSquaresPerRow){
    if (numSquaresPerRow < 1){
        alert('There must be at least 1 square');
        return undefined;
    }

    const sketchPadStyle = window.getComputedStyle(sketchPad);
    const sketchPadLength = +sketchPadStyle.height.split('p')[0];
    const sketchPadPadding = +sketchPadStyle.padding.split('p')[0];
    const sketchPadBorderWidth = +sketchPadStyle.borderWidth.split('p')[0];

    const spaceTaken = (2 * sketchPadBorderWidth) + (2 * sketchPadPadding) +
        (numSquaresPerRow * MIN_PAD_SQUARE_LENGTH) + 
        ((numSquaresPerRow + 1) * GAP_BETWEEN_PAD_SQUARES);

    if (spaceTaken > sketchPadLength){
        alert('Not enough space for that many squares per row/column, ' + 
            'reduce number of squares!');
        return undefined;
    }

    const squareLength = Math.ceil(
        ((sketchPadLength - (2 * sketchPadBorderWidth) - 
        (2 * sketchPadPadding) - ((numSquaresPerRow + 1) * GAP_BETWEEN_PAD_SQUARES))
        / numSquaresPerRow)
        );

    for (let i = 0; i < numSquaresPerRow ** 2; i++){
        const square = document.createElement('div');
        square.classList.add(PAD_SQUARE_CLASS_NAME);
        square.style.borderWidth = `${PAD_SQUARE_BORDER_WIDTH_PX}px`;
        square.style.width = `${squareLength}px`;
        square.style.height = `${squareLength}px`;
        square.style.gap = `${GAP_BETWEEN_PAD_SQUARES}px`;
        square.style.backgroundColor = 'rgb(255, 255, 255)';
        sketchPad.appendChild(square);
    }
}

    
function activatePad(){
    const sketchPadSquares = document.querySelectorAll('div.pad-square');
    if (sketchPadSquares.length == 0){
        console.log('Empty sketch pad, cannot activate');
        return undefined;
    }

    sketchPadSquares.forEach((square) =>{
            square.addEventListener('mouseover', colorSquare);
        });
}

function colorSquare(event){
    event.target.style.backgroundColor = 'lightgreen';
}

function colorSquareRandomWithDarkening(event){
    if (event.target.style.backgroundColor == 'rgb(255, 255, 255)'){
        event.target.style.backgroundColor = 
            `rgb(${randomNumber(255)}, ${randomNumber(255)}, ${randomNumber(255)})`;
    }
    else{
        let colorR = event.target.style.backgroundColor.split(',')[0];
        colorR = colorR.substring(4, colorR.length);
        let colorG = event.target.style.backgroundColor.split(',')[1];
        let colorB = event.target.style.backgroundColor.split(',')[2];
        colorB = colorB.substring(0, colorB.length - 1);
        event.target.style.backgroundColor = 
            `rgb(${+colorR - 25}, ${+colorG - 25}, ${+colorB - 25})`;
    }
}

function randomNumber(upperThreshold){
    return Math.floor(Math.random() * (upperThreshold + 1));
}