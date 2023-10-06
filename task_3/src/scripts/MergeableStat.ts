export interface MergeableStat {
    merge(anotherStat: MergeableStat): void;
}
