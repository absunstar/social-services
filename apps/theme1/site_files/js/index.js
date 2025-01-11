app.controller('mainController', function ($scope, $http, $timeout) {
  $scope.user = {};
  $scope.show_password = false;
  $scope.setting = site.showObject(`##data.#setting##`);
  $scope.codeInject = site.from123('/*###theme1/code-inject.js*/');
  $scope.showTool = function (url) {
    if (!window.SOCIALBROWSER) {
      site.showModal('#socialRequired');
    } else {
      SOCIALBROWSER.ipc('[open new popup]', {
        vip: true,
        partition: SOCIALBROWSER.partition,
        url: url,
        show: true,
        center: true,
        allowDevTools: false,
        alwaysOnTop: true,
        eval: $scope.codeInject,
      });
    }
  };

  $scope.register = function (user) {
    $scope.error = '';
    const v = site.validated('#emailData');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    let obj = {
      $encript: '123',
      email: site.to123(user.email),
      password: site.to123(user.password),
      mobile: user.mobile,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      gender: user.gender,
      country: user.country,
      gov: user.gov,
      city: user.city,
      area: user.area,
      address: user.address,
    };

    if (user) {
      if (user.password === user.rePassword) {
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: { user: obj },
        }).then(
          function (response) {
            if (response.data.error) {
              $scope.error = response.data.error;
              if (response.data.error.like('*enter a valid mobile*')) {
                $scope.error = '##word.please_enter_valid_mobile_number##';
              }
              $scope.busy = false;
            } else if (response.data.user) {
              window.location.href = '/';
            }
          },
          function (err) {
            $scope.busy = false;
            $scope.error = err;
          }
        );
      } else {
        $scope.error = '##word.Password Not Match##';
      }
    }
  };

  $scope.login = function () {
    $scope.error = '';
    const v = site.validated('#loginModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;

    $http({
      method: 'POST',
      url: '/api/user/login',
      data: {
        $encript: '123',
        email: site.to123($scope.user.email),
        password: site.to123($scope.user.password),
      },
    }).then(
      function (response) {
        if (response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*The account is inactive*')) {
            $scope.error = '##word.The account is not activated, please contact support##';
          }
          $scope.busy = false;
        }
        if (response.data.done) {
          window.location.href = '/';
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.logout = function () {
    $scope.error = '';
    $scope.busy = true;

    $http.post('/api/user/logout').then(
      function (response) {
        if (response.data.done) {
          window.location.href = '/';
        } else {
          $scope.error = response.data.error;
          $scope.busy = false;
        }
      },
      function (error) {
        $scope.busy = false;
        $scope.error = error;
      }
    );
  };

  $scope.changeLang = function (language) {
    if (typeof language == "string") {
      language = { id: language, dir: "rtl", text: "right" };
      if (!language.id.like("*ar*")) {
        language.dir = "ltr";
        language.text = "left";
      }
    }
    $http({
      method: "POST",
      url: "/x-language/change",
      data: language,
    }).then(function (response) {
      if (response.data.done) {
        window.location.reload(!0);
      }
    });
  };

  $scope.goToRegister = function (params) {
    window.location.href = '/user-register';
    
  };

  $scope.getGenderList = function () {
    $scope.busy = true;
    $scope.genderList = [];
    $http({
      method: 'POST',
      url: '/api/genderList',
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.genderList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.showPassword = function () {
    $timeout(() => {
      document.querySelectorAll('.password').forEach((p) => {
        p.setAttribute('type', $scope.show_password ? 'text' : 'password');
      });
    }, 100);
  };
});
