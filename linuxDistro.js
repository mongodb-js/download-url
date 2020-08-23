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
    var distroId = '';
    var distroVersion = '';
    try {
        distroId = exec('lsb_release -si', {encoding: 'utf8' });
        distroVersion = exec('lsb_release -sr', { encoding: 'utf8' });
    } catch (e) {
        if (e.stderr) {
            try {
            var issue = exec('cat /etc/issue', {encoding: 'utf8' }).trim();
            distroVersion = issue.match(/(\d+\.?)+/)[0];
            distroId = issue.split('GNC/Linux')[0];
            } catch (e) {
                console.error('Could not determine Linux distribution');
                throw e;
            }
        } else {
            throw e;
        }
    }

    var ret = {
        distroId: distroId.trim(),
        distroVersion: distroVersion.trim()
    };

    return ret;
}