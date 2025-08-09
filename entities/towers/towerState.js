/**
 * class used to get input from script in main the basic blue tower is default
 *               
 * @author:    Quetzalcoatl
 * Created:   31.03.2025
 **/

let chosenTower = "basic";
let lastSelectedTower = "basic";

export function setChosenTower(typeIn){
    chosenTower = typeIn;
    lastSelectedTower = typeIn; // Store the last selected tower
}

export function getChosenTower(){
    if (chosenTower != null){
        return chosenTower;
    } 
    return "basic";
}

export function getLastSelectedTower(){
    return lastSelectedTower;
}

export function setLastSelectedTower(towerType){
    lastSelectedTower = towerType;
}