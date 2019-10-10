module.exports = function() {
	var $ = Ti.UI.createListView({
		separatorColor : '#92CFE3',
		//backgroundImage :  '/assets/images/bg.png',
		templates : {
			'template' : require('TEMPLATE')
		},
		defaultItemTemplate : 'template'
	});
	$.addSection = function(items) {
		$.appendSection(Ti.UI.createListSection({
			items : items
		}));
		};
	$.clearAllSections = function() {
			$.setSections([]);
		$.backgroundImage= '/assets/images/bg.png';
	};
	return $;
};
