module.exports = function init(site) {
  site.storeTypes = [
    {
      name: "public",
      Ar: "عام",
      En: "Public",
    },
    {
      name: "private",
      Ar: "خاص",
      En: "Private",
    },
  ];

  site.serviceOrderStatus = [
    {
      name: "pending",
    },
    {
      name: "running",
    },
    {
      name: "done",
    },
  ];

  site.serviceOrderTypes = [
    {
      name: "view",
    },
    {
      name: "approved",
    },
    {
      name: "rejected",
    },
  ];

  site.socialPlatforms = [
    {
      name: "youtube",
      serviceList: [
        {
          name: "like",
        },
        {
          name: "comment",
        },
        {
          name: "share",
        },
        {
          name: "subscribe",
        },
        {
          name: "view",
        },
      ],
    },
    {
      name: "facebook",
      serviceList: [
        {
          name: "like",
        },
        {
          name: "comment",
        },
        {
          name: "share",
        },
        {
          name: "follow",
        },
      ],
    },
    {
      name: "instagram",
      serviceList: [
        {
          name: "like",
        },
        {
          name: "comment",
        },
        {
          name: "share",
        },
        {
          name: "follow",
        },
      ],
    },
  ];

  site.genders = [
    { id: 1, nameEn: "Male", nameAr: "ذكر" },
    { id: 2, nameEn: "Female", nameAr: "أنثى" },
  ];

  site.post("/api/serviceOrderStatus", (req, res) => {
    res.json({
      done: true,
      list: site.serviceOrderStatus,
    });
  });

  site.post("/api/serviceOrderTypes", (req, res) => {
    res.json({
      done: true,
      list: site.serviceOrderTypes,
    });
  });

  site.post("/api/storeTypes", (req, res) => {
    res.json({
      done: true,
      list: site.storeTypes,
    });
  });

  site.post("/api/socialPlatforms", (req, res) => {
    res.json({
      done: true,
      list: site.socialPlatforms,
    });
  });

  site.post("/api/genders", (req, res) => {
    res.json({
      done: true,
      list: site.genders,
    });
  });
};
