if ( !remote.utils ) {
	remote.utils = {};
}

/*
remote.utils.convertBytes - converts bytes (B) to KB, MB, GB and TB 

Params:
	bytes(<string> or <number>) - bytes in B/s received from Transmission
	isSpeed(<string> or <number>) - whether the speed is being converted - adds "/s" at the end
*/
remote.utils.convertBytes = function( bytes, isSpeed ) {
	bytes = bytes || 0;

	var factor = 0,
		tempSpeed = bytes,
		increment = 1024;

	//Whether KB/s, MB/s, GB/s, etc...
	while ( tempSpeed > 1 ) {
		tempSpeed = tempSpeed / increment;
		
		if ( tempSpeed >= 1 )
			factor++;
	}

	var outputBytes = ( bytes / Math.pow( increment, factor ) ).toFixed(2),
		prefixes = [
			'',
			'K',
			'M',
			'G',
			'T'
		],
		unit = (prefixes[factor] || '') + 'B' + (isSpeed ? '/s' : '');

	return outputBytes + ' ' + unit;
};

/*
remote.utils.removeControls - hide controls with sliding effect

Params:
	$torrents(<jQuery Object>) - torrents whose controls to remove
*/
remote.utils.removeControls = function( $torrents ) {
	$torrents.each( function() {
		var $torrent = $(this),
			$main = $torrent.children('.main'),
			$controls = $main.siblings();

		if ( $controls.length == 0 ) {
			return;
		}

		$main.attr('style', '-webkit-transition: -webkit-transform .5s; -webkit-transform: translateX(0)');
/*
		$main.removeAttr('style');
		remote.animate( $main, 'bounceInLeft');
*/
		setTimeout(function() {
			$controls.remove();
		}, 1000);
	});
};


/*
remote.utils.refreshSpeedLimitToggle - refreshes the turtle icon in the toolbar
*/
remote.utils.refreshSpeedLimitToggle = function() {
	remote.utils.requests.getArgs( function( response ) {
		var isSpeedLimitActive = response['speed-limit-up-enabled'] && response['speed-limit-down-enabled'],
			$button = $('.button.toggle-slow');

		$button[ isSpeedLimitActive ? 'addClass' : 'removeClass' ]('toggled');
	});
};

remote.utils.updateHeaderControls = function() {
	var $header = $('#transfers .header'),
		$pauseAll = $header.children('.button.pause-all'),
		$resumeAll = $header.children('.button.resume-all'),
		$transfers = $('#transfers > ul > li');

	$pauseAll.add( $resumeAll ).removeClass('disabled');

	if ( $transfers.filter('.paused').length == $transfers.length )
		$pauseAll.addClass('disabled');

	else if ( $transfers.filter(':not(.paused)').length == $transfers.length )
		$resumeAll.addClass('disabled');
};

remote.utils.getStyleAsObject = function( $el ) {
	var style = {};

	$el.attr('style')
		.split(';')
		.map(function(rule) {
			return rule.trim();
		})
		.forEach(function(rule) {
			var pair = rule.split(':'),
				key = pair[0].trim(),
				value = pair[1].trim();

			style[key] = value;
		});

	return style;
};