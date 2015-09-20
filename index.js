var request = require('request');

var steamDomain = 'https://steamcommunity.com';

function parentalUnlock (options, callback) {
  var cookieJar = request.jar();
  var _request = request.defaults({ jar: cookieJar });

  options.webCookie.forEach(function (name) {
    cookieJar.setCookie(request.cookie(name), steamDomain);
  });

  _request.post({
    uri: steamDomain + '/parental/ajaxunlock',
    json: true,
    headers: {
      referer: steamDomain + '/'
    },
    form: {
      pin: options.PIN
    }
  }, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      return callback(error || new Error(response.statusCode));
    }
    if (!body || typeof body.success !== 'boolean') {
      return callback(new Error('Invalid Response'));
    }
    if (!body.success) {
      return callback(new Error('Incorrect PIN'));
    }

    callback();
  });
}

module.exports = {
  parentalUnlock: parentalUnlock
};
