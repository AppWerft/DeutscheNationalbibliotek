module.exports = {
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
			left : '80dp',
			right : 15,
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
				top : 0,
			}
		},{
			type : 'Ti.UI.Label', // Use a label for the subtitle
			bindId : 'publisher', // Maps to a custom es_info property of the item data
			properties : {// Sets the label properties
				color : '#D6CC4F',
				textAlign : 'left',
				width:Ti.UI.FILL,
				font : {
					fontFamily : 'Arial',
					fontSize : '14dp',
					fontStyle: 'italic'
				},
				left : 0,
				top : 0,
			}
		}]
	}]
};