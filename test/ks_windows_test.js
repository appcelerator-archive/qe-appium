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
		platformName: 'Windows',
		deviceName: 'Mobile Emulator 10.0.14393.0 WVGA 4 inch 512MB',
		platformVersion: '10.0',
		app: 'com.appc.meh_51yh0rwc9c8h2!App',
		noReset: true // doesn't kill the simulator
	});
});

after('suite teardown', function () {
	return driver.quit();
});

describe('meh', function () {
	it('is a windows', function (done) {
		console.log('DONE');
	});
});