"use strict";

import { BubbleClass } from "./BubbleClass.js"
import { BouncyBallClass } from "./BouncyBallClass.js";
import { MAX_BUBBLE_RADIUS,CANCEL_TEXT } from "./CONFIG.js"
import * as Arsenal from "./Weapons/Arsenal.js"

const GET_BOMB_TEXT = "Number of Bombs: ";

const BOMB_RADIUS = 50;
const BOMB_LINE_DASH=4;
const BOMB_LINE_MAX_OFFSET=16;
const BOMB_REQ=3;

let bombEvent=false;
let bombLoader=0;
let bombCount=0;
let bombOffset=0;
let bombColor="red";

const GET_FREEZE_TEXT = "Number of Freeze Rays: ";

const FREEZE_RADIUS = 150;
const FREEZE_LINE_DASH=4;
const FREEZE_LINE_MAX_OFFSET=16;
const FREEZE_REQ=5;

let freezeEvent=false;
let freezeLoader=0;
let freezeCount=0;
let freezeOffset=0;
let freezeColor="teal";

const GET_BALL_TEXT = "Number of Bouncy Balls: ";

const BALL_RADIUS = 30;
const BALL_REQ=5;

let ballEvent=false;
let ballLoader=0;
let ballCount=0;
let ballColor="rgba(128,0,128,0.4)";
let ballActiveColor="rgb(128,0,128)";

let activeBallArray=[];

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
    //checkAllBallCollision();
    //checkOutofBoundBalls();
    
    removeKilledBubbles();
    fillBubbleArray();

    //remove presistent object that timed out here
    Arsenal.presistentItemsRemove();
    //removeDeadBalls();

    initCanvasSize();
    resetBoard();

    drawAllBubblesInArray();

    //TODO URGENT enter presistent object drawing here
    Arsenal.presistentItemsDraw(context,width,height)
    //drawAllActiveBallsInArray();

    Arsenal.weaponMouseOverDraw(context,mouseX,mouseY);
    //drawWeapons();

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
    /*
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
    //else if a bouncy ball is used
    else if(ballEvent)
    {
        collisonRadius=BALL_RADIUS;
        ballCount--;
        ballEvent=false;
        eventCode=3;
        activeBallArray.push(new BouncyBallClass(mouseX,mouseY));
    }
    //else normal click
    else
    {
        eventCode=0;
    }

    //let filterFunc=(bubble) => { return bubble.checkCollison(e.clientX-boundingElement.left-borderLeftLength,e.clientY-boundingElement.top-borderTopLength,collisonRadius) };
    let filterFunc=(bubble) => { return bubble.checkCollison(mouseX,mouseY,collisonRadius) };
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
            //code 2 is a freeze ray so it stops all things in radius
            case 2:
                items[i].speed= 0;//items[i].speed/2;
                break;
            //code 3 is a bouncy ball that kills all bubles it encounters and stays for 10 seconds
            case 3:
                items[i].kill();
                bubbleKilled++;
                loadWeapons();
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
    */
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

//TODO URGENT Resizing has a bug: it enlarges the canvas size permanantly

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

//this function draws the weapon cursor if the user's mouse is above the canvas
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
    else if(ballEvent)
    {
        drawBall();
    }
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
    ballLoader++;
    if(ballLoader===BALL_REQ)
    {
        ballLoader=0;
        ballCount++;
    }
}

//this functions disables all the weapons buttons
function disableAllWeapons()
{
    let bombButton=document.getElementById("bombButton");
    bombButton.disabled = true;

    let freezeButton=document.getElementById("freezeRayButton");
    freezeButton.disabled = true;

    
    let ballButton=document.getElementById("ballButton");
    ballButton.disabled = true; 
}

//this functions enables all the weapons buttons
function enableAllWeapons()
{
    let bombButton=document.getElementById("bombButton");
    bombButton.disabled = false;
    
    let freezeButton=document.getElementById("freezeRayButton");
    freezeButton.disabled = false;
    
    let ballButton=document.getElementById("ballButton");
    ballButton.disabled = false;
}

