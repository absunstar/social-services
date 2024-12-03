app.controller('security', function ($scope, $http, $interval) {
  $scope.gotoUsers = function () {
    window.location.href = '/security/users';
  };

  $scope.gotoRoles = function () {
    window.location.href = '/security/roles';
  };

  $scope.loadRoles = function () {
    $http({
      method: 'POST',
      url: '/api/security/roles',
      data: {},
    }).then(
      function (response) {
        if (response.data.done) {
          $scope.roles = response.data.roles;
          $scope.roles.forEach((role) => {
            role.$permissions = [];
            role.permissions.forEach((permission) => {
              role.$permissions.push({ name: permission });
            });
          });
        }
      },
      function (err) {
        $scope.error = err;
      }
    );
  };

  $scope.loadPermissions = function () {
    $http({
      method: 'POST',
      url: '/api/security/permissions',
      data: {},
    }).then(
      function (response) {
        $scope.screens = [];
        if (response.data.done) {
          response.data.permissions.forEach((p) => {
            let exist = false;

            $scope.screens.forEach((s) => {
              if (s.name == p.screenName) {
                exist = true;
                s.permissions.push(p);
              }
            });

            if (!exist && p.screenName) {
              $scope.screens.push({
                name: p.screenName,
                moduleName: p.moduleName,
                permissions: [p],
              });
            }
          });

          $http({
            method: 'POST',
            url: '/api/get_dir_names',
            data: $scope.screens,
          }).then(
            function (response) {
              let data = response.data.doc;
              $scope.trans = data;
            /*   $scope.screens.forEach((s) => {
                let newname = data.find((el) => el.name == s.name);
                if (newname) {
                  s.nameAr = newname.Ar;
                  s.nameEn = newname.En;
                }
              }); */
       
            },
            function (err) {}
          );

          $scope.accountingScreens = $scope.screens.filter((s) => s.moduleName == 'accounting');
          $scope.inventoryScreens = $scope.screens.filter((s) => s.moduleName == 'inventory');
          $scope.publicScreens = $scope.screens.filter((s) => s.moduleName == 'public');
          $scope.hmisScreens = $scope.screens.filter((s) => s.moduleName == 'hmis');
          $scope.hrScreens = $scope.screens.filter((s) => s.moduleName == 'hr');
          $scope.reportScreens = $scope.screens.filter((s) => s.moduleName == 'report');
          $scope.permissions = response.data.permissions;
  
        }
      },
      function (err) {
        $scope.error = err;
      }
    );
  };

  $scope.user = {
    image: {},
    files: [],
    permissions: [],
    roles: [],
  };

  $scope.addPermission = function () {
    if ($scope.permission == '') {
      return;
    }
    for (let i = 0; i < $scope.user.permissions.length; i++) {
      let p = $scope.user.permissions[i];
      if (p === $scope.permission) {
        $scope.permission = '';
        return;
      }
    }
    $scope.user.permissions.push($scope.permission);
    $scope.permission = '';
  };

  $scope.deletePermission = function (permission) {
    for (let i = 0; i < $scope.user.permissions.length; i++) {
      let p = $scope.user.permissions[i];
      if (p === permission) {
        $scope.user.permissions.splice(i, 1);
      }
    }
  };

  $scope.deleteRole = function (role) {
    for (let i = 0; i < $scope.user.roles.length; i++) {
      let r = $scope.user.roles[i];
      if (r.name === role.name) {
        $scope.user.roles.splice(i, 1);
      }
    }
  };

  $scope.newRole = function () {
    $scope.role = {
      permissions: [],
    };
    site.showModal('#addRoleModal');
    document.querySelector('#addRoleModal .tab-link').click();
  };

  $scope.addRole = function () {
    $scope.role.$permissions = $scope.role.$permissions || [];
    $scope.role.permissions = $scope.role.$permissions.map((p) => p.name);

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/role/add',
      data: $scope.role,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addRoleModal');
          $scope.loadRoles();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  $scope.displayUpdateRole = function (role) {
    $scope.role = role;
    site.showModal('#updateRoleModal');
    document.querySelector('#updateRoleModal .tab-link').click();
  };

  $scope.displayViewRole = function (role) {
    $scope.error = '';
    $scope.role = role;
    site.showModal('#viewRoleModal');
    document.querySelector('#viewRoleModal .tab-link').click();
  };

  $scope.displayDeleteRole = function (role) {
    $scope.error = '';
    $scope.role = role;
    site.showModal('#deleteRoleModal');
    document.querySelector('#deleteRoleModal .tab-link').click();
  };

  $scope.deleteRoleAction = function () {
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/role/delete',
      data: $scope.role,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteRoleModal');
          $scope.loadRoles();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.updateRole = function () {
    $scope.role.$permissions = $scope.role.$permissions || [];
    $scope.role.permissions = $scope.role.$permissions.map((p) => p.name);

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/role/edit',
      data: $scope.role,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateRoleModal');
          $scope.loadRoles();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  $scope.remove = function (user) {
    $scope.view(user);
    $scope.user = {
      image: { },

      files: [],
      permissions: [],
      roles: [],
    };
    site.showModal('#deleteUserModal');
    document.querySelector('#deleteUserModal .tab-link').click();
  };

  $scope.view = function (user) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/view',
      data: {
        id: user.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.user = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  $scope.details = function (user) {
    $scope.view(user);
    $scope.user = {
      image: {},
      files: [],

      permissions: [],
      roles: [],
    };
    site.showModal('#viewUserModal');
  };

  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/delete',
      data: {
        id: $scope.user.id,
        name: $scope.user.name,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteUserModal');
          site.hideModal('#viewUserModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };



  $scope.loadRoles();
  $scope.loadPermissions();
});
