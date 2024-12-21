SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.requestFriendDone = false;

  SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
  document.title = SOCIALBROWSER.fakeview.message;

  function addFriend() {
    if (document.querySelector('div[aria-label="Cancel request"]')) {
      window.close();
      return true;
    }
    if (SOCIALBROWSER.requestFriendDone) {
      window.close();
      return true;
    }
    if ((button = document.querySelector('div[aria-label="Add friend"]'))) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      SOCIALBROWSER.click(button);
      setTimeout(() => {
        approveAddFriend();
      }, 1000 * 2);
    }
    setTimeout(() => {
      addFriend();
    }, 1000 * 7);
  }

  function approveAddFriend() {
    if (SOCIALBROWSER.requestFriendDone) {
      return true;
    }
    let list = [];
    document.querySelectorAll('div[aria-label="Add friend"]').forEach((s) => {
      list.push(s);
    });

    if (list.length > 1) {
      SOCIALBROWSER.requestFriendDone = true;
      SOCIALBROWSER.click(list[list.length - 1]);
    } else {
      setTimeout(() => {
        approveAddFriend();
      }, 1000);
    }
  }

  addFriend();
});
