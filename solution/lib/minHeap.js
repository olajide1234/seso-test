
class Node {
    constructor(val, object, sourceIndex) {
        this.val = val;
        this.object = object;
        this.sourceIndex = sourceIndex
    }
};

class MinHeap {
    constructor() {
        this.data = [];
    }

    _swap(parentIndex, childIndex) {
        // A more involved swap since we are dealing with objects
        const tempVal = this.data[parentIndex].val;
        const tempObject = this.data[parentIndex].object;
        const tempSourceIndex = this.data[parentIndex].sourceIndex;

        this.data[parentIndex].val = this.data[childIndex].val;
        this.data[parentIndex].object = this.data[childIndex].object;
        this.data[parentIndex].sourceIndex = this.data[childIndex].sourceIndex;

        this.data[childIndex].val = tempVal;
        this.data[childIndex].object = tempObject;
        this.data[childIndex].sourceIndex = tempSourceIndex;
    }

    _hasLeftChild(parentIndex) {
        const leftChildIndex = (parentIndex * 2) + 1;
        return leftChildIndex < this.size();
    }

    _hasRightChild(parentIndex) {
        const rightChildIndex = (parentIndex * 2) + 2;
        return rightChildIndex < this.size();
    }

    _compareChildrenOf(parentIndex) {
        if (!this._hasLeftChild(parentIndex) && !this._hasRightChild(parentIndex)) {
            return -1;
        }

        const leftChildIndex = (parentIndex * 2) + 1;
        const rightChildIndex = (parentIndex * 2) + 2;

        if (!this._hasLeftChild(parentIndex)) {
            return rightChildIndex;
        }

        if (!this._hasRightChild(parentIndex)) {
            return leftChildIndex;
        }

        const compare = this.data[leftChildIndex].val > this.data[rightChildIndex].val
        return compare ? rightChildIndex : leftChildIndex;
    }

    _shouldSwapNodes(parentIndex, childIndex) {
        if (parentIndex < 0 || parentIndex >= this.size()) {
            return false;
        }

        if (childIndex < 0 || childIndex >= this.size()) {
            return false;
        }

        return this.data[parentIndex].val > this.data[childIndex].val
    }

    _bubbleUp(startIndex) {
        let childIndex = startIndex;
        let parentIndex = Math.floor((childIndex - 1) / 2);

        while (this._shouldSwapNodes(parentIndex, childIndex)) {
            this._swap(parentIndex, childIndex);
            childIndex = parentIndex;
            parentIndex = Math.floor((childIndex - 1) / 2);
        }
    }

    _bubbleDown(startIndex) {
        let parentIndex = startIndex;
        let childIndex = this._compareChildrenOf(parentIndex);

        while (this._shouldSwapNodes(parentIndex, childIndex)) {
            this._swap(parentIndex, childIndex);
            parentIndex = childIndex;
            childIndex = this._compareChildrenOf(parentIndex);
        }
    }


    insert(val, object, sourceIndex) {
        const newNode = new Node(val, object, sourceIndex);
        this.data.push(newNode);
        this._bubbleUp(this.data.length - 1);
    }

    fetchMin() {
        // Simply return first element
        return this.data[0];
    }

    changeMin(val = null, object = null, sourceIndex = null) {
        let replacementNode;
        if (val && object && sourceIndex !== null) {
            replacementNode = new Node(val, object, sourceIndex);
        } else {
            replacementNode = this.data.pop();
        }
        this.data[0] = replacementNode;

        // Let's bubble down
        this._bubbleDown(0);
    }

    size() {
        return this.data.length;
      }
}

module.exports = {
    Node: Node,
    MinHeap: MinHeap,
};
