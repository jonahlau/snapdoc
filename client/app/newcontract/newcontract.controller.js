'use strict';

angular.module('snapdocApp')
  .controller('NewcontractCtrl', function ($scope, $http, socket) {

   $http.get('/api/nodes/').success(function(data) {
      var _nodes = data;
      $scope.historyNodes = [];
      $scope.currNode = _nodes[0];
      socket.syncUpdates('node', $scope.historyNodes);
      $http.get('/api/trees/').success(function(data) {
        $scope.currTree = data;
        $scope.currTree.head = _nodes[0]._id;
      });
    });

    $http.post('/api/contracts/').success(function(data) {
      $scope.currContract = data;
    });


     var storeAnswer = function(answer, answerType) {
      if (!$scope.currContract.answers) {$scope.currContract.answers = {};}
      $scope.currContract.answers[$scope.currNode.name] = answer;
      $scope.currNode.answer = {answer: answer, type: answerType};
      $scope.historyNodes.push($scope.currNode);
      console.log($scope.historyNodes);
      $http.put('/api/contracts/'+$scope.currContract._id, $scope.currContract).success(function(data) { console.log(data.answers)});
    };

    $scope.getNext = function(id, answer, answerType) {
      storeAnswer(answer, answerType);

      $http.get('/api/nodes/'+ id).success(function(gotNode) {
        $scope.currNode = gotNode;
        socket.syncUpdates('node', $scope.historyNodes);
      });
    };

    $scope.renderPreview = function() {
      $scope.answeredQs = [];
      var compare = function(node1, node2) {
          if (node1.num < node2.num) {
            return -1;
          }
          if (node1.num > node2.num) {
            return 1;
          }
        };

      $scope.historyNodes.forEach(function(node) {
        $http.get('/api/nodes/'+node._id).success(function(gotNode) {
          var temp = {};
          temp.question = gotNode.question;
          for (var i=0; i<$scope.historyNodes.length; i++) {
            if ($scope.historyNodes[i].name === gotNode.name) {
              temp.num = i+1;
              temp.answer = $scope.historyNodes[i].answer;
            }
          }
          $scope.answeredQs.push(temp);
          $scope.answeredQs = $scope.answeredQs.sort(compare);
        });
      });
      $scope.showReview = true;
    };

    $scope.getPrev = function() {
      console.log($scope.currNode.answer);
      $scope.currNode = $scope.historyNodes.pop();
    };
});
