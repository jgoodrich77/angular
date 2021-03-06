'use strict';

angular.module('auditpagesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.errors', {
        'abstract': true,
        url: '/errors',
        views: {
          'content': {
            templateUrl: 'app/errors/errors.html'
          }
        }
      })
      .state('app.errors.accessdenied', {
        url: '/accessdenied',
        data: {
          breadcrumbTitle: 'Access Denied'
        },
        views: {
          'error-content': {
            templateUrl: 'app/errors/accessdenied/accessdenied.html',
            controller: 'ErrorsAccessDeniedCtrl'
          }
        }
      })
      .state('app.errors.pagenotfound', {
        url: '/pagenotfound',
        data: {
          breadcrumbTitle: 'Page Not Found'
        },
        views: {
          'error-content': {
            templateUrl: 'app/errors/pagenotfound/pagenotfound.html',
            controller: 'ErrorsPageNotFoundCtrl'
          }
        }
      });
  });
