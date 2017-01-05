/*
	NOTE: in order to properly use this suite, you will need to use a physical android device
	and have push notification configured on 360 dashboard
*/

'use strict';

const Setup = require('../helpers/setup.js');

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
		appActivity: '.MonkeyjunkActivity',
		noReset: true // doesn't kill the emulator
	});
});

after('suite teardown', function () {
	return driver.quit();
});

describe('Android push', function () {
	it.skip('should get push notification in the foreground', function () {});
	it.skip('should get push notification in the background', function () {});
});
