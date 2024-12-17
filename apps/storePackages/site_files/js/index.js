app.controller("storePackages", function ($scope, $http, $timeout) {
  $scope.baseURL = "";
  $scope.appName = "storePackages";
  $scope.modalID = "#storePackagesManageModal";
  $scope.modalSearchID = "#storePackagesSearchModal";
  $scope.setting = site.showObject(`##data.#setting##`);
  $scope.mode = "add";
  $scope.buy = {};
  $scope._search = {};
  $scope.structure = {
    active: true,
  };
  $scope.item = {};
  $scope.list = [];

  $scope.showAdd = function (_item) {
    $scope.error = "";
    $scope.mode = "add";
    $scope.item = { ...$scope.structure, price: 0, accountsPrice: 0 };
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

  $scope.removeAccount = function (item) {
    $scope.accountList = $scope.accountList.filter(function (itm) {
      return itm.id !== item.id;
    });
    $scope.linkWithPackage({which :13},item.email,'unlink')
  };

  $scope.calcPrice = function () {
    $scope.item.accountsPrice = 0;
    for (let i = 0; i < $scope.accountList.length; i++) {
      $scope.item.accountsPrice += $scope.accountList[i].price;
    }
  };

  $scope.linkWithPackage = function (ev, search, type) {
    $scope.errAccount = "";

    if (ev.which === 13 && search) {
      $scope.busy = true;
      $scope.error = "";
      $http({
        method: "POST",
        url: `${$scope.baseURL}/api/storeAccounts/linkWithPackage`,
        data: {
          type: type,
          packageId: $scope.item.id,
          where: {
            email: search,
            "user.id": $scope.item.user.id,
            "storeType.code": $scope.item.storeType.code,
          },
        },
      }).then(
        function (response) {
          $scope.busy = false;

          if (response.data.done) {
            if(type == 'link') {

              if (!$scope.accountList.some((_a) => _a.email == response.data.doc.email || _a.id == response.data.doc.id)) {
                $scope.accountList.unshift(response.data.doc);
              } else {
                $scope.errAccount = "##word.Email is exists##";
              }
            }
            $scope.calcPrice();
          } else {
            $scope.errAccount = response.data.error;
          }
          $scope.item.$email = "";
        },
        function (err) {
          console.log(err);
        }
      );
    }
  };

  $scope.getStoreAccounts = function (item) {
    $scope.errAccount = "";
    $scope.accountList = [];
    $scope.busy = true;
    $scope.error = "";
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/view`,
      data: {
        id: item.id,
      },
    }).then(function (response) {
      if (response.data.done) {
        $scope.item = response.data.doc;

        $http({
          method: "POST",
          url: `${$scope.baseURL}/api/storeAccounts/viewSomeData`,
          data: {
            "user.id": $scope.item.user.id,
            "packageId": $scope.item.id,
          },
        }).then(
          function (response1) {
            $scope.busy = false;
            if (response1.data.done) {
              $scope.accountList = response1.data.docs || [];
              site.showModal("#accountsManageModal");
            } else {
              $scope.errAccount = response1.data.error;
            }
            $scope.item.$email = "";
          },
          function (err) {
            console.log(err);
          }
        );
      } else {
        $scope.error = response.data.error;
      }
    });
  };

  $scope.getStoreTypeList = function () {
    $scope.busy = true;
    $scope.storeTypeList = [];
    $http({
      method: "POST",
      url: "/api/storeTypeList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.storeTypeList = response.data.list;
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
      method: 'POST',
      url: '/api/providerList',
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

  $scope.showBuyModal = function (_item) {    
    $scope.item = {};
    $scope.view(_item);
    site.showModal("#buyModal");
  };

  $scope.addBuyTransaction = function () {
    $scope.error = "";
    const v = site.validated("#buyModal");
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    let obj = {
      user: $scope.buy.user,
      transactionName: $scope.transactionNameList.find((itm) => itm.code == "buyPackage"),
      paymentMethod: $scope.buy.paymentMethod,
      type: $scope.transactionTypeList.find((itm) => itm.code == "review"),
      userProvider : $scope.item.user,
      price: $scope.item.price,
      package: {
        id: $scope.item.id,
        title: $scope.item.title,
        storeType: $scope.item.storeType,
        provider: $scope.item.provider,
      },
    };
    $scope.busy = true;
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/transactions/add`,
      data: obj,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal("#buyModal");
          site.resetValidated("#buyModal");
          $scope.buy = {};
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.getPaymentMethodList = function () {
    $scope.busy = true;
    $scope.paymentMethodList = [];
    $http({
      method: "POST",
      url: "/api/paymentMethodList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.paymentMethodList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTransactionNameList = function () {
    $scope.busy = true;
    $scope.transactionNameList = [];
    $http({
      method: "POST",
      url: "/api/transactionNameList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.transactionNameList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTransactionTypeList = function () {
    $scope.busy = true;
    $scope.transactionTypeList = [];
    $http({
      method: "POST",
      url: "/api/transactionTypeList",
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.transactionTypeList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
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
  $scope.getStoreTypeList();
  $scope.getProviderList();
  $scope.getPaymentMethodList();
  $scope.getTransactionNameList();
  $scope.getTransactionTypeList();
});
