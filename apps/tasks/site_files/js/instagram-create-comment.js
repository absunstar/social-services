SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.createCommentDone = false;

  SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
  document.title = SOCIALBROWSER.fakeview.message;
  SOCIALBROWSER.fakeview.comment = SOCIALBROWSER.fakeview.commentList[SOCIALBROWSER.random(0, SOCIALBROWSER.fakeview.commentList.length - 1)].content;
  function createComment() {
    if (document.location.href.like("*checkpoint*")) {
      setTimeout(() => {
        window.close();
      }, 1000 * 2);
      return false;
    }
    if (SOCIALBROWSER.createCommentDone) {
      alert("Facebook Comment Created !!!");
      setTimeout(() => {
        window.close();
      }, 1000 * 5);
      return true;
    }
    SOCIALBROWSER.copy(SOCIALBROWSER.fakeview.comment);
    if(SOCIALBROWSER.createCommentDone) {
      return;
    }
    if ((textarea = document.querySelector('textarea[aria-label="Add a comment…"]'))) {
      SOCIALBROWSER.click(textarea);
      SOCIALBROWSER.paste();
      SOCIALBROWSER.write(SOCIALBROWSER.fakeview.comment, textarea).then(() => {
        var buttons = document.querySelectorAll('div[role="button"][tabindex="0"]');
        buttons.forEach(function (button) {
          if (button.textContent === "Post") {
            button.click();
            SOCIALBROWSER.createCommentDone = true;
          }
        });
        /*  if ((button = document.querySelector('div[role="button"][tabindex="0"]'))) {
          SOCIALBROWSER.click(button);
          SOCIALBROWSER.createCommentDone = true;
        } */
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

  createComment();
});
