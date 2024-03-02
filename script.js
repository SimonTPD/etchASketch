const PAD_SQUARE_BORDER_WIDTH_PX = 1;
const MIN_PAD_SQUARE_LENGTH = 6;
const GAP_BETWEEN_PAD_SQUARES = 1;
const PAD_SQUARE_CLASS_NAME = 'pad-square';

let sketchPad = document.querySelector('div.pad');
let clearPadButton = document.querySelector('button#clear-pad');
let newGridButton = document.querySelector('button#new-grid');
let changeColoringButton = document.querySelector('button#change-coloring');
let pageBody = document.querySelector('body');

let colorSquareFunction = colorSquareWithDarkening;

let padToggled = false;

clearPadButton.addEventListener('click', clearPad);

newGridButton.addEventListener('click', () => {
        erasePad();
        const numSquares = prompt('Enter number of squares per row/column.');
        if (isNaN(+numSquares)){
            alert('You must enter a number!');
            return undefined;            
        }
        drawPad(+numSquares);
        activatePad(colorSquareFunction);       
    });

changeColoringButton.addEventListener('click', (event) => {
        const oldColorSquareFunction = colorSquareFunction;
        if (colorSquareFunction == colorSquareWithDarkening) {
            colorSquareFunction = colorSquareRandomWithDarkening;
            event.target.innerText = 'Light green color';
        }
        else{
            colorSquareFunction = colorSquareWithDarkening;
            event.target.innerText = 'Random color';
        }
        deactivatePad(oldColorSquareFunction);
        activatePad(colorSquareFunction);
    });

pageBody.addEventListener('keypress', (event) => {
        console.log(`Key pressed! It is a ${event.key}`);
        if (event.key == 't'){
            if(padToggled) deactivatePad(colorSquareFunction);
            else activatePad(colorSquareFunction);
        }
    });

drawPad(30);
activatePad(colorSquareFunction);

/***********************************************/
/*******************Functions*******************/
/***********************************************/

function drawPad(numSquaresPerRow){
    if (isNaN(numSquaresPerRow)){
        alert('You must enter a number!');
        return undefined;
    }

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
        ((numSquaresPerRow - 1) * GAP_BETWEEN_PAD_SQUARES);

    if (spaceTaken > sketchPadLength){
        alert('Not enough space for that many squares per row/column, ' + 
            'reduce number of squares!');
        return undefined;
    }

    const squareLength = Math.floor(
        ((sketchPadLength - (2 * sketchPadBorderWidth) - 
        (2 * sketchPadPadding) - ((numSquaresPerRow - 1) * GAP_BETWEEN_PAD_SQUARES))
        / numSquaresPerRow)
        );
    
    //Space that will be taken (in width/height) by a row/column
    const actSpaceTaken = (2 * sketchPadBorderWidth) + (2 * sketchPadPadding) +
        (numSquaresPerRow * squareLength) + 
        ((numSquaresPerRow - 1) * GAP_BETWEEN_PAD_SQUARES);
    
    /*
    For some grids, the dquare length is such that there is enough space
    for an extra square to fit on each row, which gives a last row with
    some squares and all the other rows with one too many square.
    Therefore, the edge squares are added some margin to fill in the extra
    available space.
    */
    const marginForEdgeSquare = Math.floor((sketchPadLength - actSpaceTaken) / 2);    

    for (let i = 0; i < numSquaresPerRow ** 2; i++){
        const square = document.createElement('div');
        
        square.classList.add(PAD_SQUARE_CLASS_NAME);
        square.style.borderWidth = `${PAD_SQUARE_BORDER_WIDTH_PX}px`;
        square.style.width = `${squareLength}px`;
        square.style.height = `${squareLength}px`;
        sketchPad.style.gap = `${GAP_BETWEEN_PAD_SQUARES}px`;
        square.style.backgroundColor = 'rgb(255, 255, 255)';

        //Check if the square is on the edge, add margin if needed (see comment above)
        if (i < numSquaresPerRow) square.style.marginTop = `${marginForEdgeSquare}px`;
        if (i >= (numSquaresPerRow - 1) * numSquaresPerRow) 
            square.style.marginBottom = `${marginForEdgeSquare}px`;
        if (i % numSquaresPerRow == 0) square.style.marginLeft = `${marginForEdgeSquare}px`;
        if (i % (numSquaresPerRow) == numSquaresPerRow - 1) square.style.marginRight = `${marginForEdgeSquare}px`;

        sketchPad.appendChild(square);
    }
}

    
function activatePad(colorFunction){
    if (typeof colorFunction !== 'function'){
        console.log('Pad not activated, ' + 
            'the argument passed to the function is not a function!');
        return undefined;
    }

    const sketchPadSquares = document.querySelectorAll('div.pad-square');
    if (sketchPadSquares.length == 0){
        console.log('Empty sketch pad, cannot activate');
        return undefined;
    }

    sketchPadSquares.forEach((square) =>{
            square.addEventListener('mouseover', colorFunction);
        });

    padToggled = true;
}

function deactivatePad(colorFunction){
    if (typeof colorFunction !== 'function'){
        console.log('Pad not deactivated, ' + 
            'the argument passed to the function is not a function!');
        return undefined;
    }

    const sketchPadSquares = document.querySelectorAll('div.pad-square');
    if (sketchPadSquares.length == 0){
        console.log('Empty sketch pad, cannot deactivate');
        return undefined;
    }

    sketchPadSquares.forEach((square) =>{
            square.removeEventListener('mouseover', colorFunction);
        });
    
    padToggled = false;
}

function colorSquareWithDarkening(event){
    if (event.target.style.backgroundColor == 'rgb(255, 255, 255)'){
        event.target.style.backgroundColor = 'rgb(144, 238, 144)';
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

function clearPad(){
    if (sketchPad.children.length < 1){
        console.log('Sketch pad is empty, no square clearing needed.');
        return undefined;
    }
    for (square of sketchPad.children){
        square.style.backgroundColor = 'rgb(255, 255, 255)';
    }
}

function erasePad(){
    if (sketchPad.children.length < 1){
        console.log('Sketch pad is empty, no erasing needed.');
        return undefined;
    }

    const numSquares = sketchPad.children.length;

    for (let i = 0; i < numSquares; i++){
        sketchPad.removeChild(sketchPad.children[numSquares - i - 1]);        
    }        
}

function randomNumber(upperThreshold){
    return Math.floor(Math.random() * (upperThreshold + 1));
}