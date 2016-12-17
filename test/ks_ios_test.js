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
			.waitForElementByName('Basic', webdriver.asserters.isDisplayed) // used when waiting for elements: https://github.com/admc/wd/#waiting-for-something
			.click()
			.waitForElementByName('Change Basic Slider', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Basic Slider - value = 2 act val 2', webdriver.asserters.isDisplayed);
	});

	it('should drag the scrubber on the slider to the right', function () {
		// https://github.com/admc/wd/blob/master/test/specs/mjson-actions-specs.js

		const dragToRight = new webdriver.TouchAction()
			.press({x:139, y:108}) // press on the scrubber location
			.moveTo({x:100, y:0}) // drag scrubber to the right
			.release(); // release the scrubber

		return driver
			.performTouchAction(dragToRight)
			.waitForElementByName('Basic Slider - value = 6 act val 6', webdriver.asserters.isDisplayed);
	});

	it('go back to beginning of app', function () {
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

	it('should check for appcelerator label', function () {
		return driver
			// need to wait for the label name to appear, since the transition on the app is slow for appium to keep up
			.waitForElementByName('Label', webdriver.asserters.isDisplayed)
			.click()
			.elementByName('Basic')
			.click()
			.waitForElementByName('Appcelerator', webdriver.asserters.isDisplayed);
	});

	it('should check for appcelerator label 2', function () {
		return driver
			.elementByName('Change Label 2')
			.click()
			.waitForElementByName('Appcelerator', webdriver.asserters.isDisplayed);
	});

	it('should check for appcelerator label with background', function () {
		const loremText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

		return driver
			.elementByName('Label 1 background', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName(loremText, webdriver.asserters.isDisplayed);
	});

	it('go back to beginning of app', function () {
		return driver
			.elementByName('Label')
			.click()
			.elementByName('Controls')
			.click();
	});
});

// Controls > Text Area > Basic
describe('KS iOS Text Area', function () {
	this.timeout(300000);

	it('should check text in text area', function () {
		return driver
			.waitForElementByName('Text Area', webdriver.asserters.isDisplayed)
			.click()
			.elementByName('Basic')
			.click()
			.waitForElementByName('I am a textarea', webdriver.asserters.isDisplayed);
	});

	it('should delete (backspace) default text and enter some text', function () {
		const BACKSPACES = [
			webdriver.SPECIAL_KEYS['Back space'], // yes, backspace is spelled incorrectly
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space']
		];

		return driver
			.elementByClassName('XCUIElementTypeTextView')
			.click() // brings up the soft keyboard
			.keys(BACKSPACES) // looks like this method accepts an array ...
			.keys('monkey') // or a string
			.waitForElementByName('I am a monkey', webdriver.asserters.isDisplayed);
	});

	it('should delete (clear text area) text and enter new text', function () {
		const NEW_TEXT = 'MONKEYLORD WILL RULE THIS WORLD!';

		return driver
			.elementByClassName('XCUIElementTypeTextView')
			.clear()
			.click() // brings up the soft keyboard again
			.keys(NEW_TEXT)
			.waitForElementByName(NEW_TEXT, webdriver.asserters.isDisplayed);
	});

	it('go back to beginning of app', function () {
		return driver
			.elementByName('Text Area')
			.click()
			.elementByName('Controls')
			.click();
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