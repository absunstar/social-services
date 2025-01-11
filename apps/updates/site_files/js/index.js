app.controller("updates", function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.updates = {};

  $scope.displayAddPageImplement = function () {
    $scope.error = '';
    $scope.updates = {
      image_url: '/images/updates.png',
      active: true/* ,
      immediate : false */
    };
    site.showModal('#updateImplementAddModal');
    
  };

  $scope.addPageImplement = function () {
    $scope.error = '';
    const v = site.validated('#updateImplementAddModal');

    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };
   
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/updates/add",
      data: $scope.updates
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateImplementAddModal');
          $scope.getPageImplementList();
        } else {
          $scope.error = response.data.error;
     
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayUpdatePageImplement = function (updates) {
    $scope.error = '';
    $scope.viewPageImplement(updates);
    $scope.updates = {};
    site.showModal('#updateImplementUpdateModal');
  };

  $scope.updatePageImplement = function () {
    $scope.error = '';
    const v = site.validated('#updateImplementUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/updates/update",
      data: $scope.updates
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateImplementUpdateModal');
          $scope.getPageImplementList();
        } else {
          $scope.error = 'Please Login First';
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDetailsPageImplement = function (updates) {
    $scope.error = '';
    $scope.viewPageImplement(updates);
    $scope.updates = {};
    site.showModal('#updateImplementViewModal');
  };

  $scope.viewPageImplement = function (updates) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: "POST",
      url: "/api/updates/view",
      data: {
        id: updates.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.updates = response.data.doc;
          window.editEditor.setContents($scope.updates.content);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.displayDeletePageImplement = function (updates) {
    $scope.error = '';
    $scope.viewPageImplement(updates);
    $scope.updates = {};
    site.showModal('#updateImplementDeleteModal');

  };

  $scope.deletePageImplement = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: "POST",
      url: "/api/updates/delete",
      data: {
        id: $scope.updates.id
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateImplementDeleteModal');
          $scope.getPageImplementList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    )
  };

  $scope.getPageImplementList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: "POST",
      url: "/api/updates/all",
      data: {
        where: where
      }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#updateImplementSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#updateImplementSearchModal');

  };

  $scope.searchAll = function () { 
    $scope.getPageImplementList($scope.search);
    site.hideModal('#updateImplementSearchModal');
    $scope.search = {};

  };

  $scope.getPageImplementList();
});