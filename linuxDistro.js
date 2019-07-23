'use strict';

var exec = require('child_process').execSync;

exports.lsbReleaseInfo = lsbReleaseInfo;
exports.getDistro = getDistro;

function getDistro() {
    var distroInfo = exports.lsbReleaseInfo();
    switch (distroInfo.distroId) {
        case 'Ubuntu':
            var version = distroInfo.distroVersion.replace('.', '') || '1604';
            return 'ubuntu' + version;
        default:
            return '';
    }
}

function lsbReleaseInfo() {
    var distroId = exec('lsb_release -si', {encoding: 'utf8' });
    var distroVersion = exec('lsb_release -sr', { encoding: 'utf8' });

    var ret = {
        distroId: distroId.trim(),
        distroVersion: distroVersion.trim()
    };

    return ret;
}