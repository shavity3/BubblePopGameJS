"use strict";

import { BubbleClass } from "./BubbleClass.js"
import { MAX_BUBBLE_RADIUS } from "./CONFIG.js"

const NO_BOMB_TEXT = "No Bombs.";
const GET_BOMB_TEXT = "Pick a Bomb.";
const CANCEL_BOMB_TEXT = "Cancel.";

const BOMB_RADIUS = 50;
const BOMB_LINE_DASH=4;
const BOMB_LINE_MAX_OFFSET=16;
const BOMB_REQ=3;

let bombEvent=false;
let bombLoader=0;
let bombCount=0;
let bombOffset=0;
let bombColor="red";

const NO_FREEZE_TEXT = "No Freeze Rays.";
const GET_FREEZE_TEXT = "Pick a Freeze Ray.";
const CANCEL_FREEZE_TEXT = "Cancel.";

const FREEZE_RADIUS = 150;
const FREEZE_LINE_DASH=4;
const FREEZE_LINE_MAX_OFFSET=16;
const FREEZE_REQ=5;

let freezeEvent=false;
let freezeLoader=0;
let freezeCount=0;
let freezeOffset=0;
let freezeColor="blue";

let mouseX=-1;
let mouseY=-1;



let bubbleArray = [];
let bubbleKilled=0;

function createBubble()
{
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let maxLeft=bubbleContainerElement.clientWidth;
    //create bubble

    let cointToss= Math.round(Math.random());
    let newPosVerti=0;
    let direction=1;
    if(cointToss===1)
    {
        newPosVerti=bubbleContainerElement.clientHeight;
        direction=-1;
    }

    let newPosHori=Math.round(Math.random()*(maxLeft));

    let bubbleToAdd = new BubbleClass(newPosHori,newPosVerti,direction);

    //if the bubble doesn't collide with anyone on its creation add it
    if(!checkBubbleCollision(bubbleToAdd))
    {
        bubbleArray.push(bubbleToAdd);
    }
}

function fillBubbleArray()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let bubbleBuild=bubbleArray.length;
    let maxBubbles=Math.floor((canvas.clientWidth)/(MAX_BUBBLE_RADIUS*2))*2*0.7;
    while(bubbleBuild<maxBubbles)
    {
        createBubble();
        bubbleBuild=bubbleArray.length;
    }
}

function checkBubbleCollision(bubble)
{
    for(let runner=0;runner<bubbleArray.length;runner++)
    {
        let runnerBubble=bubbleArray[runner];
        if(bubble.checkCollison(runnerBubble.xPos,runnerBubble.yPos,runnerBubble.radius))
        {
            return true;
        }
    }
    return false;
}

//tests all bubbles in the array if they collide with another bubble and i so set them to be deleted
function checkAllBubbleCollision()
{

    //we should check each bubble against all other bubbles
    for(let firstBubbleRunner=0;firstBubbleRunner<bubbleArray.length;firstBubbleRunner++)
    {
        let firstBubble=bubbleArray[firstBubbleRunner];
        //we don't need to run pn bubbles were already tested
        for(let secondBubbleRunner=firstBubbleRunner+1;secondBubbleRunner<bubbleArray.length;secondBubbleRunner++)
        {
            let secondBubble=bubbleArray[secondBubbleRunner];
            let isCollision=firstBubble.checkCollison(secondBubble.xPos,secondBubble.yPos,secondBubble.radius);
            if(isCollision)
            {
                firstBubble.kill();
                secondBubble.kill();
            }

        }
    }
}

//set deleteion for all bubbles that are out of the canvas frame
function checkOutofBoundBubbles()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let height=canvas.clientHeight;

    for(let runner=0;runner<bubbleArray.length;runner++)
    {
        let bubble=bubbleArray[runner];
        //if the bubble is already set to be deleted skip it
        if(bubble.isDelete)
        {

        }
        //else of it is above the canvas
        else if(bubble.yPos<0-bubble.radius)
        {
            bubble.kill();
        }
        //else if it exited the canvas below
        else if(bubble.yPos>height+bubble.radius)
        {
            bubble.kill()
        }
    }
}

function drawBubble(bubbleToDraw)
{
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let context = bubbleContainerElement.getContext("2d");

    context.fillStyle = bubbleToDraw.color;

    context.beginPath();
    context.arc(bubbleToDraw.xPos,bubbleToDraw.yPos,bubbleToDraw.radius,0,2*Math.PI);
    //context.fill();
    context.fill();
}

function drawAllBubblesInArray()
{
    for(let i=0;i<bubbleArray.length;i++)
    {
        let bubbleToDraw=(bubbleArray[i]);
        if(!bubbleToDraw.isDelete)
        {
            bubbleToDraw.move();
            drawBubble(bubbleToDraw);
        }
    }
}

