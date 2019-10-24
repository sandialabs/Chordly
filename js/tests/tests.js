QUnit.test('return element', function (assert) {

    const element = $('<div>'),
        result = element.chordly();

    assert.deepEqual(result, element, 'result is initial element');

});

/*
    testing of $.chordly
*/
QUnit.module('contents of $.chordly');

QUnit.test('scanCodeMap has letters', function (assert) {

    let charCodeA = 'A'.charCodeAt(0),
        charCode,
        letter,
        i;

    for (i = 0; i < 26; i++) {

        charCode = i + charCodeA;
        letter = String.fromCharCode(charCode);

        assert.equal($.chordly.scanCodeMap[letter], charCode, letter + ' has scan code of ' + charCode);
    }

});

QUnit.test('scanCodeMap has numbers', function (assert) {

    let charCodeA = '0'.charCodeAt(0),
        charCode,
        number,
        i;

    for (i = 0; i < 10; i++) {

        charCode = i + charCodeA;
        number = String.fromCharCode(charCode);

        assert.equal($.chordly.scanCodeMap[number], charCode, number + ' has scan code of ' + charCode);
    }

});


QUnit.test('inverseScanCodeMap', function (assert) {

    function invertMapping(input) {

        const inversion = {};
        let key;

        for (key in input) {
            inversion[input[key]] = key;
        }

        return inversion;
    }

    assert.deepEqual($.chordly.inverseScanCodeMap, invertMapping($.chordly.scanCodeMap), 'inverseScanCodeMap is inversion of scan code map');
});

QUnit.test('version present', function (assert) {
    assert.ok(!$.chordly.version !== undefined, 'version defined');
    assert.ok(!$.chordly.version !== null, 'version not null');
});

QUnit.test('identifiedBrowser present', function (assert) {
    assert.ok(!$.chordly.identifiedBrowser !== undefined, 'identifiedBrowser defined');
    assert.ok(!$.chordly.identifiedBrowser !== null, 'identifiedBrowser not null');
});

// test makeSequencePart
QUnit.test('makeSequencePart assign true values', function (assert) {

    const keyCode = 42,
        shift = true,
        alt = true,
        ctrl = true,
        sequencePart = $.chordly.makeSequencePart(keyCode, shift, alt, ctrl);

    assert.equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    assert.equal(sequencePart.shift, shift, 'shift assigned');
    assert.equal(sequencePart.alt, alt, 'alt assigned');
    assert.equal(sequencePart.ctrl, ctrl, 'ctrl assigned');

});

QUnit.test('makeSequencePart assign false values', function (assert) {

    const keyCode = 42,
        shift = false,
        alt = false,
        ctrl = false,
        sequencePart = $.chordly.makeSequencePart(keyCode, shift, alt, ctrl);

    assert.equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    assert.equal(sequencePart.shift, shift, 'shift assigned');
    assert.equal(sequencePart.alt, alt, 'alt assigned');
    assert.equal(sequencePart.ctrl, ctrl, 'ctrl assigned');

});

QUnit.test('makeSequencePart default values are null', function (assert) {

    const keyCode = 42,
        sequencePart = $.chordly.makeSequencePart(keyCode);

    assert.equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    assert.equal(sequencePart.shift, null, 'shift defaulted to null');
    assert.equal(sequencePart.alt, null, 'alt defaulted to null');
    assert.equal(sequencePart.ctrl, null, 'ctrl defaulted to null');

});

// test keysEqual
QUnit.test('keysEqual', function (assert) {

    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, null, null, null), $.chordly.makeSequencePart(5, null, null, null)), 'same scan code equal');
    assert.ok(!$.chordly.keysEqual($.chordly.makeSequencePart(5, null, null, null), $.chordly.makeSequencePart(2, null, null, null)), 'different scan code equal');

    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, true, null, null), $.chordly.makeSequencePart(5, true, null, null)), 'true shift modifier equal');
    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, false, null, null), $.chordly.makeSequencePart(5, false, null, null)), 'false shift modifier equal');
    assert.ok(!$.chordly.keysEqual($.chordly.makeSequencePart(5, true, null, null), $.chordly.makeSequencePart(5, false, null, null)), 'different shift modifier not equal');

    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, true, true, null), $.chordly.makeSequencePart(5, true, true, null)), 'true alt modifier equal');
    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, true, false, null), $.chordly.makeSequencePart(5, true, false, null)), 'false alt modifier equal');
    assert.ok(!$.chordly.keysEqual($.chordly.makeSequencePart(5, true, true, null), $.chordly.makeSequencePart(5, true, false, null)), 'different alt modifier not equal');

    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, true, true, true), $.chordly.makeSequencePart(5, true, true, true)), 'true ctrl modifier equal');
    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, true, true, false), $.chordly.makeSequencePart(5, true, true, false)), 'false ctrl modifier equal');
    assert.ok(!$.chordly.keysEqual($.chordly.makeSequencePart(5, true, true, true), $.chordly.makeSequencePart(5, true, true, false)), 'different ctrl modifier not equal');

    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, true, true, true), $.chordly.makeSequencePart(5, null, null, null)), 'null sequence modifier ignored in compare of true');
    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5, false, false, false), $.chordly.makeSequencePart(5, null, null, null)), 'null sequence modifier ignored in compare of false');
    assert.ok($.chordly.keysEqual($.chordly.makeSequencePart(5), $.chordly.makeSequencePart(5)), 'modifiers defaulted to null');

});

