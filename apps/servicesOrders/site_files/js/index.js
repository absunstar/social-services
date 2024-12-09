app.controller("servicesOrders", function ($scope, $http, $timeout) {
  $scope.baseURL = "";
  $scope.appName = "servicesOrders";
  $scope.modalID = "#servicesOrdersManageModal";
  $scope.modalSearchID = "#servicesOrdersSearchModal";
  $scope.setting = site.showObject(`##data.#setting##`);
  $scope.mode = "add";
  $scope._search = {};
  $scope.structure = {};
  $scope.item = {};
  $scope.list = [];

  $scope.showAdd = function (_item) {
    $scope.error = "";
    $scope.mode = "add";
    $scope.item = { ...$scope.structure, quantity: 1 };
    $scope.item.type = $scope.serviceOrderStateList.find((itm) => itm.name == "view");
    $scope.item.status = $scope.serviceOrderStatusList.find((itm) => itm.name == "pending");
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

  $scope.updateSome = function (_item, type, value) {
    $scope.error = "";
    $scope.busy = true;
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/updateSome`,
      data: { id: _item.id, type: type, value: value },
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

  $scope.getServiceOrderStatusList = function () {
    $scope.busy = true;
    $scope.serviceOrderStatusList = [];
    $http({
      method: "POST",
      url: "/api/serviceOrderStatusList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.serviceOrderStatusList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getServiceOrderStateList = function () {
    $scope.busy = true;
    $scope.serviceOrderStateList = [];
    $http({
      method: "POST",
      url: "/api/serviceOrderStateList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.serviceOrderStateList = response.data.list;
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

  $scope.getServicesList = function ($search) {
    $scope.error = "";
    if ($search && $search.length < 1) {
      return;
    }
    $scope.busy = true;
    $scope.serviceList = [];
    $http({
      method: "POST",
      url: "/api/services/all",
      data: {
        where: {
          active: true,
        },
        select: {
          id: 1,
          name: 1,
          socialPlatform: 1,
          platformService: 1,
          price: 1,
        },
        search: $search,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.serviceList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.calcTotalPrice = function () {
    $scope.error = "";
    $timeout(() => {
      if ($scope.item?.service?.id) {
        $scope.item.totalPrice = $scope.item.service.price * $scope.item.quantity;
      }
    }, 500);
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
  $scope.getServicesList();
  $scope.getServiceOrderStateList();
  $scope.getServiceOrderStatusList();
});
