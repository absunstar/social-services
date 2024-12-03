module.exports = function init(site) {
  site.get({
    name: "images",
    path: __dirname + "/site_files/images/",
  });

  site.get({
    name: "css",
    path: __dirname + "/site_files/css/",
  });

  site.get(
    {
      name: ["/profileView"],
    },
    (req, res) => {
      let setting = site.getSiteSetting(req.host) || {};
      let user = site.userList.find((t) => t._id == req.query.id);
      
      if (user) {
        let data = {
          setting: setting,
          guid: "",
          filter: site.getHostFilter(req.host),
          site_logo: setting.logo?.url || "/images/logo.png",
          site_footer_logo: setting.footerLogo?.url || "/images/logo.png",
          page_image: setting.logo?.url || "/images/logo.png",
          powerdByLogo: setting.powerdByLogo?.url || "/images/logo.png",
          user_image: req.session?.user?.image?.url || "/images/logo.png",
          site_name: setting.siteName,
          user: user,
          page_lang: setting.id,
          page_type: "website",
          page_title: setting.siteName + " " + setting.titleSeparator + " " + setting.siteSlogan,
          page_description: setting.description.substr(0, 200),
          page_keywords: setting.keyWordsList.join(","),
        };

        if (req.hasFeature("host.com")) {
          data.site_logo = "//" + req.host + data.site_logo;
          data.site_footer_logo = "//" + req.host + data.site_footer_logo;
          data.page_image = "//" + req.host + data.page_image;
          data.user_image = "//" + req.host + data.user_image;
          data.powerdByLogo = "//" + req.host + data.powerdByLogo;
        }

        res.render("profile/profileView.html", data, {
          parser: "html css js",
          compres: true,
        });
      }
    }
  );

  // site.onGET("profileView/:id", (req, res) => {
  //   site.security.getUser({ id: req.params.id }, (err, user) => {
  //     if (user) {
  //       user.title = user.firstName + " " + user.lastName;
  //       res.render("profile/profileView.html", user);
  //     }
  //   });
  // });

  site.onGET("profileEdit", (req, res) => {
    site.security.getUser({ _id: req.query.id }, (err, user) => {
      if (user) {
        let setting = site.getSiteSetting(req.host);
        setting.description = setting.description || "";
        setting.keyWordsList = setting.keyWordsList || [];
        let notificationsCount = 0;
        if (req.session.user && req.session.user.notificationsList) {
          let notifications = req.session.user.notificationsList.filter((_n) => !_n.show);
          notificationsCount = notifications.length;
        }
        let data = {
          notificationsCount: notificationsCount,
          notificationsList: req.session?.user?.notificationsList?.slice(0, 7),
          setting: setting,
          guid: "",
          filter: site.getHostFilter(req.host),
          site_logo: setting.logo?.url || "/images/logo.png",
          site_footer_logo: setting.footerLogo?.url || "/images/logo.png",
          page_image: setting.logo?.url || "/images/logo.png",
          powerdByLogo: setting.powerdByLogo?.url || "/images/logo.png",
          user_image: req.session?.user?.image?.url || "/images/logo.png",
          site_name: setting.siteName,
          page_lang: setting.id,
          page_type: "website",
          page_title: setting.siteName + " " + setting.titleSeparator + " " + setting.siteSlogan,
          page_description: setting.description.substr(0, 200),
          page_keywords: setting.keyWordsList.join(","),
        };
        if (req.hasFeature("host.com")) {
          data.site_logo = "//" + req.host + data.site_logo;
          data.site_footer_logo = "//" + req.host + data.site_footer_logo;
          data.page_image = "//" + req.host + data.page_image;
          data.user_image = "//" + req.host + data.user_image;
          data.powerdByLogo = "//" + req.host + data.powerdByLogo;
        }
        res.render("profile/profileEdit.html", data, { parser: "html css js", compres: true });
      } else {
        res.end();
      }
    });
  });

  site.get(
    {
      name: ["/login"],
    },
    (req, res) => {
      res.render(__dirname + "/site_files/html/index.html", { setting: site.getSiteSetting(req.host) }, { parser: "html css js", compres: true });
    }
  );
};
