define(function (require) {
  return function AggTypeMetricMinProvider(Private) {
    var MetricAggType = Private(require('ui/agg_types/metrics/MetricAggType'));

    return new MetricAggType({
      name: 'min',
      title: '最小值',
      makeLabel: function (aggConfig) {
        return 'Min ' + aggConfig.params.field.displayName;
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