// test literalStringToSequence
QUnit.test('literalStringToSequence Empty Input', function (assert) {

    const input = '',
        result = $.chordly.literalStringToSequence(input);

    assert.equal(result.length, 0, 'sequence has expected 0 length');

});

QUnit.test('literalStringToSequence Modifiers defaulted to null', function (assert) {

    const input = 'abc 123',
        result = $.chordly.literalStringToSequence(input);

    assert.equal(result.length, 7, 'sequence has expected length of 7');

    for (let i = 0; i < result.length; i++) {
        assert.equal(result[i].shift, null, 'sequence part ' + i + ' has null shift modifier');
        assert.equal(result[i].alt, null, 'sequence part ' + i + ' has null alt modifier');
        assert.equal(result[i].ctrl, null, 'sequence part ' + i + ' has null ctrl modifier');
    }
});

QUnit.test('literalStringToSequence Lowercase AlphaNumericSpace input', function (assert) {

    const input = 'abc 123',
        result = $.chordly.literalStringToSequence(input);

    assert.equal(result.length, 7, 'sequence has expected length of 7');

    assert.equal(result[0].keyCode, $.chordly.scanCodeMap.A, 'sequence part 0 assigned to scan code for A');
    assert.equal(result[1].keyCode, $.chordly.scanCodeMap.B, 'sequence part 0 assigned to scan code for B');
    assert.equal(result[2].keyCode, $.chordly.scanCodeMap.C, 'sequence part 0 assigned to scan code for C');

    assert.equal(result[3].keyCode, $.chordly.scanCodeMap.Space, 'sequence part 0 assigned to scan code for Space');

    assert.equal(result[4].keyCode, $.chordly.scanCodeMap[1], 'sequence part 0 assigned to scan code for 1');
    assert.equal(result[5].keyCode, $.chordly.scanCodeMap[2], 'sequence part 0 assigned to scan code for 2');
    assert.equal(result[6].keyCode, $.chordly.scanCodeMap[3], 'sequence part 0 assigned to scan code for 3');

});

QUnit.test('literalStringToSequence Uppercase AlphaNumericSpace input', function (assert) {

    const input = 'ABC 123',
        result = $.chordly.literalStringToSequence(input);

    assert.equal(result.length, 7, 'sequence has expected length of 7');

    assert.equal(result[0].keyCode, $.chordly.scanCodeMap.A, 'sequence part 0 assigned to scan code for A');
    assert.equal(result[1].keyCode, $.chordly.scanCodeMap.B, 'sequence part 0 assigned to scan code for B');
    assert.equal(result[2].keyCode, $.chordly.scanCodeMap.C, 'sequence part 0 assigned to scan code for C');

    assert.equal(result[3].keyCode, $.chordly.scanCodeMap.Space, 'sequence part 0 assigned to scan code for Space');

    assert.equal(result[4].keyCode, $.chordly.scanCodeMap[1], 'sequence part 0 assigned to scan code for 1');
    assert.equal(result[5].keyCode, $.chordly.scanCodeMap[2], 'sequence part 0 assigned to scan code for 2');
    assert.equal(result[6].keyCode, $.chordly.scanCodeMap[3], 'sequence part 0 assigned to scan code for 3');

});

// stringToSequence tests
QUnit.test('stringToSequence Defaults to null modifiers', function (assert) {

    const input = 'D O G [57]',
        result = $.chordly.stringToSequence(input);

    assert.equal(result.length, 4, 'expected sequence length');
    assert.deepEqual(result, $.chordly.literalStringToSequence('dog9'), 'sequence value as expected');

});

