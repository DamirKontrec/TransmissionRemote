if( !remote.views ) {
	remote.views = {};
}

remote.views.footer = function( response ) {
	var dl = remote.utils.convertBytes( response.downloadSpeed, true ),
		ul = remote.utils.convertBytes( response.uploadSpeed, true );

	$('#transfers .footer').html( '↓ ' + dl + ', ↑ ' + ul );
};