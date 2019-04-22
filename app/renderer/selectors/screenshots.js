import {
  createSelector,
} from 'reselect';
import * as R from 'ramda';
import {
  DateTime,
} from 'luxon';

import config from 'config';

export const getActivityForScreenshotsViewer = createSelector(
  [
    s => s.screenshotsViewerReducer.currentIssue,
    s => s.screenshotsViewerReducer.currentScreenshots,
    s => s.screenshotsViewerReducer.issuesWithScreenshotsActivity,
  ],
  (
    currentIssue,
    currentScreenshots,
    issuesWithScreenshotsActivity,
  ) => {
    let activity = [];
    if (currentIssue) {
      activity = [{
        id: 0,
        issue: currentIssue,
        worklogs: [{
          id: 0,
          isUnfinished: true,
          screenshotsPeriod: config.screenshotsPeriod,
          screenshots: currentScreenshots,
        }],
      }];
    } else {
      activity = issuesWithScreenshotsActivity;
    }
    return (
      activity
        .map(
          a => ({
            ...a,
            worklogs: (
              a.worklogs.map(
                (w) => {
                  const createdFormat = (
                    DateTime.fromJSDate(
                      (
                        w.isUnfinished
                          ? new Date()
                          : new Date(w.created)
                      ),
                      {
                        setZone: true,
                      },
                    ).toFormat('yyyy/MM/dd t')
                  );
                  const [
                    firstScreenshot,
                    lastScreenshot,
                  ] = [R.head(w.screenshots), R.last(w.screenshots)];
                  if (firstScreenshot) {
                    const worklogStartedAt = DateTime.fromMillis(firstScreenshot.timestamp);
                    const worklogCompletedAt = (
                      w.isUnfinished
                        ? DateTime.local()
                        : DateTime.fromMillis(lastScreenshot.timestamp)
                    );
                    const hoursElapsed = (
                      w.screenshots.length === 1
                        ? 1
                        : Math.ceil(worklogCompletedAt.diff(worklogStartedAt).as('hours'))
                    );
                    const screenshotsPerHour = Math.ceil(3600 / w.screenshotsPeriod);
                    const sections = R.map(
                      s => ({
                        id: s,
                        sectionScreenshots: R.slice(
                          s * w.screenshotsPerHour,
                          ((s + 1) * screenshotsPerHour) + 1,
                          w.screenshots,
                        ),
                        startedAt: worklogStartedAt.plus({ hours: s }),
                      }),
                      R.range(0, hoursElapsed),
                    );
                    return {
                      ...w,
                      createdFormat,
                      sections,
                    };
                  }
                  return {
                    ...w,
                    createdFormat,
                    sections: [],
                  };
                },
              )
            ),
          }),
        )
    );
  },
);
