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

after('suite teardown', function (done) {
	// Invoking done() prevents exit status 1.
	done();
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
		const LOREM_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

		return driver
			.elementByName('Label 1 background', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName(LOREM_TEXT, webdriver.asserters.isDisplayed);
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

// Base UI > Views > Image Views > Image File
describe('KS iOS Image Views', function () {
	this.timeout(300000);

	it('should find the apple logo by class name', function () {
		return driver
			.waitForElementByName('Base UI', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Views', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Image Views', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Image File', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByClassName('XCUIElementTypeImage', webdriver.asserters.isDisplayed);
	});

	it('should find the apple logo\'s pixel size', function () {
		return driver
			.waitForElementByClassName('XCUIElementTypeImage', webdriver.asserters.isDisplayed)
			.getSize()
				.should.eventually.eql({'width':24, 'height':24}); // alias for deep equal
	});

	it('should take screenshot and save it to local machine', function () {
		const TO_HERE = '/Users/wluu/Desktop/screenshot.png';

		return driver
			.takeScreenshot()
			.saveScreenshot(TO_HERE);
	});

	it('should handle alert dialogs too', function () {
		return driver
			.elementByClassName('XCUIElementTypeImage')
			.click() // trigger the alert dialog
			.waitForElementByClassName('XCUIElementTypeAlert', webdriver.asserters.isDisplayed)
			.waitForElementByName('You clicked me!', webdriver.asserters.isDisplayed)
			.elementByName('OK')
			.click()
			.hasElementByClassName('XCUIElementTypeAlert')
				.should.eventually.be.false;
	});

	it('go back to "views" pane', function () {
		return driver
			.waitForElementByName('Image Views', webdriver.asserters.isDisplayed)
			.click()
			.elementByName('Views')
			.click();
	});
});

// Base UI > Views > List View > Built in Templates
describe('KS iOS List View', function () {
	this.timeout(300000);

	it('move to the List View pane', function () {
		return driver
			.waitForElementByName('List View', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Built in templates', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('TEMPLATE_DEFAULT', webdriver.asserters.isDisplayed);
	});

	it('should scroll to bottom of list using "execute"', function () {
		/*
			NEW NOTE: appium CAN find elements in our list view. didn't realize there was a whitespace after the ellipses: '0 I have no accessory  Clip... '
			however, the statement below about xpath is still valid.

			OLD NOTE:
			appium can't seem to find elements via waitForElement or elementBy in out list view.
			need to use xpath, but xpath is not recommonded unless you have no other choice; it's pretty slow.
			https://github.com/appium/appium/blob/master/docs/en/advanced-concepts/migrating-to-xcuitest.md#xpath-locator-strategy.
		*/

		return driver
			.execute('mobile: scroll', {direction: 'down'}) // the element argument doesn't seem to work for some reason; passing just the direction argument scrolls twice
			.waitForElementByXPath('//*/XCUIElementTypeCell[27]', webdriver.asserters.isDisplayed) // 27th row
			.execute('mobile: scroll', {direction: 'down'})
			.waitForElementByXPath('//*/XCUIElementTypeCell[40]', webdriver.asserters.isDisplayed); // last row in the list view
	});

	it('should scroll back to top of list using "TouchAction"', function () {
		const scrollUp = new webdriver.TouchAction()
			.press({x:200, y:80}) // press near the top of the list
			.moveTo({x:0, y:500}) // drag finger down
			.release(); // release finger

		return driver
			.performTouchAction(scrollUp)
			.waitForElementByName('TEMPLATE_SUBTITLE', webdriver.asserters.isDisplayed)
			.performTouchAction(scrollUp)
			.waitForElementByName('TEMPLATE_SETTINGS', webdriver.asserters.isDisplayed)
			.performTouchAction(scrollUp)
			.waitForElementByName('TEMPLATE_DEFAULT', webdriver.asserters.isDisplayed);
	});
});