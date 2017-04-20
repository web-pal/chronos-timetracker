export function randomInteger(min, max) {
  const rand = (min - 0.5) + (Math.random() * ((max - min) + 1));
  return Math.round(rand);
}

export function randomPeriods(periodsQty, min, max, threshold = 20) {
  const averageMax = (max - min) / periodsQty;
  let prevPeriod = min;
  return [...Array(periodsQty).keys()].map(() => {
    const plusForPrev = periodsQty > 1 ? threshold : 0;
    prevPeriod = randomInteger(prevPeriod + plusForPrev, (prevPeriod + averageMax) - 1);
    return prevPeriod;
  });
}

export function calculateActivity({
  currentIdleList,
  timeSpentSeconds,
  screenshotsPeriod,
  firstPeriodInMinute,
  secondsToMinutesGrid,
}) {
  let firstPeriodIdleSec = (currentIdleList.get(0) / 1000);
  // time wasted in first Idle-minute
  firstPeriodIdleSec += currentIdleList.slice(1, firstPeriodInMinute)
    .reduce((totalWasted, wastedHere) => (totalWasted + wastedHere), 0) / 1000;
  const firstPeriodTotalTimeSec = (secondsToMinutesGrid + ((firstPeriodInMinute - 1) * 60));

  const minutesInPeriod = (screenshotsPeriod / 60);
  const lastPeriodsIdleSec = currentIdleList.slice(firstPeriodInMinute);
  const activityArray =
    [...Array(Math.ceil(
      (timeSpentSeconds - firstPeriodTotalTimeSec) / screenshotsPeriod,
    )).keys()].map((period) => {
      const thisIdleList = lastPeriodsIdleSec
        .slice(
          period * minutesInPeriod,
          (period + 1) * minutesInPeriod,
        );
      const idleSec = thisIdleList
        .reduce((totalWasted, wastedHere) => (totalWasted + wastedHere), 0) / 1000;
      return Math.round(100 * (1 - (idleSec / (thisIdleList.size * 60))));
    });

  activityArray.unshift(Math.round(100 * (1 - (firstPeriodIdleSec / firstPeriodTotalTimeSec))));
  return activityArray;
}
