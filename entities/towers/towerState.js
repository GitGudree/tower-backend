/**
 * class used to get input from script in index
 *               
 * @author:    Quetzalcoatl
 * Created:   31.03.2025
 **/

let chosenTower ="";
export function setChosenTower(typeIn){
    chosenTower = typeIn
    console.log("valgte tower" +" "+ chosenTower)
}

export function getChosenTower(){
    return chosenTower;
}