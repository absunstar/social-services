SOCIALBROWSER.onLoad(() => {
  let actionDone = false;
  function likePost() {
    if (actionDone) {
      window.close();
      return;
    }
    /*   let likeButton = document.querySelector('span.xp7jhwk [role="button"] svg[aria-label="Like"]');
    let unlikeButton = document.querySelector('span.xp7jhwk [role="button"] svg[aria-label="Unlike"]');
    
    if (likeButton) {
      console.log("Like button found!");
      likeButton.closest('button').click();
    } else if (unlikeButton) {
      console.log("Unlike button found!");
      unlikeButton.closest('button').click();
    } else {ZZAZ
      window.close();
    } */
    setTimeout(() => {
      let button = document.querySelector('span.xp7jhwk [role="button"]');
      if (button) {
        button.click();
        actionDone = true;
      } else {
        window.close();
      }
    }, 1000 * 3);

    setTimeout(() => {
      likePost();
    }, 1000 * 5);
  }
  likePost();
});
