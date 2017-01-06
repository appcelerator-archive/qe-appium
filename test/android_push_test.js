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

	// appium local server
	driver = webdriver.promiseChainRemote({
		host: 'localhost',
		port: 4723
	});

	// turn on logging for the driver
	setup.logging(driver);

	// specify target test app and ios simulator
	return driver.init({
		automationName: 'Appium',
		platformName: 'Android',
		platformVersion: '7.1',
		deviceName: 'FA6AR0303369',
		app: '/Users/wluu/github/qe-appium/monkeyjunk/build/android/bin/monkeyjunk.apk',
		appPackage: 'com.appc.junk',
		appActivity: '.MonkeyjunkActivity'
	});
});

after('suite teardown', function () {
	// it seems like the teardown, when using with devices, take longer than the default 2 seconds timeout
	this.timeout(10000);
	return driver.quit();
});

describe('Android push', function () {
	this.timeout(300000);

	let deviceToken = '';

	it('should get device token', function (done) {
		driver
			.waitForElementByAndroidUIAutomator('new UiSelector().text("DO IT")',
				webdriver.asserters.isDisplayed
			)
			.click()
			.waitForElementByAndroidUIAutomator('new UiSelector().text("Alert")',
				webdriver.asserters.isDisplayed,
				10000, // the response from 360 seems to take a while, hence the 10 second wait
				3 // and try 3 times
			)
			.elementById('android:id/message')
			.text(function (err, text) {
				const GARBAGE = 'Subscribed with token: '.length;
				deviceToken = text.slice(GARBAGE);

				// close the alert dialog before calling the done callback
				driver
					.elementByAndroidUIAutomator('new UiSelector().text("OK")')
					.click()
					.then(function () {
						done();
					});
			});
	});

	it('should send push notification via REST request', function (done) {
		const DATA = JSON.stringify({
			channel: 'a',
			payload: { "alert": "Sample alert", "title": "BLEH" },
			to_tokens: deviceToken
		});

		const XML = fs.readFileSync(path.join(__dirname, '../monkeyjunk/tiapp.xml'), {encoding: 'utf8'});
		let key = XML.match(/<property .+acs-api-key-development.+>.+<\/property>/g)[0]; // find the acs-api-key-development property in the tiapp.xml
		key = key.match(/>.+</g)[0]; // get the value in between ><
		key = key.slice(1); // remove > character
		key = key.slice(0, key.length - 1); // and remove < character
		const PATH = `/v1/push_notification/notify_tokens.json?key=${key}&pretty_json=true`;

		const OPTS = {
			hostname: 'preprod-api.cloud.appctest.com',
			path: PATH,
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		};

		https.request(OPTS, function (res) {
			res.on('data', function (chunk) {
				// i still don't understand why you need this part in order for the end event to be triggered
				console.log(chunk.toString());
			});
			res.on('end', done);
		})
		.end(DATA);
	});

	it.skip('should receive push notification in the foreground', function () {

	});

	it.skip('should get push notification in the background', function () {});
});