function initCanvasSize()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let canvasHeight=canvas.clientHeight;
    let canvasWidth=canvas.clientWidth;

    let resize = canvas.height != canvasHeight || canvas.width != canvasWidth;
    if(resize)
    {
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
    }
}

function removeKilledBubles()
{
    let tempArray=[];
    for(let i=0;i<bubbleArray.length;i++)
    {
        //if the bubble isn't deleted
        if(!bubbleArray[i].isDelete)
        {
            //it stays in the array
            tempArray.push(bubbleArray[i]);
        }
    }
    bubbleArray=tempArray;
}

function animatedBoard()
{
    checkAllBubbleCollision();
    checkOutofBoundBubbles();
    
    removeKilledBubles();
    fillBubbleArray();

    initCanvasSize();
    resetBoard();

    drawAllBubblesInArray();
    drawWeapons();

    window.requestAnimationFrame(animatedBoard);
}

function drawWeapons()
{
    if(bombEvent)
    {
        drawBomb();
    }
    else if(freezeEvent)
    {
        drawFreezeRay();
    }
}

//this function is responsible for how the bomb is drawn on the canvas
function drawBomb()
{
    //if the mouse is not on the canvas don't draw
    if(mouseX<0 || mouseY<0)
    {
        return;
    }
    
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let context = bubbleContainerElement.getContext("2d");

    context.strokeStyle = bombColor;
    context.setLineDash([BOMB_LINE_DASH, BOMB_LINE_DASH]);

    if(bombOffset>BOMB_LINE_MAX_OFFSET)
    {
        bombOffset=0;
    }
    else
    {
        bombOffset++;
    }

    context.lineDashOffset  = bombOffset;

    //intersting effect but not what I wanted
    //context.lineWidth = bombOffset;

    context.beginPath();
    context.arc(mouseX,mouseY,BOMB_RADIUS,0,2*Math.PI);
    context.stroke();
}

//this function is responsible for how the freeze ray is drawn on the canvas
function drawFreezeRay()
{
    //if the mouse is not on the canvas don't draw
    if(mouseX<0 || mouseY<0)
    {
        return;
    }
    
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let context = bubbleContainerElement.getContext("2d");

    context.strokeStyle = freezeColor;
    context.setLineDash([FREEZE_LINE_DASH, FREEZE_LINE_DASH]);

    if(freezeOffset>FREEZE_LINE_MAX_OFFSET)
    {
        freezeOffset=0;
    }
    else
    {
        freezeOffset++;
    }

    context.lineDashOffset  = freezeOffset;

    context.beginPath();
    context.arc(mouseX,mouseY,FREEZE_RADIUS,0,2*Math.PI);
    context.stroke();
}

function resetBoard()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let context = canvas.getContext("2d");
    let canvasHeight=canvas.clientHeight;
    let canvasWidth=canvas.clientWidth;

    context.clearRect(0,0,canvasWidth,canvasHeight);
}

//kill bubbles that were clicked
function clickEvent(e)
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let boundingElement = canvas.getBoundingClientRect();
    let borderLeftLength=+(getComputedStyle(canvas,null).getPropertyValue('border-left-width').slice(0,-2));
    let borderTopLength=+(getComputedStyle(canvas,null).getPropertyValue('border-top-width').slice(0,-2));

    let collisonRadius=0;

    //this variable holds what kind of events is triggered by the click
    let eventCode=0;

    //if a bomb is used
    if(bombEvent)
    {
        collisonRadius=BOMB_RADIUS;
        bombCount--;
        bombEvent=false;
        eventCode=1;
    }
    //else if a freeze ray is used
    else if(freezeEvent)
    {
        collisonRadius=FREEZE_RADIUS;
        freezeCount--;
        freezeEvent=false;
        eventCode=2;
    }
    //else normal click
    else
    {
        eventCode=0;
    }

    let filterFunc=(bubble) => { return bubble.checkCollison(e.clientX-boundingElement.left-borderLeftLength,e.clientY-boundingElement.top-borderTopLength,collisonRadius) };
    let items=bubbleArray.filter(filterFunc);
    for(let i=0;i<items.length;i++)
    {
        //does different things to the bubbles in radius depends on the event code
        switch (eventCode)
        {
            //code 1 is bombs so it just kills all in radius
            case 1:
                items[i].kill();
                bubbleKilled++;
                loadWeapons();
                break;
            //code 2 is a freeze ray so it slows all things in radius
            case 2:
                items[i].speed=items[i].speed/2;
                break;
            //code 0 is the default and is just a normal click that kills the bubble it touches.
            case 0:
            default:
                items[i].kill();
                bubbleKilled++;
                loadWeapons();
                break;
        }
    }
    document.getElementById("bubbleClickCount").innerHTML=bubbleKilled;
    updateWeapons();
}

