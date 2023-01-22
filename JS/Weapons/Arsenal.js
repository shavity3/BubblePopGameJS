"use strict";

import { BubbleClass } from "../BubbleClass.js"
import { WeaponBomb } from "./WeaponBomb.js"
import { WeaponFreezeRay } from "./WeaponFreezeRay.js"
import { WeaponBouncyBall } from "./WeaponBouncyBall.js"


let weaponBombItem;
let weaponFreezeRayItem;
let weaponBouncyBall;

let weaponArray=[];

let stopEnablingButtons=false;

export function initArsenal(bombButtonObj,freezeRayButtonObj,bouncyBallButtonObj)
{
    initWeaponBomb(bombButtonObj);
    initWeaponFreezeRay(freezeRayButtonObj)
    initWeaponBouncyBall(bouncyBallButtonObj)
}

function initWeaponBomb(buttonObj)
{
    weaponBombItem = new WeaponBomb(buttonObj);
    buttonObj.onclick=bombButtonClick;
    weaponArray.push(weaponBombItem);
}

function initWeaponFreezeRay(buttonObj)
{
    weaponFreezeRayItem = new WeaponFreezeRay(buttonObj);
    buttonObj.onclick=freezeRayButtonClick;
    weaponArray.push(weaponFreezeRayItem);
}

function initWeaponBouncyBall(buttonObj)
{
    weaponBouncyBall = new WeaponBouncyBall(buttonObj);
    buttonObj.onclick=bouncyBallButtonClick;
    weaponArray.push(weaponBouncyBall);
}

export function presistentItemsCollision(bubbleArray)
{
    let bubblesRemoved=0;
    for(let i=0;i<weaponArray.length;i++)
    {
        //if the weapon chosen has presistent obhects
        if(weaponArray[i].persistentArray.length>0)
        {
            bubblesRemoved+=weaponArray[i].checkPersistentArrayCollision(bubbleArray);
        }
    }

    loadWeapons(bubblesRemoved);
    updateWeaponButtons(stopEnablingButtons);
    return bubblesRemoved;
}

export function presistentItemsOutOfBounds(width,height)
{
    for(let i=0;i<weaponArray.length;i++)
    {
        //if the weapon chosen has presistent obhects
        if(weaponArray[i].persistentArray.length>0)
        {
            weaponArray[i].checkOutofPersistentItems(width,height);
        }
    }
}

export function presistentItemsRemove()
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

export function presistentItemsDraw(context,width,height)
{
    for(let i=0;i<weaponArray.length;i++)
    {
        //if the weapon chosen has presistent obhects
        if(weaponArray[i].persistentArray.length>0)
        {
            weaponArray[i].drawAllPersistentItemsInArray(context,width,height);
        }
    }
}

export function clickEvent(bubbleArray,mouseX,mouseY)
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
        let filterFunc=(bubble) => { return bubble.checkCollison(mouseX,mouseY,0) };
        let items=bubbleArray.filter(filterFunc);
        for(let i=0;i<items.length;i++)
        {
            items[i].kill();
            bubblesRemoved++;
        }
    }

    loadWeapons(bubblesRemoved);
    //since if their was a weapon it was used in the click the program always udates the buttons
    stopEnablingButtons=false;
    updateWeaponButtons(stopEnablingButtons);
    return bubblesRemoved;
}

export function loadWeapons(bubblesRemoved)
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].loadSelf(bubblesRemoved);
    }
}

export function updateWeaponButtons(willNotEnableButton)
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].updateButton(willNotEnableButton);
    }
}

export function disableAllButtons()
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].disableButton();
    }
}

export function enableAllButtons()
{
    for(let i=0;i<weaponArray.length;i++)
    {
        weaponArray[i].enableButton();
    }
}

export function weaponClick(weaponObj)
{
    if(weaponObj.selfEvent)
    {
        stopEnablingButtons=false;
        enableAllButtons();
        weaponObj.buttonClick();
    }
    else
    {
        stopEnablingButtons=true;
        disableAllButtons();
        weaponObj.buttonClick();
    }
}

export function weaponMouseOverDraw(context,mouseX,mouseY)
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

export function bombButtonClick()
{
    weaponClick(weaponBombItem);
}

export function freezeRayButtonClick()
{
    weaponClick(weaponFreezeRayItem);
}

export function bouncyBallButtonClick()
{
    weaponClick(weaponBouncyBall);
}