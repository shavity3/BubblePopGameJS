"use strict";

import { BUBBLE_SPEED_MAX,BUBBLE_SPEED_MIN,MAX_BUBBLE_RADIUS } from "./CONFIG.js"
import {v4 as uuidv4} from "https://cdn.skypack.dev/uuid";

//TODO: Do i need the UUID if I use canvas?

export class BubbleClass
//class BubbleClass
{
    constructor(xPos,yPos,direction)
    {
        this.speed=Math.random()*(BUBBLE_SPEED_MAX-BUBBLE_SPEED_MIN) + BUBBLE_SPEED_MIN;
        this.id=uuidv4();
        this.xPos=xPos;
        this.yPos=yPos;
        this.radius=MAX_BUBBLE_RADIUS;
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
    checkCollison(otherBubble)
    {
        //we check by looking at the two centers and seeing if the distance between them is less or equal to their combined radius
        

        let xCalc=Math.abs(this.xPos-otherBubble.xPos);
        let yCalc=Math.abs(this.yPos-otherBubble.yPos);
        //use pythagoras theorem to calculate the distance
        let distSquare=xCalc*xCalc+yCalc*yCalc;
        let radiusDistSquare=(this.radius+otherBubble.radius)*(this.radius+otherBubble.radius);
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