var win = Ti.UI.createWindow({
	title : 'Deutsche Nationalbibliothek',
	backgroundImage : '/assets/images/default.png'
});

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
		const items = records.map(function(record) {
			const data = record.recordData.dc;
			var creator = "";
			if (data['dc:creator'] && typeof data['dc:creator'] == "string")
				creator = data['dc:creator'];
			else if (data['dc:creator'] && Array.isArray(data['dc:creator'].list))
				creator = data['dc:creator'].list.join(', ');
			const item = {
				title : {
					text : data['dc:title']
				},
				creator : {
					text : creator
				},
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
var myTemplate = {
	childTemplates : [{// Image justified left
		type : 'Ti.UI.ImageView', // Use an image view for the image
		bindId : 'pic', // Maps to a custom pic property of the item data

		properties : {// Sets the image view  properties
			image : '/assets/images/dnb.png',
			width : '50dp',
			height : '50dp',
			left : 0,
			top : 10
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			layout : 'vertical',
			height : Ti.UI.SIZE,
			left : '60dp',
			right : 5,
			top : 5,
			bottom : 5
		},
		childTemplates : [{// Title
			type : 'Ti.UI.Label', // Use a label for the title
			bindId : 'title', // Maps to a custom info property of the item data
			properties : {// Sets the label properties
				textAlign : 'left',
				width:Ti.UI.FILL,
				color : '#317DBD',
				font : {
					fontFamily : 'Arial',
					fontSize : '18dp',
					fontWeight : 'bold'
				},

				top : 0,
			}
		}, {// Subtitle
			type : 'Ti.UI.Label', // Use a label for the subtitle
			bindId : 'creator', // Maps to a custom es_info property of the item data
			properties : {// Sets the label properties
				color : '#E05D61',
				textAlign : 'left',
				width:Ti.UI.FILL,
				font : {
					fontFamily : 'Arial',
					fontSize : '14dp'
				},
				left : 0,
				top : '5dp',
			}
		}]
	}]
};

var listView = Ti.UI.createListView({
	separatorColor : '#92CFE3',
	templates : {
		'template' : myTemplate
	},
	defaultItemTemplate : 'template'

});
win.add(listView);
listView.addEventListener('itemclick', function(e) {
	console.log(e.itemId);
});
var sections = [];

win.open();

const SRU = require('de.appwerft.sru');

const DNB = SRU.createEndpoint({
	url : "https://services.dnb.de/sru",
	version : '1.1',
	catalog : 'dnb',
	accesstoken : require('accesstoken')
});

win.activity.onCreateOptionsMenu = function(e) {
	var menu = e.menu;
	var menuItem = menu.add({
		title : 'Suche',
		actionView : searchView,
		icon : '/assets/images/lupe.png',
		showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
	});
};
