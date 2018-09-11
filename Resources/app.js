var win = Ti.UI.createWindow({
	title : 'Deutsche Nationalbibliothek',
	backgroundImage : '/assets/images/default.png'
});
var abx = require('com.alcoapps.actionbarextras');
var searchView = Ti.UI.Android.createSearchView({
	hintText : "Suche …",
	top : 0
});
searchView.addEventListener('submit', function() {
	menuItem.collapseActionView();
	abx.setSubtitle('Suche nach „' + searchView.getValue() + '“');
	DNB.searchretrieve({
		query : searchView.getValue(),
		maximumRecords : 100
	}, function(e) {
		const response = e.searchRetrieveResponse;
		Ti.UI.createNotification({
			message : response.numberOfRecords + ' Treffer',
			duration : 3000
		}).show();
		if (!response.records.record) {
			listView.sections.items = [];
			return;
		}
		const records = response.records.record.list;
		function getCover(data) {
			if (Array.isArray(data['dc:identifier'].list)) {
				var ids = {};
				data['dc:identifier'].list.forEach(function(item) {
					ids[item['xsi:type']] = item.content;
				});
				return ids['dnb:IDN'] ? 'https://archive.org/services/img/:' + ids['dnb:IDN'] : '';
			}
		}

		const items = records.map(function(record) {
			const data = record.recordData.dc;
			var creator = "";
			if (data['dc:creator'] && typeof data['dc:creator'] == "string")
				creator = data['dc:creator'];
			else if (data['dc:creator'] && Array.isArray(data['dc:creator'].list))
				creator = data['dc:creator'].list.join(', ');
			const cover = getCover(data);

			const item = {
				title : {
					text : data['dc:title']
				},
				publisher : {
					text : data['dc:publisher'] ? (data['dc:publisher'])  + ',  ' + data['dc:date'] : data['dc:date']
				},
				creator : {
					text : creator
				},
				/*pic : {
				 image : getCover(data)
				 },*/
				properties : {
					itemId : JSON.stringify(data),
					accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
				}
			};
			return item;
		});
		listView.setSections([Ti.UI.createListSection({
			items : items
		})]);
		listView.backgroundColor = 'white';
	});
});

win.add(searchView);

var listView = Ti.UI.createListView({
	separatorColor : '#92CFE3',
	templates : {
		'template' : require('TEMPLATE')
	},
	defaultItemTemplate : 'template'

});
win.add(listView);
listView.addEventListener('itemclick', function(e) {
	console.log(e.itemId);
});
var sections = [];

win.open();

const DNB = require('de.appwerft.sru').createEndpoint({
	url : "https://services.dnb.de/sru",
	version : '1.1',
	catalog : 'dnb',
	recordSchema : 'oai_dc',
	accesstoken : require('.accesstoken'),
	explained : function(e) {
	}
});

abx.setStatusbarColor('#D6CC50');
abx.setBackgroundColor('#2E7CBD');
abx.subtitle = "Suche im Gesamtbestand";

var menuItem;
win.activity.onCreateOptionsMenu = function(e) {
	abx.setStatusbarColor('#D6CC50');
	abx.setBackgroundColor('#2E7CBD');
	abx.subtitle = "Suche im Gesamtbestand";
	var menu = e.menu;
	menuItem = menu.add({
		title : 'Suche',
		actionView : searchView,
		icon : '/assets/images/lupe.png',
		showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
	});
};
