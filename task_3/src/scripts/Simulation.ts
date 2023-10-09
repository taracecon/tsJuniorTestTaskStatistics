import { LoggableStat } from './LoggableStat';
import { TestableStat } from './TestableStat';
import { Stat } from './Stat'
//import { StatCl } from './StatCl';
import { CreateStatFn } from './CreateStatFn';
import { MergeableStat } from './MergeableStat';

export class Simulation {
    private static readonly logIterationCount = 50000 
    private static readonly statsToTestCount = 10 

    static runSimulation(createStatFn: CreateStatFn): number {
        if (createStatFn == null)
            throw Error('create new stat function not specified');

        const startTime = Date.now();

        const resStat = Simulation.runSingleSim(createStatFn);
        resStat.print();

        const durationMs = Date.now() - startTime;
        console.log(`Simulation took ${durationMs}ms.`);

        return durationMs;
    }

    private static runSingleSim(createStatFn: CreateStatFn): Stat {
        
        // 1/4. Create statistics.
        const stats = [];
        for (let i = 0; i < Simulation.statsToTestCount; i++) 
            stats.push(createStatFn());
        
        // 2/4. Fill.
        for (const stat of stats) 
            Simulation.fillStat(stat);

        // 3/4. Merge all together.
        const resStat = Simulation.mergeStats(createStatFn, stats);

        // 4/4. Test.
        Simulation.testFinalStatWins(resStat);

        return resStat;        
    }

    private static fillStat(stat: LoggableStat): void {
        for (let i = 0; i < Simulation.logIterationCount; i++) {
            if (Math.random() < 0.5) {

                // 50% chance of no win.
                stat.log(0, 1);
                continue;
            }

            // [1,3.9999999999999999] -> [1,4] after rounding.
            const rndWinAmount =
                        Math.random() + Math.floor(Math.random() * 3) + 1; 

            // [1,2]
            const rndHitCount = Math.floor(Math.random() * 2) + 1; 

            stat.log(rndWinAmount, rndHitCount);
        }
    }

    // MergeableStat -> StatCl
    private static mergeStats(createStatFn: CreateStatFn, 
                                    stats: MergeableStat[]): Stat {
        const resStat = createStatFn();
        for (const stat of stats) {
            resStat.merge(stat);
        }
        return resStat;
    }

    private static testFinalStatWins(stat: TestableStat): void {

        // 50% of getting zero in each test. 
        const expectedZerosHitCount =
            (Simulation.logIterationCount / 2) * Simulation.statsToTestCount;      
        Simulation.testSingleWin(stat, 0, expectedZerosHitCount);

        const winAmountSmallestIncl = 1;

        // changed from 0.1 to 1/10 to avoid .0000000002 and similar
        const smallestWinAmountStep = 1/10; 
        const winAmountBiggestIncl = 4;

        // Test all values in the middle.
        const expectedMiddleHitCount = expectedZerosHitCount / 2 / 10;
        for (
            let winAmount = 
                        (winAmountSmallestIncl + smallestWinAmountStep) * 10;     
            winAmount < winAmountBiggestIncl;                    
            winAmount += smallestWinAmountStep           
        ) {
            console.log(`winAmount:`, winAmount  )
            Simulation.testSingleWin(
                stat,
                winAmount,
                expectedMiddleHitCount
            );
        }

        // Test lower and upper range.
        const expectedEdgesZerosHitCount = expectedMiddleHitCount / 2;
        Simulation.testSingleWin(
            stat,
            winAmountSmallestIncl,
            expectedEdgesZerosHitCount
        );

        Simulation.testSingleWin(
            stat,
            winAmountBiggestIncl,
            expectedEdgesZerosHitCount
        );

        // Test out of the range.
        Simulation.testSingleWin(
            stat,
            winAmountSmallestIncl - smallestWinAmountStep,
            0
        );

        Simulation.testSingleWin(
            stat,
            winAmountBiggestIncl + smallestWinAmountStep,
            0
        );
    }

    private static testSingleWin(
        stat: TestableStat,
        testableWinAmount: number,
        expectedHitsCount: number
    ): void {
        const discrepancy = 0.1;
        const currWinHitCount = stat.getHitCount(testableWinAmount);
        if (
            !Simulation.checkIsValueInRange(
                currWinHitCount,
                expectedHitsCount,
                discrepancy
            )
        ) {
            throw new Error(
                `Statistics contains incorrect data: there are \
                ${currWinHitCount} hits of "${testableWinAmount}" but expected\
                ${expectedHitsCount} +/-${discrepancy * 100}% hits.`
            );
        }
    }

    private static checkIsValueInRange(
        currentValue: number,
        referenceValue: number,
        discrepancy: number
    ): boolean {
        return (
            currentValue === referenceValue ||
            (currentValue > referenceValue * (1 - discrepancy) &&
            referenceValue * (1 + discrepancy) > currentValue)
        );
    }
}