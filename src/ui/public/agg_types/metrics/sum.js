define(function (require) {
  return function AggTypeMetricSumProvider(Private) {
    var MetricAggType = Private(require('ui/agg_types/metrics/MetricAggType'));

    return new MetricAggType({
      name: 'sum',
      title: '总和',
      makeLabel: function (aggConfig) {
        return 'Sum of ' + aggConfig.params.field.displayName;
      },
      params: [
        {
          name: 'field',
          filterFieldTypes: 'number'
        }
      ]
    });
  };
});
