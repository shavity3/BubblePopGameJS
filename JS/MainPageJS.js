"use strict";

import { BubbleClass } from "./BubbleClass.js"
import { MAX_BUBBLE_RADIUS } from "./CONFIG.js"
import * as Arsenal from "./Weapons/Arsenal.js"

//TODO add more weapons
// idea: bullet - horizantal line that kills all bubles it touches
// idea: fast forward - increases speed of all  bubbles in the game for a certian time.
// idea: nuke - pops all bubbles. animation should change the canvas background
// idea: ball - jumps a around in a given time frame and pops every bubble it touches

let mouseX=-1;
let mouseY=-1;



let bubbleArray = [];
let bubbleKilled=0;

//this function is responsible for drawing, animating and handling all the items in the canvas
function animatedBoard()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let context = canvas.getContext("2d");
    let height=canvas.height;
    let width=canvas.width;
    let thisDrawRemovedBubbles=0;

    checkAllBubbleCollision();
    checkOutofBoundBubbles();

    //enter presistent object collision here
    thisDrawRemovedBubbles += Arsenal.presistentItemsCollision(bubbleArray);
    Arsenal.presistentItemsOutOfBounds(width,height);
    
    removeKilledBubbles();
    fillBubbleArray();

    //remove presistent object that timed out here
    Arsenal.presistentItemsRemove();

    initCanvasSize();
    resetBoard();

    drawAllBubblesInArray();

    //enter presistent object drawing here
    Arsenal.presistentItemsDraw(context,width,height)

    //draw weapons mouse over
    Arsenal.weaponMouseOverDraw(context,mouseX,mouseY);

    if(thisDrawRemovedBubbles>0)
    {
        bubbleKilled += thisDrawRemovedBubbles;
        document.getElementById("bubbleClickCount").innerHTML=bubbleKilled;
    }

    window.requestAnimationFrame(animatedBoard);
}

//clears the canvas
function resetBoard()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let context = canvas.getContext("2d");
    let canvasHeight=canvas.clientHeight;
    let canvasWidth=canvas.clientWidth;

    context.clearRect(0,0,canvasWidth,canvasHeight);
}

//this function handles a click on the canvas according to what weapon event is currently on (including no weapon event)
function clickEvent(e)
{
    let clickBubblesKilled = Arsenal.clickEvent(bubbleArray,mouseX,mouseY);
    bubbleKilled+=clickBubblesKilled;
    document.getElementById("bubbleClickCount").innerHTML=bubbleKilled;
}

//creats a single bubble and pushes it into the bubble array
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

//fills the array with the maximum amount of bubbles according to the canvas size
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

//for one bubble checks if it collides with any other bubble in the array
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
    let width=canvas.clientWidth;

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
        //else of it is exited the canvas to the left
        else if(bubble.xPos<0-bubble.radius)
        {
            bubble.kill();
        }
        //else if it exited the canvas to the right
        else if(bubble.xPos>width+bubble.radius)
        {
            bubble.kill()
        }
    }
}

//draw the bubble object on the canvas
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

//draw all the bubbles in the array on the canvas
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

//adjusts the canvas size based on the size of the window
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

//remove all bubles that were flagges as killed from the array
function removeKilledBubbles()
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
    removeKilledBubbles();

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

Arsenal.initArsenal(document.getElementById("bombButton"),
    document.getElementById("freezeRayButton"),
    document.getElementById("ballButton"));

document.getElementById("bombButton").onclick=Arsenal.bombButtonClick;
document.getElementById("freezeRayButton").onclick=Arsenal.freezeRayButtonClick;
document.getElementById("ballButton").onclick=Arsenal.bouncyBallButtonClick;

window.requestAnimationFrame(animatedBoard);
//window.requestAnimationFrame(animatedBoardTest);

let canvas=document.getElementById("bubbleContainerCanvas");
canvas.addEventListener("click", (e)=>{clickEvent(e);});
canvas.addEventListener("mouseout", (e) => {mouseOutCanvas(e);});
canvas.addEventListener("mousemove", (e) => {mouseMoveCanvas(e);});
