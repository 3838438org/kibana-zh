define(function (require) {


  require('plugins/kbn_relation_vis/kbn_relation_vis.less');
  require('plugins/kbn_relation_vis/kbn_relation_vis_controller');

  require('ui/registry/vis_types').register(KbnRelationVisProvider);

  function KbnRelationVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));


    return new TemplateVisType({
      name: 'kbn_relation',
      title: '关系图',
      icon: 'fa-life-ring',
      description: 'Cool D3 Relation',
      template: require('plugins/kbn_relation_vis/kbn_relation_vis.html'),
      params: {
        editor: require('plugins/kbn_relation_vis/kbn_relation_vis_params.html') /*'<vislib-basic-options></vislib-basic-options>'*/
      },


      requiresSearch: false
    });
  }

  // export the provider so that the visType can be required with Private()
  return KbnRelationVisProvider;
});
