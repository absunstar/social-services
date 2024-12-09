module.exports = function init(site) {
  site.storeTypeList = [
    {
      name: 'Private',
    },
    {
      name: 'Public',
    },
    {
      name: 'shared',
    },
  ];

  site.serviceOrderStatusList = [
    {
      name: 'Pending',
    },
    {
      name: 'Running',
    },
    {
      name: 'Done',
    },
  ];

  site.serviceOrderStateList = [
    {
      name: 'Review',
    },
    {
      name: 'Approved',
    },
    {
      name: 'Rejected',
    },
  ];

  site.socialPlatformList = [
    {
      name: 'Website',
      serviceList: [
        {
          name: 'View',
        },
      ],
    },
    {
      name: 'Instagram',
      serviceList: [
        {
          name: 'Like',
        },
        {
          name: 'Comment',
        },
        {
          name: 'Share',
        },
        {
          name: 'Follow User',
        },
        {
          name: 'Un-Follow User',
        },
      ],
    },
    {
      name: 'Youtube',
      serviceList: [
        {
          name: 'Like',
        },
        {
          name: 'Comment',
        },
        {
          name: 'Share',
        },
        {
          name: 'Subscribe',
        },
        {
          name: 'View',
        },
      ],
    },
    {
      name: 'Facebook',
      url : 'https://www.facebook.com/',
      serviceList: [
        {
          name: 'Like',
        },
        {
          name: 'Comment',
        },
        {
          name: 'Share',
        },
        {
          name: 'Follow',
        },
      ],
    },
  ];

  site.genderList = [
    { id: 1, nameEn: 'Male', nameAr: 'ذكر' },
    { id: 2, nameEn: 'Female', nameAr: 'أنثى' },
  ];

  site.post('/api/serviceOrderStatusList', (req, res) => {
    res.json({
      done: true,
      list: site.serviceOrderStatusList,
    });
  });

  site.post('/api/serviceOrderStateList', (req, res) => {
    res.json({
      done: true,
      list: site.serviceOrderStateList,
    });
  });

  site.post('/api/storeTypeList', (req, res) => {
    res.json({
      done: true,
      list: site.storeTypeList,
    });
  });

  site.post('/api/socialPlatformList', (req, res) => {
    res.json({
      done: true,
      list: site.socialPlatformList,
    });
  });

  site.post('/api/genderList', (req, res) => {
    res.json({
      done: true,
      list: site.genderList,
    });
  });
};
