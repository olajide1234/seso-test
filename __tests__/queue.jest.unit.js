const QueueModule = require('../solution/lib/queue');
const { Queue } = QueueModule;

describe('Queue test', () => {
    test('should enqueue and dequeue properly', () => {
        const queue = new Queue()

        queue.enqueue(4)
        queue.enqueue(5)
        queue.enqueue(8)
        queue.enqueue(9)

        expect(queue.dequeue()).toEqual(4);
        expect(queue.dequeue()).toEqual(5);
        expect(queue.peek()).toEqual(8);
        expect(queue.queueLength).toEqual(2);
        expect(queue.printQueue).toStrictEqual(new Map([
            [2, 8],
            [3, 9],
          ]));
    });
});