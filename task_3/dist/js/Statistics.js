"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statistics = void 0;
//import { MergeableStat } from './MergeableStat';
class Statistics {
    constructor() {
        this.statDict = {};
    }
    log(winAmount, hitCount) {
        if ((winAmount < 0 || winAmount == Infinity) ||
            (hitCount <= 0 || hitCount == Infinity || hitCount % 1 != 0)) {
            throw new Error(`winAmount can be only 0 or any positive, \
                            finite number. The hitCount can be \
                            any positive finite integer number`);
        }
        else {
            let winAmountRounded = Math.round(winAmount * 10) / 10;
            if (this.statDict.hasOwnProperty(winAmountRounded))
                this.statDict[winAmountRounded] += hitCount;
            else
                this.statDict[winAmountRounded] = 1;
        }
    }
    getHitCount(winAmount) {
        if (this.statDict.hasOwnProperty(winAmount))
            return this.statDict[winAmount];
        else
            return 0;
    }
    merge(anotherStat) {
        for (const key of Object.keys(anotherStat.statDict).map((str) => parseFloat(str))) {
            if (this.statDict.hasOwnProperty(key))
                this.statDict[key] += anotherStat.statDict[key];
            else
                this.statDict[key] = anotherStat.statDict[key];
        }
    }
    print() {
        let thisDictKeys = Object.keys(this.statDict).map((str) => parseFloat(str)).sort();
        let sumAllWins = 0;
        let countAllHits = 0;
        for (const key of thisDictKeys) {
            sumAllWins += key * this.statDict[key];
            countAllHits += this.statDict[key];
        }
        console.log(`\nTotal win amount: ${sumAllWins}.`);
        console.log(`The average win amount: ${sumAllWins / countAllHits}`);
        let thisDictKeysPositives = thisDictKeys.filter((num) => num > 0);
        if (thisDictKeysPositives.length == 0)
            throw new Error(`No positive wins detected`);
        else {
            console.log(`The smallest non-zero win is \
                ${thisDictKeysPositives[0]}`);
            console.log(`The biggest win is \
                ${thisDictKeysPositives[thisDictKeysPositives.length - 1]}`);
        }
        console.log(`\nAll unique wins (sorted 0...9): `);
        for (let i = 0; i < thisDictKeys.length; i++) {
            let key = thisDictKeys[i];
            console.log(`${i + 1}. ${key}: ${this.statDict[key]}`);
        }
    }
}
exports.Statistics = Statistics;
;
