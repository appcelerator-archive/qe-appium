"use strict";

// test setup like chai and should and color
require("./helpers/setup");

var wd = require("wd"),
	serverConfigs = require('./helpers/appium-servers');

describe("simple ti stuff", function() {
	this.timeout(300000);
	var driver;

	before(function() {
		let serverConfig = {
			host: 'localhost',
			port: 4723
		};
		driver = wd.promiseChainRemote(serverConfig);

		// a bunch of logging stuff
		require("./helpers/logging").configure(driver);

		let desired = {
			automationName: 'XCUITest',
			platformName: 'iOS',
			// NOTE: for simulator
			// deviceName: 'iPhone 7 Plus',
			// platformVersion: '10.1',
			// app: '/Users/wluu/sandbox/monkeycheck2/build/iphone/build/Products/Debug-iphonesimulator/monkeycheck2.app'

			// NOTE: for device
			deviceName: 'Pippin',
			platformVersion: '9.3.4',
			udid: 'f8052c8714f0b9585a8f89274f447bbd4eda1601',
			app: 'com.appc.monkeycheck2',
			realDeviceLogger: '/Users/wluu/sandbox/node_modules/deviceconsole'
		};

		// NOTE: it looks like you'll need to launch the android emulator or Genymotion first
		// let desired = {
		// 	automationName: 'Appium',
		// 	platformName: 'Android',
		// 	// platformVersion: '6.0',
		// 	platformVersion: '7.1',
		// 	// deviceName: '192.168.56.101:5555',
		// 	deviceName: 'FA6AR0303369',
		// 	app: '/Users/wluu/sandbox/monkeycheck2/build/android/bin/monkeycheck2.apk',
		// 	appPackage: 'com.appc.monkeycheck2',
		// 	appActivity: '.Monkeycheck2Activity'
		// };

		return driver.init(desired);
	});

	after(function() {
		return driver.quit();
	});

	it("should click on label", function() {
		// ios
		return driver
			.elementByName('Hello, World')
			.click()
			.waitForElementByName('Alert')
			.elementByName('OK')
			.click()
			.sleep(500);

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