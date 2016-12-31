
angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('searchitem', {
        url: '',
        templateUrl: 'views/searchitem.html',
        controller: 'SearchController'
      })
      .state('schedule',{
        url: '/schedule',
        templateUrl: '/views/schedule.html',
        controller: 'ScheduleController'
      })
      .state('foodlist',{
        url: '/foodlist',
        templateUrl: '/views/foodlist.html',
        controller: 'FoodController'
      })
      .state('search-qs',{
        url: '/search?item',
        templateUrl: '/views/searchresult.html',
        controller: 'FoodSearchController'
      });

      $urlRouterProvider.otherwise('home');
  }]);
