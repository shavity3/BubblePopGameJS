"use strict";

import { BUBBLE_SPEED_MAX,BUBBLE_SPEED_MIN,MAX_BUBBLE_RADIUS,MIN_BUBBLE_RADIUS } from "./CONFIG.js"
import { CanvasObjectClass } from "./CanvasObjectClass.js"

//const values for creating random colors
const MIN_R_VALUE=155;
const MAX_R_VALUE=255;

const MIN_G_VALUE=155;
const MAX_G_VALUE=255;

const MIN_B_VALUE=155;
const MAX_B_VALUE=255;


export class BubbleClass extends CanvasObjectClass
//class BubbleClass
{
    constructor(xPos,yPos,direction)
    {
        super(xPos,yPos);
        this.speed=Math.random()*(BUBBLE_SPEED_MAX-BUBBLE_SPEED_MIN) + BUBBLE_SPEED_MIN;
        this.radius=Math.random()*(MAX_BUBBLE_RADIUS-MIN_BUBBLE_RADIUS) + MIN_BUBBLE_RADIUS;
        this.direction=direction;
        let rValue=Math.round(Math.random()*(MAX_R_VALUE-MIN_R_VALUE) + MIN_R_VALUE);
        let gValue=Math.round(Math.random()*(MAX_G_VALUE-MIN_G_VALUE) + MIN_G_VALUE);
        let bValue=Math.round(Math.random()*(MAX_B_VALUE-MIN_B_VALUE) + MIN_B_VALUE);

        this.color="rgba(" + rValue +"," + gValue + "," + bValue + ",0.9)";
    }

    move()
    {
        this.yPos+=this.speed*this.direction;
    }

    //checks if this bubble an another circular object collide if so return true
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