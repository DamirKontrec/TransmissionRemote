remote.utils.notification = {
	show: function(message, customCfg) {
		var cfg = {
				timeout: 5000, //can be false to remain indefinetly
				cssClass: '',
				title: '',
				$bindingElement: $(),
				dismissable: true
			};

		$.extend( cfg, customCfg );

		//Only allow one general notification (the one in status bar)
		if (cfg.$bindingElement.length == 0) {
			remote.utils.notification.clear();
		}

		var $notification = $('<div>')
				.addClass('notification ' + cfg.cssClass + ( cfg.$bindingElement.length > 0 ? ' bound': '' ))
				.append( $('<div>').addClass('icon') )
				.append( $('<h3>').html( cfg.title ) )
				.append( $('<p>').html( message ) )
				.appendTo( cfg.$bindingElement.length > 0 ? cfg.$bindingElement : $('body') );

		if ( cfg.dismissable ) {
			$notification.on('touchend', function() {
				remote.utils.notification.clear($notification);
			});
		}

		remote.animate( $notification, 'fadeInDown' );

		if ( cfg.timeout ) {
			var timeout = setTimeout( function() {
				remote.utils.notification.clear( $notification, timeout );
			}, cfg.timeout);
		}

		return $notification;
	},
	
	clear: function( $notification, timeout ) {
		if (timeout) {
			clearTimeout( timeout );
		}

		$notification = $notification || $('.notification:not(".bound")');

		remote.animate( $notification, 'fadeOutUp', { callback: function() {
			$notification.remove();
		}});
	},

	info: function(message, customCfg) {
		customCfg = customCfg || {};
		$.extend(customCfg || {}, { cssClass: 'info', title: 'Info' });
		return remote.utils.notification.show(message, customCfg);
	},

	error: function(message, customCfg) {
		customCfg = customCfg || {};
		$.extend(customCfg || {}, { cssClass: 'error', title: 'Error' });
		return remote.utils.notification.show(message, customCfg);
	},

	warn: function(message, customCfg) {
		customCfg = customCfg || {};
		$.extend(customCfg, { cssClass: 'warning', title: 'Warning' });
		return remote.utils.notification.show(message, customCfg);
	},

	loading: function(message, customCfg) {
		customCfg = customCfg || {};
		$.extend(customCfg, { cssClass: 'loading', title: 'Contacting Transmission' });
		return remote.utils.notification.show(message, customCfg);
	}
};