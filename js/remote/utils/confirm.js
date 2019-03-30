remote.utils.confirm = function( customCfg ) {
	var cfg = {
			$bindingElement: $('body'),
			message: 'Are you sure?',
			approveCallback: null,
			denyCallback: null
		};

	$.extend( cfg, customCfg );

	var $container = $('<div>')
			.addClass('confirm'),

		$content = $('<ul>')
			.addClass('content')
			.appendTo( $container ),

		$deny = $('<li>')
			.addClass('button deny')
			.on('touchend', function() {
				removeConfirmContainer( cfg.denyCallback );
			})
			.appendTo( $content ),

		$message = $('<li>')
			.addClass('message')
			.append(
				$('<div>')
					.addClass('vertical-align')
					.append( $('<p>').html(cfg.message) )
			)
			.appendTo( $content ),

		$approve = $('<li>')
			.addClass('button approve')
			.on('touchend', function() {
				removeConfirmContainer( cfg.confirmCallback );
			})
			.appendTo( $content );

	if ( !cfg.$bindingElement.is('body') ) {
		$container.addClass('bound');
	}

	$container.appendTo( cfg.$bindingElement );
	remote.animate( $container, 'fadeIn' )

	function removeConfirmContainer( callback ) {
		remote.animate( $container, 'fadeOut', { callback: function() { $container.remove(); } });

		if ( typeof callback == 'function' ) {
			callback();
		}
	}
}