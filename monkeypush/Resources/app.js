var Cloud = require('ti.cloud');

Cloud.debug = true;

var win = Ti.UI.createWindow({
	backgroundColor: 'white'
});

var button = Ti.UI.createButton({
	top: '50%',
	title: 'DO IT'
});

button.addEventListener('click', function () {
	// On iOS 8 + user notification types need to be registered via registerUserNotificationSettings.
	Ti.App.iOS.registerUserNotificationSettings({
		types: [
			Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
			Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
			Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
		]
	});

	// Add 'usernotificationsettings' event listener to ensure that registerForPushNotifications is
	// called after userNotificationSettings has changed.
	// When this event is fired, it means that the user clicked a button on the alert asking for
	// permission to send notifications (they may have allowed or denied the notification).
	Ti.App.iOS.addEventListener('usernotificationsettings', function () {
		Ti.Network.registerForPushNotifications({
			success: function (e) {
				// then, subscribe with the device token
				Cloud.PushNotifications.subscribeToken({
					channel: 'a',
					device_token: e.deviceToken,
					type: 'ios'
				}, function (subscribe) {
					if (subscribe.success) {
						alert('Subscribed with token: ' + e.deviceToken);
					}
					else {
						alert(JSON.stringify(subscribe));
					}
				});
			},
			error: function (e) {
				alert('Failed to register for push: ' + e.error);
			},
			callback: function (e) {
				alert(e.data.title + ', ' +  e.data.alert);
			}
		});
	});
});

win.add(button);

win.open();