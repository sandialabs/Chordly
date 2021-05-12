/*
    testing of window.chordly
*/
QUnit.module('contents of window.chordly');

QUnit.test('scanCodeMap has letters', function (assert) {

    let charCodeA = 'A'.charCodeAt(0),
        charCode,
        letter,
        i;

    for (i = 0; i < 26; i++) {

        charCode = i + charCodeA;
        letter = String.fromCharCode(charCode);

        assert.equal(window.chordly.scanCodeMap[letter], charCode, letter + ' has scan code of ' + charCode);
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

        assert.equal(window.chordly.scanCodeMap[number], charCode, number + ' has scan code of ' + charCode);
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

    assert.deepEqual(window.chordly.inverseScanCodeMap, invertMapping(window.chordly.scanCodeMap), 'inverseScanCodeMap is inversion of scan code map');
});

QUnit.test('version present', function (assert) {
    assert.ok(!window.chordly.version !== undefined, 'version defined');
    assert.ok(!window.chordly.version !== null, 'version not null');
});

QUnit.test('identifiedBrowser present', function (assert) {
    assert.ok(!window.chordly.identifiedBrowser !== undefined, 'identifiedBrowser defined');
    assert.ok(!window.chordly.identifiedBrowser !== null, 'identifiedBrowser not null');
});

// test makeSequencePart
QUnit.test('makeSequencePart assign true values', function (assert) {

    const keyCode = 42,
        shift = true,
        alt = true,
        ctrl = true,
        sequencePart = window.chordly.makeSequencePart(keyCode, shift, alt, ctrl);

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
        sequencePart = window.chordly.makeSequencePart(keyCode, shift, alt, ctrl);

    assert.equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    assert.equal(sequencePart.shift, shift, 'shift assigned');
    assert.equal(sequencePart.alt, alt, 'alt assigned');
    assert.equal(sequencePart.ctrl, ctrl, 'ctrl assigned');

});

QUnit.test('makeSequencePart default values are null', function (assert) {

    const keyCode = 42,
        sequencePart = window.chordly.makeSequencePart(keyCode);

    assert.equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    assert.equal(sequencePart.shift, null, 'shift defaulted to null');
    assert.equal(sequencePart.alt, null, 'alt defaulted to null');
    assert.equal(sequencePart.ctrl, null, 'ctrl defaulted to null');

});

// test keysEqual
QUnit.test('keysEqual', function (assert) {

    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, null, null, null), window.chordly.makeSequencePart(5, null, null, null)), 'same scan code equal');
    assert.ok(!window.chordly.keysEqual(window.chordly.makeSequencePart(5, null, null, null), window.chordly.makeSequencePart(2, null, null, null)), 'different scan code equal');

    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, null, null), window.chordly.makeSequencePart(5, true, null, null)), 'true shift modifier equal');
    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, false, null, null), window.chordly.makeSequencePart(5, false, null, null)), 'false shift modifier equal');
    assert.ok(!window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, null, null), window.chordly.makeSequencePart(5, false, null, null)), 'different shift modifier not equal');

    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, true, null), window.chordly.makeSequencePart(5, true, true, null)), 'true alt modifier equal');
    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, false, null), window.chordly.makeSequencePart(5, true, false, null)), 'false alt modifier equal');
    assert.ok(!window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, true, null), window.chordly.makeSequencePart(5, true, false, null)), 'different alt modifier not equal');

    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, true, true), window.chordly.makeSequencePart(5, true, true, true)), 'true ctrl modifier equal');
    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, true, false), window.chordly.makeSequencePart(5, true, true, false)), 'false ctrl modifier equal');
    assert.ok(!window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, true, true), window.chordly.makeSequencePart(5, true, true, false)), 'different ctrl modifier not equal');

    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, true, true, true), window.chordly.makeSequencePart(5, null, null, null)), 'null sequence modifier ignored in compare of true');
    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5, false, false, false), window.chordly.makeSequencePart(5, null, null, null)), 'null sequence modifier ignored in compare of false');
    assert.ok(window.chordly.keysEqual(window.chordly.makeSequencePart(5), window.chordly.makeSequencePart(5)), 'modifiers defaulted to null');

});

// test literalStringToSequence
QUnit.test('literalStringToSequence Empty Input', function (assert) {

    const input = '',
        result = window.chordly.literalStringToSequence(input);

    assert.equal(result.length, 0, 'sequence has expected 0 length');

});

QUnit.test('literalStringToSequence Modifiers defaulted to null', function (assert) {

    const input = 'abc 123',
        result = window.chordly.literalStringToSequence(input);

    assert.equal(result.length, 7, 'sequence has expected length of 7');

    for (let i = 0; i < result.length; i++) {
        assert.equal(result[i].shift, null, 'sequence part ' + i + ' has null shift modifier');
        assert.equal(result[i].alt, null, 'sequence part ' + i + ' has null alt modifier');
        assert.equal(result[i].ctrl, null, 'sequence part ' + i + ' has null ctrl modifier');
    }
});

