"use strict";

module.exports = function(animal_id){
    const animalData = {
        id: { 
            1: {name: "cat", habitat: "land"}, 
            2: {name: "dog", habitat: "land"},
            3: {name: "dolphin", habitat: "water"},
            4: {name: "eagle", habitat: "air"},
            5: {name: "crocodile", habitat: "land and water"}
        }
    }
    return animalData.id[animal_id];
}