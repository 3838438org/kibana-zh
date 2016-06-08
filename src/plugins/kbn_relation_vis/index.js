module.exports = function(kibana){
	return new kibana.Plugin({
		name: 'kbn_relation_vis',
		require: ['kibana', 'elasticsearch'],
		uiExports: {
			visTypes: [
				'plugins/kbn_relation_vis/kbn_relation_vis'
				]
		}
	});
};