QUnit.test('literalStringToSequence Lowercase AlphaNumericSpace input', function (assert) {

    const input = 'abc 123',
        result = window.chordly.literalStringToSequence(input);

    assert.equal(result.length, 7, 'sequence has expected length of 7');

    assert.equal(result[0].keyCode, window.chordly.scanCodeMap.A, 'sequence part 0 assigned to scan code for A');
    assert.equal(result[1].keyCode, window.chordly.scanCodeMap.B, 'sequence part 0 assigned to scan code for B');
    assert.equal(result[2].keyCode, window.chordly.scanCodeMap.C, 'sequence part 0 assigned to scan code for C');

    assert.equal(result[3].keyCode, window.chordly.scanCodeMap.Space, 'sequence part 0 assigned to scan code for Space');

    assert.equal(result[4].keyCode, window.chordly.scanCodeMap[1], 'sequence part 0 assigned to scan code for 1');
    assert.equal(result[5].keyCode, window.chordly.scanCodeMap[2], 'sequence part 0 assigned to scan code for 2');
    assert.equal(result[6].keyCode, window.chordly.scanCodeMap[3], 'sequence part 0 assigned to scan code for 3');

});

QUnit.test('literalStringToSequence Uppercase AlphaNumericSpace input', function (assert) {

    const input = 'ABC 123',
        result = window.chordly.literalStringToSequence(input);

    assert.equal(result.length, 7, 'sequence has expected length of 7');

    assert.equal(result[0].keyCode, window.chordly.scanCodeMap.A, 'sequence part 0 assigned to scan code for A');
    assert.equal(result[1].keyCode, window.chordly.scanCodeMap.B, 'sequence part 0 assigned to scan code for B');
    assert.equal(result[2].keyCode, window.chordly.scanCodeMap.C, 'sequence part 0 assigned to scan code for C');

    assert.equal(result[3].keyCode, window.chordly.scanCodeMap.Space, 'sequence part 0 assigned to scan code for Space');

    assert.equal(result[4].keyCode, window.chordly.scanCodeMap[1], 'sequence part 0 assigned to scan code for 1');
    assert.equal(result[5].keyCode, window.chordly.scanCodeMap[2], 'sequence part 0 assigned to scan code for 2');
    assert.equal(result[6].keyCode, window.chordly.scanCodeMap[3], 'sequence part 0 assigned to scan code for 3');

});

// stringToSequence tests
QUnit.test('stringToSequence Defaults to null modifiers', function (assert) {

    const input = 'D O G [57]',
        result = window.chordly.stringToSequence(input);

    assert.equal(result.length, 4, 'expected sequence length');
    assert.deepEqual(result, window.chordly.literalStringToSequence('dog9'), 'sequence value as expected');

});

QUnit.test('stringToSequence Positive modifiers assignable', function (assert) {

    const input = 'shift+D alt+O ctrl+G shift+alt+ctrl+[42]',
        result = window.chordly.stringToSequence(input),
        expectation = [
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['D'], true, null, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['O'], null, true, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['G'], null, null, true),
            window.chordly.makeSequencePart(42, true, true, true),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

});

QUnit.test('stringToSequence Negative modifiers assignable', function (assert) {

    const input = '!shift+D !alt+O !ctrl+G !shift+!alt+!ctrl+[42]',
        result = window.chordly.stringToSequence(input),
        expectation = [
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['D'], false, null, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['O'], null, false, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['G'], null, null, false),
            window.chordly.makeSequencePart(42, false, false, false),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

});

QUnit.test('stringToSequence negative modifiers overrides positive modifiers', function (assert) {

    const input = '!shift+shift+D alt+!alt+O ctrl+!ctrl+G !shift+!alt+!ctrl+shift+alt+ctrl+[42]',
        result = window.chordly.stringToSequence(input),
        expectation = [
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['D'], false, null, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['O'], null, false, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['G'], null, null, false),
            window.chordly.makeSequencePart(42, false, false, false),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

    assert.equal(result.length, 4);

});

QUnit.test('sequenceToString negative modifiers overrides positive modifiers', function (assert) {

    const input = '!shift+shift+D alt+!alt+O ctrl+!ctrl+G !shift+!alt+!ctrl+shift+alt+ctrl+[42]',
        result = window.chordly.stringToSequence(input),
        expectation = [
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['D'], false, null, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['O'], null, false, null),
            window.chordly.makeSequencePart(window.chordly.scanCodeMap['G'], null, null, false),
            window.chordly.makeSequencePart(42, false, false, false),
        ];

    assert.deepEqual(result, expectation, 'sequence value as expected');

    assert.equal(result.length, 4);

});

// Sequence to string
QUnit.test('sequenceToString', function (assert) {

    const inputString = '!shift+D alt+O !ctrl+G !shift+!alt+!ctrl+[42]',
        inputSequence = window.chordly.stringToSequence(inputString),
        result = window.chordly.sequenceToString(inputSequence);

    assert.equal(result, inputString);

});

