"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Simulation_1 = require("./Simulation");
const StatCl_1 = require("./StatCl");
let createStatFn = () => {
    return new StatCl_1.StatCl();
};
Simulation_1.Simulation.runSimulation(createStatFn);
