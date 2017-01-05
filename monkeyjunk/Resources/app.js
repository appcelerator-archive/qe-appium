var
	Cloud = require('ti.cloud'),
	Push = require('ti.cloudpush');

Cloud.debug = true;

var win = Ti.UI.createWindow({
	backgroundColor: 'white'
});

var button = Ti.UI.createButton({
	top: '50%',
	title: 'DO IT'
});

button.addEventListener('click', function () {
	// If Google Play Services is not available then we should not continue
	if (Push.isGooglePlayServicesAvailable() !== Push.SUCCESS) {
		alert("Google Play Services is not installed/updated/available");
		return;
	}

	// need to retrieve the device token first
	Push.retrieveDeviceToken({
		success: successCb,
		error: function (e) {
			alert('Failed to register for push: ' + e.error);
		}
	});

	function successCb(retrieve) {
		// after getting the device token, add the event listeners
		Push.addEventListener('callback', function (e) {
			// e.payload is a json string
			var
				payload = JSON.parse(e.payload).android,
				msg = payload.title + ', ' +  payload.alert;
			alert(msg);
		});

		// then, subscribe with the device token
		Cloud.PushNotifications.subscribeToken({
			channel: 'a',
			device_token: retrieve.deviceToken,
			type: 'gcm'
		}, function (subscribe) {
			if (subscribe.success) {
				alert('Subscribed with token: ' + retrieve.deviceToken);
			}
			else {
				alert(JSON.stringify(subscribe));
			}
		});
	}
});

win.add(button);

win.open();