'use strict';

const Setup = require('../helpers/setup.js');

let
	driver = null,
	asserters = null,
	webdriver = null;

before('suite setup', function () {
	// the webdriver takes a while to setup; mocha timeout is set to 5 minutes
	this.timeout(300000);

	const setup = new Setup();

	webdriver = setup.getWd();

	// used when waiting for elements: https://github.com/admc/wd/#waiting-for-something
	asserters = webdriver.asserters;

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
		platformVersion: '6.0',
		deviceName: '192.168.56.101:5555',
		app: '/Users/wluu/github/qe-appium/KitchenSink/build/android/bin/KitchenSink.apk',
		appPackage: 'com.appcelerator.kitchensink',
		appActivity: '.KitchensinkActivity',
		noReset: true // doesn't kill the simulator
	});
});

after('suite teardown', function () {
	// return driver.quit();
});

// Controls > Slider > Basic
describe('KS Slider', function () {
	this.timeout(300000);

	it.skip('do something there', function () {
		// android
		// return driver
		// 	.elementByAndroidUIAutomator('new UiSelector().text("Hello, World");')
		// 	.click()
		// 	.sleep(500)
		// 	.elementByAndroidUIAutomator('new UiSelector().text("Alert");')
		// 	.elementByAndroidUIAutomator('new UiSelector().text("OK");')
		// 	.click()
		// 	.sleep(500);
	});
});

// Controls > Label > Basic
describe('KS Labels', function () {
	this.timeout(300000);

	it.skip('do labels stuff', function () {

	});
});

// Controls > Text Area > Basic
describe('KS Text Area', function () {
	this.timeout(300000);

	it.skip('do text area stuff', function () {

	});
});

// Base UI > Views > List View > Built in Templates
describe('KS List View', function () {
	this.timeout(300000);

	it.skip('do list view stuff', function () {

	});
});

// Base UI > Views > Image Views > Image File
describe('KS Image Views', function () {
	this.timeout(300000);

	it.skip('do image view stuff', function () {

	});
});