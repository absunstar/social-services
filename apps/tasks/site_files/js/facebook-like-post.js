SOCIALBROWSER.onLoad(() => {
  function likePost() {
    if (!document.querySelector('div[aria-label="Remove Like"]')) {
      if ((button = document.querySelector('div[aria-label="Like"]'))) {
        SOCIALBROWSER.click(button);
      }
    } else {
      window.close();
    }
    setTimeout(() => {
      likePost();
    }, 1000 * 5);
  }
  likePost();
});
