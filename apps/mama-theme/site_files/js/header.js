var app = app || angular.module('myApp', []);
app.controller('mamaHeader', function ($scope, $http, $timeout) {
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
 
  $scope.exitMama = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/exitMama',
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
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
 
});
