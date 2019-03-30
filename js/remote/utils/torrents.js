if ( !remote.utils.torrents ) {
	remote.utils.torrents = {};
}

remote.utils.torrents.general = function( method, $torrents, callback ) {
	if ( !method ) {
		console.error('Method not defined. Cancelling...');
		return;
	}

	$torrents = $torrents || $();

	var data = { method: method },
		ids;

	if ( $torrents.length > 0 ) {
		data.arguments = {
			//get() will convert jQuery object to an ordinary array
			ids: $torrents.map( remote.utils.torrents.getOriginalId ).get()
		};
	}

	/*
		Configuration for long loading notification that will
		be displayed over the torrent whose action is taking
		longer than the provided delay
	*/
	var longLoading = {
			delay: 1000,
			message: 'This action is taking longer than usual...'
		};

	/*
		If only one torrent is performing action, bind
		loader to it or its controls, and disable its
		uer interactivness
	*/
	$torrents.addClass('loading');
	var $controls = $torrents.children('.controls');
	longLoading.$bindingElement = $controls.length > 0 ? $controls : $torrents;

	longLoading.timeout = setTimeout(function() {
		longLoading.notification = remote.utils.notification.loading( longLoading.message, {
			timeout: false,
			dismissable: false,
			$bindingElement: longLoading.$bindingElement
		});
	}, longLoading.delay);

	remote.request({
		data: data,
		success: function(response) {
			if (typeof callback == 'function') {
				callback(response);
			}
		},
		complete: function() {
			clearTimeout( longLoading.timeout );
			$torrents.removeClass('loading');

			if (longLoading.notification) {
				remote.utils.notification.clear(longLoading.notification);
				longLoading.$bindingElement.removeClass('loading');
			}
		}
	});
};

remote.utils.torrents.resume = function(callback, $torrents) {
	remote.utils.torrents.general('torrent-start', $torrents, callback);
};

remote.utils.torrents.pause = function(callback, $torrents) {
	remote.utils.torrents.general('torrent-stop', $torrents, callback);
};

remote.utils.torrents.verify = function(callback, $torrents) {
	remote.utils.torrents.general('torrent-verify', $torrents, callback);
};

remote.utils.torrents.getList = function(callback, $torrents) {
	var data = {
			method: "torrent-get",
			arguments: {
				fields: [
					"id",
					"addedDate",
					"name",
					"totalSize",
					"eta",
					"isFinished",
					"isStalled",
					"leftUntilDone",
					"percentDone",
					"queuePosition",
					"rateDownload",
					"rateUpload",
					"sizeWhenDone",
					"status",
					"uploadRatio"
				]
			}
		};

	if ( $torrents && $torrents.length > 0 ) {
		data.ids = $torrents.map( remote.utils.torrents.getOriginalId ).get();
	}

	remote.request({
		data: data,
		success: function(response) {
			if (typeof callback == 'function') {
				callback(response);
			}
		}
	});
};

remote.utils.torrents.getOriginalId = function( index, torrent ) {
	return parseInt( $(torrent).attr('id').replace('torrent-', '') );
};