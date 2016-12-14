'use strict';

const Setup = require('../helpers/setup.js');

// Controls > Slider > Basic
describe('KS Slider on iOS', function () {
	this.timeout(300000);

	let driver = null;

	before('setup', function () {
		const
			setup = new Setup(),
			webdriver = setup.getWd();

		// appium local server
		driver = webdriver.promiseChainRemote({
			host: 'localhost',
			port: 4723
		});

		// setups console output for the driver
		setup.logging(driver);

		// specify target test app and ios simulator
		return driver.init({
			automationName: 'XCUITest',
			platformName: 'iOS',
			deviceName: 'iPhone 7 Plus',
			platformVersion: '10.2',
			app: '/Users/wluu/sandbox/monkeycheck/build/iphone/build/Products/Debug-iphonesimulator/monkeycheck.app'
		});
	});

	after('teardown', function () {
		return driver.quit();
	});

	it('do something', function () {
		return driver
			.elementByName('Hello, World')
			.click()
			.waitForElementByName('Alert')
			.elementByName('OK')
			.click()
			.sleep(500);
	});
});

describe('KS Slider on Android', function () {
	before('setup', function () {
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

	after('teardown', function () {

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