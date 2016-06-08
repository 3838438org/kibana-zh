define(function (require) {
  var _ = require('lodash');
  require('ui/paginated_table');

  require('ui/modules').get('apps/settings')
  .directive('indexedFields', function ($filter) {
    var yesTemplate = '<i class="fa fa-check" aria-label="yes"></i>';
    var noTemplate = '';
    var nameHtml = require('plugins/kibana/settings/sections/indices/_field_name.html');
    var typeHtml = require('plugins/kibana/settings/sections/indices/_field_type.html');
    var controlsHtml = require('plugins/kibana/settings/sections/indices/_field_controls.html');
    var filter = $filter('filter');

    return {
      restrict: 'E',
      template: require('plugins/kibana/settings/sections/indices/_indexed_fields.html'),
      scope: true,
      link: function ($scope) {
        var rowScopes = []; // track row scopes, so they can be destroyed as needed
        $scope.perPage = 25;
        $scope.columns = [
          { title: '名称' },
          { title: '类型' },
          { title: '格式' },
          { title: '可分析', info: '分析字段可能需要额外的内存来生成控件' },
          { title: '被索引', info: '没有索引的字段不可搜索' },
          { title: '管理', sortable: false }
        ];

        $scope.$watchMulti(['[]indexPattern.fields', 'fieldFilter'], refreshRows);

        function refreshRows() {
          // clear and destroy row scopes
          _.invoke(rowScopes.splice(0), '$destroy');

          var fields = filter($scope.indexPattern.getNonScriptedFields(), $scope.fieldFilter);
          _.find($scope.fieldTypes, {index: 'indexedFields'}).count = fields.length; // Update the tab count

          $scope.rows = fields.map(function (field) {
            var childScope = _.assign($scope.$new(), { field: field });
            rowScopes.push(childScope);

            return [
              {
                markup: nameHtml,
                scope: childScope,
                value: field.displayName
              },
              {
                markup: typeHtml,
                scope: childScope,
                value: field.type
              },
              _.get($scope.indexPattern, ['fieldFormatMap', field.name, 'type', 'title']),
              {
                markup: field.analyzed ? yesTemplate : noTemplate,
                value: field.analyzed
              },
              {
                markup: field.indexed ? yesTemplate : noTemplate,
                value: field.indexed
              },
              {
                markup: controlsHtml,
                scope: childScope
              }
            ];
          });
        }
      }
    };
  });
});
