'use strict';

angular.module('auditpagesApp')
  .controller('NavbarCtrl', function ($scope, $location, $state, Auth) {

    var
    loggedIn = Auth.isLoggedIn,
    loggedOut = function(){
      return !loggedIn();
    };

    //
    // Menu items with 'link' property instead of 'state'
    // have a bug right now. Trying to find a way to conditionally
    // add the directive 'ui-sref-active' only when item  has a 'state'
    // property set.
    //

    $scope.menuLeft = [/*{
      'caption': 'Home',
      'title': 'Go back to home page',
      'state': 'app.main',
      'glyph': 'glyphicon glyphicon-home',
      'showIf': function() {
        return $state.current.name !== 'app.main';
      }
    },{
      'caption': 'External Link',
      'title': 'Go back to Google.com',
      'link': 'http://google.com/',
      'external': true
    }*/];

    $scope.menuRight = [{
      'caption': 'Dashboard',
      'state': 'app.dashboard',
      'roles': ['user','admin']
    }, {
      'caption': 'Meme Generator',
      'title': 'Generator a Meme Image',
      'state': 'app.meme',
      'glyph': 'glyphicon glyphicon-image',
      'roles': ['user','admin']
    }/*,{
      'caption': 'About',
      'title': 'HookupJS Free Software',
      'link': 'http://blog.hookupjs.com/about/',
      'external': true
    },{
      'caption': 'Contact',
      'title': 'HookupJS Contact FAQ',
      'link': 'http://blog.hookupjs.com/faq-items/faq/',
      'external': true
    }*/,{
      'caption': 'Administration',
      'title': 'Administration page',
      'state': 'app.admin',
      'glyph': 'glyphicon glyphicon-star',
      'roles': ['admin']
    }];

    $scope.userMenu = [{
      'caption': 'My Dashboard',
      'title': 'Access your amazing dashboard.',
      'state': 'app.dashboard',
      'glyph': 'fa fa-tachometer'
    }/*,{
      'caption': 'Groups',
      'title': 'Choose which groups you are associated with',
      'state': 'app.account.groups',
      'glyph': 'glyphicon glyphicon-plane'
    }*/,{
      'caption': 'Profile Settings',
      'title': 'Change your profile settings',
      'state': 'app.account',
      'glyph': 'glyphicon glyphicon-cog'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isSettingUp = Auth.isSettingUp;
    $scope.currentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