//update all the weapons buttons
function updateWeapons()
{
    updateBombButton();
    updateFreezeButton();
    updateBallButton();
}

//#region Bomb region

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

//this function updates the bomb button text and disables/enables it accodring to the bomb count
function updateBombButton()
{
    let bombButton=document.getElementById("bombButton");
    bombButton.innerHTML = GET_BOMB_TEXT + bombCount;
    if(bombCount==0)
    {
        bombButton.disabled = true;
    }
    else
    {
        bombButton.disabled = false;
    }
}

//this function is called when the bomb button is clicked, it changes function based if it's the bomb event was triggered or not
function bombButtonClick()
{
    let bombButton=document.getElementById("bombButton");
    //if the user hasn't picked a bomb yet
    if(bombEvent==false)
    {
        //disable all weapons apart from bomb, set the bomb event flag to true and change the bomb button text to cancel
        disableAllWeapons();
        bombButton.disabled=false;
        bombEvent=true;
        bombButton.innerHTML = CANCEL_TEXT;
    }
    //else the user picked a bomb and clicked the button again instead of using it
    else
    {
        //enable all weapons and disable the bomb event, return button to its previous context
        enableAllWeapons();
        bombEvent=false;
        bombButton.innerHTML = GET_BOMB_TEXT + bombCount;
    }
}

//#endregion

//#region Freeze ray region

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

//this function updates the freeze ray button text and disables/enables it accodring to the bomb count
function updateFreezeButton()
{
    let freezeButton=document.getElementById("freezeRayButton");
    freezeButton.innerHTML = GET_FREEZE_TEXT + freezeCount;
    if(freezeCount==0)
    {
        freezeButton.disabled = true;
    }
    else
    {
        freezeButton.disabled = false;
    }
}

//this function is called when the freeze ray button is clicked, it changes function based if it's the freeze ray event was triggered or not
function freezeButtonClick()
{
    let freezeButton=document.getElementById("freezeRayButton");
    //if the user hasn't picked a freeze ray yet
    if(freezeEvent==false)
    {
        //disable all weapons apart from freeze ray, set the freeze ray event flag to true and change the freeze ray button text to cancel
        disableAllWeapons();
        freezeButton.disabled=false;
        freezeEvent=true;
        freezeButton.innerHTML = CANCEL_TEXT;
    }
    //else the user picked a freeze ray and clicked the button again instead of using it
    else
    {
        //enable all weapons and disable the freeze ray event, return button to its previous context
        enableAllWeapons();
        freezeEvent=false;
        freezeButton.innerHTML = GET_FREEZE_TEXT + freezeCount;
    }
}

//#endregion

//#region Bouncy ball region
//this function is responsible for how the ball is drawn on the canvas before it is released
function drawBall()
{
    //if the mouse is not on the canvas don't draw
    if(mouseX<0 || mouseY<0)
    {
        return;
    }
    
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let context = bubbleContainerElement.getContext("2d");

    context.fillStyle = ballColor;

    context.beginPath();
    context.arc(mouseX,mouseY,BALL_RADIUS,0,2*Math.PI);
    context.fill();
    
}

//this function updates the ball button text and disables/enables it accodring to the bomb count
function updateBallButton()
{
    let ballButton=document.getElementById("ballButton");
    //if the user hasn't picked a bomb yet
    ballButton.innerHTML = GET_BALL_TEXT + ballCount;
    if(ballCount==0)
    {
        ballButton.disabled = true;
    }
    else
    {
        ballButton.disabled = false;
    }
}

//this function is called when the ball button is clicked, it changes function based if it's the ball event was triggered or not
function ballButtonClick()
{
    let ballButton=document.getElementById("ballButton");
    if(ballEvent==false)
    {
        //disable all weapons apart from ball, set the ball event flag to true and change the ball button text to cancel
        disableAllWeapons();
        ballButton.disabled=false;
        ballEvent=true;
        ballButton.innerHTML = CANCEL_TEXT;
    }
    //else the user picked a ball and clicked the button again instead of using it
    else
    {
        //enable all weapons and disable the ball event, return button to its previous context
        enableAllWeapons();
        ballEvent=false;
        ballButton.innerHTML = GET_FREEZE_TEXT + freezeCount;
    }
}

