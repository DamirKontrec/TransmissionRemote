$(document).ready(function(){
	//Hide all but the first page
	$('.page').not(':first-child').hide();

	var clickableClass = 'button';

	$(document)
		.on('touchstart', function(e) {
			var $target = $(e.target);

			if ( $target.hasClass(clickableClass) ) {
				$target.addClass('active');
			}
		})
		.on('touchend', function(e) {
			var $target = $(e.target);

			if ( $target.hasClass(clickableClass) ) {
				$target.removeClass('active');

				if ( !$target.hasClass('disabled') ) {
					var	action = $target.attr('data-action'),
						$torrent = $target.closest('li.torrent');

					if ( typeof remote.actions[ action ] == 'function' ) {
						//If the torrent is clicked, then it will be sent as an argument
						remote.actions[ action ]( $torrent.length > 0 ? $torrent : $() );
					}
				}
			}
		});

	$('#transfers')
		.hammer({
			drag_vertical: false
		})
			.on('tap', remote.manageTransferControls )
			.on('hold', remote.manageTransferControls )
			.on('dragstart', remote.manageTransferControls )
			.on('drag', remote.manageTransferControls )
			.on('dragend', remote.manageTransferControls )
			.on('swipe', remote.manageTransferControls )
			.on('doubletap', function(event) {
				var $torrent = $(event.originalEvent.target).closest('li.torrent');
				remote.actions.togglePauseSingle( $torrent );
			});

	remote.utils.refreshSpeedLimitToggle();

	//remote.refresh();
	setInterval( remote.refresh, remote.cfg.refreshInterval * 1000);
});