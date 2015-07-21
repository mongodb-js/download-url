var getURL = require('../');
var assert = require('assert');

describe('mongodb-download-url', function() {
  it('should get the .zip for windows', function(done) {
    getURL({
      version: '3.1.6',
      platform: 'win32',
      bits: 64
    }, function(err, res) {
      if (err) return done(err);
      assert.deepEqual(res, {
        name: 'mongodb',
        version: '3.1.6',
        artifact: 'mongodb-win32-x86_64-3.1.6.zip',
        url: 'http://fastdl.mongodb.org/win32/mongodb-win32-x86_64-3.1.6.zip'
      });
      done();
    });
  });

  it('should get a debug build from mci', function(done) {
    var sha = '610765fdb94eebf612bd0172ec081ccc21110103';
    getURL({
      version: sha,
      platform: 'win32',
      bits: 64,
      debug: true
    }, function(err, res) {
      if (err) return done(err);
      assert.deepEqual(res, {
        name: 'mongodb',
        version: '610765fdb94eebf612bd0172ec081ccc21110103',
        artifact: 'binaries-mongodb_mongo_master_windows_64_2k8_debug_610765fdb9'
          + '4eebf612bd0172ec081ccc21110103_15_07_20_20_04_03.zip',
        url: 'https://s3.amazonaws.com/mciuploads/mongodb-mongo-master/'
          + 'windows_64_2k8_debug/610765fdb94eebf612bd0172ec081ccc21110103/binaries'
          + '/binaries-mongodb_mongo_master_windows_64_2k8_debug_610765fdb94eebf'
          + '612bd0172ec081ccc21110103_15_07_20_20_04_03.zip'
      });
      done();
    });
  });

  it('should get `stable`', function(done) {
    getURL({
      version: 'stable'
    }, function(err, res) {
      if (err) return done(err);
      assert(res.version);
      assert(res.url);
      done();
    });
  });

  it('should get `unstable`', function(done) {
    getURL({
      version: 'unstable'
    }, function(err, res) {
      if (err) return done(err);
      assert(res.version);
      assert(res.url);
      done();
    });
  });

  it('should get `latest`', function(done) {
    getURL({
      version: 'latest'
    }, function(err, res) {
      if (err) return done(err);
      assert(res.version);
      assert(res.url);
      done();
    });
  });
});
