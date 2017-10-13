export function* throwError(err) {
  console.log('throwError', err);
}

// 1) TODO: CLOSE FILTERES WHEN SWITCHING SIDEBAR TAB
// function* onSidebarTabChange() {
//   yield put({
//     type: types.SET_SHOW_SIDEBAR_FILTERS,
//     payload: false,
//   });
// }

// export function* watchChangeSidebarTab() {
//   yield takeEvery(types.SET_SIDEBAR_TYPE, onSidebarTabChange);
// }
//
// 2) TODO: RESET TAB TO DETAILS WHEN SWITCHING BETWEEN ISSUES
