var win = Ti.UI.createWindow({
	title : 'Deutsche Nationalbibliothek',
	backgroundImage : '/assets/images/default.png'
});
var abx = require('com.alcoapps.actionbarextras');
var searchView = Ti.UI.Android.createSearchView({
	hintText : "Search",
	top : 0
});
searchView.addEventListener('submit', function() {
	DNB.searchretrieve({
		query : searchView.getValue(),
		maximumRecords : 100
	}, function(e) {
		searchView.blur();
		const response = e.searchRetrieveResponse;
		Ti.UI.createNotification({
			message : response.numberOfRecords + ' Treffer',
			duration : 3000
		}).show();
		if (!response.records.record) {
			return;
		}
		const records = response.records.record.list;
		function getCover(data) {
			if (Array.isArray(data['dc:identifier'].list)) {
				var ids = {};
				data['dc:identifier'].list.forEach(function(item) {
					ids[item['xsi:type']] = item.content;
				});
				console.log(ids);
				return ids['dnb:IDN'] ? 'http://covers.openlibrary.org/b/idn/' + ids['dnb:IDN'] + '-M.jpg' : '';
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
			console.log(cover);

			const item = {
				title : {
					text : data['dc:title']
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
	accesstoken : require('.accesstoken')
});
abx.setStatusbarColor('#D6CC50');
abx.setBackgroundColor('#2E7CBD');
abx.subtitle = "Suche im Gesamtbestand";

win.activity.onCreateOptionsMenu = function(e) {
	abx.setStatusbarColor('#D6CC50');
	abx.setBackgroundColor('#2E7CBD');
	abx.subtitle = "Suche im Gesamtbestand";
	var menu = e.menu;
	var menuItem = menu.add({
		title : 'Suche',
		actionView : searchView,
		icon : '/assets/images/lupe.png',
		showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
	});
};
