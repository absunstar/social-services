module.exports = function init(site) {
  site.get({
    name: "/mama",
    path: __dirname + "/site_files",
  });
  site.get({
    name: "images",
    path: __dirname + "/site_files/images/",
  });

  site.get({
    name: ["/css/mama.css"],
    parser: "css2",
    public: true,
    compress: !0,
    path: [
      __dirname + "/site_files/css/header.css",
      __dirname + "/site_files/css/sidebar.css",
      __dirname + "/site_files/css/sidebarProfile.css",
      __dirname + "/site_files/css/storysContainer.css",
      __dirname + "/site_files/css/lawSectionsConatiner.css",
      __dirname + "/site_files/css/moreActiveLowersConatiner.css",
      __dirname + "/site_files/css/recentlyConsultantsContanier.css",
      __dirname + "/site_files/css/profile.css",
      __dirname + "/site_files/css/smScreen.css",
      __dirname + "/site_files/css/mdScreen.css",
      __dirname + "/site_files/css/cricleConsultantAskConatainer.css",
      __dirname + "/site_files/css/payedConsultantConatainer.css",
      __dirname + "/site_files/css/orderTextConsultingContainer.css",
      __dirname + "/site_files/css/videoStoryContainer.css",
      __dirname + "/site_files/css/adsBanner.css",
      __dirname + "/site_files/css/footer.css",
      __dirname + "/site_files/css/color.css",
      __dirname + "/site_files/css/style.css",
      __dirname + "/site_files/css/mama-mobile.css",
    ],
  });

  site.get({
    name: ["/js/mama.js"],
    parser: "js2",
    public: true,
    compress: !0,
    path: [
      __dirname + "/site_files/js/SectionScroll.js",
      __dirname + "/site_files/js/orderConsultant.js",
      __dirname + "/site_files/js/orderTextConsultant.js",
      __dirname + "/site_files/js/storyvideoLower.js",
      __dirname + "/site_files/js/openMobileMenu.js",
    ],
  });

  site.get(
    {
      name: ["/", "/@*"],
    },
    (req, res) => {

      let setting = site.getSiteSetting(req.host) || {};
      let notificationsCount = 0;
      if (req.session.user && req.session.user.notificationsList) {
        let notifications = req.session.user.notificationsList.filter((_n) => !_n.show);
        notificationsCount = notifications.length;
      }

      setting.description = setting.description || "";
      setting.keyWordsList = setting.keyWordsList || [];
      let data = {
        guid: "",
        setting: setting,
        notificationsCount: notificationsCount,
        notificationsList: req.session?.user?.notificationsList?.slice(0, 7),
        filter: site.getHostFilter(req.host),
        site_logo: setting.logo?.url || "/images/logo.png",
        powerdByLogo: setting.powerdByLogo?.url || "/images/logo.png",
        site_footer_logo: setting.footerLogo?.url || "/images/logo.png",
        page_image: setting.logo?.url || "/images/logo.png",
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
      res.render(__dirname + "/site_files/html/index.html", data, {
        parser: "html",
        compres: true,
      });
    }
  );

};
