import _ from 'utils/underscore';
import {
    hasRedundantLevels,
    generateLabel,
    createLabel,
    getCustomLabel,
    findClosestBandwidth,
    toKbps
} from 'providers/utils/quality-labels';

describe('quality-labels', function() {

    var customLabels = {
        1000: 'low',
        2000: 'medium',
        3000: 'high',
    };

    var bandwidths = _.keys(customLabels);

    describe('createLabel', function() {
        it('creates a label using height when available', function() {
            var expected = '360p';
            var actual = createLabel(360, undefined, false);
            expect(expected).to.equal(actual);
        });

        it('creates a label using bandwidth when height is not available', function() {
            var expected = '1337 kbps';
            var actual = createLabel(undefined, 1337000, false);
            expect(expected).to.equal(actual);
        });

        it('does not add parentheses to bandwidth when redundant is true and height is not available', function() {
            var expected = '1337 kbps';
            var actual = createLabel(undefined, 1337000, true);
            expect(expected).to.equal(actual);
        });

        it('includes bandwidth string when redundant argument is true', function() {
            var expected = '360p (1337 kbps)';
            var actual = createLabel(360, 1337000, true);
            expect(expected).to.equal(actual);
        });

        it('returns an empty string when height and bandwidth are not available', function() {
            var expected = '';
            var actual = createLabel(undefined, undefined, false);
            expect(expected).to.equal(actual);
        });
    });


    describe('getCustomLabel', function() {
        it('gets custom label when bandwidth exactly matches a key', function() {
            var expected = 'medium';
            var actual = getCustomLabel(customLabels, 2000000);
            expect(expected).to.equal(actual);
        });

        it('gets custom label when bandwidth rounds to a key', function() {
            var expected = 'medium';
            var actual = getCustomLabel(customLabels, 2000004);
            expect(expected).to.equal(actual);
        });

        it('retuns null when no custom labels are given', function() {
            var expected = null;
            var actual = getCustomLabel(null, 4000000);
            expect(expected).to.equal(actual);
        });

        it('retuns null when custom labels are empty', function() {
            var expected = null;
            var actual = getCustomLabel({}, 4000000);
            expect(expected).to.equal(actual);
        });

        it('retuns null when bandwidth is undefined', function() {
            var expected = null;
            var actual = getCustomLabel(customLabels, undefined);
            expect(expected).to.equal(actual);
        });
    });


    describe('findClosestBandwidth', function() {
        it('retuns null when no bandwidths are given', function() {
            var expected = null;
            var actual = findClosestBandwidth([], 4000);
            expect(expected).to.equal(actual);
        });

        it('returns null when bandwidths are not an array', function() {
            var expected = null;
            var actual = findClosestBandwidth({ medium: 4000 }, 4000);
            expect(expected).to.equal(actual);
        });

        it('finds the quality label with closest to the target bandwidth when between two bandwidths', function() {
            var expected = '2000';
            var actual = findClosestBandwidth(bandwidths, 2200);
            expect(expected).to.equal(actual);
        });

        it('finds the quality label closest to the target bandwidth when exactly matching a bandwidth', function() {
            var expected = '1000';
            var actual = findClosestBandwidth(bandwidths, 1000);
            expect(expected).to.equal(actual);
        });

        it('chooses the top label when the target bandwidth is greater than every bandwidth', function() {
            var expected = '3000';
            var actual = findClosestBandwidth(bandwidths, 9999999);
            expect(expected).to.equal(actual);
        });

        it('chooses the lowest label when the target bandwidth is less than every bandwidth', function() {
            var expected = '1000';
            var actual = findClosestBandwidth(bandwidths, 1);
            expect(expected).to.equal(actual);
        });
    });


    describe('toKbps', function() {
        it('should be 0 if 0 bps', function() {
            var expected = 0;
            var actual = toKbps(0);
            expect(expected).to.equal(actual);
        });

        it('should be 0 if less than 1 kbps', function() {
            var expected = 0;
            var actual = toKbps(999);
            expect(expected).to.equal(actual);
        });

        it('should convert bps to kbps', function() {
            var expected = 3;
            var actual = toKbps(3000);
            expect(expected).to.equal(actual);
        });
    });


    describe('hasRedundantLevels', function() {
        it('should return true if at least two levels share the same height', function() {
            var levels = [{ height: 100 }, { height: 50 }, { height: 100 }];
            var actual = hasRedundantLevels(levels);
            expect(actual).to.equal(true);
        });

        it('should return false if no levels share the same height', function() {
            var levels = [{ height: 100 }, { height: 50 }, { height: 200 }];
            var actual = hasRedundantLevels(levels);
            expect(actual).to.equal(false);
        });

        it('should return true if at least two have no height and share the same bandwidth', function() {
            var levels = [{ bandwidth: 10000 }, { height: 50 }, { bandwidth: 10000 }];
            var actual = hasRedundantLevels(levels);
            expect(actual).to.equal(true);
        });

        it('should return false if at least two have no height and do not share the same bandwidth', function() {
            var levels = [{ bandwidth: 10000 }, { height: 50 }, { bandwidth: 20000 }];
            var actual = hasRedundantLevels(levels);
            expect(actual).to.equal(false);
        });

        it('should return false if there are no levels', function() {
            var levels = [];
            var actual = hasRedundantLevels(levels);
            expect(actual).to.equal(false);
        });

        it('should return false if levels are undefined', function() {
            var levels;
            var actual = hasRedundantLevels(levels);
            expect(actual).to.equal(false);
        });

        it('should return false if levels are not an array', function() {
            var levels = { height: 100, notHeight: 100 };
            var actual = hasRedundantLevels(levels);
            expect(actual).to.equal(false);
        });

        describe('generateLabel', function() {
            // flash provider only
            it('should use label property if it exists and there are no custom labels', function() {
                var level = { label: '360px' };
                var actual = generateLabel(level, null, false);
                expect(actual).to.equal('360px');
            });

            // flash provider only
            it('should not use label property if it exists and there are custom labels', function() {
                var level = { label: '360px', bitrate: 2000000 };
                var actual = generateLabel(level, customLabels, false);
                expect(actual).to.equal('medium');
            });
        });
    });
});

