var resolve = require('../');
var request = require('request');
var assert = require('assert');

function verify(done, query, expectedURL) {
  resolve(query, function(err, res) {
    assert.ifError(err);
    assert.equal(res.url, expectedURL);

    request(res.url, {
      method: 'HEAD'
    }, function(badUrl) {
      if (badUrl) {
        return done(new Error('The URL `' + res.url + '` returned: ' + badUrl.message));
      }
      done();
    });
  });
}

describe('mongodb-download-url', function() {
  // - https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.4.14.tgz
  // + https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-linux_64-2.4.14.tgz
  describe('linux', function() {
    it('should resolve 2.4.14', function(done) {
      var query = {
        version: '2.4.14',
        platform: 'linux',
        linuxDistro: 'legacy',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.4.14.tgz');
    });

    it('should resolve 2.6.11', function(done) {
      var query = {
        version: '2.6.11',
        platform: 'linux',
        linuxDistro: 'legacy',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.6.11.tgz');
    });

    it('should resolve 3.1.9', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'linux',
        linuxDistro: 'legacy',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.1.9.tgz');
    });

    it('should resolve 3.1.9 enterprise', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'linux',
        distro: 'ubuntu1404',
        enterprise: true,
        bits: 64
      };
      verify(done, query,
        'https://downloads.mongodb.com/linux/mongodb-linux-x86_64'
        + '-enterprise-ubuntu1404-3.1.9.tgz');
    });

    it('should resolve 3.0.7 (32-bit)', function(done) {
      var query = {
        version: '3.0.7',
        platform: 'linux',
        linuxDistro: 'legacy',
        bits: 32
      };
      verify(done, query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-i686-3.0.7.tgz');
    });

    it('should resolve RHEL 6.2', function(done) {
      // We support 6.2, and 7.0 community versions
      var query = {
        version: '3.6.2',
        platform: 'linux',
        linuxDistro: 'rhel62',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel62-3.6.2.tgz');
    });

    it('should resolve PPC RHEL 7.1 Enterprise', function(done) {
      var query = {
        version: '3.6.2',
        platform: 'linux',
        arch: 'ppc64le',
        enterprise: true,
        linuxDistro: 'rhel71',
        bits: 64
      };
      verify(done, query,
        'https://downloads.mongodb.com/linux/mongodb-linux-ppc64le-enterprise-rhel71-3.6.2.tgz');
    });

    it('should resolve SuSE 11', function(done) {
      // Community
      var query = {
        version: '3.6.2',
        platform: 'linux',
        linuxDistro: 'suse11',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-suse11-3.6.2.tgz');
    });

    it('should resolve x390s SuSE 12 Enterprise', function(done) {
      var query = {
        version: '3.6.2',
        arch: 's390x',
        platform: 'linux',
        enterprise: true,
        linuxDistro: 'suse12',
        bits: 64
      };
      verify(done, query,
        'https://downloads.mongodb.com/linux/mongodb-linux-s390x-enterprise-suse12-3.6.2.tgz');
    });

    it('should resolve SuSE 11 Enterprise', function(done) {
      var query = {
        version: '3.6.2',
        platform: 'linux',
        enterprise: true,
        linuxDistro: 'suse11',
        bits: 64
      };
      verify(done, query,
        'https://downloads.mongodb.com/linux/mongodb-linux-x86_64-enterprise-suse11-3.6.2.tgz');
    });

    it('should resolve PPC Ubuntu 16.04 Enterprise', function(done) {
      var query = {
        version: '3.6.2',
        platform: 'linux',
        arch: 'ppc64le',
        enterprise: true,
        linuxDistro: 'ubuntu1604',
        bits: 64
      };
      verify(done, query,
        'https://downloads.mongodb.com/linux/mongodb-linux-ppc64le-enterprise-ubuntu1604-3.6.2.tgz');
    });

    it('should resolve ARM Ubuntu 16.04', function(done) {
      // Community
      var query = {
        version: '3.6.2',
        platform: 'linux',
        arch: 'arm64',
        linuxDistro: 'ubuntu1604',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/linux/mongodb-linux-arm64-ubuntu1604-3.6.2.tgz');
    });
  });

  describe('windows', function() {
    it('should resolve 3.1.9', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'win32',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.1.9.zip');
    });
    it('should resolve 3.1.19 enterprise', function(done) {
      var query = {
        version: '3.1.9',
        platform: 'win32',
        enterprise: true,
        bits: 64
      };
      verify(done, query,
        'https://downloads.mongodb.com/win32/'
        + 'mongodb-win32-x86_64-enterprise-windows-64-3.1.9.zip');
    });
    it('should resolve 2.6.11', function(done) {
      var query = {
        version: '2.6.11',
        platform: 'win32',
        bits: 64
      };
      verify(done, query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-2.6.11.zip');
    });
    it('should resolve 3.0.7 (32-bit)', function(done) {
      var query = {
        version: '3.0.7',
        platform: 'win32',
        bits: 32
      };
      verify(done, query,
        'https://fastdl.mongodb.org/win32/mongodb-win32-i386-3.0.7.zip');
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
      verify(done, query,
        'https://downloads.mongodb.com/osx/mongodb-osx-x86_64-enterprise-3.1.9.tgz');
    });

    it('should resolve 3.5.13 community', function(done) {
      var query = {
        version: '3.5.13',
        platform: 'osx',
        bits: 64
      };

      verify(done, query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.5.13.tgz');
    });

    it('should resolve 3.0.0 without ssl', function(done) {
      var query = {
        version: '3.0.0',
        platform: 'osx',
        bits: 64
      };

      verify(done, query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.0.0.tgz');
    });

    it('should resolve 2.6.0 without ssl', function(done) {
      var query = {
        version: '2.6.0',
        platform: 'osx',
        bits: 64
      };

      verify(done, query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.6.0.tgz');
    });

    it('should resolve 3.2.0 with ssl', function(done) {
      var query = {
        version: '3.2.0',
        platform: 'osx',
        bits: 64
      };

      verify(done, query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.2.0.tgz');
    });

    it('should resolve 3.6.0-rc3 with ssl', function(done) {
      var query = {
        version: '3.6.0-rc3',
        platform: 'osx',
        bits: 64
      };

      verify(done, query,
        'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.0-rc3.tgz');
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
        assert.equal(res.url,
          'https://s3.amazonaws.com/mciuploads/mongodb-mongo-master/'
          + 'windows_64_2k8_debug/610765fdb94eebf612bd0172ec081ccc21110103/binaries'
          + '/binaries-mongodb_mongo_master_windows_64_2k8_debug_610765fdb94eebf'
          + '612bd0172ec081ccc21110103_15_07_20_20_04_03.zip'
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
