var angular = require('angular');
require('angular-mocks');

describe('wine controller', function() {
  var $httpBackend;
  var $controller;

  beforeEach(angular.mock.module('practiceApp'));

  beforeEach(angular.mock.inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('should be a controller', function() {
    var winecontrol = $controller('WineController');
    expect(typeof winecontrol).toBe('object');
    expect(typeof winecontrol.getAll).toBe('function');
  });

  describe('REST functionality', function() {
    var winecontrol;

    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      winecontrol = $controller('WineController');
    }));

    afterEach(function() {
      $httpBackend.veryifyNoOutstandingException();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send a GET to retrieve a wine', function() {
      $httpBackend.expectGET('http://localhost:5000/api/wine').respond(200, [{ name: 'test wine' }]);
      winecontrol.getAll();
      $httpBackend.flush();
      expect(winecontrol.wine.length).toBe(1);
      expect(winecontrol.wine[0].name).toBe('test wine');
    });

    it('should create a wine', function() {
      $httpBackend.expectPOST('http://localhost:5000/api/wine', { name: 'Tempranillo' })
      .respond(200, { name: 'Malbec' });
      expect(winecontrol.wine.length).toBe(0);
      winecontrol.newWine = { name: 'Tempranillo' };
      winecontrol.createWine();
      $httpBackend.flush();
      expect(winecontrol.wine[0].name).toBe('Malbec');
      expect(winecontrol.newWine).toBe(null);
    });

    it('should update a wine', function() {
      $httpBackend.expectPUT('http://localhost:5000/api/wine/1', { name: 'different wine', editing: true, _id: 1 })
      .respond(200);
      winecontrol.wine = [{ name: 'test wine', _id: 1, editing: true }];
      winecontrol.wine[0].name = 'different wine';
      winecontrol.updateWine(winecontrol.wine[0]);
      $httpBackend.flush();
      expect(winecontrol.wine[0].editing).toBe(false);
    });

    it('should delete a wine', function() {
      $httpBackend.expectDELETE('http://localhost:5000/api/wine/1')
      .respond(200);
      winecontrol.wine = [{ name: 'Tempranillo', _id: 1 }];
      winecontrol.deleteWine(winecontrol.wine[0]);
      $httpBackend.flush();
      expect(winecontrol.wine.length).toBe(0);
    });
  });
});
