'use strict';

class Setup {
	constructor() {
		this.wd = require('wd');
		this.chai = require('chai');
		this.chaiAsPromised = require('chai-as-promised');
		this.colors = require('colors');

		// enabling chai assertion style: https://www.npmjs.com/package/chai-as-promised#node
		this.chai.use(this.chaiAsPromised);
		this.chai.should();
		// enables chai assertion chaining
		this.chaiAsPromised.transferPromiseness = this.wd.transferPromiseness;
	}

	// returns web driver module
	getWd() {
		return this.wd;
	}

	// configures driver output logging
	logging(driver) {
		// See whats going on
		driver.on('status', info => {
			console.log(this.colors.cyan(info));
		});
		driver.on('command', (meth, path, data) => {
			console.log(` > ${this.colors.yellow(meth)} ${this.colors.grey(path)} ${data || ''}`);
			// console.log(' > ' + this.colors.yellow(meth), this.colors.grey(path), data || '');
		});
		driver.on('http', (meth, path, data) => {
			console.log(` > ${this.colors.magenta(meth)} ${path} ${this.colors.grey(data || '')}`);
			// console.log(' > ' + this.colors.magenta(meth), path, this.colors.grey(data || ''));
		});
	}
}

module.exports = Setup;