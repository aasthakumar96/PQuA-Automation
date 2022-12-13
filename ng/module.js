angular.module('myapp', [
    'ngRoute', 'pascalprecht.translate'
]).controller('MainCtrl', ['$scope', '$translate', function ($scope, $translate) {
    $scope.config = {
        languageList: languageList
    };
    $scope.currentLanguage = 'English';
    $scope.languages = _.map($scope.config.languageList, function (item) {
        return item['name'];
    });

    $scope.updateLocale = function () {
        var languageItem = _.filter($scope.config.languageList, function (item) {
            return item['name'] == $scope.currentLanguage;
        })[0];
        $translate.use(languageItem['locale']);
    };
}]).config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'resources/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en-US');

});
