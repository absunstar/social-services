(() => {
  if ((facebookShortcut = true)) {
    let menuList = [];

    menuList.push({
      label: 'Confirm ALL Friends Requests',
      click() {
        let index = 0;
        document.querySelectorAll('[aria-label="Friends"][role="main"] div[role=button][aria-label="Confirm"]').forEach((button) => {
          index++;
          setTimeout(() => {
            SOCIALBROWSER.click(button);
          }, 1000 * index);
        });
      },
    });

    SOCIALBROWSER.addMenu({
      label: 'Facebook Shortcuts',
      type: 'submenu',
      submenu: menuList,
    });
  }
})();
