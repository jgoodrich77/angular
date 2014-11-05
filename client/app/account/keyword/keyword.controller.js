/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

angular
.module('auditpagesApp')
.controller('AccountKeywordsCtrl', function ($scope, $http) {
$scope.awesomeThings = [];

    $http.get('/api/keywords').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      console.log($scope.awesomeThings);
     
    });
    $scope.errors = {};
$scope.keywords = [ {
   "_id": "5451c2cf0d90f415458b4567",
   "keyword": "mobile phone"
  
},
 {
   "_id": "54502ba33dd00722b92ce18e",
   "keyword": "digital cameras"
  
}	

];
//    $scope.addKeyword = function(form) {
//      if($scope.newKeyword === '') {
//        return;
//      }
//    
//      console.log($scope.newKeyword);
//        console.log('hee');
//      $http
//        .post('/api/keyword', { keyword: $scope.newKeyword })
//        .success(function(){
//          console.log('success:', arguments);
//        })
//        .error(function(){
//          console.log('error:', arguments);
//        });
//      $scope.newKeyword = '';
//    };


  $scope.addKeyword = function() {
      if($scope.newKeyword === '') {
        return;
      }
      $http.post('/api/keyword', { keyword: $scope.newKeyword });
      $scope.newKeyword = '';
    };
    $scope.deleteKeyword = function(keyword) {
      $http.delete('/keyword/' + keyword._id);
    };

});
