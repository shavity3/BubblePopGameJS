"use strict";

import { BubbleClass } from "./BubbleClass.js"
import { WeaponBomb } from "./WeaponBomb.js"
import { WeaponFreezeRay } from "./WeaponFreezeRay.js"
import { WeaponBouncyBall } from "./WeaponBouncyBall.js"


let weaponBombItem;
let weaponFreezeRayItem;
let weaponBouncyBall;

let weaponArray=[];

initArsenal(bombButtonObj,freezeRayButtonObj,bouncyBallButtonObj)
{
    initWeaponBomb(bombButtonObj);
    initWeaponFreezeRay(freezeRayButtonObj)
    initWeaponBouncyBall(bouncyBallButtonObj)
}

initWeaponBomb(buttonObj)
{
    weaponBombItem = new WeaponBomb(buttonObj);
    buttonObj.onclick=bombButtonClick;
    weaponArray.push(weaponBombItem);
}

initWeaponFreezeRay(buttonObj)
{
    weaponFreezeRayItem = new WeaponFreezeRay(buttonObj);
    buttonObj.onclick=freezeRayButtonClick;
    weaponArray.push(weaponFreezeRayItem);
}

initWeaponBouncyBall(buttonObj)
{
    weaponBouncyBall = new WeaponBouncyBall(buttonObj);
    buttonObj.onclick=bouncyBallButtonClick;
    weaponArray.push(weaponBouncyBall);
}

presistentItemsCollision(bubbleArray)
{
    let bubblesRemoved=0;
    for(let i=0;i<weaponArray.length;i++)
    {
        //if the weapon chosen has presistent obhects
        if(weaponArray[i].persistentArray.length>0)
        {
            bubblesRemoved+=weaponArray[i].checkPersistentArrayCollision(bubbleArray)
            weaponArray[i].checkOutofPersistentItems(height,width);
        }
    }

    loadWeapons(bubblesRemoved);
    updateWeaponButtons();
    return bubblesRemoved;
}

presistentItemsRemove()
{
    for(let i=0;i<weaponArray.length;i++)
    {
        //if the weapon chosen has presistent obhects
        if(weaponArray[i].persistentArray.length>0)
        {
            weaponArray[i].removeDeadPersistentItems();
        }
    }
}

presistentItemsDraw(canvas)
{
    for(let i=0;i<weaponArray.length;i++)
    {
        //if the weapon chosen has presistent obhects
        if(weaponArray[i].persistentArray.length>0)
        {
            weaponArray[i].drawAllPersistentItemsInArray(canvas);
        }
    }
}

clickEvent(bubbleArray,mouseX,mouseY)
{
    let bubblesRemoved=0;
    let wasEventTriggered=false;

    
    for(let i=0;i<weaponArray.length;i++)
    {
        if(weaponArray[i].selfEvent)
        {
            wasEventTriggered=true;
            bubblesRemoved+=weaponArray[i].clickEvent(bubbleArray,mouseX,mouseY);
        }
    }
   
    //if no event was triggered treat it as a normal click
    if(!wasEventTriggered)
    {
        let filterFunc=(bubble) => { return bubble.checkCollison(mouseX,mouseY,collisonRadius) };
        let items=bubbleArray.filter(filterFunc);
        for(let i=0;i<items.length;i++)
        {
            items[i].kill();
            bubblesRemoved++;
        }
    }

    loadWeapons(bubblesRemoved);
    updateWeaponButtons();
    return bubblesRemoved;
}

loadWeapons(bubblesRemoved)
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].loadSelf(bubblesRemoved);
    }
}

updateWeaponButtons();
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].updateButton();
    }
}

disableAllButtons()
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].disableButton();
    }
}

enableAllButtons()
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].enableButton();
    }
}

weaponClick(weaponObj)
{
    if(weaponObj.selfEvent)
    {
        weaponObj.buttonClick();
        enableAllButtons();
    }
    else
    {
        weaponObj.buttonClick();
        disableAllButtons();
    }
}

weaponMouseOverDraw(context,mouseX,mouseY)
{
    for(let i=0;i<weaponArray.length;i++)
    {
        //if the current weapon is the one that is currently activated
        if(weaponArray[i].selfEvent)
        {
            //draw it
            weaponArray[i].drawOnMouseOverEvent(context,mouseX,mouseY);
            //exit since we found the weapon to draw
            return;
        }
    }
}

bombButtonClick()
{
    weaponClick(weaponBombItem);
}

freezeRayButtonClick()
{
    weaponClick(weaponFreezeRayItem);
}

bouncyBallButtonClick()
{
    weaponClick(weaponBouncyBall);
}