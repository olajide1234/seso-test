"use strict";

// Print all entries, across all of the sources, in chronological order.
const MinHeapModule = require('../solution/lib/minHeap');
const { MinHeap } = MinHeapModule;

/**
 * The time complexity is O(s * n * log s) due to our usage of minHeap. 
 * The space complexity is O(s) since only s logSources are stored in the minHeap.
 *
 * Here, s represents the number of log sources, 
 * while e represents the number of log entries for each log source
 */

module.exports = (logSources, printer) => {
  const heap = new MinHeap();
  let countOfSourcesWithLogs = 0;

  // Init heap
  logSources.forEach((logSource, i) => {
    const log = logSource.pop();
    if (log) {
      countOfSourcesWithLogs ++;
      // Lets extend the log data with an index of the source log, so we know which source the log came from
      heap.insert(log.date.getTime(), log, i);
    } else {
      // Nothing to do, source is drained already. This is an early exit, we don't even waste time with an already drained source
      // We can add a nice warning messsage here
    }
  });

  // As long as we have sources available, we have something to log; else we exit early
  while (countOfSourcesWithLogs > 0) {
    const { object, sourceIndex } = heap.fetchMin();
    printer.print(object);

    const nextLogFromSource = logSources[sourceIndex].pop();

    // Now that we have used the min, we need to replace it.
    // Attempting to replace with the next log from the source might slightly reduce our bubble down time
    if (nextLogFromSource) {
      heap.changeMin(nextLogFromSource.date.getTime(), nextLogFromSource, sourceIndex);
    } else {
      // Else we just do a standard min replacement 
      countOfSourcesWithLogs --;
      heap.changeMin()
    }
  }

  printer.done();
};
