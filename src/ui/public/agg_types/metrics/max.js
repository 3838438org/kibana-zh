define(function (require) {
  return function AggTypeMetricMaxProvider(Private) {
    var MetricAggType = Private(require('ui/agg_types/metrics/MetricAggType'));

    return new MetricAggType({
      name: 'max',
      title: '最大值',
      makeLabel: function (aggConfig) {
        return 'Max ' + aggConfig.params.field.displayName;
      },
      params: [
        {
          name: 'field',
          filterFieldTypes: 'number,date'
        }
      ]
    });
  };
});
