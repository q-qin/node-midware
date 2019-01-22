'use strict';

module.exports = {
	port: 4001,
	portSSL:4002,
	url: 'mongodb://localhost:27017/juzi',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
		    secure:   false,
		    maxAge:   365 * 24 * 60 * 60 * 1000,
		}
	}
}