QUnit.test('sequenceToString non modifier like scan codes', function (assert) {

    assert.deepEqual(window.chordly.stringToSequence('Shift'), [window.chordly.makeSequencePart(window.chordly.scanCodeMap['Shift'])], 'Shift interpreted and scan code, not modifier');
    assert.deepEqual(window.chordly.stringToSequence('Alt'), [window.chordly.makeSequencePart(window.chordly.scanCodeMap['Alt'])], 'Alt interpreted and scan code, not modifier');
    // ctrl is and control can not be confused

});

QUnit.test('flattenSequenceMap', function (assert) {

    const input = [{
            sequence: [window.chordly.stringToSequence('A'), window.chordly.stringToSequence('A')],
            matched: function () {
                return 'a';
            },
            lookup: 'lookup a'
        },
            {
                sequence: window.chordly.stringToSequence('B'),
                matched: function () {
                    return 'b';
                },
                lookup: 'lookup b'
            },
            {
                sequence: [window.chordly.stringToSequence('C')],
                matched: function () {
                    return 'c';
                },
                lookup: 'lookup c'
            }
        ],
        result = window.chordly.flattenSequenceMap(input);

    assert.equal(result.length, 4);

    assert.deepEqual(result[0].sequence, window.chordly.stringToSequence('A'));
    assert.equal(result[0].matched.call(), 'a');
    assert.equal(result[0].lookup, 'lookup a');

    assert.deepEqual(result[1].sequence, window.chordly.stringToSequence('A'));
    assert.equal(result[1].matched.call(), 'a');
    assert.equal(result[1].lookup, 'lookup a');

    assert.deepEqual(result[2].sequence, window.chordly.stringToSequence('B'));
    assert.equal(result[2].matched.call(), 'b');
    assert.equal(result[2].lookup, 'lookup b');

    assert.deepEqual(result[3].sequence, window.chordly.stringToSequence('C'));
    assert.equal(result[3].matched.call(), 'c');
    assert.equal(result[3].lookup, 'lookup c');

});

/*
    Chordly prototyping test
*/
QUnit.module('chordly prototype');

QUnit.test('chordly creation', function (assert) {

    const element = document.querySelector('body');

    assert.ok(element.chordlyInstance == null, 'no chordly before initialization');

    element.pushToChordly();

    assert.ok(element.chordlyInstance != null, 'chordly should exist after initialization');
    assert.ok(element.classList.contains('chordly'), 'chordly class added to element');
    removeChordlyAfterTest(element);
});

QUnit.test('chordly creation overridden defaults options', function (assert) {

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
            sequence: window.chordly.literalStringToSequence('dog'),
            lookup: "dog",
            matched: undefined
        }],

        paused: true
    };

    const element = document.querySelector('body');
    element.pushToChordly(options);

    assert.deepEqual(element.chordlyInstance.options, options, 'defaults overridden');

    removeChordlyAfterTest(element);
});

QUnit.test('chordly destroy', function (assert) {

    const element = document.querySelector('body');

    element.pushToChordly();
    element.pushToChordly('destroy');

    assert.equal(element.chordlyInstance, undefined, 'no chordly data');
    assert.ok(!element.classList.contains('chordly'), 'chordly class not on element');
});

QUnit.test('can push to sequence buffer', function (assert) {

    const element = document.querySelector('body');

    element.pushToChordly()
    const data = element.chordlyInstance;
    const sequence = window.chordly.literalStringToSequence('dog');

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer starts at length 0');

    element.pushToChordly('pushSequence', sequence);

    assert.deepEqual(data.sequenceBuffer, sequence, 'sequence buffer contains pushed sequence');

    removeChordlyAfterTest(element);
});

QUnit.test('can clear sequence buffer', function (assert) {

    const element = document.querySelector('body');

    element.pushToChordly()
    const data = element.chordlyInstance;
    const sequence = window.chordly.literalStringToSequence('dog');

    element.pushToChordly('pushSequence', sequence);
    assert.ok(data.sequenceBuffer.length > 0, 'sequence buffer contains data');

    element.pushToChordly('clearSequenceBuffer');
    assert.ok(data.sequenceBuffer.length === 0, 'sequence buffer contains data');

    removeChordlyAfterTest(element);
});

QUnit.test('can pause', function (assert) {

    const element = document.querySelector('body');

    element.pushToChordly({ paused: false });
    const options = element.chordlyInstance.options;

    assert.equal(options.paused, false, 'starts in non-paused state');

    element.pushToChordly('pause');
    assert.equal(options.paused, true, 'in paused state');

    element.pushToChordly('pause');
    assert.equal(options.paused, true, 'stays in paused state');

    removeChordlyAfterTest(element);
});

QUnit.test('can resume', function (assert) {

    const element = document.querySelector('body');

    element.pushToChordly({ paused: true });
    const options = element.chordlyInstance.options;

    assert.equal(options.paused, true, 'starts in paused state');

    element.pushToChordly('resume');
    assert.equal(options.paused, false, 'in non-paused state');

    element.pushToChordly('resume');
    assert.equal(options.paused, false, 'stays in non-paused state');

    removeChordlyAfterTest(element);
});