//tests all bouncy balls in the array if they collide with another bubble and if so set the bubbles to be deleted
function checkAllBallCollision()
{
    //we should check each bubble against all other bubbles
    for(let ballRunner=0;ballRunner<activeBallArray.length;ballRunner++)
    {
        let currentBall=activeBallArray[ballRunner];
        //we don't need to run pn bubbles were already tested
        for(let bubbleRunner=0;bubbleRunner<bubbleArray.length;bubbleRunner++)
        {
            let currentBubble=bubbleArray[bubbleRunner];
            let isCollision=currentBall.checkCollison(currentBubble.xPos,currentBubble.yPos,currentBubble.radius);
            //if the ball encountred a ball that wasn't killed yet
            if(isCollision && currentBubble.isDelete==false)
            {
                //kill the bubble and update the weaponary
                currentBubble.kill();
                bubbleKilled++;
                loadWeapons();
                document.getElementById("bubbleClickCount").innerHTML=bubbleKilled;
                updateWeapons();
            }
        }
    }
}

//set deleteion for all balls that are out of the canvas frame
function checkOutofBoundBalls()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    let height=canvas.clientHeight;
    let width=canvas.clientWidth;

    for(let runner=0;runner<activeBallArray.length;runner++)
    {
        let ball=activeBallArray[runner];
        //if the bubble is already set to be deleted skip it
        if(ball.isDelete)
        {

        }
        //else of it is above the canvas
        else if(ball.yPos<0-ball.radius)
        {
            ball.kill();
        }
        //else if it exited the canvas below
        else if(ball.yPos>height+ball.radius)
        {
            ball.kill()
        }
        //else of it is exited the canvas to the left
        else if(ball.xPos<0-ball.radius)
        {
            ball.kill();
        }
        //else if it exited the canvas to the right
        else if(ball.xPos>width+ball.radius)
        {
            ball.kill()
        }
    }
}

//draw all the bouncy balls in the array on the canvas
function drawAllActiveBallsInArray()
{
    let canvas=document.getElementById("bubbleContainerCanvas");
    for(let i=0;i<activeBallArray.length;i++)
    {
        let ballToDraw=(activeBallArray[i]);
        if(!ballToDraw.isDelete)
        {
            ballToDraw.move(canvas.width,canvas.height);
            drawActiveBall(ballToDraw);
        }
    }
}

//this function is responsible for how the ball is drawn on the canvas after it is released
function drawActiveBall(ballToDraw)
{
    //TODO URGENT add velocity
    let bubbleContainerElement=document.getElementById("bubbleContainerCanvas");
    let context = bubbleContainerElement.getContext("2d");

    context.fillStyle = ballActiveColor;

    context.beginPath();
    context.arc(ballToDraw.xPos,ballToDraw.yPos,BALL_RADIUS,0,2*Math.PI);
    context.fill();
    
}

//remove all bubles that were flagges as killed from the array
function removeDeadBalls()
{
    let tempArray=[];
    for(let i=0;i<activeBallArray.length;i++)
    {
        //if the bubble isn't deleted
        if(!activeBallArray[i].isDelete)
        {
            //it stays in the array
            tempArray.push(activeBallArray[i]);
        }
    }
    activeBallArray=tempArray;
}
//#endregion

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
/*
document.getElementById("bombButton").onclick=bombButtonClick;
document.getElementById("freezeRayButton").onclick=freezeButtonClick;
document.getElementById("ballButton").onclick=ballButtonClick;
*/
window.requestAnimationFrame(animatedBoard);
//window.requestAnimationFrame(animatedBoardTest);

let canvas=document.getElementById("bubbleContainerCanvas");
canvas.addEventListener("click", (e)=>{clickEvent(e);});
canvas.addEventListener("mouseout", (e) => {mouseOutCanvas(e);});
canvas.addEventListener("mousemove", (e) => {mouseMoveCanvas(e);});
