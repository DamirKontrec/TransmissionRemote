remote.actions = {
	pauseAll: function() {
		remote.utils.torrents.pause();
	},
	resumeAll: function() {
		remote.utils.torrents.resume();
	},

	resumeSingle: function( $torrent ) {
		remote.utils.torrents.resume( function() {
			$torrent.toggleClass('paused ' + ( $torrent.hasClass('finished') ? 'seeding' : 'downloading' ) );
			remote.utils.removeControls( $torrent );
		}, $torrent );
	},

	pauseSingle: function( $torrent ) {
		remote.utils.torrents.pause( function() {
			$torrent.toggleClass('paused ' + ( $torrent.hasClass('finished') ? 'seeding' : 'downloading' ) );
			remote.utils.removeControls( $torrent );
		}, $torrent );
	},

	togglePauseSingle: function( $torrent ) {
		$torrent.hasClass('paused')
			? remote.actions.resumeSingle($torrent)
			: remote.actions.pauseSingle($torrent);
	},

	toggleSlow: function() {
		var $button = $('.button.toggle-slow'),
			isEnabled = $button.hasClass('toggled');

		remote.request({
			data: {
				method: 'session-set',
				arguments: {
					'speed-limit-down-enabled': !isEnabled,
					'speed-limit-up-enabled': !isEnabled
				}
			},
			arguments: {},
			success: function( response ) {
				$('.button.toggle-slow').toggleClass('toggled');
			}
		});
	},

	showMenu: function() {
		//remote.utils.notification.error('An error occured.');
		remote.utils.notification.warn('Not yet implemented :(', { title: 'Sorry' });
		//remote.utils.notification.loading('This action is taking longer than usual...');
	},

	filterTorrents: function() {
		remote.utils.notification.info('You will be able to filter the torrents.', {title: 'Planned functionality'});
	},

	removeSingle: function( $torrent ) {
		remote.utils.confirm({
			message: 'Are you sure you want to delete this torrent?',
			$bindingElement : $torrent,
			confirmCallback: animateRemoval,
			denyCallback: function() {
				remote.utils.removeControls( $torrent );
			}
		});

		function animateRemoval() {
			var $list = $torrent.closest('ul'),
				$following = $torrent.nextUntil(),
				delay = 200;

			remote.animationsInQueue++;

			$torrent.siblings()
				.addClass('loading') //prevent on initiating torrent controls
				.removeAttr('style');

			$torrent.addClass('minimized');
			remote.animate( $torrent, 'flipOutX' ); //rollOut, flipOutX

			$following
				.each(function(index, el) {
					var $el = $(el);
					$el.attr('style', '-webkit-transform: translateY(-' + $el.outerHeight() + 'px); -webkit-transition-delay: ' + (index * delay) + 'ms;');
				})
				.addClass('translated');

			setTimeout(function() {
				resetList();
				remote.animationsInQueue--;
			}, ( ( $following.length || 1 ) * delay ) + 150 ); //TODO - use CSS transition JS event library

			function resetList() {
				var $oldList = $torrent.closest('ul'),
					$transfersToCopy  = $oldList
						.children(':not(.minimized)')
							.removeClass('loading')
							.removeAttr('style'),
					$newList = $('<ul>')
						.append( $transfersToCopy );

				$newList.insertAfter($oldList);
				$oldList.remove();
			}
		}
	}
};