<img align="left" width="100px" height="100px" src="/assets/seso-eng-logo.png">

# Seso Engineering | Challenge: Log Sorting

<br>

## Approach:
The objective is straightforward: merge an unspecified number of sorted arrays into a priority sequence, with arrays of variable lengths and contents.

To address this, I've opted for a MinHeap, implemented as a priority queue, as the most suitable data structure. The MinHeap significantly reduces the time complexity of sorting the logs. However, our problem entails additional unique constraints: space complexity, where we aim to minimize memory usage due to the unpredictable log sizes, and the asynchronous nature of certain log sources.

Given the requirement to print logs chronologically, employing a MinHeap as a priority queue offers swift access to the log with the lowest value for printing (O(1)). Moreover, the MinHeap ensures rapid insertion of new logs into the data structure while preserving their chronological order (O(log(N))).

The approach is simple: initialize a MinHeap using an initial set of elements from all log sources. Subsequently, we extract and print the minimum item from the heap, remove it, and replace it with another log from the same source. This strategy maintains a fixed space usage equivalent to the number of log sources with data at the outset (O(N)). Additionally, the MinHeap offers reasonable insertion time complexity (O(log(N))).

#### Synchronous merge
Our time complexity is O(s * n * log s) due to our usage of minHeap. 
The space complexity is O(s) since only s logSources are stored in the minHeap.
The sync merge only has time and space complexity issues.

Here are the performance results:
Device: Apple M1; 8GB Ram
Node: v21.7.1

<img width="536" alt="Screenshot 2024-04-06 at 10 47 26 AM" src="https://github.com/olajide1234/seso-test/assets/42445456/4108ee20-2e09-429e-a129-a525ed880489">



#### Asynchronous merge
The asynchronous merge presents an additional bottleneck in the form of the wait time for the asynchronous call to resolve. The duration for the logs to be returned from the async source is uncertain, complicating the management of their retrieval. To mitigate this challenge, we've introduced an auxiliary queue responsible for preemptively fetching logs from the async sources, thereby maintaining a queue of logs readily available for addition to the heap.

Navigating the realm of asynchronous sources requires a delicate balance. The resolution of multiple async functions poses a bottleneck, necessitating a cautious approach. On one hand, fetching an excessive amount of logs into memory simultaneously can be problematic due to the potentially immense size of the logs, impacting space complexity. On the other hand, waiting excessively for promise resolution before printing could result in undue delays.

I propose the implementation of a queue or cache with a configurable buffer length to address this challenge. This solution allows us to fine-tune the amount of logs loaded into memory, optimizing resource usage. Furthermore, deploying this queue within a background process would optimize its performance and ensure it does not impede the main running process. Leveraging multi-threading, particularly on machines equipped with multiple cores, could further enhance efficiency in managing these asynchronous operations.

For our impementation, we wait for the cache to deplete to about 1/4 before refilling it up again. This adds around 10% improvement to the async print performance.

The time complexity is O(s * n * log s) due to our usage of minHeap. 
The space complexity is O(s * MAX_FETCH) due to the extra queue to fetch more logs proactively.

Here are the performance results:
Device: Apple M1; 8GB Ram
Node: v21.7.1
<img width="532" alt="Screenshot 2024-04-06 at 10 46 58 AM" src="https://github.com/olajide1234/seso-test/assets/42445456/3dbec6f9-c2f9-44af-8fb8-37f23cbdbce4">



## Instructions

We have a number of [**log sources**](https://github.com/sesolabor/coding-challenge/blob/master/lib/log-source.js). Each log source contains N log entries. Each entry is a javascript object with a timestamp and message. We don't know the number of log entries each source contains - however - we do know that the entries within each source are sorted 🕒 **chronologically** 🕒.

### The Objectives:

1. **_Drain all of the log sources_** for both the synchronous and asynchronous solutions.
   - [Synchronous](https://github.com/sesolabor/coding-challenge/blob/31313e303c53cebb96fa02f3aab473dd011e1d16/lib/log-source.js#L37)
   - [Asynchronous](https://github.com/sesolabor/coding-challenge/blob/31313e303c53cebb96fa02f3aab473dd011e1d16/lib/log-source.js#L45)
1. Print all of the entries, across all of the sources, in chronological order.
   - We don't need to store the log entries, just print them to stdout.
1. Do this _efficiently_. There are time and space complexities afoot!

We expect candidates to spend 1-3 hours on this exercise.

**We want to see you flex your CS muscles!!! Use the appropriate data structures to satisfy the time and space complexities inherent to the problem!!!**

## Pointers & Callouts

- We don't know how many logs each source contains. A source could contain millions of entries and be exabytes in size! In other words, reading the entirety of a log source into memory won't work well.
- Log sources could contain logs from last year, from yesterday, even from 100 years ago. We won't know the timeframe of a log source until we start looking.
- Consider what would happen when asked to merge 1 million log sources. Where might bottlenecks arise?

There are two parts of the challenge which you'll see when diving into things. You can get started by running `npm start`.

## Submitting

Create a GitHub repo and email your point of contact the link.

If - for whatever reason - you cannot create a GitHub repo for this challenge, it is also acceptable to 'zip' the directory and provide your submission as an email attachment.
