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
		noReset: true // doesn't kill the emulator
	});
});

after('suite teardown', function () {
	return driver.quit();
});

// Controls > Slider > Basic
describe('KS Android Slider', function () {
	// in general, the tests take a while to go through, which will hit mocha's 2 second timeout threshold.
	// set timeout to 5 minutes
	this.timeout(300000);

	it('should change basic slider', function () {
		// https://developer.android.com/reference/android/support/test/uiautomator/UiSelector.html

		return driver
			.elementByAndroidUIAutomator('new UiSelector().text("Slider")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Basic")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Change Basic Slider")')
			.click();
	});

	it('should drag the scrubber on the slider to the right', function () {
		// https://github.com/admc/wd/blob/master/test/specs/mjson-actions-specs.js

		const dragToRight = new webdriver.TouchAction()
			.press({x:244, y:273}) // press on the scrubber location
			.moveTo({x:100, y:0}) // drag scrubber to the right
			.release(); // release the scrubber

		return driver
			.performTouchAction(dragToRight)
			.elementByAndroidUIAutomator('new UiSelector().className("android.widget.SeekBar")')
			.textPresent('Basic Slider - value = 5 act val 5');
	});

	it('go back to beginning of app', function () {
		return driver
			.back()
			.back();
	});
});

// Controls > Label > Basic
describe('KS Android Labels', function () {
	this.timeout(300000);

	it.skip('do labels stuff', function () {

	});
});

// Controls > Text Area > Basic
describe('KS Android Text Area', function () {
	this.timeout(300000);

	it.skip('do text area stuff', function () {

	});
});

// Base UI > Views > List View > Built in Templates
describe('KS Android List View', function () {
	this.timeout(300000);

	it.skip('do list view stuff', function () {

	});
});

// Base UI > Views > Image Views > Image File
describe('KS Android Image Views', function () {
	this.timeout(300000);

	it.skip('do image view stuff', function () {

	});
});