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
		automationName: 'XCUITest',
		platformName: 'iOS',
		deviceName: 'iPhone 7 Plus',
		platformVersion: '10.2',
		app: '/Users/wluu/github/qe-appium/KitchenSink/build/iphone/build/Products/Debug-iphonesimulator/KitchenSink.app',
		noReset: true // doesn't kill the simulator
	});
});

after('suite teardown', function () {
	return driver.quit();
});

// Controls > Slider > Basic
describe('KS iOS Slider', function () {
	// in general, the tests take a while to go through, which will hit mocha's 2 second timeout threshold.
	// set timeout to 5 minutes
	this.timeout(300000);

	it('should change basic slider', function () {
		return driver
			.elementByName('Slider')
			.click()
			.waitForElementByName('Basic', asserters.isDisplayed)
			.click()
			.waitForElementByName('Change Basic Slider', asserters.isDisplayed)
			.click()
			.waitForElementByName('Basic Slider - value = 2 act val 2', asserters.isDisplayed);
	});

	it('should drag the scrubber on the slider to the right', function () {
		// https://github.com/admc/wd/blob/master/test/specs/mjson-actions-specs.js

		const dragToRight = new webdriver.TouchAction()
			.press({x:139, y:108}) // press on the scrubber location
			.moveTo({x:100, y:0}) // drag scrubber to the right
			.release(); // release the scrubber

		return driver
			.performTouchAction(dragToRight)
			.waitForElementByName('Basic Slider - value = 6 act val 6', asserters.isDisplayed);
	});

	it('go back to home screen', function () {
		return driver
			.elementByName('Slider')
			.click()
			.elementByName('Controls')
			.click();
	});
});

// Controls > Label > Basic
describe('KS iOS Labels', function () {
	this.timeout(300000);

	it.skip('do labels stuff', function () {

	});
});

// Controls > Text Area > Basic
describe('KS iOS Text Area', function () {
	this.timeout(300000);

	it.skip('do text area stuff', function () {

	});
});


// Base UI > Views > List View > Built in Templates
describe('KS iOS List View', function () {
	this.timeout(300000);

	it.skip('do list view stuff', function () {

	});
});

// Base UI > Views > Image Views > Image File
describe('KS iOS Image Views', function () {
	this.timeout(300000);

	it.skip('do image view stuff', function () {

	});
});