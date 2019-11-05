var resolve = require('../');
var request = require('request');
var assert = require('assert');
var sinon = require('sinon');
var linuxDistro = require('../linuxDistro');

function verify(done, query, expectedURL) {
  resolve(query, function(err, res) {
    assert.ifError(err);
    assert.equal(res.url, expectedURL);

    request(
      res.url,
      {
        method: 'HEAD'
      },
      function(badUrl) {
        if (badUrl) {
          return done(
            new Error('The URL `' + res.url + '` returned: ' + badUrl.message)
          );
        }
        done();
      }
    );
  });
}

describe('mongodb-download-url', function() {
  this.timeout(2000);
  // - https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.4.14.tgz
  // + https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-linux_64-2.4.14.tgz
  describe('linux', function() {
    it('should resolve 2.4.14', function(done) {
      var query = {
        version: '2.4.14',
        platform: 'linux',
        bits: 64
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.4.14.tgz'
      );
    });

    it('should resolve 2.6.11', function(done) {
      var query = {
        version: '2.6.11',
        platform: 'linux',
        bits: 64
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.6.11.tgz'
      );
    });

    it('should resolve 3.1.9', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'linux',
        bits: 64
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.1.9.tgz'
      );
    });

    it('should resolve 3.1.9 enterprise', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'linux',
        distro: 'ubuntu1404',
        enterprise: true,
        bits: 64
      };
      verify(
        done,
        query,
        'https://downloads.mongodb.com/linux/mongodb-linux-x86_64' +
          '-enterprise-ubuntu1404-3.1.9.tgz'
      );
    });

    it('should resolve 3.0.7 (32-bit)', function(done) {
      var query = {
        version: '3.0.7',
        platform: 'linux',
        bits: 32
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-i686-3.0.7.tgz'
      );
    });

    describe('ubuntu', function() {
      before(function() {
        this.sinon = sinon.createSandbox();
        this.sinon.stub(linuxDistro, 'lsbReleaseInfo').returns({
          distroId: 'Ubuntu',
          distroVersion: '16.04'
        });
      });
      after(function() {
        this.sinon.restore();
      });

      it('should resolve 4.2.0-rc1 with ubuntu-specific url', function (done) {
        var query = {
          version: '4.2.0-rc1',
          platform: 'linux'
        };

        verify(
          done,
          query,
          'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.2.0-rc1.tgz'
        );
      });

      it('should resolve 4.0.0 with ubuntu-specific url', function (done) {
        var query = {
          version: '4.0.0',
          platform: 'linux'
        };

        verify(
          done,
          query,
          'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.0.0.tgz'
        );
      });


      it('should resolve 3.6.0 with generic linux url url', function (done) {
        var query = {
          version: '3.6.0',
          platform: 'linux'
        };

        verify(
          done,
          query,
          'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.6.0.tgz'
        );
      });
    });
  });

  describe('windows', function() {
    it('should resolve 3.1.9', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'win32',
        bits: 64
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.1.9.zip'
      );
    });
    it('should resolve 3.1.19 enterprise', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'win32',
        enterprise: true,
        bits: 64
      };
      verify(
        done,
        query,
        'https://downloads.mongodb.com/win32/' +
          'mongodb-win32-x86_64-enterprise-windows-64-3.1.9.zip'
      );
    });
    it('should resolve 2.6.11', function(done) {
      var query = {
        version: '2.6.11',
        platform: 'win32',
        bits: 64
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-2.6.11.zip'
      );
    });
    it('should resolve 3.0.7 (32-bit)', function(done) {
      var query = {
        version: '3.0.7',
        platform: 'win32',
        bits: 32
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-i386-3.0.7.zip'
      );
    });
    it('should resolve 4.2.1 (64-bit)', function(done) {
      var query = {
        version: '4.2.1',
        platform: 'win32',
        bits: 64
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.1.zip'
      );
    });
    it('should resolve stable (64-bit)', function(done) {
      var query = {
        version: 'stable',
        platform: 'win32',
        bits: 64
      };
      verify(
        done,
        query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.1.zip'
      );
    });
  });

  describe('osx', function() {
    it('should resolve 3.1.19 enterprise', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'osx',
        enterprise: true,
        bits: 64
      };
      verify(
        done,
        query,
        'https://downloads.mongodb.com/osx/mongodb-osx-x86_64-enterprise-3.1.9.tgz'
      );
    });

    it('should rersolve 3.6.8', function(done) {
      var query = {
        version: '3.6.8',
        platform: 'osx',
        bits: 64
      };
      https: verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.8.tgz'
      );
    });

    it('should rersolve 4.0.3', function(done) {
      var query = {
        version: '4.0.3',
        platform: 'osx',
        bits: 64
      };
      https: verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.3.tgz'
      );
    });

    //fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.3.tgz

    https: it('should resolve 4.1.3', function(done) {
      var query = {
        version: '4.1.3',
        platform: 'osx',
        bits: 64
      };
      //fastdl.mongodb.org/osx/mongodb-macos-x86_64-3.6.8.tgz
      https: verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.1.3.tgz'
      );
    });

    it('should resolve 3.5.13 community', function(done) {
      var query = {
        version: '3.5.13',
        platform: 'osx',
        bits: 64
      };

      verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.5.13.tgz'
      );
    });

    it('should resolve 3.0.0 without ssl', function(done) {
      var query = {
        version: '3.0.0',
        platform: 'osx',
        bits: 64
      };

      verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.0.0.tgz'
      );
    });

    it('should resolve 2.6.0 without ssl', function(done) {
      var query = {
        version: '2.6.0',
        platform: 'osx',
        bits: 64
      };

      verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.0.tgz'
      );
    });

    it('should resolve 3.2.0 with ssl', function(done) {
      var query = {
        version: '3.2.0',
        platform: 'osx',
        bits: 64
      };

      verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.2.0.tgz'
      );
    });

    it('should resolve 3.6.0-rc3 with ssl', function(done) {
      var query = {
        version: '3.6.0-rc3',
        platform: 'osx',
        bits: 64
      };

      verify(
        done,
        query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.0-rc3.tgz'
      );
    });
  });

  // NOTE (imlucas): This is pretty unused as far as I know...
  describe.skip('evergreen', function() {
    it('should resolve a git commit sha1', function(done) {
      var sha = '610765fdb94eebf612bd0172ec081ccc21110103';
      var query = {
        version: sha,
        platform: 'win32',
        bits: 64,
        debug: true
      };
      resolve(query, function(err, res) {
        assert.ifError(err);
        assert.equal(
          res.url,
          'https://s3.amazonaws.com/mciuploads/mongodb-mongo-master/' +
            'windows_64_2k8_debug/610765fdb94eebf612bd0172ec081ccc21110103/binaries' +
            '/binaries-mongodb_mongo_master_windows_64_2k8_debug_610765fdb94eebf' +
            '612bd0172ec081ccc21110103_15_07_20_20_04_03.zip'
        );
        done();
      });
    });
  });

  describe('version aliases', function() {
    it('should resolve `stable`', function(done) {
      var query = {
        version: 'stable'
      };
      resolve(query, function(err, res) {
        assert.ifError(err);
        assert(res.version);
        assert(res.url);
        done();
      });
    });

    it('should resolve `unstable`', function(done) {
      var query = {
        version: 'unstable'
      };
      resolve(query, function(err, res) {
        assert.ifError(err);
        assert(res.version);
        assert(res.url);
        done();
      });
    });

    it('should resolve `latest`', function(done) {
      var query = {
        version: 'latest'
      };
      resolve(query, function(err, res) {
        assert.ifError(err);
        assert(res.version);
        assert(res.url);
        done();
      });
    });
  });

  describe('options', function() {
    it('should handle nulls', function() {
      assert.doesNotThrow(function() {
        resolve.options();
      });
    });

    it('should default version to `stable`', function() {
      assert.equal(resolve.options().version, 'stable');
    });

    it('should use the MONGODB_VERSION environment variable for version', function() {
      process.env.MONGODB_VERSION = '2.6.11';
      var res = resolve.options();
      delete process.env.MONGODB_VERSION;

      assert.equal(res.version, '2.6.11');
    });
  });
});
