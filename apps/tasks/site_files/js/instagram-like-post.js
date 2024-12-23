SOCIALBROWSER.onLoad(() => {
  function likePost() {
  /*   let likeButton = document.querySelector('span.xp7jhwk [role="button"] svg[aria-label="Like"]');
    let unlikeButton = document.querySelector('span.xp7jhwk [role="button"] svg[aria-label="Unlike"]');
    
    if (likeButton) {
      console.log("Like button found!");
      likeButton.closest('button').click();
    } else if (unlikeButton) {
      console.log("Unlike button found!");
      unlikeButton.closest('button').click();
    } else {
      window.close();
    } */
    setTimeout(() => {
      let button = document.querySelector('span.xp7jhwk [role="button"]');
      if (button) {
        button.click();
      } else {
        window.close();
      }
    }, 3000);

   
    setTimeout(() => {
      likePost();
    }, 1000 * 5);
  }
  likePost();
});
