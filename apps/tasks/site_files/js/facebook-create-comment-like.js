SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.createCommentDone = false;

  SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
  document.title = SOCIALBROWSER.fakeview.message;
  SOCIALBROWSER.fakeview.comment = SOCIALBROWSER.fakeview.commentList[SOCIALBROWSER.random(0, SOCIALBROWSER.fakeview.commentList.length - 1)].content;
  function createComment() {
    if (document.location.href.like('*checkpoint*')) {
      setTimeout(() => {
        window.close();
      }, 1000 * 2);
      return false;
    }
    if (SOCIALBROWSER.createCommentDone) {
      alert('Facebook Comment Created !!!');
      setTimeout(() => {
        window.close();
      }, 1000 * 5);
      return true;
    }

    if ((textarea = document.querySelector('div[aria-label="Write a comment…"] p'))) {
      SOCIALBROWSER.click(textarea);
      SOCIALBROWSER.write(SOCIALBROWSER.fakeview.comment, textarea).then(() => {
        if ((button = document.querySelector('div[aria-label="Comment"]'))) {
          SOCIALBROWSER.click(button);
          SOCIALBROWSER.createCommentDone = true;
        }
      });
    } else if ((textarea = document.querySelector('div[aria-label="Write an answer…"] p'))) {
      SOCIALBROWSER.click(textarea);
      SOCIALBROWSER.write(SOCIALBROWSER.fakeview.comment, textarea).then(() => {
        if ((button = document.querySelector('div[aria-label="Comment"]'))) {
          SOCIALBROWSER.click(button);
          SOCIALBROWSER.createCommentDone = true;
        }
      });
    } else {
      return setTimeout(() => {
        createComment();
      }, 1000 * 1);
    }
    setTimeout(() => {
      createComment();
    }, 1000 * 5);
  }
  function likePost() {
    if (SOCIALBROWSER.likeClicked) {
      return true;
    }

    if ((button = document.querySelector('div[aria-label="Like"]'))) {
      SOCIALBROWSER.likeClicked = true;
      SOCIALBROWSER.click(button);
      return true;
    }

    setTimeout(() => {
      likePost();
    }, 1000 * 3);
  }
  likePost();
  setTimeout(() => {
    createComment();
  }, 1000 * 8);
});
