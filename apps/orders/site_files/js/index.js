app.controller("orders", function ($scope, $http, $timeout) {
  $scope.baseURL = "";
  $scope.appName = "orders";
  $scope.modalID = "#ordersManageModal";
  $scope.modalSearchID = "#ordersSearchModal";
  $scope.setting = site.showObject(`##data.#setting##`);
  $scope.mode = "add";
  $scope._search = {};
  $scope.structure = {};
  $scope.item = {};
  $scope.list = [];
  $scope.title = "##query.type##";
  $scope.title = $scope.title[0].toUpperCase() + $scope.title.slice(1);
  $scope.showAdd = function (_item) {
    $scope.error = "";
    $scope.mode = "add";
    $scope.item = {
      private: false,
      url: `https://www.##query.type##.com/`,
      socialPlatform: $scope.socialPlatformList.find((itm) => itm.code == "##query.type##"),
      accountsType: $scope.selectedAccountsTypeList[1],
      status: $scope.transactionStatusList[0],
      actionCount: 0,
      fromUser: 1,
      toUser: 10,
      windowsCount: 10,
      currentWindowCount: 0,
      openedWindowCount: 0,
      closedWindowCount: 0,
      timeout: 30,
      delay: 15,
      commentList: [],
      interval: null,
      screenWidth: 1200,
      screenHeight: 800,
      screenX: 0,
      screenY: 0,
      startActionAfter: 60,
      closeAfterAction: false,
      refererEnabled: false,
      refererURL: "https://www.google.com",
    };
    $scope.item.platformService = $scope.item.socialPlatform.serviceList[0];
    site.showModal($scope.modalID);
  };

  $scope.add = function (_item) {
    $scope.error = "";
    const v = site.validated($scope.modalID);
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if ($scope.item.accountsType.code == "allUsers") {
      $scope.item.accountList = $scope.accountList;
    } else if ($scope.item.accountsType.code == "limitedCount") {
      $scope.item.accountList = $scope.accountList.slice($scope.item.fromUser - 1, $scope.item.toUser).map((s) => ({ name: s.name, display: s.display }));
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/add`,
      data: $scope.item,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal($scope.modalID);
          site.resetValidated($scope.modalID);
          $scope.list.unshift(response.data.doc);
        } else {
          $scope.error = response.data.error;
          if (response.data.error && response.data.error.like("*Must Enter Code*")) {
            $scope.error = "##word.Must Enter Code##";
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.duplicate = function (_item) {
    $scope.error = "";
    let item = { ..._item };
    $scope.busy = true;
    delete item.id;
    delete item._id;
    item.actionCount = 0;
    item.isTargets = false;
    item.status = $scope.transactionStatusList[0];
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/add`,
      data: item,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list.unshift(response.data.doc);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.showUpdate = function (_item) {
    $scope.error = "";
    $scope.mode = "edit";
    $scope.view(_item);
    $scope.item = {};
    site.showModal($scope.modalID);
  };

  $scope.update = function (_item) {
    $scope.error = "";
    const v = site.validated($scope.modalID);
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if ($scope.item.accountsType.code == "allUsers") {
      $scope.item.accountList = $scope.accountList;
    } else if ($scope.item.accountsType.code == "limitedCount") {
      $scope.item.accountList = $scope.accountList.slice($scope.item.fromUser - 1, $scope.item.toUser).map((s) => ({ name: s.name, display: s.display }));
    }

    $scope.busy = true;
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/update`,
      data: _item,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal($scope.modalID);
          site.resetValidated($scope.modalID);
          let index = $scope.list.findIndex((itm) => itm.id == response.data.result.doc.id);
          if (index !== -1) {
            $scope.list[index] = response.data.result.doc;
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.postingTasks = function (itemId, type) {
    $scope.error = "";

    $scope.busy = true;
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/postingTasks`,
      data: { id: itemId, isTargets: type },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          let index = $scope.list.findIndex((itm) => itm.id == response.data.doc.id);
          if (index !== -1) {
            $scope.list[index] = response.data.doc;
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.showView = function (_item) {
    $scope.error = "";
    $scope.mode = "view";
    $scope.item = {};
    $scope.view(_item);
    site.showModal($scope.modalID);
  };

  $scope.showTasks = function (_item) {
    $scope.error = "";
    $scope.item = _item;
    $scope.getTasks({ orderId: _item.id }, (tasks) => {
      if (tasks && tasks.length > 0) {
        site.showModal("#taskListhModal");
      }
    });
  };

  $scope.view = function (_item) {
    $scope.busy = true;
    $scope.error = "";
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/view`,
      data: {
        id: _item.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.item = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.showDelete = function (_item) {
    $scope.error = "";
    $scope.mode = "delete";
    $scope.item = {};
    $scope.view(_item);
    site.showModal($scope.modalID);
  };

  $scope.delete = function (_item) {
    $scope.busy = true;
    $scope.error = "";

    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/delete`,
      data: {
        id: $scope.item.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal($scope.modalID);
          let index = $scope.list.findIndex((itm) => itm.id == response.data.result.doc.id);
          if (index !== -1) {
            $scope.list.splice(index, 1);
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.getAll = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    where["socialPlatform.code"] = "##query.type##";
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/all`,
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;

          $scope.count = response.data.count;
          site.hideModal($scope.modalSearchID);
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getSocialPlatformList = function () {
    $scope.busy = true;
    $scope.socialPlatformList = [];
    $http({
      method: "POST",
      url: "/api/socialPlatformList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.socialPlatformList = response.data.list;
          $scope.socialPlatform = $scope.socialPlatformList.find((s) => s.code == '##query.type##')
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getProviderList = function () {
    $scope.busy = true;
    $scope.providerList = [];
    $http({
      method: "POST",
      url: "/api/providerList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.providerList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTransactionStatusList = function () {
    $scope.busy = true;
    $scope.transactionStatusList = [];
    $http({
      method: "POST",
      url: "/api/transactionStatusList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.transactionStatusList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getselectedAccountsTypeList = function () {
    $scope.busy = true;
    $scope.selectedAccountsTypeList = [];
    $http({
      method: "POST",
      url: "/api/selectedAccountsTypeList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.selectedAccountsTypeList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getUsers = function (search) {
    $scope.error = "";
    /*    if ($scope.busyAll) {
        return;
      } */
    $scope.busyAll = true;
    $scope.usersList = [];

    $http({
      method: "POST",
      url: `/api/manageUsers/all`,
      data: {
        search: search,
        select: { id: 1, firstName: 1 },
      },
    }).then(
      function (response) {
        $scope.busyAll = false;

        if (response.data.done && response.data.list.length > 0) {
          $scope.usersList = response.data.list;
        }
      },
      function (err) {
        $scope.busyAll = false;
        $scope.error = err;
      }
    );
  };

  $scope.getAccountList = function () {
    $scope.error = "";
    if ($scope.busy || !$scope.item?.user?.id) {
      return;
    }
    $scope.busy = true;
    $scope.accountList = [];
    $http({
      method: "POST",
      url: `/api/storeAccounts/all`,
      data: {
        where: { "user.id": $scope.item.user.id, "socialPlatform.code": "##query.type##" },
        // select: { id: 1, firstName: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.accountList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTasks = function (where, callback) {
    $scope.error = "";
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/tasks/all",
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list) {
          callback(response.data.list);
        } else {
          callback(null);
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
        callback(null);
      }
    );
  };

  $scope.runAction = function (item) {
    $scope.getTasks({ orderId: item.id, isDone: false }, (tasks) => {
      let accountIndex = tasks.findIndex((u) => u.isDone == false);
      if (accountIndex != -1) {
        $scope.createActionWindow({ ...item, $email: tasks[accountIndex].account.email });
        $scope.updateAction({ orderId: item.id, taskId: tasks[accountIndex].id, type: "run" });
      } else {
        $scope.updateAction({ orderId: item.id, type: "finish" });
      }
    });
  };

  $scope.updateAction = function (item) {
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/updateAction`,
      data: item,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          let index = $scope.list.findIndex((itm) => itm.id == response.data.result.doc.id);
          if (index !== -1) {
            $scope.list[index] = response.data.result.doc;
            if (item.type == "run") {
              $timeout(() => {
                $scope.runAction($scope.list[index]);
              }, 1000 * $scope.list[index].delay);
            }
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.stop = function (item) {
    $scope.updateAction({ orderId: item.id, type: "stop" });
  };

  $scope.scripts = {
    facebook: [
      {
        code: "likePage",
        name: "Like Page",
        script: SOCIALBROWSER.from123("/*###tasks/facebook-like-page.js*/"),
      },
      {
        code: "likePost",
        name: "Like Post",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-like-post.js*/`),
      },
      {
        code: "joinGroup",
        name: "Join Group",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-join-group.js*/`),
      },
      {
        code: "followUser",
        name: "Follow User",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-follow-user.js*/`),
      },
      {
        code: "getRequestFriend",
        name: "Get Request Friend",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-request-friend.js*/`),
      },
      {
        code: "removeBlockedUsers",
        name: "Remove Blocked or [ check Point ] Users",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-remove-blocked-users.js*/`),
      },
      {
        code: "createPost",
        name: "Create Post",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-create-post.js*/`),
      },
      {
        code: "createComment",
        name: "Create Comment",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-create-comment.js*/`),
      },
      {
        code: "createCommentAndLike",
        name: "Create Comment And Like",
        script: SOCIALBROWSER.from123(`/*###tasks/facebook-create-comment-like.js*/`),
      },
    ],
    instagram: [
      {
        code: "likePost",
        name: "Like Post",
        script: SOCIALBROWSER.from123(`/*###tasks/instagram-like-post.js*/`),
      },
      {
        code: "followUser",
        name: "Follow User",
        script: SOCIALBROWSER.from123(`/*###tasks/instagram-follow-user.js*/`),
      },
      {
        code: "createComment",
        name: "Create Comment",
        script: SOCIALBROWSER.from123(`/*###tasks/instagram-create-comment.js*/`),
      },
      {
        code: "createCommentAndLike",
        name: "Create Comment And Like",
        script: SOCIALBROWSER.from123(`/*###tasks/instagram-create-comment-like.js*/`),
      },
    ],
  };

  $scope.createActionWindow = function (site) {
    site.message = "Facebook Manager Ready ...";
    site._time = new Date().getTime();
    let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(site)}';`;
    let code_injected = code + $scope.scripts["##query.type##"].find((s) => s.code == site.platformService.code).script;

    let isTest = SOCIALBROWSER.var.core.id.like("*test*");
    SOCIALBROWSER.ipc("[open new popup]", {
      trackingID: site.trackingID,
      vip: true,
      partition: "persist:" + SOCIALBROWSER.md5(site.$email),
      url: site.url,
      show: true,
      center: !site.screenX && !site.screenY,
      width: site.screenWidth,
      height: site.screenHeight,
      x: site.screenX,
      y: site.screenY,
      allowAudio: false,
      allowDevTools: isTest,
      allowDownload: false,
      allowAds: false,
      allowNewWindows: false,
      allowSaveUserData: false,
      allowSaveUrls: false,
      eval: code_injected,
      timeout: site.timeout * 1000,
      alwaysOnTop: true,
      site: site,
    });
  };

  $scope.openURL = function (site) {
    if (site.$testAccount?.email) {
      let code = `SOCIALBROWSER.fakeview123 = '${SOCIALBROWSER.to123(site)}';`;
      let code_injected = code + $scope.scripts["##query.type##"].find((s) => s.code == site.platformService.code).script;

      let isTest = SOCIALBROWSER.var.core.id.like("*test*");
      SOCIALBROWSER.ipc("[open new popup]", {
        trackingID: site.trackingID,
        vip: true,
        partition: "persist:" + SOCIALBROWSER.md5(site.$testAccount.email),
        url: site.url,
        show: true,
        center: true,
        allowAudio: false,
        allowDevTools: isTest,
        allowDownload: false,
        allowAds: false,
        allowNewWindows: false,
        allowSaveUserData: false,
        allowSaveUrls: false,
        eval: code_injected,
        alwaysOnTop: true,
        site: site,
      });
    }
  };
  $scope.addToCommentList = function (site) {
    site.commentList = site.commentList || [];
    site.commentList.push({ content: site.comment, enabled: true });
    site.comment = "";
    $scope.$applyAsync();
  };

  $scope.showSearch = function () {
    $scope.error = "";
    site.showModal($scope.modalSearchID);
  };

  $scope.searchAll = function () {
    $scope.getAll($scope.search);
    site.hideModal($scope.modalSearchID);
    $scope.search = {};
  };

  $scope.getAll();
  $scope.getSocialPlatformList();
  $scope.getProviderList();
  $scope.getselectedAccountsTypeList();
  $scope.getTransactionStatusList();
});
