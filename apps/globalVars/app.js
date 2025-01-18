module.exports = function init(site) {
  site.paymentMethodList = [
    {
      code: "paypal",
      name: "Paypal",
    },
    {
      code: "walletCash",
      name: "Wallet Cash",
    },
  ];
  site.runTypeList = [
    {
      code: "immediate",
      name: "Immediate",
    },
    {
      code: "specificDate",
      name: "Specific Date",
    },
  ];
  site.providerList = [
    {
      code: "site",
      name: "Site",
    },
    {
      code: "user",
      name: "User",
    },
  ];
  site.storeTypeList = [
    {
      code: "private",
      name: "Private",
    },
    {
      code: "public",
      name: "Public",
    },
    {
      code: "shared",
      name: "Shared",
    },
  ];

  site.transactionStatusList = [
    {
      code: "pending",
      name: "Pending",
    },
    {
      code: "running",
      name: "Running",
    },
    {
      code: "done",
      name: "Done",
    },
  ];

  site.transactionNameList = [
    {
      code: "rechargeBalance",
      name: "Recharge Balance",
    },
    {
      code: "buyAccount",
      name: "Buy Account",
    },
    {
      code: "buyPackage",
      name: "Buy Package",
    },
    {
      code: "buyService",
      name: "Buy Service",
    },
  ];

  site.transactionTypeList = [
    {
      code: "review",
      name: "Review",
    },
    {
      code: "approved",
      name: "Approved",
    },
    {
      code: "rejected",
      name: "Rejected",
    },
  ];

  site.socialPlatformList = [
    {
      code: "website",
      name: "Website",
      serviceList: [
        {
          code: "view",
          name: "View",
        },
      ],
    },
    {
      code: "instagram",
      name: "Instagram",
      url: "https://www.instagram.com/",
      serviceList: [
        {
          code: "likePost",
          name: "Like Post",
        },
        {
          code: "createComment",
          name: "Create Comment",
        },
        {
          code: "createCommentAndLike",
          name: "Create Comment And Like",
        },
        {
          code: "followUser",
          name: "Follow User",
        },
        {
          code: "share",
          name: "Share",
        },
       
        {
          code: "unFollowUser",
          name: "Un-Follow User",
        },
      ],
    },
    {
      code: "youtube",
      name: "Youtube",
      url: "https://www.youtube.com/",

      serviceList: [
        {
          code: "like",
          name: "Like",
        },
        {
          code: "comment",
          name: "Comment",
        },
        {
          code: "share",
          name: "Share",
        },
        {
          code: "subscribe",
          name: "Subscribe",
        },
        {
          code: "view",
          name: "View",
        },
      ],
    },
    {
      code: "facebook",
      name: "Facebook",
      url: "https://www.facebook.com/",
      serviceList: [
        {
          code: "likePage",
          name: "Like Page",
        },
        {
          code: "likePost",
          name: "Like Post",
        },
        {
          code: "joinGroup",
          name: "Join Group",
        },
        {
          code: "followUser",
          name: "Follow User",
        },
        {
          code: "getRequestFriend",
          name: "Get Request Friend",
        },
        {
          code: "removeBlockedUsers",
          name: "Remove Blocked or [ check Point ] Users",
        },
        {
          code: "createPost",
          name: "Create Post",
        },
        {
          code: "createComment",
          name: "Create Comment",
        },
        {
          code: "createCommentAndLike",
          name: "Create Comment And Like",
        },
      ],
    },
  ];

  site.selectedAccountsTypeList = [
    {
      code: "allUsers",
      name: "All Users",
    },
    {
      code: "limitedCount",
      name: "Limited Users Count",
    },
    {
      code: "selectedUsers",
      name: "Selected Users",
    },
  ];

  site.genderList = [
    { code: "male", name: "Male" },
    { code: "female", name: "Female" },
  ];

  site.post("/api/paymentMethodList", (req, res) => {
    res.json({
      done: true,
      list: site.paymentMethodList,
    });
  });

  site.post("/api/providerList", (req, res) => {
    res.json({
      done: true,
      list: site.providerList,
    });
  });

  site.post("/api/runTypeList", (req, res) => {
    res.json({
      done: true,
      list: site.runTypeList,
    });
  });

  site.post("/api/transactionStatusList", (req, res) => {
    res.json({
      done: true,
      list: site.transactionStatusList,
    });
  });

  site.post("/api/transactionTypeList", (req, res) => {
    res.json({
      done: true,
      list: site.transactionTypeList,
    });
  });

  site.post("/api/transactionNameList", (req, res) => {
    res.json({
      done: true,
      list: site.transactionNameList,
    });
  });

  site.post("/api/storeTypeList", (req, res) => {
    res.json({
      done: true,
      list: site.storeTypeList,
    });
  });

  site.post("/api/socialPlatformList", (req, res) => {
    res.json({
      done: true,
      list: site.socialPlatformList,
    });
  });

  site.post("/api/selectedAccountsTypeList", (req, res) => {
    res.json({
      done: true,
      list: site.selectedAccountsTypeList,
    });
  });

  site.post("/api/genderList", (req, res) => {
    res.json({
      done: true,
      list: site.genderList,
    });
  });
};
