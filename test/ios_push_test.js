/*
	NOTE: in order to properly use this suite, you will need to use a physical android device
	and have push notification configured on 360 dashboard
*/

'use strict';

const
	Setup = require('../helpers/setup.js'),
	https = require('https'),
	fs = require('fs'),
	path = require('path');

let
	driver = null,
	webdriver = null;

before('suite setup', function () {
	// the webdriver takes a while to setup; mocha timeout is set to 5 minutes
	this.timeout(300000);

	const setup = new Setup();

	webdriver = setup.getWd();

	// sendNotificationTo is a custom method added to the webdriver prototype chain; can be used later
	webdriver.addAsyncMethod('sendNotificationTo', function (deviceToken) {
		// from here: https://github.com/admc/wd/blob/master/examples/promise/add-method-async.js#L23
		const callback = webdriver.findCallback(arguments);

		const data = JSON.stringify({
			channel: 'a',
			payload: { "alert": "Sample alert", "title": "BLEH" },
			to_tokens: deviceToken
		});

		const xmlContent = fs.readFileSync(path.join(__dirname, '../monkeypush/tiapp.xml'), {encoding: 'utf8'});

		// find the acs-base-url-development property in the tiapp.xml
		let host = xmlContent.match(/<property .+acs-base-url-development.+>.+<\/property>/g)[0];
		host = host.match(/>.+</g)[0]; // get the value in between ><
		host = host.slice(1); // remove > character
		host = host.slice(0, host.length - 1); // and remove < character
		host = host.slice('https://'.length); // remove 'https://' from the string

		// find the acs-api-key-development property in the tiapp.xml
		let key = xmlContent.match(/<property .+acs-api-key-development.+>.+<\/property>/g)[0];
		key = key.match(/>.+</g)[0]; // get the value in between ><
		key = key.slice(1); // remove > character
		key = key.slice(0, key.length - 1); // and remove < character
		const notifyApi = `/v1/push_notification/notify_tokens.json?key=${key}&pretty_json=true`;

		const options = {
			hostname: host,
			path: notifyApi,
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		};

		https.request(options, function (res) {
			res.on('data', function (chunk) {
				// i still don't understand why you need this part in order for the end event to be triggered
				console.log(chunk.toString());
			});
			res.on('end', callback);
		})
		.end(data);
	});

	// appium local server
	driver = webdriver.promiseChainRemote({
		host: 'localhost',
		port: 4723
	});

	// turn on logging for the driver
	setup.logging(driver);

	// specify target test app and ios simulator
	return driver.init({
		automationName: 'XCUITest',
	    platformName: 'iOS',
	    deviceName: 'Pippin',
	    platformVersion: '9.3.4',
	    udid: 'f8052c8714f0b9585a8f89274f447bbd4eda1601',
		app: '/Users/wluu/github/qe-appium/monkeypush/build/iphone/build/Products/Debug-iphoneos/monkeypush.ipa'
	});
});

after('suite teardown', function () {
	// it seems like the teardown, when using with devices, take longer than the default 2 seconds timeout
	this.timeout(10000);
	return driver.quit();
});

describe('iOS push', function () {
	this.timeout(300000);

	let deviceToken = '';

	it('should get device token', function (done) {
		driver
			.waitForElementByName('DO IT')
			.click()
			.waitForElementByClassName('XCUIElementTypeAlert') // alert dialogs
			.hasElementByName('OK') // the permission dialog appears on first install of the app; will need to check for it
			.then(function (isFirstInstall) {
				if (isFirstInstall) {
					return driver
						.elementByName('OK') // if it's the first install, the permission dialog will appear; press the allow button
						.click()
						.waitForElementByClassName('XCUIElementTypeAlert'); // and wait for the second alert dialog appear; the subscribed token
				}
				return; // otherwise, do nothing
			})
			.elementByXPath('//*/XCUIElementTypeStaticText[2]') // need to grab that text that is under the Alert text
			.text(function (err, text) {
				const GARBAGE = 'Subscribed with token: '.length;
				deviceToken = text.slice(GARBAGE);

				// close the alert dialog before calling the done callback
				driver
					.waitForElementByName('OK')
					.click()
					.then(function () {
						done();
					});
			});
	});

	it('should send push notification via REST request', function () {
		return driver.sendNotificationTo(deviceToken);
	});

	it('should receive push notification in the foreground', function () {
		const EXP = 'BLEH, Sample alert';

		return driver
			.waitForElementByClassName('XCUIElementTypeAlert', // after sending the push notification, it could take some time to receive it
				webdriver.asserters.isDisplayed,
				10000 // 10 seconds timeout
			)
			.elementByXPath('//*/XCUIElementTypeStaticText[2]') // need to grab that text that is under the Alert text
			.text().should.become(EXP)
			.elementByName('OK')
			.click(); // dismiss the alert dialog
	});

	it('should get push notification in the background; checking tray notification', function () {
		const dragTrayNotification = new webdriver.TouchAction()
			.press({x:204, y:0}) // press the top of the screen; notification bar
			.moveTo({x:0, y:300}) // move down
			.release(); // release the notification bar

		return driver
			/*
				NOTE:
				- deviceKeyEvent() seems to be only implemented for android
				- closeApp() seems to background the app in this case, but makes the proxy not active
				- backgroundApp() behaves like for android: app will be backgrounded, then relaunched after n seconds
			*/
			.sendNotificationTo(deviceToken)
			.backgroundApp(10)
			.performTouchAction(dragTrayNotification)
			.waitForElementByName('monkeypush, now, Sample alert'); // this is a XCUIElementTypeCell
	});

	it('press on tray notification and should bring app to foreground', function () {
		const EXP = 'BLEH, Sample alert';

		return driver
			.elementByName('monkeypush, now, Sample alert')
			.click()
			.waitForElementByClassName('XCUIElementTypeAlert')
			.elementByXPath('//*/XCUIElementTypeStaticText[2]')
			.text().should.become(EXP);
	});
});
