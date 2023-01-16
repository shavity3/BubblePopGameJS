"use strict";

import { BubbleClass } from "./BubbleClass.js"
import { MAX_BUBBLE_RADIUS } from "./CONFIG.js"

let bubbleArray = [];

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
    
    //drawing the bubble
    //initCanvasSize();
    //drawBubble(bubbleToAdd);
}

function fillBubbleArray()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    //let canvasHeight=canvas.clientHeight;
    //let canvasWidth=canvas.clientWidth;
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
        if(bubble.checkCollison(bubbleArray[runner]))
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
            let isCollision=firstBubble.checkCollison(secondBubble);
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

//TODO add deletion method, AKA simply not drawing bubbles that have left the canvas frame
function drawBubble(bubbleToDraw)
{
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let context = bubbleContainerElement.getContext("2d");

    //context.lineWidth = 1;
    //context.fillStyle = "red";
    //context.strokeStyle = "red";
    //context.globalAlpha = 0.5;

    context.beginPath();
    context.arc(bubbleToDraw.xPos,bubbleToDraw.yPos,bubbleToDraw.radius,0,2*Math.PI);
    //context.fill();
    context.stroke();
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

    //TODO delete this?

    for(let i=0;i<bubbleArray.length;i++)
    {
        let bubbleToDraw=(bubbleArray[i]);
        if(!bubbleToDraw.isDelete)
        {
            bubbleToDraw.move();
            drawBubble(bubbleToDraw);
        }
    }
    window.requestAnimationFrame(animatedBoard);
}

function resetBoard()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let context = canvas.getContext("2d");
    let canvasHeight=canvas.clientHeight;
    let canvasWidth=canvas.clientWidth;

    context.clearRect(0,0,canvasWidth,canvasHeight);
}

fillBubbleArray();


document.getElementById("resetButton").onclick=resetBoard;

window.requestAnimationFrame(animatedBoard);
