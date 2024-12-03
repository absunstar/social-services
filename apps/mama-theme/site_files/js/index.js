var app = app || angular.module("myApp", []);
app.controller("mamaTheme", function ($scope, $http, $timeout) {
  $scope.setting = site.showObject(`##data.#setting##`);
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

});
