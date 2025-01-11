module.exports = function init(site) {
  site.templateList.push({
    id: 1,
    name: 'Mama Theme 1',
    categoryTemplateList: [
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
      { id: 3, name: 'Template 3' },
    ],
  });

  site.get({
    name: 'theme1/images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'theme1/css',
    path: __dirname + '/site_files/css/',
  });

  site.get({
    name: 'theme1/js',
    path: __dirname + '/site_files/js/',
  });

  site.get({
    name: ['/css/theme1.css'],
    parser: 'css',
    public: true,
    compress: !0,
    shared: true,
    path: [
      'client-side/normalize.css',
      'client-side/theme.css',
      'client-side/layout.css',
      'client-side/modal.css',
      'client-side/color.css',
      'client-side/images.css',
      'client-side/dropdown.css',
      'client-side/fonts.css',
      'client-side/font-droid.css',
      'client-side/effect.css',
      'client-side/table.css',
      'client-side/treeview.css',
      'client-side/tabs.css',
      'client-side/help.css',
      'client-side/print.css',
      'client-side/tableExport.css',
      'client-side/theme_paper.css',
      'client-side/bootstrap5.css',
      'client-side/bootstrap5-addon.css',
      'client-side/font-awesome.css',
      'client-side/WebShareEditor.css',

      __dirname + '/site_files/css/colorstheme.css',
      __dirname + '/site_files/css/burgeurmenu.css',
      __dirname + '/site_files/css/header.css',
      __dirname + '/site_files/css/topHeader.css',
      __dirname + '/site_files/css/style.css',
    ],
  });

  site.get({
    name: ['/js/theme1.js'],
    parser: 'js',
    public: true,
    compress: !0,
    shared: true,
    path: [
      'client-side/first.js',
      'client-side/jquery.js',
      'client-side/mustache.js',
      'client-side/base64.min.js',
      'client-side/site.js',
      'client-side/dom-to-image.min.js',
      'client-side/barcode.js',
      'client-side/qrcode.min.js',
      'client-side/angular.min.js',
      'client-side/app.js',
      'client-side/directive-core.js',
      'client-side/bootstrap-5-directive.js',
      'client-side/last.js',
      'client-side/bootstrap5.js',
      'client-side/bootstrap-5-addon.js',
      'client-side/WebShareEditor.js',
      'client-side/xlsx.js',

      __dirname + '/site_files/js/gsap.min.js',
      __dirname + '/site_files/js/ScrollTrigger.min.js',
      __dirname + '/site_files/js/script.js',
      __dirname + '/site_files/js/topHeader.js',
      __dirname + '/site_files/js/burgurMenuToggle.js',
      __dirname + '/site_files/js/TextPlugin.min.js',
      __dirname + '/site_files/js/herobanner-Animate.js',
      __dirname + '/site_files/js/index.js',
    ],
  });

  site.get(
    {
      name: '/',
    },
    (req, res) => {
      let setting = site.getSiteSetting(req.host) || {};

      let data = {
        setting: setting,
        siteUpdateList: site.siteUpdateList,
        site_logo: setting.logo?.url || '/images/logo.png',
        user_image: req.session?.user?.image?.url || '/images/logo.png',
        site_name: setting.siteName,
      };
      if (req.hasFeature('host.com')) {
        data.site_logo = '//' + req.host + data.site_logo;
        data.user_image = '//' + req.host + data.user_image;
      }
      res.render('theme1/index.html', data, { parser: 'html css js', compres: true });
    }
  );

  site.get(
    {
      name: '/user-login',
    },
    (req, res) => {
      let setting = site.getSiteSetting(req.host) || {};

      let data = {
        setting: setting,
        siteUpdateList: site.siteUpdateList,
        site_logo: setting.logo?.url || '/images/logo.png',
        user_image: req.session?.user?.image?.url || '/images/logo.png',
        site_name: setting.siteName,
      };
      if (req.hasFeature('host.com')) {
        data.site_logo = '//' + req.host + data.site_logo;
        data.user_image = '//' + req.host + data.user_image;
      }
      res.render('theme1/login.html', data, { parser: 'html css js', compres: true });
    }
  );

  site.get(
    {
      name: '/user-register',
    },
    (req, res) => {
      let setting = site.getSiteSetting(req.host) || {};

      let data = {
        setting: setting,
        siteUpdateList: site.siteUpdateList,
        site_logo: setting.logo?.url || '/images/logo.png',
        user_image: req.session?.user?.image?.url || '/images/logo.png',
        site_name: setting.siteName,
      };
      if (req.hasFeature('host.com')) {
        data.site_logo = '//' + req.host + data.site_logo;
        data.user_image = '//' + req.host + data.user_image;
      }
      res.render('theme1/register.html', data, { parser: 'html css js', compres: true });
    }
  );

  site.onGET("/siteUpdate/:url", (req, res) => {
    let exists = false;
    let setting = site.getSiteSetting(req.host);
    setting.description = setting.description || "";
    setting.keyWordsList = setting.keyWordsList || [];
    let data = {
      setting: setting,
      guid: "",
      isMama: req.session.selectedMamaId ? true : false,
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
      data.site_logo = "https://" + req.host + data.site_logo;
      data.site_footer_logo = "//" + req.host + data.site_footer_logo;
      data.page_image = "https://" + req.host + data.page_image;
      data.user_image = "https://" + req.host + data.user_image;
      data.powerdByLogo = "https://" + req.host + data.powerdByLogo;
    }
    let page = site.siteUpdateList.find((itm) => itm.url == req.params.url && itm.host == site.getHostFilter(req.host));

    data.page = page;

    res.render("theme1/siteUpdate.html", data);
  });
};