QUnit.test('can toggle pause', function (assert) {

    const element = document.querySelector('body');

    element.pushToChordly({ paused: false });
    const options = element.chordlyInstance.options;

    assert.equal(options.paused, false, 'starts in non-paused state');

    element.pushToChordly('togglePause');
    assert.equal(options.paused, true, 'in paused state');

    element.pushToChordly('togglePause');
    assert.equal(options.paused, false, 'in non-paused state');

    removeChordlyAfterTest(element);
});

QUnit.test('can bind new sequence', function (assert) {

    const element = document.querySelector('body');

    element.pushToChordly();
    const sequenceMap = element.chordlyInstance.options.sequenceMap;
    const sequenceMapping = {
        sequence: window.chordly.literalStringToSequence('dog'),
        lookup: 'lookup',
        matched: undefined
    };

    assert.equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.pushToChordly('bind', sequenceMapping);

    assert.deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound');

    removeChordlyAfterTest(element);
});

QUnit.test('can double bind new sequence', function (assert) {

    const element = document.querySelector('body');

    const sequenceMap = element.pushToChordly().options.sequenceMap;
    const sequenceMapping = {
        sequence: window.chordly.literalStringToSequence('dog'),
        lookup: 'lookup',
        matched: undefined
    };

    assert.equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.pushToChordly('bind', sequenceMapping);
    element.pushToChordly('bind', sequenceMapping);

    assert.deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound once');
    assert.deepEqual(sequenceMap[1], sequenceMapping, 'sequence mapping bound twice');

    removeChordlyAfterTest(element);
});

QUnit.test('can unbind sequence', function (assert) {

    const element = document.querySelector('body');

    const sequenceMap = element.pushToChordly().options.sequenceMap;
    const sequenceOne = window.chordly.literalStringToSequence('dog');
    const sequenceMappingOne = {
        sequence: sequenceOne,
        lookup: 'lookup1',
        matched: undefined
    };
    const sequenceTwo = window.chordly.literalStringToSequence('cat');
    const sequenceMappingTwo = {
        sequence: sequenceTwo,
        lookup: 'lookup2',
        matched: undefined
    };

    element.pushToChordly('bind', sequenceMappingOne);
    element.pushToChordly('bind', sequenceMappingTwo);
    assert.deepEqual(sequenceMap[0], sequenceMappingOne, 'sequence mapping1 exists');
    assert.deepEqual(sequenceMap[1], sequenceMappingTwo, 'sequence mapping2 exists');

    element.pushToChordly('unbind', sequenceOne);
    assert.equal(sequenceMap.length, 1, 'sequence mapping unbound');
    assert.deepEqual(sequenceMap[0], sequenceMappingTwo, 'previous mapping2 exists');

    removeChordlyAfterTest(element);
});

QUnit.test('can unbind all matching sequences', function (assert) {

    const element = document.querySelector('body');

    const sequenceMap = element.pushToChordly().options.sequenceMap;
    const sequence = window.chordly.literalStringToSequence('dog');
    const sequenceMapping = {
        sequence: sequence,
        lookup: 'lookup',
        matched: undefined
    };

    assert.equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.pushToChordly('bind', sequenceMapping);
    element.pushToChordly('bind', sequenceMapping);

    assert.deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound once');
    assert.deepEqual(sequenceMap[1], sequenceMapping, 'sequence mapping bound twice');

    element.pushToChordly('unbind', sequence);

    assert.equal(sequenceMap.length, 0, 'sequences unbound');

    removeChordlyAfterTest(element);
});

QUnit.test('bind will flatten SequenceMap', function (assert) {

    const element = document.querySelector('body');

    const sequenceMapping = [{
        sequence: [window.chordly.stringToSequence('A'), window.chordly.stringToSequence('A')],
        matched: function () {
            return 'a';
        },
        lookup: 'lookup a'
    },
        {
            sequence: window.chordly.stringToSequence('B'),
            matched: function () {
                return 'b';
            },
            lookup: 'lookup b'
        },
        {
            sequence: [window.chordly.stringToSequence('C')],
            matched: function () {
                return 'c';
            },
            lookup: 'lookup c'
        }
    ];
    const sequenceMap = element.pushToChordly().options.sequenceMap;

    element.pushToChordly('bind', sequenceMapping);
    assert.deepEqual(sequenceMap, window.chordly.flattenSequenceMap(sequenceMapping), 'bind flattened map');

    removeChordlyAfterTest(element);
});


QUnit.test('construct option will flatten SequenceMap', function (assert) {

    const element = document.querySelector('body');

    const sequenceMapping = [{
        sequence: [window.chordly.stringToSequence('A'), window.chordly.stringToSequence('A')],
        matched: function () {
            return 'a';
        },
        lookup: 'lookup a'
    },
        {
            sequence: window.chordly.stringToSequence('B'),
            matched: function () {
                return 'b';
            },
            lookup: 'lookup b'
        },
        {
            sequence: [window.chordly.stringToSequence('C')],
            matched: function () {
                return 'c';
            },
            lookup: 'lookup c'
        }
    ];
    const expectedResult = window.chordly.flattenSequenceMap(sequenceMapping);
    const sequenceMap = element.pushToChordly({
        sequenceMap: sequenceMapping
    }).options.sequenceMap;

    assert.deepEqual(sequenceMap, expectedResult, 'options flattened map');

    removeChordlyAfterTest(element);
});

