SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
  document.title = SOCIALBROWSER.fakeview.message;
  setInterval(() => {
    if (document.title != SOCIALBROWSER.fakeview.message && document.title != 'Following ....') {
      document.title = SOCIALBROWSER.fakeview.message;
    }
  }, 1000 * 5);

  let actionDone = false;
  function followUser() {
    if (actionDone) {
      return;
    }
    let followButtons = document.querySelectorAll('button._acan._acap._acas._aj1-._ap30');
    followButtons.forEach(button => button.click());
    actionDone = true;
  }
  setInterval(() => {
    followUser();
  }, 1000 * 3);
});
