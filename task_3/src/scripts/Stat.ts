import { MergeableStat } from './MergeableStat'
import { TestableStat }  from './TestableStat'
import { LoggableStat } from './LoggableStat';

export interface Stat extends LoggableStat, MergeableStat, TestableStat {
    print(): void;
}