QUnit.test('bindLiteralSequence lonely', function (assert) {

    const element = document.querySelector('body');

    sequenceString = 'chicken';
    sequenceMap = element.pushToChordly().options.sequenceMap;

    element.pushToChordly('bindLiteralSequence', sequenceString);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.literalStringToSequence(sequenceString), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

    removeChordlyAfterTest(element);
});

QUnit.test('bindLiteralSequence matched', function (assert) {

    const element = document.querySelector('body');

    const sequenceString = 'chicken';
    const matched = function () {
        return 'chicken matched';
    };
    const sequenceMap = element.pushToChordly().options.sequenceMap;

    element.pushToChordly('bindLiteralSequence', sequenceString, matched);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.literalStringToSequence(sequenceString, matched), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

    removeChordlyAfterTest(element);
});

QUnit.test('bindLiteralSequence lookup', function (assert) {

    const element = document.querySelector('body');

    const sequenceString = 'chicken';
    const lookup = 'chicken lookup';
    const sequenceMap = element.pushToChordly().options.sequenceMap;

    element.pushToChordly('bindLiteralSequence', sequenceString, lookup);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.literalStringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

    removeChordlyAfterTest(element);
});

QUnit.test('bindLiteralSequence matched lookup', function (assert) {

    const element = document.querySelector('body');

    const sequenceString = 'chicken';
    const lookup = 'chicken lookup';
    const matched = function () {
        return 'chicken matched';
    };
    const sequenceMap = element.pushToChordly().options.sequenceMap;

    element.pushToChordly('bindLiteralSequence', sequenceString, matched, lookup);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.literalStringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

    removeChordlyAfterTest(element);
});

QUnit.test('bindSequence lonely', function (assert) {

    const element = document.querySelector('body');

    sequenceString = 'shift+D !alt+O ctrl+!shift+D';
    sequenceMap = element.pushToChordly().options.sequenceMap;

    element.pushToChordly('bindSequence', sequenceString);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.stringToSequence(sequenceString), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');
    removeChordlyAfterTest(element);
});

QUnit.test('bindSequence matched', function (assert) {

    const element = document.querySelector('body');

    const sequenceString = 'shift+D !alt+O ctrl+!shift+D';
    const matched = function () {
        return 'dog matched';
    };
    const sequenceMap = element.pushToChordly().options.sequenceMap;

    element.pushToChordly('bindSequence', sequenceString, matched);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.stringToSequence(sequenceString, matched), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');
    removeChordlyAfterTest(element);
});

QUnit.test('bindSequence lookup', function (assert) {

    const element = document.querySelector('body');

    const sequenceString = 'shift+D !alt+O ctrl+!shift+D';
    const lookup = 'dog lookup';
    const data = element.pushToChordly();
    const sequenceMap = data.options.sequenceMap;

    element.pushToChordly('bindSequence', sequenceString, lookup);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.stringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');
    removeChordlyAfterTest(element);
});

QUnit.test('bindSequence matched lookup', function (assert) {

    const element = document.querySelector('body');

    const sequenceString = 'shift+D !alt+O ctrl+!shift+D';
    const lookup = 'dog lookup';
    const matched = function () {
        return 'dog matched';
    };
    const data = element.pushToChordly();
    const sequenceMap = data.options.sequenceMap;

    element.pushToChordly('bindSequence', sequenceString, matched, lookup);

    assert.deepEqual(sequenceMap[0].sequence, window.chordly.stringToSequence(sequenceString, lookup), 'sequence assigned');
    assert.deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    assert.deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');
    removeChordlyAfterTest(element);
});

