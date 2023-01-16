"use strict";

import { BUBBLE_SPEED_MAX,BUBBLE_SPEED_MIN,MAX_BUBBLE_RADIUS,MIN_BUBBLE_RADIUS } from "./CONFIG.js"

//TODO: Do i need the UUID if I use canvas?

export class BubbleClass
//class BubbleClass
{
    constructor(xPos,yPos,direction)
    {
        this.speed=Math.random()*(BUBBLE_SPEED_MAX-BUBBLE_SPEED_MIN) + BUBBLE_SPEED_MIN;
        this.xPos=xPos;
        this.yPos=yPos;
        //this.radius=MAX_BUBBLE_RADIUS;
        this.radius=Math.random()*(MAX_BUBBLE_RADIUS-MIN_BUBBLE_RADIUS) + MIN_BUBBLE_RADIUS;
        this.direction=direction;
        this.isDelete=false;
        //this.color=2;
    }

    move()
    {
        this.yPos+=this.speed*this.direction;
    }

    kill()
    {
        this.isDelete=true;
    }

    //checks if this bubble an another collide if so return true
    checkCollison(xPoint,yPoint,radius)
    {
        //we check by looking at the two centers and seeing if the distance between them is less or equal to their combined radius
        

        let xCalc=Math.abs(this.xPos-xPoint);
        let yCalc=Math.abs(this.yPos-yPoint);
        //use pythagoras theorem to calculate the distance
        let distSquare=xCalc*xCalc+yCalc*yCalc;
        let radiusDistSquare=(this.radius+radius)*(this.radius+radius);
        if(distSquare<=radiusDistSquare)
        {
            return true;
        }
        else
        {
            return false;
        }
    }


}