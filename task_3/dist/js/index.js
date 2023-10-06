"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Simulation_1 = require("./Simulation");
const Statistics_1 = require("./Statistics");
let createStatFn = () => {
    return new Statistics_1.Statistics();
};
Simulation_1.Simulation.runSimulation(createStatFn);
// Simulation.runSimulation( () => { return new Statistics() } );