QUnit.test('pushSequenceAndAct', function (assert) {

    const element = document.querySelector('body');

    // Arrange
    let matchedSequence = false;
    let eventTriggeredCounter = 0;

    element.pushToChordly();
    const sequence = window.chordly.literalStringToSequence('dog');
    const sequenceMapping = {
        sequence: sequence,
        matched: function () {
            matchedSequence = true;
        }
    };

    element.addEventListener('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.pushToChordly('bind', sequenceMapping);

    // Act
    element.pushToChordly('pushSequenceAndAct', sequence);

    // Assert
    assert.ok(matchedSequence, "matched sequence");
    assert.equal(eventTriggeredCounter, 1, "custom event triggered once");
    removeChordlyAfterTest(element);
});

QUnit.test('actOnBuffer', function (assert) {

    const element = document.querySelector('body');

    // Arrange
    let matchedSequence = false;
    let eventTriggeredCounter = 0;

    element.pushToChordly();
    const sequence = window.chordly.literalStringToSequence('dog');
    const sequenceMapping = {
        sequence: sequence,
        matched: function () {
            matchedSequence = true;
        }
    };

    element.addEventListener('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.pushToChordly('bind', sequenceMapping);
    element.pushToChordly('pushSequence', sequence);

    // Act
    element.pushToChordly('actOnBuffer');

    // Assert
    assert.ok(matchedSequence, "matched sequence");
    assert.equal(eventTriggeredCounter, 1, "custom event triggered once");
    removeChordlyAfterTest(element);
});

QUnit.test('act on all matches of same sequence', function (assert) {

    const element = document.querySelector('body');

    // Arrange
    let sequenceMappingOneMatched = false;
    let sequenceMappingTwoMatched = false;
    let eventTriggeredCounter = 0;

    element.pushToChordly();
    const sequence = window.chordly.literalStringToSequence('dog');
    const sequenceMappingOne = {
        sequence: sequence,
        matched: function () {
            sequenceMappingOneMatched = true;
        }
    };
    const sequenceMappingTwo = {
        sequence: sequence,
        matched: function () {
            sequenceMappingTwoMatched = true
        }
    };
    element.addEventListener('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.pushToChordly('bind', sequenceMappingOne);
    element.pushToChordly('bind', sequenceMappingTwo);

    // Act
    element.pushToChordly('pushSequence', sequence);
    element.pushToChordly('actOnBuffer');

    // Assert
    assert.ok(sequenceMappingOneMatched, "sequence mapping 1 matched");
    assert.ok(sequenceMappingTwoMatched, "sequence mapping 2 matched");
    assert.equal(eventTriggeredCounter, 2, "custom event triggered twice");
    removeChordlyAfterTest(element);
});

QUnit.test('act on all matches of alternate sequences', function (assert) {

    const element = document.querySelector('body');

    // Arrange
    let matchedSequenceOne = false;
    let matchedSequenceTwo = false;
    let eventTriggeredCounter = 0;

    element.pushToChordly();
    const sequenceOne = window.chordly.literalStringToSequence('dog');
    const sequenceMappingOne = {
        sequence: sequenceOne,
        matched: function () {
            matchedSequenceOne = true;
        }
    };
    const sequenceTwo = window.chordly.literalStringToSequence('og');
    const sequenceMappingTwo = {
        sequence: sequenceTwo,
        matched: function () {
            matchedSequenceTwo = true;
        }
    };
    element.addEventListener('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.pushToChordly('bind', sequenceMappingOne);
    element.pushToChordly('bind', sequenceMappingTwo);

    // Act
    element.pushToChordly('pushSequence', sequenceOne);
    element.pushToChordly('actOnBuffer');

    // Assert
    assert.ok(matchedSequenceOne, "matched sequence 1");
    assert.ok(matchedSequenceTwo, "matched sequence 2");
    assert.equal(eventTriggeredCounter, 2, "custom event triggered twice");
    removeChordlyAfterTest(element);
});

QUnit.test('key event adds to buffer', function (assert) {

    const element = document.querySelector('body');

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    const data = element.pushToChordly({
        keyEvent: eventName
    });
    const sequenceBuffer = data.sequenceBuffer;
    const keyCode = 42;
    const shiftState = true;
    const altState = true;
    const ctrlState = true;
    const sequencePart = window.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    event.which = keyCode;
    event.shiftKey = shiftState;
    event.altKey = altState;
    event.ctrlKey = ctrlState;

    element.dispatchEvent(event);
    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds to buffer');
    removeChordlyAfterTest(element);
});

QUnit.test('key event acts', function (assert) {

    const element = document.querySelector('body');

    // Arrange
    let eventTriggeredCounter = 0;
    let matchedSequence = false;

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    element.pushToChordly({
        keyEvent: eventName
    });
    const sequence = window.chordly.literalStringToSequence('d');
    const sequenceMapping = {
        sequence: sequence,
        matched: function () {
            matchedSequence = true;
        }
    };
    element.addEventListener('chordlyMatch', function (e) {
        eventTriggeredCounter++;
    });

    element.pushToChordly('bind', sequenceMapping);

    event.which = window.chordly.scanCodeMap['D'];
    event.shiftKey = false;
    event.altKey = false;
    event.ctrlKey = false;

    // Act
    element.dispatchEvent(event);

    // Assert
    assert.ok(matchedSequence, "matched sequence");
    assert.equal(eventTriggeredCounter, 1, "custom event triggered twice");
    removeChordlyAfterTest(element);
});


QUnit.test('buffer length auto expands', function (assert) {

    const element = document.querySelector('body');

    const bufferLength = 1;
    const sequenceString = 'this is a longer sequence';
    const sequenceMapping = {
        sequence: window.chordly.literalStringToSequence(sequenceString),
        lookup: 'lookup',
        matched: undefined
    };
    const data = element.pushToChordly({
        maxBufferLength: bufferLength,
        sequenceMap: [sequenceMapping]
    });

    assert.equal(data.options.maxBufferLength, sequenceString.length, 'buffer stretched');
    removeChordlyAfterTest(element);
});

QUnit.test('buffer length auto expands on bind', function (assert) {

    const element = document.querySelector('body');

    const bufferLength = 1;
    const sequenceString = 'this is a longer sequence';
    const data = element.pushToChordly({
        maxBufferLength: bufferLength
    });
    const sequenceMapping = {
        sequence: window.chordly.literalStringToSequence(sequenceString),
        lookup: 'lookup',
        matched: undefined
    };

    assert.equal(data.options.maxBufferLength, bufferLength, 'buffer length as set');

    element.pushToChordly('bind', sequenceMapping);

    assert.equal(data.options.maxBufferLength, sequenceString.length, 'buffer stretched');
    removeChordlyAfterTest(element);
});

QUnit.test('buffer length pushed to maxBufferLength', function (assert) {

    const element = document.querySelector('body');

    const bufferLength = 5;
    const sequence = window.chordly.literalStringToSequence('a');
    const data = element.pushToChordly({
        maxBufferLength: bufferLength
    });
    let i;

    assert.equal(data.sequenceBuffer.length, 0, 'buffer starts at 0 size');

    for (i = 0; i < bufferLength + 5; i++) {
        element.pushToChordly('pushSequence', sequence);
    }

    assert.equal(data.sequenceBuffer.length, bufferLength, 'buffer equal to max length');
    removeChordlyAfterTest(element);
});

QUnit.test('option clearBufferOnMatch true', function (assert) {

    const element = document.querySelector('body');

    const data = element.pushToChordly({
        clearBufferOnMatch: true
    });
    const sequence = window.chordly.literalStringToSequence('dog');
    const sequenceMapping = {
        sequence: sequence,
    };

    element.pushToChordly('bind', sequenceMapping);
    element.pushToChordly('pushSequenceAndAct', sequence);

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer empty');
    removeChordlyAfterTest(element);
});

QUnit.test('option clearBufferOnMatch false', function (assert) {

    const element = document.querySelector('body');

    const data = element.pushToChordly({
        clearBufferOnMatch: false
    });
    const sequence = window.chordly.literalStringToSequence('dog');
    const sequenceMapping = {
        sequence: sequence,
    };

    element.pushToChordly('bind', sequenceMapping);
    element.pushToChordly('pushSequenceAndAct', sequence);

    assert.equal(data.sequenceBuffer.length, 3, 'sequence buffer not empty');
    removeChordlyAfterTest(element);
});

QUnit.test('option capture shift true', function (assert) {

    const element = document.querySelector('body');

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    const data = element.pushToChordly({
        keyEvent: eventName,
        captureShift: true
    });
    const sequenceBuffer = data.sequenceBuffer;
    const keyCode = window.chordly.scanCodeMap.Shift;
    const shiftState = true;
    const altState = false;
    const ctrlState = false;
    const sequencePart = window.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    event.which = keyCode;
    event.shiftKey = shiftState;
    event.altKey = altState;
    event.ctrlKey = ctrlState;

    element.dispatchEvent(event);

    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds shift to buffer');
    removeChordlyAfterTest(element);
});

QUnit.test('option capture shift false', function (assert) {

    const element = document.querySelector('body');

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    const data = element.pushToChordly({
        keyEvent: eventName,
        captureShift: false
    });
    const sequenceBuffer = data.sequenceBuffer;
    const keyCode = window.chordly.scanCodeMap.Shift;
    const shiftState = true;
    const altState = false;
    const ctrlState = false;


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    event.which = keyCode;
    event.shiftKey = shiftState;
    event.altKey = altState;
    event.ctrlKey = ctrlState;

    element.dispatchEvent(event);

    assert.equal(sequenceBuffer.length, 0, 'key event does not add shift to buffer');
    removeChordlyAfterTest(element);
});

QUnit.test('option capture ctrl true', function (assert) {

    const element = document.querySelector('body');

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    const data = element.pushToChordly({
        keyEvent: eventName,
        captureCtrl: true
    });
    const sequenceBuffer = data.sequenceBuffer;
    const keyCode = window.chordly.scanCodeMap.Control;
    const shiftState = false;
    const altState = false;
    const ctrlState = true;
    const sequencePart = window.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    event.which = keyCode;
    event.shiftKey = shiftState;
    event.altKey = altState;
    event.ctrlKey = ctrlState;

    element.dispatchEvent(event);

    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds ctrl to buffer');
    removeChordlyAfterTest(element);
});

QUnit.test('option capture ctrl false', function (assert) {

    const element = document.querySelector('body');

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    const data = element.pushToChordly({
        keyEvent: eventName,
        captureCtrl: false
    });
    const sequenceBuffer = data.sequenceBuffer;
    const keyCode = window.chordly.scanCodeMap.Control;
    const shiftState = false;
    const altState = false;
    const ctrlState = true;

    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    event.which = keyCode;
    event.shiftKey = shiftState;
    event.altKey = altState;
    event.ctrlKey = ctrlState;

    element.dispatchEvent(event);

    assert.equal(sequenceBuffer.length, 0, 'key event does not add ctrl to buffer');
    removeChordlyAfterTest(element);
});

QUnit.test('option capture alt true', function (assert) {

    const element = document.querySelector('body');

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    const data = element.pushToChordly({
        keyEvent: eventName,
        captureAlt: true
    });
    const sequenceBuffer = data.sequenceBuffer;
    const keyCode = window.chordly.scanCodeMap.Alt;
    const shiftState = false;
    const altState = true;
    const ctrlState = false;
    const sequencePart = window.chordly.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    event.which = keyCode;
    event.shiftKey = shiftState;
    event.altKey = altState;
    event.ctrlKey = ctrlState;

    element.dispatchEvent(event);

    assert.deepEqual(sequenceBuffer[0], sequencePart, 'key event adds alt to buffer');
    removeChordlyAfterTest(element);
});

QUnit.test('option capture alt false', function (assert) {

    const element = document.querySelector('body');

    const eventName = 'custom_key_event';
    const event = new Event(eventName);
    const data = element.pushToChordly({
        keyEvent: eventName,
        captureAlt: false
    });
    const sequenceBuffer = data.sequenceBuffer;
    const keyCode = window.chordly.scanCodeMap.Alt;
    const shiftState = false;
    const altState = true;
    const ctrlState = false;


    assert.equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    event.which = keyCode;
    event.shiftKey = shiftState;
    event.altKey = altState;
    event.ctrlKey = ctrlState;

    element.dispatchEvent(event);

    assert.equal(sequenceBuffer.length, 0, 'key event does not add alt to buffer');
    removeChordlyAfterTest(element);
});

QUnit.test('option ignoreFormElements false', function (assert) {

    const element = document.querySelector('body');

    const formElement = document.createElement("input");
    formElement.type = 'text';
    const eventName = 'custom_key_event';
    const event = new Event(eventName, {bubbles: true});
    const data = element.pushToChordly({
        keyEvent: eventName,
        ignoreFormElements: false
    });

    element.appendChild(formElement);

    event.which = window.chordly.scanCodeMap.D;
    event.shiftKey = false;
    event.altKey = false;
    event.ctrlKey = false;

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer is empty');
    formElement.dispatchEvent(event);
    assert.equal(data.sequenceBuffer.length, 1, 'sequence buffer has been pushed to');
    removeChordlyAfterTest(element);
});

QUnit.test('option ignoreFormElements true', function (assert) {

    const element = document.querySelector('body');

    const formElement = document.createElement("input");
    formElement.type = 'text';
    const eventName = 'custom_key_event';
    const event = new Event(eventName,  { bubbles: true });
    const data = element.pushToChordly({
        keyEvent: eventName,
        ignoreFormElements: true
    });

    element.append(formElement);

    event.which = window.chordly.scanCodeMap.D;
    event.shiftKey = false;
    event.altKey = false;
    event.ctrlKey = false;

    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer is empty');
    formElement.dispatchEvent(event);
    assert.equal(data.sequenceBuffer.length, 0, 'sequence buffer has not been pushed to');
    removeChordlyAfterTest(element);
});

QUnit.test('literalStringToSequence throws error on unrecognized character', function (assert) {

    for (let i = 0; i <= 255; i++) {

        const charString = String.fromCharCode(i);
        if (!charString.match(/[A-Za-z0-9 ]/)) {

            assert.throws(
                function () {
                    window.chordly.literalStringToSequence(charString);
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
            window.chordly.literalStringToSequence(charString);
            assert.ok(true, "no raised error message on recognized character code " + i + " ('" + charString + "')");
        }
    }
});

QUnit.test('stringToSequence throws error on NaN keycode', function (assert) {
    assert.throws(
        function () {
            window.chordly.stringToSequence('[potato]');
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
                window.chordly.stringToSequence(charString);
            },
            "raised error message on keycode '" + charString + "'"
        );

    }
});

QUnit.test('stringToSequence does not throw error on valid keycode', function (assert) {

    for (let i = 0; i <= 255; i++) {
        const charString = "[" + i + "]";
        window.chordly.stringToSequence(charString);
        assert.ok(true, "no raised error message on recognized key code " + i + " ('" + charString + "')");
    }
});

QUnit.test('stringToSequence does not throw error on recognized sequence', function (assert) {

    for (let item in window.chordly.scanCodeMap) {

        window.chordly.stringToSequence(item + " shift+" + item + " ctrl+" + item + " alt+" + item + " shift+ctrl+alt+" + item);
        assert.ok(true, "no raised error message on recognized sequence '" + item + "'");
    }
});

QUnit.test('stringToSequence throws error on unrecognized sequence', function (assert) {

    assert.throws(
        function () {
            window.chordly.stringToSequence('Potato');
        }, "raised error message on unrecognized sequence"
    );
});


function removeChordlyAfterTest(htmlElement) {
    htmlElement.removeEventListener(htmlElement.chordlyInstance.keyEvent, htmlElement.chordlyInstance.eventCall)
    htmlElement.chordlyInstance = undefined;
    htmlElement.classList.remove('chordly');
}
