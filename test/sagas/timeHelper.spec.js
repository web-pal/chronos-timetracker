/* eslint no-undef: 0 */
import { List } from 'immutable';
import { randomPeriods, calculateActivity, randomInteger } from '../../app/sagas/timerHelper';


describe('randomInteger', () => {
  test('to be not less then min', () => {
    expect(randomInteger(2, 3)).toBeGreaterThanOrEqual(2);
  });

  test('to be not greater then max', () => {
    expect(randomInteger(2, 3)).toBeLessThanOrEqual(3);
  });

  test('to be integer', () => {
    expect(randomInteger(2, 3) % 1).toBe(0);
  });
});

describe('randomPeriods: creating time points for n screenshots between t=t1 and t=t2, with threshold for possible previous screen acceptance', () => {
  test('have 10 screenshots', () => {
    const n = 10;
    const min = 0;
    const max = 700;
    const threshold = 20;
    const periods = randomPeriods(n, min, max, threshold);
    expect(periods.length).toBe(n);
  });

  test('to be not less then min (t1)', () => {
    const n = 10;
    const min = 0;
    const max = 700;
    const threshold = 20;
    const periods = randomPeriods(n, min, max, threshold);
    expect(periods[0]).toBeGreaterThanOrEqual(min);
  });

  test('default threshold = 20', () => {
    const n = 10;
    const min = 0;
    const max = 300;
    const threshold = 20;
    const periods = randomPeriods(n, min, max);
    expect(periods[0]).toBeGreaterThanOrEqual(threshold);
  });

  test('to be not greater then max (t2)', () => {
    const n = 10;
    const min = 0;
    const max = 400;
    const threshold = 20;
    const periods = randomPeriods(n, min, max, threshold);
    expect(periods[n - 1]).toBeLessThanOrEqual(max + threshold);
  });

  test('no doubling', () => {
    const n = 10;
    const min = 300;
    const threshold = 20;
    const max = min + (n * threshold);
    const periods = randomPeriods(n, min, max, threshold);
    const minDifference = periods.reduce((minDiff, period, i, thisPeriods) =>
      (i ? Math.min(period - thisPeriods[i - 1], minDiff) : Infinity), Infinity);
    expect(minDifference).toBeGreaterThan(0);
  });
});


const currentIdleList = List([
  3000, // first idle minute, witch is 30 sec long (e. g. started at 7 minutes 30 sec)
  6000, // first normal minute (e. g. 8 minutes 0 sec)
  6000, // end of first period witch contains 3 Idle-minutes, and start at 7:30 and end at 10:00
  0, // first in grid-period minute (e. g. 10 minutes 0 sec)
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  30000, // first minute of second and last grid-period witch was interrupted
  30000,
]);

describe('calculateActivity', () => {
  test('to be working', () => {
    const result = calculateActivity({
      currentIdleList, // list of Idle-minutes
      timeSpentSeconds: 15 * 60, // total secont spendt
      screenshotsPeriod: 10 * 60, // full period length
      firstPeriodInMinute: 3, // first period length
      secondsToMinutesGrid: 30, // seconds to minutes grid
    });
    expect(result).toEqual(expect.arrayContaining([90, 100, 50]));
  });
});

// need other test for calculateActivity function
// some other comment
// i started tracking at 18:58:~40smtng
// another stuff
