var os = require('os');
var PLATFORM = os.platform() === 'darwin' ? 'osx' : os.platform();
var ARCH = os.arch() === 'x64' ? 'x86_64' : os.arch();
var versions = require('mongodb-version-list');
var semver = require('semver');
var request = require('request');
var async = require('async');
var defaults = require('lodash.defaults');
var format = require('util').format;
var debug = require('debug')('mongodb-download-url');

var EVERGREEN_ENDPOINT = 'http://mci-motu.10gen.cc:9090';

function resolveEvergreenBuildArtifact(opts, fn) {
  if (opts.platform === 'win32') {
    opts.distro = 'windows_64_2k8';
    if (opts.debug) {
      opts.distro += '_debug';
    }
  }

  var projectName = format('mongodb-mongo-%s', opts.branch);
  var url = format('%s/rest/v1/projects/%s/revisions/%s',
    EVERGREEN_ENDPOINT, projectName, opts.version);

  debug('resolving git commit sha1 via evergreen `%s`', url);
  request.get({
    url: url,
    json: true
  }, function(err, res, body) {
    if (err) {
      return fn(err);
    }

    if (res.statusCode === 404) {
      return fn(new Error(body.message));
    }

    var dl = format('https://s3.amazonaws.com/mciuploads/%s/%s/%s/binaries',
      projectName, opts.distro, opts.version);
    var artifactPrefix = format('mongodb_mongo_%s_%s', opts.branch, opts.distro);
    var basename = body.builds.filter(function(b) {
      return b.indexOf(artifactPrefix) > -1;
    })[0];

    // @todo: test across all distros as I believe this may be different for some.
    basename = 'binaries-' + basename;
    fn(null, {
      name: 'mongodb',
      version: opts.version,
      artifact: basename + opts.ext,
      url: dl + '/' + basename + opts.ext
    });
  });
}

function search(query, fn) {
  debug('searching for version', query);
  versions(function(err, res) {
    if (err) {
      return fn(err);
    }

    var found = false;
    for (var i = 0; i < res.length; i++) {
      if (!found && semver.satisfies(res[i], query.version)) {
        found = true;
        fn(null, res[i]);
      }
    }
    if (!found) {
      fn(new Error('Could not find a MongoDB version matching `' + JSON.stringify(query) + '`'));
    }
  });
}

function latest(fn) {
  versions(function(err, res) {
    if (err) {
      return fn(err);
    }
    fn(null, res[0]);
  });
}

function stable(fn) {
  versions(function(err, res) {
    if (err) {
      return fn(err);
    }

    fn(null, res.map(function(v) {
      return semver.parse(v);
    }).filter(function(v) {
      return v.prerelease.length === 0 && v.minor % 2 === 0;
    }).map(function(v) {
      return v.version;
    })[0]);
  });
}

function parsePlatform(opts) {
  if (opts.platform === 'darwin') {
    opts.platform = 'osx';
  }
  if (opts.platform === 'windows') {
    opts.platform = 'win32';
  }
  return opts;
}

function parseBits(opts) {
  // 64bit -> 64
  opts.bits = '' + opts.bits;
  opts.bits = opts.bits.replace(/[^0-9]/g, '');
  return opts;
}

function parseFileExtension(opts) {
  opts.ext = '.tgz';
  if (opts.platform === 'win32') {
    opts.ext = '.zip';
  }
  return opts;
}

function parseDistro(opts) {
  if (!opts.distro) {
    if (opts.platform === 'linux') {
      opts.distro = 'linux_' + opts.bits;
    } else if (opts.platform === 'osx') {
      opts.distro = '';
    } else if (opts.enterprise) {
      opts.distro = 'windows-64';
    } else if (opts.version.charAt(0) === '2') {
      // 2.x did not ship ssl for windows.
      opts.distro = '2008plus';
    } else {
      opts.distro = '2008plus-ssl';
    }
    if (opts.debug) {
      opts.distro += '_debug';
    }
  }
  return opts;
}

function resolve(opts, fn) {
  /**
   * If it's a commit hash, resolve the artifact
   * URL using the evergreen rest api.
   */
  if (opts.version.length === 40) {
    return resolveEvergreenBuildArtifact(opts, fn);
  }

  var handler = versions;
  if (opts.version === 'latest' || opts.version === 'unstable') {
    handler = latest;
  } else if (opts.version === 'stable') {
    handler = stable;
  } else {
    handler = search.bind(null, opts);
  }

  handler(function(err, versionId) {
    if (err) {
      return fn(err);
    }

    var extraDash = '-';
    if (opts.platform === 'osx') {
      extraDash = '';
    }

    var artifact;
    var hostname = 'fastdl.mongodb.org';

    if (opts.enterprise) {
      hostname = 'downloads.mongodb.com';
      artifact = format('mongodb-%s-x86_64-enterprise-%s',
        opts.platform,
        [
          opts.distro,
          extraDash,
          opts.debug ? '-debugsymbols-' : '',
          versionId,
          opts.ext
        ].join(''));
    } else if (opts.platform === 'linux') {
      artifact = format('mongodb-%s-x86_64-%s',
        opts.platform,
        [
          opts.debug ? '-debugsymbols-' : '',
          versionId,
          opts.ext
        ].join(''));
    } else {
      artifact = 'mongodb-' + opts.platform + '-x86_64-' + opts.distro + extraDash
        + (opts.debug ? '-debugsymbols-' : '') + versionId + opts.ext;
    }

    var pkg = {
      name: 'mongodb',
      version: versionId,
      artifact: artifact,
      url: format('http://%s/%s/%s',
        hostname, opts.platform, artifact)
    };

    debug('Url: ' + pkg.url);
    fn(null, pkg);
  });
}

module.exports = function(opts, fn) {
  if (Array.isArray(opts)) {
    var tasks = {};

    opts.map(function(opt) {
      tasks[opt.version] = module.exports.bind(null, opt);
    });

    return async.parallel(tasks, fn);
  }

  if (typeof opts === 'string') {
    opts = {
      version: opts
    };
  }

  defaults(opts, {
    arch: ARCH,
    platform: PLATFORM,
    branch: 'master',
    bits: '64',
    debug: false
  });

  parsePlatform(opts);
  parseBits(opts);
  parseFileExtension(opts);
  parseDistro(opts);

  debug('Building URL for options `%j`', opts);

  resolve(opts, fn);
};
