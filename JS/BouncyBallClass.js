"use strict";

import { BALL_RADIUS,BALL_MAX_LIFETIME,BALL_SPEED } from "./CONFIG.js"
import { CanvasObjectClass } from "./CanvasObjectClass.js"

export class BouncyBallClass extends CanvasObjectClass
{
    constructor(xPos,yPos)
    {
        super(xPos,yPos);
        this.radius=BALL_RADIUS;
        this.lifeTime=0;
        this.xSpeed=BALL_SPEED;
        this.ySpeed=BALL_SPEED;
    }

    move(canvasWidth,canvasHeight)
    {
        //if the ball is out of bounds on the x axis
        if (this.xPos+this.xSpeed > canvasWidth || this.xPos+this.xSpeed < 0) 
        {
            //reverse its x direction
            this.xSpeed=this.xSpeed*-1;
        }
        //if the ball is out of bounds on the y axis
        if (this.yPos+this.ySpeed > canvasHeight ||this.yPos+this.ySpeed < 0) 
        {
            //reverse its y direction
            this.ySpeed=this.ySpeed*-1;
        }

        this.xPos=this.xPos+this.xSpeed;
        this.yPos=this.yPos+this.ySpeed;


        if(this.lifeTime>BALL_MAX_LIFETIME)
        {
            this.kill();
        }
        else
        {
            this.lifeTime++;
        }
    }

    //checks if this ball and another circular object collide if so return true
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