'use strict';

const Setup = require('../helpers/setup.js');

// Controls > Slider > Basic
describe('KS Slider on iOS', function () {
	// the webdriver takes a while to setup; mocha timeout is set to 5 minutes
	this.timeout(300000);

	let
		driver = null,
		asserters = null,
		webdriver = null;

	before('suite setup', function () {
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

	it('drag the scrubber on the slider to the right', function () {
		// https://github.com/admc/wd/blob/master/test/specs/mjson-actions-specs.js

		const dragToRight = new webdriver.TouchAction()
			.press({x:139, y:108}) // press on the scrubber location
			.moveTo({x:100, y:0}) // drag scrubber to the right
			.release(); // release the scrubber

		return driver
			.performTouchAction(dragToRight)
			.waitForElementByName('Basic Slider - value = 6 act val 6', asserters.isDisplayed);
	});
});

describe('KS Slider on Android', function () {
	before('suite setup', function () {
		// let desired = {
		// 	automationName: 'Appium',
		// 	platformName: 'Android',
		// 	platformVersion: '6.0',
		// 	deviceName: '192.168.56.101:5555',
		// 	app: '/Users/wluu/sandbox/monkeycheck2/build/android/bin/monkeycheck2.apk',
		// 	appPackage: 'com.appc.monkeycheck2',
		// 	appActivity: '.Monkeycheck2Activity'
		// };
	});

	after('suite teardown', function () {

	});

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