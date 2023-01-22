"use strict";

import { CANCEL_TEXT } from "../CONFIG.js"

export class Weapon
{
    constructor(buttonObj)
    {
        //holds the button object of the weapon
        this.buttonObj=buttonObj;
        //bool for if the weapon button was clicked and is ongoing
        this.selfEvent=false;
        //how much uses the weapon currently have
        this.weaponCount=0;
        //used to caclculate the weapon count according to each weapon bubble requirement
        this.fragmentCount=0;
        //used to calculate the offset of the drawing when the user hover with the unused weapon 
        this.outlineOffset=0;
        //placeholder for all weapon outline color
        this.outLineColor="black";
        //placeholder for weapons that create persistent objects
        this.persistentArray=[];
    }

    drawOnMouseOverEvent(context)
    {

    }

    loadSelf(killedBubbles)
    {

    }

    clickEvent(bubbleArray,mouseX,mouseY)
    {

    }

    disableButton()
    {
        this.buttonObj.disabled = true;
    }

    enableButton()
    {
        this.buttonObj.disabled = false;
    }

    updateButton()
    {
        
    }

    buttonClick()
    {

    }

    //reloading the weapon according to the bubbles killed
    genericLoad(killedBubbles,fragementRequired)
    {
        //take into account the previous fragement count
        let newValue=killedBubbles+this.fragmentCount;
        this.weaponCount += Math.floor(newValue/fragementRequired);
        this.fragmentCount=newValue % fragementRequired;
    }

    //the inherited function all descendats will overwrite
    loadSelf(killedBubbles)
    {

    }
    
    genericUpdateButton(weaponText,willNotEnableButton)
    {
        if(this.selfEvent)
        {
            this.buttonObj.innerHTML = CANCEL_TEXT;
        }
        else if(this.weaponCount==0)
        {
            this.buttonObj.innerHTML = weaponText + this.weaponCount;
            if(!willNotEnableButton)
            {
                this.disableButton();
            }
        }
        else
        {
            this.buttonObj.innerHTML = weaponText + this.weaponCount;
            if(!willNotEnableButton)
            {
                this.enableButton();
            }
        }
    }

    //the inherited function all descendats will overwrite
    updateButton(willNotEnableButton)
    {

    }

    genericButtonClick(weaponText)
    {
        //if the user hasn't picked a bomb yet
        if(this.selfEvent==false)
        {
            //set the bomb event flag to true and change the bomb button text to cancel
            this.selfEvent=true;
            this.buttonObj.innerHTML = CANCEL_TEXT;
        }
        //else the user picked a bomb and clicked the button again instead of using it
        else
        {
            //disable the bomb event, return button to its previous context
            this.selfEvent=false;
            this.buttonObj.innerHTML = weaponText + this.weaponCount;
        }
        this.enableButton();
    }

    //the inherited function all descendats will overwrite
    buttonClick()
    {

    }

    checkPersistentArrayCollision(bubbleArray)
    {
        return;
    }

    checkOutofPersistentItems(height,width)
    {
        return;
    }

    drawAllPersistentItemsInArray(context,height,width)
    {
        return;
    }

    removeDeadPersistentItems()
    {
        return;
    }
}