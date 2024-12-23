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
          code: "comment",
          name: "Comment",
        },
        {
          code: "share",
          name: "Share",
        },
        {
          code: "followUser",
          name: "Follow User",
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
          script: 'facebook-like-post',
        },
        {
          code: "likePost",
          name: "Like Post",
          script: `/*###tasks/facebook-like-post.js*/`,
        },
        {
          code: "joinGroup",
          name: "Join Group",
          script: `/*###tasks/facebook-join-group.js*/`,
        },
        {
          code: "followUser",
          name: "Follow User",
          script: `/*###tasks/facebook-follow-user.js*/`,
        },
        {
          code: "getRequestFriend",
          name: "Get Request Friend",
          script: `/*###tasks/facebook-request-friend.js*/`,
        },
        {
          code: "removeBlockedUsers",
          name: "Remove Blocked or [ check Point ] Users",
          script: `/*###tasks/facebook-remove-blocked-users.js*/`,
        },
        {
          code: "createPost",
          name: "Create Post",
          script: `/*###tasks/facebook-create-post.js*/`,
        },
        {
          code: "createComment",
          name: "Create Comment",
          script: `/*###tasks/facebook-create-comment.js*/`,
        },
        {
          code: "createCommentAndLike",
          name: "Create Comment And Like",
          script: `/*###tasks/facebook-create-comment-like.js*/`,
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
