app.controller("storeAccounts", function ($scope, $http, $timeout) {
  $scope.baseURL = "";
  $scope.appName = "storeAccounts";
  $scope.modalID = "#storeAccountsManageModal";
  $scope.modalSearchID = "#storeAccountsSearchModal";
  $scope.setting = site.showObject(`##data.#setting##`);
  $scope.mode = "add";
  $scope._search = {};
  $scope.buy = {};
  $scope.structure = {
    active: true,
    standalone: true,
    allowSale: false,
    trusted: false,
  };
  $scope.item = {};
  $scope.list = [];

  $scope.showAdd = function (_item) {
    $scope.error = "";
    $scope.mode = "add";
    $scope.item = { ...$scope.structure };
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
            $scope.list[index].socialPlatform.$image = { url: "/images/" + $scope.list[index].socialPlatform.name + ".png" };
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

  $scope.makeTrusted = function (_item) {
    $scope.error = "";
    $scope.busy = true;
    $http({
      method: "POST",
      url: `${$scope.baseURL}/api/${$scope.appName}/updateTrusted`,
      data: { id: _item.id },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal($scope.modalID);
          site.resetValidated($scope.modalID);
          let index = $scope.list.findIndex((itm) => itm.id == response.data.doc.id);
          if (index !== -1) {
            $scope.list[index] = response.data.doc;
            $scope.list[index].socialPlatform.$image = { url: "/images/" + $scope.list[index].socialPlatform.name + ".png" };
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
          $scope.item.socialPlatform.$image = { url: "/images/" + $scope.item.socialPlatform.name + ".png" };
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
          response.data.list.forEach((s) => {
            s.socialPlatform.$image = { url: "/images/" + s.socialPlatform.name + ".png" };
          });
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
    if(!$scope.item.standalone) {
      $scope.error = '##word.This account is linked to a group and cannot be purchased individually##';
      return;
    }
    let obj = {
      user: $scope.buy.user,
      transactionName: $scope.transactionNameList.find((itm) => itm.code == "buyAccount"),
      paymentMethod: $scope.buy.paymentMethod,
      type: $scope.transactionTypeList.find((itm) => itm.code == "review"),
      price: $scope.item.price,
      userProvider : $scope.item.user,
      account: {
        id: $scope.item.id,
        title: $scope.item.title,
        socialPlatform: $scope.item.socialPlatform,
        storeType: $scope.item.storeType,
        provider: $scope.item.provider,
        email: $scope.item.email,
        password: $scope.item.password,
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

  $scope.login = function (account) {
    if (!window.SOCIALBROWSER) {
      alert("Download Social Browser");
      return false;
    }

    let codeInjected = `SOCIALBROWSER.$account = '${SOCIALBROWSER.to123(account)}';`;
    let coreScript = SOCIALBROWSER.from123(`/*###storeAccounts/core.js*/`);

    codeInjected += coreScript;

    /*SOCIALBROWSER.addSession(account.email);*/

    SOCIALBROWSER.ipc("[open new popup]", {
      url: account.socialPlatform.url || "https://www.google.com/",
      partition: "persist:" + SOCIALBROWSER.md5(account.email),
      show: true,
      vip: true,
      width: 800,
      height: 600,
      skipTaskbar: false,
      center: true,
      allowMenu: true,
      alwaysOnTop: true,
      eval: codeInjected,
    });
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
