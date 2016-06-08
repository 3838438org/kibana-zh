define(function (require) {
  var module = require('ui/modules').get('kibana');
  var _ = require('lodash');
  var rison = require('ui/utils/rison');
  var keymap = require('ui/utils/key_map');

  module.directive('savedVis', function ($location, $injector, kbnUrl, Private) {

    var services = Private(require('ui/saved_objects/saved_object_registry')).byLoaderPropertiesName;

    return {
      restrict: 'E',
      scope: {
        type: '@',
        title: '@?',
        // optional make-url attr, sets the userMakeUrl in our scope
        userMakeUrl: '=?makeUrl',
        // optional on-choose attr, sets the userOnChoose in our scope
        userOnChoose: '=?onChoose'
      },
      template: require('ui/partials/saved_vis.html'),
      controllerAs: 'finder',
      controller: function ($scope, $element, $timeout) {
        var self = this;

        // the text input element
        //var $input = $element.find('input[ng-model=filter]');

        // the list that will hold the suggestions
        //var $list = $element.find('ul');

        // the current filter string, used to check that returned results are still useful
        var currentFilter = $scope.filter;

        // the most recently entered search/filter
        var prevSearch;

        // the list of hits, used to render display
        self.hits = [];

        self.service = services[$scope.type];
        self.properties = self.service.loaderProperties;

        filterResults();

        $scope.visTypes = Private(require('ui/registry/vis_types'));

        /**
         * Passed the hit objects and will determine if the
         * hit should have a url in the UI, returns it if so
         * @return {string|null} - the url or nothing
         */
        self.makeUrl = function (hit) {
          if ($scope.userMakeUrl) {
            return $scope.userMakeUrl(hit);
          }

          if (!$scope.userOnChoose) {
            return hit.url;
          }

          return '#';
        };

        self.preventClick = function ($event) {
          $event.preventDefault();
        };

        /**
         * Called when a hit object is clicked, can override the
         * url behavior if necessary.
         */
        self.onChoose = function (hit, $event) {
          if ($scope.userOnChoose) {
            $scope.userOnChoose(hit, $event);
          }

          var url = self.makeUrl(hit);
          if (!url || url === '#' || url.charAt(0) !== '#') return;

          $event.preventDefault();

          // we want the '/path', not '#/path'
          kbnUrl.change(url.substr(1));
        };

        $scope.$watch('filter', function (newFilter) {
          // ensure that the currentFilter changes from undefined to ''
          // which triggers
          currentFilter = newFilter || '';
          filterResults();
        });

        //manages the state of the keyboard selector
        self.selector = {
          enabled: false,
          index: -1
        };

        //key handler for the filter text box
        self.filterKeyDown = function ($event) {
          switch (keymap[$event.keyCode]) {
            case 'tab':
              if (self.hitCount === 0) return;

              self.selector.index = 0;
              self.selector.enabled = true;

              selectTopHit();

              $event.preventDefault();
              break;
            case 'enter':
              if (self.hitCount !== 1) return;

              var hit = self.hits[0];
              if (!hit) return;

              self.onChoose(hit, $event);
              $event.preventDefault();
              break;
          }
        };

        self.hitBlur = function ($event) {
          self.selector.index = -1;
          self.selector.enabled = false;
        };

        self.manageObjects = function (type) {
          $location.url('/settings/objects?_a=' + rison.encode({tab: type}));
        };

        self.hitCountNoun = function () {
          return ((self.hitCount === 1) ? self.properties.noun : self.properties.nouns).toLowerCase();
        };

        function selectTopHit() {
          setTimeout(function () {
            //triggering a focus event kicks off a new angular digest cycle.
            $list.find('a:first').focus();
          }, 0);
        }

        function filterResults() {
          if (!self.service) return;
          if (!self.properties) return;

          // track the filter that we use for this search,
          // but ensure that we don't search for the same
          // thing twice. This is called from multiple places
          // and needs to be smart about when it actually searches
          var filter = currentFilter;
          if (prevSearch === filter) return;

          prevSearch = filter;
          self.service.find(filter)
            .then(function (hits) {
              // ensure that we don't display old results
              // as we can't really cancel requests
              if (currentFilter === filter) {
                self.hitCount = hits.total;
                self.hits = _.sortBy(hits.hits, 'title');
              }
            });
        }

        function scrollIntoView($element, snapTop) {
          var el = $element[0];

          if (!el) return;

          if ('scrollIntoViewIfNeeded' in el) {
            el.scrollIntoViewIfNeeded(snapTop);
          } else if ('scrollIntoView' in el) {
            el.scrollIntoView(snapTop);
          }
        }
      }
    };
  });
});
