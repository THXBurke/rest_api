module.exports = function(app) {
  app.directive('wineListItem', function() {
    return {
      restrict: 'EAC',
      replace: true,
      require: '^ngController',
      transclude: true,
      templateUrl: '/templates/wine_directives/wine_list_item.html',
      scope: {
        wine: '='
      },
      link: function(scope, element, attrs, controller) {
        scope.drink = controller.deleteWine;
      }
    };
  });
};
