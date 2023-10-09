import { Simulation } from './Simulation'
import { StatCl } from './StatCl'
//import { Stat } from './Stat';
import { CreateStatFn } from './CreateStatFn';

let createStatFn: CreateStatFn = () => { 
    return new StatCl() 
};

Simulation.runSimulation(createStatFn);

