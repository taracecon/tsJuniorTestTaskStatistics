import { Simulation } from './Simulation'
import { Statistics } from './Statistics'
import { CreateStatFn } from './CreateStatFn';

let createStatFn: CreateStatFn = () => { 
    return new Statistics() 
};

Simulation.runSimulation(createStatFn);

// Simulation.runSimulation( () => { return new Statistics() } );

