"use strict";

// Print all entries, across all of the *async* sources, in chronological order.
const MinHeapModule = require('../solution/lib/minHeap');
const { MinHeap } = MinHeapModule;

// There is some balancing act here for async sources. Await resolving is a bottleneck. We do not want to fetch too much logs into memory at a time, the logs can be really huge - space complexity
// However, we also do not want to be waiting too much for the promise to resolve before printing, we could potentially wait too long.
// My suggested solution will be a queue or cache with a configurable buffer length. So we can adjust to load the optimal amount of logs into memory.
// We should put this queue in some background processs to optimize it and make sure it does not block the main running process. Perhaps using multi threading if our machine has multiple cores

/**
 * The time complexity is O(s * n * log s) due to our usage of minHeap. 
 * The space complexity is O(s * MAX_FETCH)
 *
 * Here, s represents the number of log sources, 
 * while e represents the number of log entries for each log source
 */

module.exports = async (logSources, printer) => {
  try {
    const MAX_FETCH = 300;
    let moreResultExists = true;
    const heap = new MinHeap();
    let countOfSourcesWithLogs = 0;

    const firstSetOfLogs = await Promise.all(logSources.map((log) => log.popAsync()));

    // Init heap
    firstSetOfLogs.forEach((log, i) => {
      if (log) {
        countOfSourcesWithLogs++;
        // Lets extend the log data with an index of the source log, so we know which source the log came from
        heap.insert(log.date.getTime(), log, i);
      } else {
        // Nothing to do, source is drained already. This is an early exit, we don't even waste time with an already drained source
        // We can add a nice warning messsage here
      }
    });

    const resultCache = logSources.map(_ => []);
    await hydrateCache(); // Initial cache hydration.

    async function hydrateCache() { // This is a mimick. If I had more time, this will live in a separate process to avoid blocking the thread. For now, we manage the optimization of awaiting multiple promises at once. This has a tradeoff of cold start to initialize cache.
      try {
        if (moreResultExists && resultCache.find(cache => cache.length < (MAX_FETCH/3))) { // Top up cache when depleted to less than third. This improves the performance by around 10%.
          while (moreResultExists && resultCache.find(cache => cache.length < MAX_FETCH)) {
            const nextLogs = await Promise.all(logSources.map((source) => { // Using top level Promise.all so that all the promises resolve in parallel
                return source.drained ? false : source.popAsync();
            }));
            if (nextLogs.every(log => log === false)) {
              moreResultExists =  false
            }
            nextLogs.forEach((nextLog, i) => {
              resultCache[i].push(nextLog)
            });
        }
        return
      }
        return
    } catch (e) {
      console.log('Unable to hydrate cache', e)
    }
  }

    async function getResultFromCache(index) {
    const log = resultCache[index].shift(); // Not a true queue in JS, we could avoid shifting by moving cursor (or other crafty solutions), but those would leave a lot of printed logs in the memory. - space complexity. We will sacrifice with a shift, that is O(number of sources * MAX_FETCH) complexity
    await hydrateCache();
    return log
  }

  // As long as we have sources available, we have something to log; else we exit early
  while (countOfSourcesWithLogs > 0) {
    const { object, sourceIndex } = heap.fetchMin();
    printer.print(object);


    const nextLogFromSource = await getResultFromCache(sourceIndex); // need to fetch this from queue
    // Now that we have used the min, we need to replace it.
    // Attempting to replace the next log from the source might slightly reduce our bubble down time
    if (nextLogFromSource) {
      heap.changeMin(nextLogFromSource.date.getTime(), nextLogFromSource, sourceIndex);
    } else {
      // Else we just do a standard min replacement 
      countOfSourcesWithLogs--;
      heap.changeMin()
    }
  }

  printer.done();

} catch (e) {
  console.log("Error completing async sort", e)
}
};
