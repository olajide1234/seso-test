const MinHeapModule = require('../solution/lib/minHeap');
const { Node, MinHeap } = MinHeapModule;

describe('MinHeap test', () => {
  test('should insert data correctly', () => {
    const data = [
        { val: 3, object: 'three', sourceIndex: 3},
        { val: 1, object: 'one', sourceIndex: 1},
        { val: 2, object: 'two', sourceIndex: 2},
        { val: 4, object: 'four', sourceIndex: 4},
    ];

    const heap = new MinHeap();

    data.forEach((item) => heap.insert(item.val, item.object, item.sourceIndex));

    expect(heap.data).toStrictEqual([
      new Node(data[1].val, data[1].object, data[1].sourceIndex),
      new Node(data[0].val, data[0].object, data[0].sourceIndex ),
      new Node(data[2].val, data[2].object, data[2].sourceIndex ),
      new Node(data[3].val, data[3].object, data[3].sourceIndex ),
    ]);
  });


  test('should replace minimum correctly', () => {
    const data = [
        { val: 3, object: 'three', sourceIndex: 3},
        { val: 5, object: 'five', sourceIndex: 5},
        { val: 2, object: 'two', sourceIndex: 2},
        { val: 4, object: 'four', sourceIndex: 4},
    ];

    const heap = new MinHeap();

    data.forEach((item) => heap.insert(item.val, item.object, item.sourceIndex));

    heap.changeMin(1, 'one', 1);

    expect(heap.data).toStrictEqual([
      new Node(1,'one', 1),
      new Node(data[3].val, data[3].object, data[3].sourceIndex),
      new Node(data[0].val, data[0].object, data[0].sourceIndex ),
      new Node(data[1].val, data[1].object, data[1].sourceIndex ),
    ]);
  });

});
