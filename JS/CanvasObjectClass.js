"use strict";

export class CanvasObjectClass
{
    constructor(xPos,yPos)
    {
        this.xPos=xPos;
        this.yPos=yPos;
        this.isDelete=false;
    }
    
    move()
    {

    }

    kill()
    {
        this.isDelete=true;
    }

}