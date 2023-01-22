"use strict";

import { Weapon } from "./Weapon.js"
import { BouncyBallClass } from "../BouncyBallClass.js"

const GET_BALL_TEXT = "Number of Bouncy Balls: ";

const BALL_RADIUS = 30;
const BALL_REQ=5;

let outlineBallColor="rgba(128,0,128,0.4)";
let ballActiveColor="rgb(128,0,128)";

export class WeaponBouncyBall extends Weapon
{
    constructor(buttonObj)
    {
        super(buttonObj);
        this.outLineColor=outlineBallColor;
    }

    drawOnMouseOverEvent(context,mouseX,mouseY)
    {
        //if the mouse is not on the canvas don't draw
        if(mouseX<0 || mouseY<0)
        {
            return;
        }

        context.fillStyle = ballColor;
    
        context.beginPath();
        context.arc(mouseX,mouseY,BALL_RADIUS,0,2*Math.PI);
        context.fill();
    }

    //reloading the weapon according to the bubbles killed
    loadSelf(killedBubbles)
    {
        this.genericLoad(killedBubbles,BALL_REQ);
    }

    updateButton()
    {
        this.genericUpdateButton(GET_BALL_TEXT);
    }

    buttonClick()
    {
        this.genericButtonClick(GET_BALL_TEXT);
    }

    clickEvent(bubbleArray,mouseX,mouseY)
    {
        let killedBubbles=0;

        let collisonRadius=BALL_RADIUS;
        this.weaponCount--;
        this.selfEvent=false;
        this.persistentArray.push(new BouncyBallClass(mouseX,mouseY));

        let filterFunc=(bubble) => { return bubble.checkCollison(mouseX,mouseY,collisonRadius) };
        let items=bubbleArray.filter(filterFunc);

        for(let i=0;i<items.length;i++)
        {
            items[i].kill();
            killedBubbles++;
        }

        return killedBubbles;
    }

    //tests all bouncy balls in the array if they collide with another bubble and if so set the bubbles to be deleted
    checkPersistentArrayCollision(bubbleArray)
    {
        let killedBubbles=0;

        //we should check each bubble against all other bubbles
        for(let ballRunner=0;ballRunner<this.persistentArray.length;ballRunner++)
        {
            let currentBall=this.persistentArray[ballRunner];
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
                    killedBubbles++;

                    /*
                    loadWeapons();
                    document.getElementById("bubbleClickCount").innerHTML=bubbleKilled;
                    updateWeapons();
                    */
                }
            }
        }
    }

    //set deleteion for all balls that are out of the canvas frame
    checkOutofPersistentItems(height,width)
    {
        for(let runner=0;runner<this.persistentArray.length;runner++)
        {
            let ball=this.persistentArray[runner];
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
    drawAllPersistentItemsInArray(canvas)
    {
        for(let i=0;i<this.persistentArray.length;i++)
        {
            let ballToDraw=(this.persistentArray[i]);
            if(!ballToDraw.isDelete)
            {
                ballToDraw.move(canvas.width,canvas.height);
                drawActiveBall(ballToDraw);
            }
        }
    }

    //this function is responsible for how the ball is drawn on the canvas after it is released
    drawActiveBall(ballToDraw,canvas)
    {
        //TODO URGENT add velocity
        let context = canvas.getContext("2d");
    
        context.fillStyle = ballActiveColor;
    
        context.beginPath();
        context.arc(ballToDraw.xPos,ballToDraw.yPos,BALL_RADIUS,0,2*Math.PI);
        context.fill();
        
    }
    
    //remove all bubles that were flagges as killed from the array
    removeDeadPersistentItems()
    {
        let tempArray=[];
        for(let i=0;i<this.persistentArray.length;i++)
        {
            //if the bubble isn't deleted
            if(!this.persistentArray[i].isDelete)
            {
                //it stays in the array
                tempArray.push(this.persistentArray[i]);
            }
        }
        this.persistentArray=tempArray;
    }
}