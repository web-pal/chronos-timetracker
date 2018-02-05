// @flow

export function randomInteger(min: number, max: number): number {
  const rand: number = (min - 0.5) + (Math.random() * ((max - min) + 1));
  return Math.round(rand);
}

export function randomPeriods(
  periodsQty: number,
  min: number,
  max: number,
  threshold: number = 20,
): Array<number> {
  const averageMax: number = (max - min) / periodsQty;
  let prevPeriod: number = min;
  return [...Array(periodsQty).keys()].map(() => {
    const plusForPrev: number = periodsQty > 1 ? threshold : 0;
    prevPeriod = randomInteger(prevPeriod + plusForPrev, (prevPeriod + averageMax) - 1);
    return prevPeriod;
  });
}

type Params = {
  currentIdleList: Array<number>,
  timeSpentInSeconds: number,
  screenshotsPeriod: number,
  firstPeriodInMinute: number,
  secondsToMinutesGrid: number,
};

export function calculateActivity({
  currentIdleList,
  timeSpentInSeconds,
  screenshotsPeriod,
  firstPeriodInMinute,
  secondsToMinutesGrid,
}: Params): Array<any> {
  let firstPeriodIdleSec: number = (currentIdleList[0] / 1000);
  // time wasted in first Idle-minute
  firstPeriodIdleSec += currentIdleList.slice(1, firstPeriodInMinute)
    .reduce((totalWasted, wastedHere) => (totalWasted + wastedHere), 0) / 1000;

  const firstPeriodTotalTimeSec: number =
    (secondsToMinutesGrid + ((firstPeriodInMinute - 1) * 60));

  const minutesInPeriod: number = (screenshotsPeriod / 60);
  const lastPeriodsIdleSec: Array<any> = currentIdleList.slice(firstPeriodInMinute);
  const activityArray =
    [...Array(Math.ceil(
      (timeSpentInSeconds - firstPeriodTotalTimeSec) / screenshotsPeriod,
    )).keys()].map((period) => {
      if (period) {
        const thisIdleList: Array<any> = lastPeriodsIdleSec
          .slice(
            period * minutesInPeriod,
            (period + 1) * minutesInPeriod,
          );
        const idleSec: number = thisIdleList
          .reduce((totalWasted, wastedHere) => (totalWasted + wastedHere), 0) / 1000;
        return Math.round(100 * (1 - (idleSec / (thisIdleList.length * 60))));
      }
      return 100;
    });

  activityArray.unshift(Math.round(100 * (1 - (firstPeriodIdleSec / firstPeriodTotalTimeSec))));
  return activityArray;
}
