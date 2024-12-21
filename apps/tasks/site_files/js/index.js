app.controller("tasks", function ($scope, $http, $timeout) {
  if (SOCIALBROWSER) {
    $scope.baseURL = "";
    $scope.appName = "tasks";
    $scope.modalID = "#tasksManageModal";
    $scope.modalSearchID = "#tasksSearchModal";
    $scope.setting = site.showObject(`##data.#setting##`);
    $scope.mode = "add";
    $scope._search = {};
    $scope.structure = {};
    $scope.item = {};
    $scope.list = [];

    $scope.showAdd = function (_item) {
      $scope.error = "";
      $scope.mode = "add";
      $scope.item = {
        private: false,
        url: `https://www.##query.type##.com/`,
        platform: $scope.socialPlatformList.find((itm) => itm.code == "##query.type##"),
        usersType: $scope.selectedUserTypeList[1],
        session: SOCIALBROWSER.var.core.session,
        count: 0,
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
      $scope.item.platformService = $scope.item.platform.serviceList[0];
      site.showModal($scope.modalID);
    };

    $scope.add = function (_item) {
      $scope.error = "";
      const v = site.validated($scope.modalID);
      if (!v.ok) {
        $scope.error = v.messages[0].ar;
        return;
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

    $scope.showView = function (_item) {
      $scope.error = "";
      $scope.mode = "view";
      $scope.item = {};
      $scope.view(_item);
      site.showModal($scope.modalID);
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

    $scope.getselectedUserTypeList = function () {
      $scope.busy = true;
      $scope.selectedUserTypeList = [];
      $http({
        method: "POST",
        url: "/api/selectedUserTypeList",
        data: {},
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            $scope.selectedUserTypeList = response.data.list;
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
      if ($scope.busyAll) {
        return;
      }
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
    $scope.getselectedUserTypeList();
    $scope.getTransactionStatusList();
  }
});
