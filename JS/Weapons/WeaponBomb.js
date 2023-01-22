"use strict";

import { Weapon } from "./Weapon.js"

const GET_BOMB_TEXT = "Number of Bombs: ";

const BOMB_RADIUS = 50;
const BOMB_LINE_DASH=4;
const BOMB_LINE_MAX_OFFSET=16;
const BOMB_REQ=3;

const BOMB_COLOR = "red";

export class WeaponBomb extends Weapon
{
    constructor(buttonObj)
    {
        super(buttonObj);
        this.outLineColor=BOMB_COLOR;
    }

    drawOnMouseOverEvent(context,mouseX,mouseY)
    {
        //if the mouse is not on the canvas don't draw
        if(mouseX<0 || mouseY<0)
        {
            return;
        }
    
        context.strokeStyle = this.outLineColor;
        context.setLineDash([BOMB_LINE_DASH, BOMB_LINE_DASH]);
    
        if(this.outlineOffset>BOMB_LINE_MAX_OFFSET)
        {
            this.outlineOffset=0;
        }
        else
        {
            this.outlineOffset++;
        }
    
        context.lineDashOffset  = this.outlineOffset;
    
        //intersting effect but not what I wanted
        //context.lineWidth = this.outlineOffset;
    
        context.beginPath();
        context.arc(mouseX,mouseY,BOMB_RADIUS,0,2*Math.PI);
        context.stroke();
    }

    //reloading the weapon according to the bubbles killed
    loadSelf(killedBubbles)
    {
        this.genericLoad(killedBubbles,BOMB_REQ);
    }

    updateButton()
    {
        this.genericUpdateButton(GET_BOMB_TEXT);
    }

    buttonClick()
    {
        this.genericButtonClick(GET_BOMB_TEXT);
    }

    clickEvent(bubbleArray,mouseX,mouseY)
    {
        let killedBubbles=0;

        let collisonRadius=BOMB_RADIUS;
        this.weaponCount--;
        this.selfEvent=false;

        let filterFunc=(bubble) => { return bubble.checkCollison(mouseX,mouseY,collisonRadius) };
        let items=bubbleArray.filter(filterFunc);

        for(let i=0;i<items.length;i++)
        {
            items[i].kill();
            killedBubbles++;
        }

        return killedBubbles;
    }
}