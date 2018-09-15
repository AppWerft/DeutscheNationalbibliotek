module.exports = function() {
	var $ = Ti.UI.createView({
		backgroundColor : "#05D6CC50",
		touchEnabled : false,
		pubbleParent : false,
		zIndex : 998
	});
	$.add(require("ti.animation").createLottieView({
		file : '/gears.json',
		loop : true,
		width : 320,
		height : 320,
		zIndex : 999,
		touchEnabled : false,
		autoStart : true,
		transform : Ti.UI.create2DMatrix({
			scale : 3
		})
	}));
	return $;
};
