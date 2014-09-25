'use strict';

describe('Controller: NewcontractCtrl', function () {

  // load the controller's module
  beforeEach(module('snapdocApp'));

  var NewcontractCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewcontractCtrl = $controller('NewcontractCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
