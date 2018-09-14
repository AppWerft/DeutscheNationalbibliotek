module.exports = function() {
	var $ = Ti.UI.createListView({
		separatorColor : '#92CFE3',
		templates : {
			'template' : require('TEMPLATE')
		},
		defaultItemTemplate : 'template'
	});
	$.addSection=function(items) {
		console.log("APPEND");
		$.appendSection(Ti.UI.createListSection({
			items: items
		}));
		
	};
	$.clear=function() {
		console.log('CLEAR');
		const c = $.getSectionCount();
		console.log(c);
		for (var i=0;i<c;i++)
			$.deleteSectionAt(i);
	};
	return $;
};
