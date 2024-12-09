(() => {
  if (SOCIALBROWSER.$account) {
    SOCIALBROWSER.account = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.$account));
    SOCIALBROWSER.session.display = SOCIALBROWSER.account.email;
    SOCIALBROWSER.var.core.emails = SOCIALBROWSER.var.core.emails || {};
    SOCIALBROWSER.var.core.emails.enabled = true;
    SOCIALBROWSER.var.core.emails.domain =  'mama-services.com';
    SOCIALBROWSER.var.core.emails.password = SOCIALBROWSER.account.password;
  }
})();
