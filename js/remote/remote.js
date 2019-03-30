var remote = {
		cfg : config
	};

remote.request = function( customOpts ) {
	var opts = {
			headers: {
				'X-Transmission-Session-Id': remote.cfg.sessionId,
				'Content-Type': 'json',
				'Cache-Control': 'no-cache'
			}
		};

	$.extend(true, opts, customOpts);

	$.ajax({
		url: window.location.origin + '/transmission/rpc',
		type: 'POST',
		cache: false,
		headers: opts.headers,
		data: JSON.stringify(opts.data),
		success: function( results ) {
			if ( results.result == 'success' && typeof opts.success == 'function' ) {
				opts.success(results.arguments);
			}
		},
		error: function(response) {
			//Missing X-Transmission-Session-Id
			if (response.status == 409) {
				//Update Session ID
				remote.cfg.sessionId = response.getResponseHeader('X-Transmission-Session-Id');
				//Rerun the request
				remote.request(customOpts);
				return;
			}

			//TODO: Attach the error notification

			if ( typeof opts.error == 'function' ) {
				opts.error(results);
			}
		},
		complete: function() {
			if ( typeof opts.complete == 'function' ) {
				opts.complete();
			}
		}
	});
};

remote.refresh = function() {
	remote.utils.requests.getStats( remote.views.footer );
	remote.utils.torrents.getList( remote.views.transfers.list );
};

remote.manageTransferControls = function( event ) {
	var $originalTarget = $(event.originalEvent.target),
		$target = $originalTarget.closest('.main, .controls'),
		snappingDistance = 50;

	if ( $originalTarget.length == 0 ) {
		return;
	}

	if ( $target.hasClass('controls') ) {
		if ( ( event.type == 'swipe' && event.direction == 'right' ) || event.type == 'hold' || event.type == 'dragend') {
			remote.utils.removeControls( $target.closest('li.torrent') );
			return;
		}

		//ignore buttons, TODO: fix
		if ( $originalTarget.hasClass('button') ) {
			return;
		}

		if ( ( event.type == 'drag' || event.type == 'dragend' ) && event.direction == 'right' ) {
			var $main = $target.siblings('.main'),
				distance = event.distanceX - $main.outerWidth();
			$main.attr('style', '-webkit-transition: none; -webkit-transform: translateX(' + distance + 'px)');
		}

		if ( event.type == 'dragend' && event.distanceX <= snappingDistance ) {
			$main.attr('style', '-webkit-transition: -webkit-transform .5s; -webkit-transform: translateX(-100%)');
			return;
		}
		return;
	}  

	if (event.type == 'tap') {
		var $torrent = $target.parent(),
			$others = $torrent.siblings();

		remote.utils.removeControls( $others );
		return;
	}

	//handle only main for now
	if ( !$target.hasClass('main') || ( event.direction != 'left' && event.type != 'hold' ) ) {
		return;
	}

	if ( event.type == 'dragstart' || event.type == 'hold' ) {
		var $torrent = $target.parent(),
			$others = $torrent.siblings();

		remote.utils.removeControls( $others );
		$torrent.append( remote.views.transfers.controls( $torrent ) );

		if (event.type == 'hold') {
			$target.attr('style', '-webkit-transition: -webkit-transform .5s; -webkit-transform: translateX(-' + $target.outerWidth() + 'px)')
		}
	}

	else if ( event.type == 'drag' ) {
		$target.attr('style', '-webkit-transition: none; -webkit-transform: translateX(' + event.distanceX + 'px)');
	}

	else if ( event.type == 'dragend' || event.type == 'swipe' ) {
		if ( event.direction == 'left' ) {
			event.distance >= snappingDistance
				? $target.attr('style', '-webkit-transition: -webkit-transform .5s;  -webkit-transform: translateX(-' + $target.outerWidth() + 'px)')
				: $target.attr('style', '-webkit-transition: -webkit-transform .5s;  -webkit-transform: translateX(0px)');
		} else {
			$target.attr('style', '-webkit-transition: -webkit-transform .5s;  -webkit-transform: translateX(0px)');
		}

		/*
			Fixing bug that occurs if the .main
			returns to its default position
		*/
		setTimeout(function() {
			var style = remote.utils.getStyleAsObject( $target );

			if ( style['-webkit-transform'].indexOf('(0px)') != -1 ) {
				$target.removeAttr('style');
				$target.siblings('.controls').remove();
			}
		}, 500);
	}
}

/*
Needed because we need to block the UI refresh
while animations are being played
*/
remote.animate = function( $element, animation, customCfg ) {
	var cfg = {
			//animation duration after which the class is reset, maybe exists a callback after css animation is done?
			duration: 1000,
			delay: 0,
			callback: null
		},

		animationClasses = 'animated ' + animation;

	$.extend( cfg, customCfg );

	cfg.delay
		? setTimeout( performAnimation, cfg.delay )
		: performAnimation();

	function performAnimation() {
		addAnimationClasses();

		setTimeout(function() {
			$element.removeClass(animationClasses);

			if ( typeof cfg.callback == 'function' ) {
				cfg.callback();
			} 
		}, cfg.duration);
	}

	function addAnimationClasses() {
		$element
			.addClass(animationClasses)
			.removeClass('hidden'); //If the element was hidden, show it
	}
};


remote.isUpdatingDisabled = function( $torrent ) {
	return $torrent.is('.animated, .minimized, .loading');
}