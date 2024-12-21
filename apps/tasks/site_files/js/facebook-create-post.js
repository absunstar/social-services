SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.createPostDone = false;

  SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
  document.title = SOCIALBROWSER.fakeview.message;

  function createPost() {
    if (document.location.href.like('*checkpoint*')) {
      setTimeout(() => {
        window.close();
      }, 1000 * 3);
      return false;
    }
    if (SOCIALBROWSER.createPostDone) {
      alert('Facebook Post Created !!!');
      setTimeout(() => {
        window.close();
      }, 1000 * 3);
      return true;
    }
    if ((textarea = document.querySelector('div[aria-label="Create a post"] span'))) {
      SOCIALBROWSER.click(textarea);
      setTimeout(() => {
        if ((textarea2List = document.querySelectorAll('[role="presentation"] [contenteditable="true"]'))) {
          SOCIALBROWSER.write(SOCIALBROWSER.fakeview.content, textarea2List[textarea2List.length - 1]).then(() => {
            if ((button = document.querySelector('div[aria-label="Post"]'))) {
              SOCIALBROWSER.createPostDone = true;
              SOCIALBROWSER.click(button);
              setTimeout(() => {
                window.close();
              }, 1000 * 5);
            }
          });
        }
      }, 1000 * 3);
    }
    setTimeout(() => {
      createPost();
    }, 1000 * 10);
  }

  createPost();
});
