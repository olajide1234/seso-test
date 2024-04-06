const syncMerge = require('../solution/sync-sorted-merge');

class LogSource {
  constructor(logList) {
    this.logList = logList;
  }

  pop() {
    const value = this.logList.shift();
    return value ? { date : value } : false;
  }
}

class Printer {
  constructor() {
    this.results = [];
  }

  print(value) {
    const valueString = value.date.toISOString();
    this.results.push(valueString);
  }

  done() {
    // Do nothing
  }
}

describe('sorted sync merge', () => {
  test('print logs in order', () => {
    const testData = [
      [new Date('2022-02-01T00:00:00.000Z'), new Date('2022-03-01T00:00:00.000Z')],
      [new Date('2023-04-05T00:00:00.000Z'), new Date('2023-06-11T00:00:00.000Z')],
      [new Date('2024-01-09T00:00:00.000Z'), new Date('2024-05-11T00:00:00.000Z')],
    ];

    const logSources = testData.map((data) => new LogSource(data));

    const printer = new Printer();

    syncMerge(logSources, printer);

    expect(printer.results).toStrictEqual([
      '2022-02-01T00:00:00.000Z', '2022-03-01T00:00:00.000Z', '2023-04-05T00:00:00.000Z', '2023-06-11T00:00:00.000Z',
      '2024-01-09T00:00:00.000Z', '2024-05-11T00:00:00.000Z'
    ]);
  });
});
