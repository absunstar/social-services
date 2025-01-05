SOCIALBROWSER.onLoad(() => {
  let likePostDone = false;
  function likePost() {
    if (likePostDone) {
      window.close();
      return;
    }
    if (!document.querySelector('div[aria-label="Remove Like"]')) {
      if ((button = document.querySelector('div[aria-label="Like"]'))) {
        SOCIALBROWSER.click(button);
      }
    } else {
      window.close();
    }
    setTimeout(() => {
      if (!likePostDone) {
        likePost();
      } else {
        window.close();
      }
    }, 1000 * 5);
  }
  likePost();
});
