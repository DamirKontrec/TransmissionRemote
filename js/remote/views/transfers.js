if( !remote.views.transfers ) {
	remote.views.transfers = {};
}

remote.views.transfers.list = function( response ) {
	var $list = $('#transfers > ul');

	$.each(response.torrents, function( index, torrentData ) {
		var $existing = $list.find('#torrent-' + torrentData.id);

		$existing.length
			? remote.views.transfers.updateSingleTorrent( $existing, torrentData )
			: (function() {
				var $transfer = remote.views.transfers.singleTorrent( torrentData ).addClass('hidden');
				$list.append( $transfer );
				remote.animate( $transfer, 'bounceInLeft', { delay: $list.children().length * 100 });
			})()
	});

	remote.utils.updateHeaderControls();
};

remote.views.transfers.getFormattedData = function( torrentData ) {
	var delimiter = ', ',

		totalSize = remote.utils.convertBytes( torrentData.sizeWhenDone ),
		downloadedSize = remote.utils.convertBytes( torrentData.sizeWhenDone * torrentData.percentDone ),
		
		statusList = {
			6: "Seeding",
			4: "Downloading",
			3: "Queued",
			0: "Paused"
		},

		status = statusList[ torrentData.status ],

		infoAboveMeter = [
			status,
			'↓ ' + remote.utils.convertBytes( torrentData.rateDownload, true ),
			'↑ ' + remote.utils.convertBytes( torrentData.rateUpload, true )
		],

		infoBelowMeter = [
			( totalSize == downloadedSize ) ? totalSize : downloadedSize + ' of ' + totalSize,
			'Ratio: ' + torrentData.uploadRatio.toFixed(2)
		];

	//Pass the remaining time if needed
	if ( torrentData.eta != -1 && torrentData.status != 'Queued' ) {
		infoBelowMeter.push( moment.duration(torrentData.eta, 's').humanize() + ' remaining' );
	}

	return {
		status: status,
		name: torrentData.name.split('.').join(' '),
		infoAboveMeter: infoAboveMeter.join(delimiter),
		infoBelowMeter: infoBelowMeter.join(delimiter),
		percentage: parseInt( torrentData.percentDone * 100 ) + '%',
		finishedStatus: torrentData.percentDone == 1 ? 'finished' : 'not-finished'
	};

};

remote.views.transfers.updateSingleTorrent = function( $torrent, torrent ) {
	var data = remote.views.transfers.getFormattedData( torrent );

	//Don't update torrents in middle of user interactions, loadings and animations
	if ( remote.isUpdatingDisabled( $torrent ) ) {
		return;
	}

	$torrent
		.attr('class', 'torrent ' + data.status.toLowerCase() + ' ' + data.finishedStatus )

		.children('.main')
			//Set text above percentage meter
			.children('.above-meter')
				.html( data.infoAboveMeter )
				.end()

			//Set text below percentage meter
			.children('.below-meter')
				.html( data.infoBelowMeter )
				.end()

			//Update percentage meter
			.find('.percentage')
				.css({ width: data.percentage })
				.siblings('p')
					.html( data.percentage );
};

remote.views.transfers.singleTorrent = function( torrent ) {
	var data = remote.views.transfers.getFormattedData( torrent ),

		$percentageMeter = $('<div>')
			.addClass('percentage-meter')
			.append(
				$('<div>')
					.addClass('percentage')
					.css({ width: data.percentage })
			)
			.append( $('<p>').html( data.percentage ) );

	return $('<li>')
				.attr('id', 'torrent-' + torrent.id)
				.addClass('torrent ' + data.status.toLowerCase() + ' ' + data.finishedStatus )
				.append(
					$('<div>')
						.addClass('main')
						.append( $('<h3>').html( data.name ) )
						.append( $('<p>').addClass('above-meter').html( data.infoAboveMeter ) )
						.append( $percentageMeter )
						.append( $('<p>').addClass('below-meter').html( data.infoBelowMeter ) )
				);
};

remote.views.transfers.controls = function( $transfer ) {
	var $toolbar = $('<ul>')
			.addClass('toolbar'),

		$resume = $('<li>')
			.addClass('resume button' + ( !$transfer.hasClass('paused') ? ' disabled' : '' ) )
			.attr('data-action', 'resumeSingle')
			.appendTo( $toolbar ),

		$pause = $('<li>')
			.addClass('pause button' + ( $transfer.hasClass('paused') ? ' disabled' : '' ) )
			.attr('data-action', 'pauseSingle')
			.appendTo( $toolbar ),

		$remove = $('<li>')
			.addClass('remove button')
			.attr('data-action', 'removeSingle')
			.appendTo( $toolbar ),

		$info = $('<li>')
			.addClass('info button')
			.attr('data-action', 'infoSingle')
			.appendTo( $toolbar );

	return $('<div>')
				.addClass('controls')
				.html( $('<h3>').html( $transfer.find('.main > h3').html() ) )
				.append( $toolbar );
};