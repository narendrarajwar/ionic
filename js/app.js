// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var instance='imtrade';
var API_URL='http://api.gocatalyze.com';
var API_PORT= '80';
var header={"Content-Type":"application.json"};
var API_KEY;

var imtrade=angular.module('starter', ['ionic','ngRoute','ngCookies','ngResource']);

imtrade.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});



imtrade.config(function($stateProvider,$urlRouterProvider){
  $stateProvider
  .state('login',{
    url:"/login",
    templateUrl:"templates/login.html",
    controller:'LoginCtrl'
  })
  .state('app',{
    url:"/app",
    templateUrl:"templates/menu.html",
    controller:'HomeCtrl'
  })
  .state('app.home',{
    url:"/home",
    views:{
      'menuContent':{
        templateUrl:"templates/home.html",
        controller:'HomeCtrl'
      }
    }
  })
  .state('app.profile',{
    url:"/profile",
    views:{
      'menuContent':{
        templateUrl:"templates/profile.html",
        controller:'ProfileCtrl'
      }
    }
  })
  .state('app.orders',{
    url:"/orders",
    views:{
      'menuContent':{
        templateUrl:"templates/orders.html",
        controller:'OrderCtrl'
      }
    }
  })
  .state('app.invoice',{
    url:"/invoice",
    views:{
      'menuContent':{
        templateUrl:"templates/invoice-history.html",
        controller:'InvoiceHistoryCtrl'
      }
    }
  })
  .state('app.order-detail',{
    url:'/orders/order-detail/:orderId',
    views:{
      'menuContent':{
        controller:'OrderDetailCtrl',
        templateUrl:'templates/order-detail.html'
      }
    }
  })
  .state('app.enquiry',{
    url:'/enquiry',
    views:{
      'menuContent':{
        controller:'EnquiryCtrl',
        templateUrl:'templates/enquiry.html'
      }
    }
  })
  .state('app.msg-full-mode',{
    url:'/msg-full-mode/:msgId',
    views:{
      'menuContent':{
        templateUrl:'templates/msg-full-mode.html',
        controller:'MsgFullModeCtrl'
      }
    }
  })
  .state('app.delegate',{
    url:'/delegate',
    views:{
        'menuContent':{
          templateUrl:'templates/delegate.html',
          controller:'DelCtrl'
        }
      }
  });



  $urlRouterProvider.otherwise('/app/home');
});


/*imtrade.config(function($routeProvider){
  $routeProvider.
  when('/login',{
    templateUrl:'templates/login.html',
    controller:'LoginCtrl'
  }).
  when('/home',{
    templateUrl:'templates/menu.html',
    controller:'HomeCtrl'
  }).
  when('/profile',{
    templateUrl:'templates/profile.html',
    controller:'ProfileCtrl'
  }).
  otherwise({
    redirectTo:'/login'
  });
});*/