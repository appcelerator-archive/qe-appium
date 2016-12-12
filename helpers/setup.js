'use strict';

class Setup {
	constructor() {
		const
			this.wd = require('wd'),
			this.chai = require('chai'),
			this.chaiAsPromised = require('chai-as-promised'),
			this.colors = require('colors');

		// enabling chai assertion style: https://www.npmjs.com/package/chai-as-promised#node
		this.chai.use(this.chaiAsPromised);
		this.chai.should();
		// enables chai assertion chaining
		this.chaiAsPromised.transferPromiseness = this.wd.transferPromiseness;
	}

	// configures web driver output logging
	function wdLogging(driver) {
		// See whats going on
		driver.on('status', info => {
			console.log(this.colors.cyan(info));
		});
		driver.on('command', (meth, path, data) => {
			console.log(` > ${this.colors.yellow(meth)}`);
			console.log(this.colors.grey(path));
			console.log(data || '');
		});
		driver.on('http', (meth, path, data) => {
			console.log(` > ${this.colors.magenta(meth)}`);
			console.log(path);
			console.log(this.colors.grey(data || ''));
		});
	}

	// returns web driver module
	function getWd() {
		return this.wd;
	}
}

module.exports = Setup;