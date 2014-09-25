'use strict';

angular.module('snapdocApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newcontract', {
        url: '/newcontract',
        templateUrl: 'app/newcontract/newcontract.html',
        controller: 'NewcontractCtrl'
      });
  });