QUnit.test('stringToSequence Positive modifiers assignable', function (assert) {

    const input = 'shift+D alt+O ctrl+G shift+alt+ctrl+[42]',
        result = $.chordly.stringToSequence(input),
        expectation = [
            $.chordly.makeSequencePart($.chordly.scanCodeMap['D'], true, null, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['O'], null, true, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['G'], null, null, true),
            $.chordly.makeSequencePart(42, true, true, true),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

});

QUnit.test('stringToSequence Negative modifiers assignable', function (assert) {

    const input = '!shift+D !alt+O !ctrl+G !shift+!alt+!ctrl+[42]',
        result = $.chordly.stringToSequence(input),
        expectation = [
            $.chordly.makeSequencePart($.chordly.scanCodeMap['D'], false, null, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['O'], null, false, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['G'], null, null, false),
            $.chordly.makeSequencePart(42, false, false, false),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

});

QUnit.test('stringToSequence negative modifiers overrides positive modifiers', function (assert) {

    const input = '!shift+shift+D alt+!alt+O ctrl+!ctrl+G !shift+!alt+!ctrl+shift+alt+ctrl+[42]',
        result = $.chordly.stringToSequence(input),
        expectation = [
            $.chordly.makeSequencePart($.chordly.scanCodeMap['D'], false, null, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['O'], null, false, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['G'], null, null, false),
            $.chordly.makeSequencePart(42, false, false, false),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

    assert.equal(result.length, 4);

});

QUnit.test('sequenceToString negative modifiers overrides positive modifiers', function (assert) {

    const input = '!shift+shift+D alt+!alt+O ctrl+!ctrl+G !shift+!alt+!ctrl+shift+alt+ctrl+[42]',
        result = $.chordly.stringToSequence(input),
        expectation = [
            $.chordly.makeSequencePart($.chordly.scanCodeMap['D'], false, null, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['O'], null, false, null),
            $.chordly.makeSequencePart($.chordly.scanCodeMap['G'], null, null, false),
            $.chordly.makeSequencePart(42, false, false, false),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

    assert.equal(result.length, 4);

});

// Sequence to string
QUnit.test('sequenceToString', function (assert) {

    const inputString = '!shift+D alt+O !ctrl+G !shift+!alt+!ctrl+[42]',
        inputSequence = $.chordly.stringToSequence(inputString),
        result = $.chordly.sequenceToString(inputSequence);

    assert.equal(result, inputString);

});

QUnit.test('sequenceToString non modifier like scan codes', function (assert) {

    assert.deepEqual($.chordly.stringToSequence('Shift'), [$.chordly.makeSequencePart($.chordly.scanCodeMap['Shift'])], 'Shift interpreted and scan code, not modifier');
    assert.deepEqual($.chordly.stringToSequence('Alt'), [$.chordly.makeSequencePart($.chordly.scanCodeMap['Alt'])], 'Alt interpreted and scan code, not modifier');
    // ctrl is and control can not be confused

});

QUnit.test('flattenSequenceMap', function (assert) {

    const input = [{
            sequence: [$.chordly.stringToSequence('A'), $.chordly.stringToSequence('A')],
            matched: function () {
                return 'a';
            },
            lookup: 'lookup a'
        },
            {
                sequence: $.chordly.stringToSequence('B'),
                matched: function () {
                    return 'b';
                },
                lookup: 'lookup b'
            },
            {
                sequence: [$.chordly.stringToSequence('C')],
                matched: function () {
                    return 'c';
                },
                lookup: 'lookup c'
            }
        ],
        result = $.chordly.flattenSequenceMap(input);

    assert.equal(result.length, 4);

    assert.deepEqual(result[0].sequence, $.chordly.stringToSequence('A'));
    assert.equal(result[0].matched.call(), 'a');
    assert.equal(result[0].lookup, 'lookup a');

    assert.deepEqual(result[1].sequence, $.chordly.stringToSequence('A'));
    assert.equal(result[1].matched.call(), 'a');
    assert.equal(result[1].lookup, 'lookup a');

    assert.deepEqual(result[2].sequence, $.chordly.stringToSequence('B'));
    assert.equal(result[2].matched.call(), 'b');
    assert.equal(result[2].lookup, 'lookup b');

    assert.deepEqual(result[3].sequence, $.chordly.stringToSequence('C'));
    assert.equal(result[3].matched.call(), 'c');
    assert.equal(result[3].lookup, 'lookup c');

});

/*
    Chordly prototyping test
*/
QUnit.module('chordly prototype');

QUnit.test('chordly creation', function (assert) {

    const element = $('<div>');

    assert.equal(element.data('chordly'), undefined, 'no initial chordly data');

    element.chordly();

    assert.ok(element.data('chordly') !== undefined, 'chordly data present');
    assert.ok(element.hasClass('chordly'), 'chordly class added to element');
    assert.ok(element.data('chordly').options !== undefined, 'defaults set on creation');

});

QUnit.test('chordly creation overridden defaults options', function (assert) {

    const element = $('<div>'),
        options = {
            captureShift: true,
            captureAlt: true,
            captureCtrl: true,

            ignoreFormElements: false,

            keyEvent: 'keydown',

            maxBufferLength: 10,

            clearBufferOnMatch: false,

            bufferTimeoutMs: 250,

            greedyTimeoutMs: 0,

            sequenceMap: [{
                sequence: $.chordly.literalStringToSequence('dog'),
                lookup: "dog",
                matched: undefined
            }],

            paused: true
        },
        data = element.chordly(options).data('chordly');

    assert.deepEqual(element.data('chordly').options, options, 'defaults overridden');

});

QUnit.test('chordly destroy', function (assert) {

    const element = $('<div>');

    element.chordly();
    element.chordly('destroy');

    assert.equal(element.data('chordly'), undefined, 'no chordly data');
    assert.ok(!element.hasClass('chordly'), 'chordly class not on element');

});

QUnit.test('can push to sequence buffer', function (assert) {

    const element = $('<div>'),
        data = element.chordly().data('chordly'),
        sequence = $.chordly.literalStringToSequence('dog');

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer starts at length 0');

    element.chordly('pushSequence', sequence);

    assert.deepEqual(data.sequenceBuffer, sequence, 'sequence buffer contains pushed sequence');

});

QUnit.test('can clear sequence buffer', function (assert) {

    const element = $('<div>'),
        data = element.chordly().data('chordly'),
        sequence = $.chordly.literalStringToSequence('dog');

    element.chordly('pushSequence', sequence);
    assert.ok(data.sequenceBuffer.length > 0, 'sequence buffer contains data');

    element.chordly('clearSequenceBuffer');
    assert.ok(data.sequenceBuffer.length === 0, 'sequence buffer contains data');

});

QUnit.test('can pause', function (assert) {

    const element = $('<div>'),
        options = element.chordly({
            paused: false
        }).data('chordly').options;

    assert.equal(options.paused, false, 'starts in non-paused state');

    element.chordly('pause');
    assert.equal(options.paused, true, 'in paused state');

    element.chordly('pause');
    assert.equal(options.paused, true, 'stays in paused state');

});

QUnit.test('can resume', function (assert) {

    const element = $('<div>'),
        options = element.chordly({
            paused: true
        }).data('chordly').options;

    assert.equal(options.paused, true, 'starts in paused state');

    element.chordly('resume');
    assert.equal(options.paused, false, 'in non-paused state');

    element.chordly('resume');
    assert.equal(options.paused, false, 'stays in non-paused state');

});

QUnit.test('can toggle pause', function (assert) {

    const element = $('<div>'),
        options = element.chordly({
            paused: false
        }).data('chordly').options;

    assert.equal(options.paused, false, 'starts in non-paused state');

    element.chordly('togglePause');
    assert.equal(options.paused, true, 'in paused state');

    element.chordly('togglePause');
    assert.equal(options.paused, false, 'in non-paused state');

});

QUnit.test('can bind new sequence', function (assert) {

    const element = $('<div>'),
        sequenceMap = element.chordly().data('chordly').options.sequenceMap,
        sequenceMapping = {
            sequence: $.chordly.literalStringToSequence('dog'),
            lookup: 'lookup',
            matched: undefined
        };

    assert.equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.chordly('bind', sequenceMapping);

    assert.deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound');

});

QUnit.test('can double bind new sequence', function (assert) {

    const element = $('<div>'),
        sequenceMap = element.chordly().data('chordly').options.sequenceMap,
        sequenceMapping = {
            sequence: $.chordly.literalStringToSequence('dog'),
            lookup: 'lookup',
            matched: undefined
        };

    assert.equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.chordly('bind', sequenceMapping);
    element.chordly('bind', sequenceMapping);

    assert.deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound once');
    assert.deepEqual(sequenceMap[1], sequenceMapping, 'sequence mapping bound twice');

});

QUnit.test('can unbind sequence', function (assert) {

    const element = $('<div>'),
        sequenceMap = element.chordly().data('chordly').options.sequenceMap,
        sequence1 = $.chordly.literalStringToSequence('dog'),
        sequenceMapping1 = {
            sequence: sequence1,
            lookup: 'lookup1',
            matched: undefined
        },
        sequence2 = $.chordly.literalStringToSequence('cat'),
        sequenceMapping2 = {
            sequence: sequence2,
            lookup: 'lookup2',
            matched: undefined
        };

    element.chordly('bind', sequenceMapping1);
    element.chordly('bind', sequenceMapping2);
    assert.deepEqual(sequenceMap[0], sequenceMapping1, 'sequence mapping1 exists');
    assert.deepEqual(sequenceMap[1], sequenceMapping2, 'sequence mapping2 exists');

    element.chordly('unbind', sequence1);
    assert.equal(sequenceMap.length, 1, 'sequence mapping unbound');
    assert.deepEqual(sequenceMap[0], sequenceMapping2, 'previous mapping2 exists');

});

QUnit.test('can unbind all matching sequences', function (assert) {

    const element = $('<div>'),
        sequenceMap = element.chordly().data('chordly').options.sequenceMap,
        sequence = $.chordly.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
            lookup: 'lookup',
            matched: undefined
        };

    assert.equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.chordly('bind', sequenceMapping);
    element.chordly('bind', sequenceMapping);

    assert.deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound once');
    assert.deepEqual(sequenceMap[1], sequenceMapping, 'sequence mapping bound twice');

    element.chordly('unbind', sequence);

    assert.equal(sequenceMap.length, 0, 'sequences unbound');

});

QUnit.test('bind will flatten SequenceMap', function (assert) {

    const element = $('<div>'),
        sequenceMapping = [{
            sequence: [$.chordly.stringToSequence('A'), $.chordly.stringToSequence('A')],
            matched: function () {
                return 'a';
            },
            lookup: 'lookup a'
        },
            {
                sequence: $.chordly.stringToSequence('B'),
                matched: function () {
                    return 'b';
                },
                lookup: 'lookup b'
            },
            {
                sequence: [$.chordly.stringToSequence('C')],
                matched: function () {
                    return 'c';
                },
                lookup: 'lookup c'
            }
        ],
        data = element.chordly().data('chordly').options.sequenceMap;

    element.chordly('bind', sequenceMapping);
    assert.deepEqual(element.chordly().data('chordly').options.sequenceMap, $.chordly.flattenSequenceMap(sequenceMapping), 'bind flattened map');

});


QUnit.test('construct option will flatten SequenceMap', function (assert) {

    const element = $('<div>'),
        sequenceMapping = [{
            sequence: [$.chordly.stringToSequence('A'), $.chordly.stringToSequence('A')],
            matched: function () {
                return 'a';
            },
            lookup: 'lookup a'
        },
            {
                sequence: $.chordly.stringToSequence('B'),
                matched: function () {
                    return 'b';
                },
                lookup: 'lookup b'
            },
            {
                sequence: [$.chordly.stringToSequence('C')],
                matched: function () {
                    return 'c';
                },
                lookup: 'lookup c'
            }
        ],
        expectedResult = $.chordly.flattenSequenceMap(sequenceMapping),
        data = element.chordly({
            sequenceMap: sequenceMapping
        }).data('chordly').options.sequenceMap;

    assert.deepEqual(element.chordly().data('chordly').options.sequenceMap, $.chordly.flattenSequenceMap(sequenceMapping), 'options flattened map');

});

QUnit.test('bindLiteralSequence lonely', function (assert) {

    const element = $('<div>'),
        sequenceString = 'chicken',
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindLiteralSequence', sequenceString);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.literalStringToSequence(sequenceString), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

});

QUnit.test('bindLiteralSequence matched', function (assert) {

    const element = $('<div>'),
        sequenceString = 'chicken',
        matched = function () {
            return 'chicken matched';
        },
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindLiteralSequence', sequenceString, matched);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.literalStringToSequence(sequenceString, matched), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

});

QUnit.test('bindLiteralSequence lookup', function (assert) {

    const element = $('<div>'),
        sequenceString = 'chicken',
        lookup = 'chicken lookup',
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindLiteralSequence', sequenceString, lookup);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.literalStringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

QUnit.test('bindLiteralSequence matched lookup', function (assert) {

    const element = $('<div>'),
        sequenceString = 'chicken',
        lookup = 'chicken lookup',
        matched = function () {
            return 'chicken matched';
        },
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindLiteralSequence', sequenceString, matched, lookup);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.literalStringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

QUnit.test('bindSequence lonely', function (assert) {

    const element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindSequence', sequenceString);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.stringToSequence(sequenceString), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

});

QUnit.test('bindSequence matched', function (assert) {

    const element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        matched = function () {
            return 'dog matched';
        },
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindSequence', sequenceString, matched);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.stringToSequence(sequenceString, matched), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

});

QUnit.test('bindSequence lookup', function (assert) {

    const element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        lookup = 'dog lookup',
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindSequence', sequenceString, lookup);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.stringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

QUnit.test('bindSequence matched lookup', function (assert) {

    const element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        lookup = 'dog lookup',
        matched = function () {
            return 'dog matched';
        },
        data = element.chordly().data('chordly'),
        sequenceMap = data.options.sequenceMap;

    element.chordly('bindSequence', sequenceString, matched, lookup);

    assert.deepEqual(sequenceMap[0].sequence, $.chordly.stringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

QUnit.test('pushSequenceAndAct', function (assert) {

    // Arrange
    let matchedSequence = false;
    let eventTriggeredCounter = 0;

    const element = $('<div>'),
        data = element.chordly().data('chordly'),
        sequence = $.chordly.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
            matched: function () {
                matchedSequence = true;
            }
        };

    element.bind('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.chordly('bind', sequenceMapping);

    // Act
    element.chordly('pushSequenceAndAct', sequence);

    // Assert
    assert.ok(matchedSequence, "matched sequence");
    assert.equal(eventTriggeredCounter, 1, "custom event triggered once");

});

QUnit.test('actOnBuffer', function (assert) {

    // Arrange
    let matchedSequence = false;
    let eventTriggeredCounter = 0;

    const element = $('<div>'),
        data = element.chordly().data('chordly'),
        sequence = $.chordly.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
            matched: function () {
                matchedSequence = true;
            }
        };

    element.bind('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.chordly('bind', sequenceMapping);
    element.chordly('pushSequence', sequence);

    // Act
    element.chordly('actOnBuffer');

    // Assert
    assert.ok(matchedSequence, "matched sequence");
    assert.equal(eventTriggeredCounter, 1, "custom event triggered once");

});

QUnit.test('act on all matches of same sequence', function (assert) {

    // Arrange
    let sequenceMapping1Matched = false;
    let sequenceMapping2Matched = false;
    let eventTriggeredCounter = 0;

    const element = $('<div>'),
        data = element.chordly().data('chordly'),
        sequence = $.chordly.literalStringToSequence('dog'),
        sequenceMapping1 = {
            sequence: sequence,
            matched: function () {
                sequenceMapping1Matched = true;
            }
        },
        sequenceMapping2 = {
            sequence: sequence,
            matched: function () {
                sequenceMapping2Matched = true
            }
        };

    element.bind('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.chordly('bind', sequenceMapping1);
    element.chordly('bind', sequenceMapping2);

    // Act
    element.chordly('pushSequence', sequence);
    element.chordly('actOnBuffer');

    // Assert
    assert.ok(sequenceMapping1Matched, "sequence mapping 1 matched");
    assert.ok(sequenceMapping2Matched, "sequence mapping 2 matched");
    assert.equal(eventTriggeredCounter, 2, "custom event triggered twice");
});

QUnit.test('act on all matches of alternate sequences', function (assert) {

    // Arrange
    let matchedSequence1 = false;
    let matchedSequence2 = false;
    let eventTriggeredCounter = 0;

    const element = $('<div>'),
        data = element.chordly().data('chordly'),
        sequence1 = $.chordly.literalStringToSequence('dog'),
        sequenceMapping1 = {
            sequence: sequence1,
            matched: function () {
                matchedSequence1 = true;
            }
        },
        sequence2 = $.chordly.literalStringToSequence('og'),
        sequenceMapping2 = {
            sequence: sequence2,
            matched: function () {
                matchedSequence2 = true;
            }
        };

    element.bind('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.chordly('bind', sequenceMapping1);
    element.chordly('bind', sequenceMapping2);

    // Act
    element.chordly('pushSequence', sequence1);
    element.chordly('actOnBuffer');

    // Assert
    assert.ok(matchedSequence1, "matched sequence 1");
    assert.ok(matchedSequence2, "matched sequence 2");
    assert.equal(eventTriggeredCounter, 2, "custom event triggered twice");

});

QUnit.test('key event adds to buffer', function (assert) {

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName
        }).data('chordly'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = 42,
        shiftState = true,
        altState = true,
        ctrlState = true,
        sequencePart = $.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);
    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds to buffer');

});

QUnit.test('key event acts', function (assert) {

    // Arrange
    let eventTriggeredCounter = 0;
    let matchedSequence = false;

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName
        }).data('chordly'),
        sequence = $.chordly.literalStringToSequence('d'),
        sequenceMapping = {
            sequence: sequence,
            matched: function () {
                matchedSequence = true;
            }
        };

    element.bind('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.chordly('bind', sequenceMapping);

    e.which = $.chordly.scanCodeMap['D'];
    e.shiftKey = false;
    e.altKey = false;
    e.ctrlKey = false;

    // Act
    element.trigger(e);

    // Assert
    assert.ok(matchedSequence, "matched sequence");
    assert.equal(eventTriggeredCounter, 1, "custom event triggered twice");
});


QUnit.test('buffer length auto expands', function (assert) {

    const element = $('<div>'),
        bufferLength = 1,
        sequenceString = 'this is a longer sequence',
        sequenceMapping = {
            sequence: $.chordly.literalStringToSequence(sequenceString),
            lookup: 'lookup',
            matched: undefined
        },
        data = element.chordly({
            maxBufferLength: bufferLength,
            sequenceMap: [sequenceMapping]
        }).data('chordly');

    assert.equal(data.options.maxBufferLength, sequenceString.length, 'buffer stretched');

});

QUnit.test('buffer length auto expands on bind', function (assert) {

    const element = $('<div>'),
        bufferLength = 1,
        sequenceString = 'this is a longer sequence',
        data = element.chordly({
            maxBufferLength: bufferLength
        }).data('chordly'),
        sequenceMapping = {
            sequence: $.chordly.literalStringToSequence(sequenceString),
            lookup: 'lookup',
            matched: undefined
        };

    assert.equal(data.options.maxBufferLength, bufferLength, 'buffer length as set');

    element.chordly('bind', sequenceMapping);

    assert.equal(data.options.maxBufferLength, sequenceString.length, 'buffer stretched');

});

QUnit.test('buffer length pushed to maxBufferLength', function (assert) {

    const element = $('<div>'),
        bufferLength = 5,
        sequence = $.chordly.literalStringToSequence('a'),
        data = element.chordly({
            maxBufferLength: bufferLength
        }).data('chordly');
    let i;

    assert.equal(data.sequenceBuffer.length, 0, 'buffer starts at 0 size');

    for (i = 0; i < bufferLength + 5; i++) {
        element.chordly('pushSequence', sequence);
    }

    assert.equal(data.sequenceBuffer.length, bufferLength, 'buffer equal to max length');

});

QUnit.test('option clearBufferOnMatch true', function (assert) {

    const element = $('<div>'),
        data = element.chordly({
            clearBufferOnMatch: true
        }).data('chordly'),
        sequence = $.chordly.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
        };

    element.chordly('bind', sequenceMapping);
    element.chordly('pushSequenceAndAct', sequence);

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer empty');

});

QUnit.test('option clearBufferOnMatch false', function (assert) {

    const element = $('<div>'),
        data = element.chordly({
            clearBufferOnMatch: false
        }).data('chordly'),
        sequence = $.chordly.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
        };

    element.chordly('bind', sequenceMapping);
    element.chordly('pushSequenceAndAct', sequence);

    assert.equal(data.sequenceBuffer.length, 3, 'sequence buffer not empty');

});

QUnit.test('option capture shift true', function (assert) {

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            captureShift: true
        }).data('chordly'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chordly.scanCodeMap.Shift,
        shiftState = true,
        altState = false,
        ctrlState = false,
        sequencePart = $.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds shift to buffer');

});

QUnit.test('option capture shift false', function (assert) {

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            captureShift: false
        }).data('chordly'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chordly.scanCodeMap.Shift,
        shiftState = true,
        altState = false,
        ctrlState = false,
        sequencePart = $.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    assert.equal(sequenceBuffer.length, 0, 'key event does not add shift to buffer');

});

QUnit.test('option capture ctrl true', function (assert) {

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            captureCtrl: true
        }).data('chordly'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chordly.scanCodeMap.Control,
        shiftState = false,
        altState = false,
        ctrlState = true,
        sequencePart = $.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds ctrl to buffer');

});

QUnit.test('option capture ctrl false', function (assert) {

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            captureCtrl: false
        }).data('chordly'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chordly.scanCodeMap.Control,
        shiftState = false,
        altState = false,
        ctrlState = true,
        sequencePart = $.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);

    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    assert.equal(sequenceBuffer.length, 0, 'key event does not add ctrl to buffer');

});

QUnit.test('option capture alt true', function (assert) {

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            captureAlt: true
        }).data('chordly'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chordly.scanCodeMap.Alt,
        shiftState = false,
        altState = true,
        ctrlState = false,
        sequencePart = $.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds alt to buffer');

});

QUnit.test('option capture alt false', function (assert) {

    const element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            captureAlt: false
        }).data('chordly'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chordly.scanCodeMap.Alt,
        shiftState = false,
        altState = true,
        ctrlState = false,
        sequencePart = $.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    assert.equal(sequenceBuffer.length, 0, 'key event does not add alt to buffer');

});

QUnit.test('option ignoreFormElements false', function (assert) {

    const element = $('<div>'),
        formElement = $('<input>').attr('type', 'text'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            ignoreFormElements: false
        }).data('chordly');

    element.append(formElement);

    e.which = $.chordly.scanCodeMap.D;
    e.shiftKey = false;
    e.altKey = false;
    e.ctrlKey = false;

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer is empty');
    formElement.trigger(e);
    assert.equal(data.sequenceBuffer.length, 1, 'sequence buffer has been pushed to');

});

QUnit.test('option ignoreFormElements true', function (assert) {

    const element = $('<div>'),
        formElement = $('<input>').attr('type', 'text'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chordly({
            keyEvent: eventName,
            ignoreFormElements: true
        }).data('chordly');

    element.append(formElement);

    e.which = $.chordly.scanCodeMap.D;
    e.shiftKey = false;
    e.altKey = false;
    e.ctrlKey = false;

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer is empty');
    formElement.trigger(e);
    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer has not been pushed to');

});

QUnit.test('literalStringToSequence throws error on unrecognized character', function (assert) {

    for (let i = 0; i <= 255; i++) {

        const charString = String.fromCharCode(i);
        if (!charString.match(/[A-Za-z0-9 ]/)) {

            assert.throws(
                function () {
                    $.chordly.literalStringToSequence(charString);
                },
                "raised error message on unrecognized character code " + i
            );
        }
    }

});

QUnit.test('literalStringToSequence does not throw error on recognized character', function (assert) {

    for (let i = 0; i <= 255; i++) {

        const charString = String.fromCharCode(i);

        if (charString.match(/[A-Za-z0-9 ]/)) {
            $.chordly.literalStringToSequence(charString);
            assert.ok(true, "no raised error message on recognized character code " + i + " ('" + charString + "')");
        }
    }

});

QUnit.test('stringToSequence throws error on NaN keycode', function (assert) {
    assert.throws(
        function () {
            $.chordly.stringToSequence('[potato]');
        },
        "raised error message on NaN keycode"
    );
});

QUnit.test('stringToSequence throws error on invalid keycode', function (assert) {

    for (let i = -10; i <= 265; i++) {

        if (i >= 0 && i <= 255) {
            continue;
        }

        const charString = "[" + i + "]";

        assert.throws(
            function () {
                $.chordly.stringToSequence(charString);
            },
            "raised error message on keycode '" + charString + "'"
        );

    }
});

QUnit.test('stringToSequence does not throw error on valid keycode', function (assert) {

    for (let i = 0; i <= 255; i++) {
        const charString = "[" + i + "]";
        $.chordly.stringToSequence(charString);
        assert.ok(true, "no raised error message on recognized key code " + i + " ('" + charString + "')");
    }
});

QUnit.test('stringToSequence does not throw error on recognized sequence', function (assert) {

    for (let item in $.chordly.scanCodeMap) {

        $.chordly.stringToSequence(item + " shift+" + item + " ctrl+" + item + " alt+" + item + " shift+ctrl+alt+" + item);
        assert.ok(true, "no raised error message on recognized sequence '" + item + "'");
    }

});

QUnit.test('stringToSequence throws error on unrecognized sequence', function (assert) {

    assert.throws(
        function () {
            $.chordly.stringToSequence('Potato');
        }, "raised error message on unrecognized sequence"
    );

});