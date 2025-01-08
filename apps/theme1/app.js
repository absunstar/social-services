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
    ],
  });

  site.get(
    {
      name: '/',
    },
    (req, res) => {
      res.render(
        'theme1/index.html',
        {
          setting: site.getSiteSetting(req.host),
        },
        { parser: 'html css js', compres: true }
      );
    }
  );
};
