"use strict";

import { Weapon } from "./Weapon.js"
import { GET_FREEZE_TEXT,FREEZE_RADIUS,FREEZE_LINE_DASH,FREEZE_LINE_MAX_OFFSET,FREEZE_REQ,FREEZE_COLOR } from "../CONFIG.js"

export class WeaponFreezeRay extends Weapon
{
    constructor(buttonObj)
    {
        super(buttonObj);
        this.outLineColor=FREEZE_COLOR;
    }

    drawOnMouseOverEvent(context,mouseX,mouseY)
    {
        //if the mouse is not on the canvas don't draw
        if(mouseX<0 || mouseY<0)
        {
            return;
        }
    
        context.strokeStyle = this.outLineColor;
        context.setLineDash([FREEZE_LINE_DASH, FREEZE_LINE_DASH]);
    
        if(this.outlineOffset>FREEZE_LINE_MAX_OFFSET)
        {
            this.outlineOffset=0;
        }
        else
        {
            this.outlineOffset++;
        }
    
        context.lineDashOffset  = this.outlineOffset;
    
        context.beginPath();
        context.arc(mouseX,mouseY,FREEZE_RADIUS,0,2*Math.PI);
        context.stroke();
    }

    //reloading the weapon according to the bubbles killed
    loadSelf(killedBubbles)
    {
        this.genericLoad(killedBubbles,FREEZE_REQ);
    }

    updateButton(willNotEnableButton)
    {
        this.genericUpdateButton(GET_FREEZE_TEXT,willNotEnableButton);
    }

    buttonClick()
    {
        this.genericButtonClick(GET_FREEZE_TEXT);
    }

    clickEvent(bubbleArray,mouseX,mouseY)
    {
        let killedBubbles=0;

        let collisonRadius=FREEZE_RADIUS;
        this.weaponCount--;
        this.selfEvent=false;

        let filterFunc=(bubble) => { return bubble.checkCollison(mouseX,mouseY,collisonRadius) };
        let items=bubbleArray.filter(filterFunc);

        for(let i=0;i<items.length;i++)
        {
            items[i].speed= 0;
        }

        return killedBubbles;
    }
}