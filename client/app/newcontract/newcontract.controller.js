'use strict';

angular.module('snapdocApp')
  .controller('NewcontractCtrl', function ($scope, $http, socket, Auth, $modal, $log, $rootScope) {
    $scope.user = Auth.getCurrentUser();
    $scope.showGen = false;

    $scope.createContract = function() {
      $scope.showGen = true;
      $rootScope.showGen = true;
      $http.post('/api/contracts/').success(function(data) {
        $scope.currContract = data;
        $http.get('/api/nodes/').success(function(data) {
          var _nodes = data;
          $scope.historyNodes = [];
          $scope.currNode = _nodes[0];
          socket.syncUpdates('node', $scope.historyNodes);
          $http.get('/api/trees/').success(function(data) {
            $scope.currTree = data;
            $scope.currTree.head = _nodes[0]._id;
            $scope.currContract.tree = $scope.currTree._id;
            $http.put('/api/contracts/'+$scope.currContract._id, $scope.currContract).success(function(data) {console.log("tree added", data)});
          });
        });
      });
    };

    // $http.get('/api/nodes/').success(function(data) {
    //   var _nodes = data;
    //   $scope.historyNodes = [];
    //   $scope.currNode = _nodes[0];
    //   socket.syncUpdates('node', $scope.historyNodes);
    //   $http.get('/api/trees/').success(function(data) {
    //     $scope.currTree = data;
    //     $scope.currTree.head = _nodes[0]._id;
    //     $scope.currContract.tree = $scope.currTree._id;
    //     $http.put('/api/contracts/'+$scope.currContract._id, $scope.currContract).success(function(data) {console.log("tree added")});
    //     $rootScope.currContract = $scope.currContract;
    //   });
    // });

     var storeAnswer = function(answer, answerType) {
      if (!$scope.currContract.answers) {$scope.currContract.answers = {};}
      $scope.currContract.answers[$scope.currNode.name] = answer;
      $scope.currNode.answer = {answer: answer, type: answerType};
      $scope.historyNodes.push($scope.currNode);
      console.log($scope.historyNodes);
      $http.put('/api/contracts/'+$scope.currContract._id, $scope.currContract).success(function(data) { console.log("stored answers on db", data.answers)});
    };

    $scope.getNext = function(id, answer, answerType) {
      storeAnswer(answer, answerType);

      $http.get('/api/nodes/'+ id).success(function(gotNode) {
        $scope.currNode = gotNode;
        socket.syncUpdates('node', $scope.historyNodes);
      });
    };

    $scope.renderReview = function() {
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



    $scope.open = function() {
      console.log("got here");
      var modalInstance = $modal.open({
         templateUrl: 'modal.html',
         controller: ModalInstanceCtrl,
         size: "lg",
         resolve: {
             items: function() {
                 return {
                  historyNodes: $scope.historyNodes,
                  currContract: $scope.currContract,
                  currTree: $scope.currTree
                }
             }
         }
      });

     modalInstance.result.then(function(selectedItem) {
         $scope.selected = selectedItem;
     }, function() {
         $log.info('Modal dismissed at: ' + new Date());
     });
    };
 });



 // Please note that $modalInstance represents a modal window (instance) dependency.
 // It is not the same as the $modal service used above.

 var ModalInstanceCtrl = function($scope, $modalInstance, items, $location) {

     $scope.historyNodes = items.historyNodes;
     var currContract = items.currContract;
     var template = items.currTree[0].template;
     var answers = items.currContract.answers;
     // console.log("contract", $scope.currContract);
     // console.log("tree", $scope.currTree);
     // console.log("template:", $scope.currTree[0].template);
     // console.log("historyNodes", $scope.historyNodes);
     var  output= template;

    $scope.renderContract = function() {
      console.log("got to renderContract");
      if (answers.whichSide === "For the company") {
        console.log("got to first if statement");
        console.log(answers);
        if (answers.clientType === "A company") {

          output = template.replace("{{partyA}}", answers.clientCoName);
          console.log(output);
        }
        if (answers.clientType === "An individual") {
          output = template.replace("{{partyA}}", answers.personClientName);
        }
        if (answers.otherPartyType === "Yes") {
        output = template.replace("{{partyB}}", answers.otherPartyCoName)
        }
        if (answers.otherPartyType === "No") {
          output = template.replace("{{partyB}}", "ConsultantName")
        }
      } else if (answers.whichSide === "For the consultant") {
        if (answers.clientType === "A company") {
          output = template.replace("{{partyB}}", answers.clientCoName);
        }
        if (answers.clientType === "An individual") {
          output = template.replace("{{partyB}}", answers.personClientName);
        }
        if (answers.otherPartyType === "Yes") {
        output = template.replace("{{partyA}}", answers.otherPartyCoName);
        }
        if (answers.otherPartyType === "No") {
          output = template.replace("{{partyA}}", "otherPartyCoName");
        }
      }

      if (answers.rateType === "Fixed Rate") {
        output = template.replace("{{rate}}", answers.rate);
      } else if (answers.rateType === "Hourly rate") {
        output = template.replace("{{rate}}", answers.rate+"per hour");
      }

      // if (answers.ipOwnership === "The Company") {
      //   if (answers.haveIpRestrictions === "Yes") {
      //     output = template.replace("{{}}")
      //   }
      // }

      output = template.replace("{{scopeOfWork}}", answers.scopeOfWork);
      output = template.replace("{{deadline}}", answers.deadline);
      output = template.replace("{{rateType}}", answers.rateType)
      output = template.replace("{{jurisdiction}}", answers.jurisdiction)

      $scope.output = output;
    };

     $scope.ok = function() {
      console.log("got here to ok")
        $scope.renderContract();
        $scope.showContract = true;
     };

     $scope.cancel = function() {
         $modalInstance.dismiss('cancel');
     };
 };