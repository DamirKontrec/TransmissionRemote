if ( !remote.utils.requests ) {
	remote.utils.requests = {};
}

remote.utils.requests.generic = function(method, callback ) {
	if ( !method ) {
		console.error('No method specified. Cancelling...');
		return;
	}

	remote.request({
		data: { method: method },
		success: function( response ) {
			if ( typeof callback == 'function' ) {
				callback(response);
			}
		}
	});
}

remote.utils.requests.getStats = function(callback) {
	remote.utils.requests.generic('session-stats', callback);
};

remote.utils.requests.getArgs = function(callback) {
	remote.utils.requests.generic('session-get', callback);
};