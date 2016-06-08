define(function (require) {
  return function AggTypeMetricAvgProvider(Private) {
    var MetricAggType = Private(require('ui/agg_types/metrics/MetricAggType'));

    return new MetricAggType({
      name: 'avg',
      title: '平均数',
      makeLabel: function (aggConfig) {
        return 'Average ' + aggConfig.params.field.displayName;
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