//function that will update all the extra weapons the user can use that is called whenever a bomb is deleted
function loadWeapons()
{
    bombLoader++;
    if(bombLoader===BOMB_REQ)
    {
        bombLoader=0;
        bombCount++;
    }
    freezeLoader++;
    if(freezeLoader===FREEZE_REQ)
    {
        freezeLoader=0;
        freezeCount++;
    }
}

function disableAllWeapons()
{
    let bombButton=document.getElementById("bombButton");
    bombButton.disabled = true;

    let freezeButton=document.getElementById("freezeRayButton");
    freezeButton.disabled = true;
}

function enableAllWeapons()
{
    let bombButton=document.getElementById("bombButton");
    bombButton.disabled = false;
    
    let freezeButton=document.getElementById("freezeRayButton");
    freezeButton.disabled = false;
}

function updateWeapons()
{
    updateBombButton();
    updateFreezeButton();
}

function updateBombButton()
{
    let bombButton=document.getElementById("bombButton");
    if(bombCount==0)
    {
        bombButton.disabled = true;
        bombButton.innerHTML = NO_BOMB_TEXT;
    }
    else
    {
        bombButton.disabled = false;
        bombButton.innerHTML = GET_BOMB_TEXT;
    }
}

function updateFreezeButton()
{
    let freezeButton=document.getElementById("freezeRayButton");
    if(freezeCount==0)
    {
        freezeButton.disabled = true;
        freezeButton.innerHTML = NO_FREEZE_TEXT;
    }
    else
    {
        freezeButton.disabled = false;
        freezeButton.innerHTML = GET_FREEZE_TEXT;
    }
}

function bombButtonClick()
{
    let bombButton=document.getElementById("bombButton");
    if(bombEvent==false)
    {
        disableAllWeapons();
        bombButton.disabled=false;
        bombEvent=true;
        bombButton.innerHTML = CANCEL_BOMB_TEXT;
    }
    else
    {
        enableAllWeapons();
        bombEvent=false;
        bombButton.innerHTML = GET_BOMB_TEXT;
    }
}

function freezeButtonClick()
{
    let freezeButton=document.getElementById("freezeRayButton");
    if(freezeEvent==false)
    {
        disableAllWeapons();
        freezeButton.disabled=false;
        freezeEvent=true;
        freezeButton.innerHTML = CANCEL_FREEZE_TEXT;
    }
    else
    {
        enableAllWeapons();
        freezeEvent=false;
        freezeButton.innerHTML = GET_FREEZE_TEXT;
    }
}

function mouseOutCanvas(e)
{
    mouseX=-1;
    mouseY=-1;
}

function mouseMoveCanvas(e)
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let boundingElement = canvas.getBoundingClientRect();
    let borderLeftLength=+(getComputedStyle(canvas,null).getPropertyValue('border-left-width').slice(0,-2));
    let borderTopLength=+(getComputedStyle(canvas,null).getPropertyValue('border-top-width').slice(0,-2));

    mouseX=e.clientX-boundingElement.left-borderLeftLength;
    mouseY=e.clientY-boundingElement.top-borderTopLength;
}

//#region testing area
function createBubbleTest()
{
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let maxLeft=bubbleContainerElement.clientWidth;
    //create bubble

    let cointToss= Math.round(Math.random());
    let newPosVerti=100;
    let direction=0;

    let newPosHori=100;

    let bubbleToAdd = new BubbleClass(newPosHori,newPosVerti,direction);
    bubbleArray.push(bubbleToAdd);
}

function animatedBoardTest()
{
    removeKilledBubles();

    initCanvasSize();
    resetBoard();

    for(let i=0;i<bubbleArray.length;i++)
    {
        let bubbleToDraw=(bubbleArray[i]);
        if(!bubbleToDraw.isDelete)
        {
            bubbleToDraw.move();
            drawBubble(bubbleToDraw);
        }
    }
    window.requestAnimationFrame(animatedBoardTest);
}

function resetTest()
{
    bubbleArray=[];
    createBubbleTest();
    initCanvasSize();
    resetBoard();
}

//#endregion

fillBubbleArray();
//createBubbleTest();


document.getElementById("resetButton").onclick=resetTest;

document.getElementById("bombButton").onclick=bombButtonClick;
document.getElementById("freezeRayButton").onclick=freezeButtonClick;

window.requestAnimationFrame(animatedBoard);
//window.requestAnimationFrame(animatedBoardTest);

let canvas=document.getElementById("bubbleContainerCanvas");
canvas.addEventListener("click", (e)=>{clickEvent(e);});
canvas.addEventListener("mouseout", (e) => {mouseOutCanvas(e);});
canvas.addEventListener("mousemove", (e) => {mouseMoveCanvas(e);});
