
test('return element', function () {

    var element = $('<div>'),
        result = element.chord();

    deepEqual(result, element, 'result is initial element');

})

/*
    testing of $.chord
*/
module('contents of $.chord')

test('scanCodeMap has letters', function () {

    var charCodeA = 'A'.charCodeAt(0),
        charCode,
        letter,
        i;

    for (i = 0; i < 26; i++) {

        charCode = i + charCodeA;
        letter = String.fromCharCode(charCode);
        
        equal($.chord.scanCodeMap[letter], charCode, letter + ' has scan code of ' + charCode);
    }

});

test('scanCodeMap has numbers', function () {

    var charCodeA = '0'.charCodeAt(0),
        charCode,
        number,
        i;

    for (i = 0; i < 10; i++) {

        charCode = i + charCodeA;
        number = String.fromCharCode(charCode);

        equal($.chord.scanCodeMap[number], charCode, number + ' has scan code of ' + charCode);
    }

});


test('inverseScanCodeMap', function () {

    function invertMapping(input) {

        var inversion = {},
            key;

        for (key in input) {
            inversion[input[key]] = key;
        }

        return inversion;
    }
    
    deepEqual($.chord.inverseScanCodeMap, invertMapping($.chord.scanCodeMap), 'inverseScanCodeMap is inversion of scan code map');
});

test('version present', function () {
    ok(!$.chord.version !== undefined, 'version defined');
    ok(!$.chord.version !== null, 'version not null');
});

test('identifiedBrowser present', function () {
    ok(!$.chord.identifiedBrowser !== undefined, 'identifiedBrowser defined');
    ok(!$.chord.identifiedBrowser !== null, 'identifiedBrowser not null');
});

// test makeSequencePart
test('makeSequencePart assign true values', function () {

    var keyCode = 42,
        shift = true,
        alt = true,
        ctrl = true,
        sequencePart = $.chord.makeSequencePart(keyCode, shift, alt, ctrl);

    equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    equal(sequencePart.shift, shift, 'shift assigned');
    equal(sequencePart.alt, alt, 'alt assigned');
    equal(sequencePart.ctrl, ctrl, 'ctrl assigned');

});

test('makeSequencePart assign false values', function () {

    var keyCode = 42,
        shift = false,
        alt = false,
        ctrl = false,
        sequencePart = $.chord.makeSequencePart(keyCode, shift, alt, ctrl);

    equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    equal(sequencePart.shift, shift, 'shift assigned');
    equal(sequencePart.alt, alt, 'alt assigned');
    equal(sequencePart.ctrl, ctrl, 'ctrl assigned');

});

test('makeSequencePart default values are null', function () {

    var keyCode = 42,
        sequencePart = $.chord.makeSequencePart(keyCode);

    equal(sequencePart.keyCode, keyCode, 'keyCode assigned');
    equal(sequencePart.shift, null, 'shift defaulted to null');
    equal(sequencePart.alt, null, 'alt defaulted to null');
    equal(sequencePart.ctrl, null, 'ctrl defaulted to null');

});

// test keysEqual
test('keysEqual', function () {

    ok($.chord.keysEqual($.chord.makeSequencePart(5, null, null, null), $.chord.makeSequencePart(5, null, null, null)), 'same scan code equal');
    ok(!$.chord.keysEqual($.chord.makeSequencePart(5, null, null, null), $.chord.makeSequencePart(2, null, null, null)), 'different scan code equal');

    ok($.chord.keysEqual($.chord.makeSequencePart(5, true, null, null), $.chord.makeSequencePart(5, true, null, null)), 'true shift modifier equal');
    ok($.chord.keysEqual($.chord.makeSequencePart(5, false, null, null), $.chord.makeSequencePart(5, false, null, null)), 'false shift modifier equal');
    ok(!$.chord.keysEqual($.chord.makeSequencePart(5, true, null, null), $.chord.makeSequencePart(5, false, null, null)), 'different shift modifier not equal');

    ok($.chord.keysEqual($.chord.makeSequencePart(5, true, true, null), $.chord.makeSequencePart(5, true, true, null)), 'true alt modifier equal');
    ok($.chord.keysEqual($.chord.makeSequencePart(5, true, false, null), $.chord.makeSequencePart(5, true, false, null)), 'false alt modifier equal');
    ok(!$.chord.keysEqual($.chord.makeSequencePart(5, true, true, null), $.chord.makeSequencePart(5, true, false, null)), 'different alt modifier not equal');

    ok($.chord.keysEqual($.chord.makeSequencePart(5, true, true, true), $.chord.makeSequencePart(5, true, true, true)), 'true ctrl modifier equal');
    ok($.chord.keysEqual($.chord.makeSequencePart(5, true, true, false), $.chord.makeSequencePart(5, true, true, false)), 'false ctrl modifier equal');
    ok(!$.chord.keysEqual($.chord.makeSequencePart(5, true, true, true), $.chord.makeSequencePart(5, true, true, false)), 'different ctrl modifier not equal');

    ok($.chord.keysEqual($.chord.makeSequencePart(5, true, true, true), $.chord.makeSequencePart(5, null, null, null)), 'null sequence modifier ignored in compare of true');
    ok($.chord.keysEqual($.chord.makeSequencePart(5, false, false, false), $.chord.makeSequencePart(5, null, null, null)), 'null sequence modifier ignored in compare of false');
    ok($.chord.keysEqual($.chord.makeSequencePart(5), $.chord.makeSequencePart(5)), 'modifiers defaulted to null');

});

// test literalStringToSequence
test('literalStringToSequence Empty Input', function () {

    var input = '',
        result = $.chord.literalStringToSequence(input);

    equal(result.length, 0, 'sequence has expected 0 length');

});

test('literalStringToSequence Modifiers defaulted to null', function () {

    var input = 'abc 123',
        result = $.chord.literalStringToSequence(input);

    equal(result.length, 7, 'sequence has expected length of 7');

    for (var i = 0; i < result.length; i++) {
        equal(result[i].shift, null, 'sequence part ' + i + ' has null shift modifier');
        equal(result[i].alt, null, 'sequence part ' + i + ' has null alt modifier');
        equal(result[i].ctrl, null, 'sequence part ' + i + ' has null ctrl modifier');
    }
});

test('literalStringToSequence Lowercase AlphaNumericSpace input', function () {

    var input = 'abc 123',
        result = $.chord.literalStringToSequence(input);

    equal(result.length, 7, 'sequence has expected length of 7');

    equal(result[0].keyCode, $.chord.scanCodeMap.A, 'sequence part 0 assigned to scan code for A');
    equal(result[1].keyCode, $.chord.scanCodeMap.B, 'sequence part 0 assigned to scan code for B');
    equal(result[2].keyCode, $.chord.scanCodeMap.C, 'sequence part 0 assigned to scan code for C');

    equal(result[3].keyCode, $.chord.scanCodeMap.Space, 'sequence part 0 assigned to scan code for Space');

    equal(result[4].keyCode, $.chord.scanCodeMap[1], 'sequence part 0 assigned to scan code for 1');
    equal(result[5].keyCode, $.chord.scanCodeMap[2], 'sequence part 0 assigned to scan code for 2');
    equal(result[6].keyCode, $.chord.scanCodeMap[3], 'sequence part 0 assigned to scan code for 3');

});

test('literalStringToSequence Uppercase AlphaNumericSpace input', function () {

    var input = 'ABC 123',
        result = $.chord.literalStringToSequence(input);

    equal(result.length, 7, 'sequence has expected length of 7');

    equal(result[0].keyCode, $.chord.scanCodeMap.A, 'sequence part 0 assigned to scan code for A');
    equal(result[1].keyCode, $.chord.scanCodeMap.B, 'sequence part 0 assigned to scan code for B');
    equal(result[2].keyCode, $.chord.scanCodeMap.C, 'sequence part 0 assigned to scan code for C');

    equal(result[3].keyCode, $.chord.scanCodeMap.Space, 'sequence part 0 assigned to scan code for Space');

    equal(result[4].keyCode, $.chord.scanCodeMap[1], 'sequence part 0 assigned to scan code for 1');
    equal(result[5].keyCode, $.chord.scanCodeMap[2], 'sequence part 0 assigned to scan code for 2');
    equal(result[6].keyCode, $.chord.scanCodeMap[3], 'sequence part 0 assigned to scan code for 3');

});

// stringToSequence tests
test('stringToSequence Defaults to null modifiers', function () {

    var input = 'D O G [57]',
        result = $.chord.stringToSequence(input);

    equal(result.length, 4, 'expected sequence length');
    deepEqual(result, $.chord.literalStringToSequence('dog9'), 'sequence value as expected');

});

test('stringToSequence Positive modifiers assignable', function () {

    var input = 'shift+D alt+O ctrl+G shift+alt+ctrl+[42]',
        result = $.chord.stringToSequence(input),
        expectation = [
            $.chord.makeSequencePart($.chord.scanCodeMap['D'], true, null, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['O'], null, true, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['G'], null, null, true),
            $.chord.makeSequencePart(42, true, true, true),
        ];

    deepEqual(result, expectation, 'sequence value as expected');

});

test('stringToSequence Negative modifiers assignable', function () {

    var input = '!shift+D !alt+O !ctrl+G !shift+!alt+!ctrl+[42]',
        result = $.chord.stringToSequence(input),
        expectation = [
            $.chord.makeSequencePart($.chord.scanCodeMap['D'], false, null, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['O'], null, false, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['G'], null, null, false),
            $.chord.makeSequencePart(42, false, false, false),
        ];

    deepEqual(result, expectation, 'sequence value as expected');

});

test('stringToSequence negative modifiers overrides positive modifiers', function () {

    var input = '!shift+shift+D alt+!alt+O ctrl+!ctrl+G !shift+!alt+!ctrl+shift+alt+ctrl+[42]',
        result = $.chord.stringToSequence(input),
        expectation = [
            $.chord.makeSequencePart($.chord.scanCodeMap['D'], false, null, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['O'], null, false, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['G'], null, null, false),
            $.chord.makeSequencePart(42, false, false, false),
        ];

    deepEqual(result, expectation, 'sequence value as expected');

    equal(result.length, 4);

});

test('sequenceToString negative modifiers overrides positive modifiers', function () {

    var input = '!shift+shift+D alt+!alt+O ctrl+!ctrl+G !shift+!alt+!ctrl+shift+alt+ctrl+[42]',
        result = $.chord.stringToSequence(input),
        expectation = [
            $.chord.makeSequencePart($.chord.scanCodeMap['D'], false, null, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['O'], null, false, null),
            $.chord.makeSequencePart($.chord.scanCodeMap['G'], null, null, false),
            $.chord.makeSequencePart(42, false, false, false),
        ];

    deepEqual(result, expectation, 'sequence value as expected');

    equal(result.length, 4);

});

// Sequence to string
test('sequenceToString', function () {

    var inputString = '!shift+D alt+O !ctrl+G !shift+!alt+!ctrl+[42]',
        inputSequence = $.chord.stringToSequence(inputString),
        result = $.chord.sequenceToString(inputSequence);

    equal(result, inputString);

});

test('sequenceToString non modifier like scan codes', function () {

    deepEqual($.chord.stringToSequence('Shift'), [$.chord.makeSequencePart($.chord.scanCodeMap['Shift'])], 'Shift interpreted and scan code, not modifier');
    deepEqual($.chord.stringToSequence('Alt'), [$.chord.makeSequencePart($.chord.scanCodeMap['Alt'])], 'Alt interpreted and scan code, not modifier');
    // ctrl is and control can not be confused
    
});

test('flattenSequenceMap', function () {

    var input = [
        {
            sequence: [$.chord.stringToSequence('A'), $.chord.stringToSequence('A')],
            matched: function () { return 'a';},
            lookup: 'lookup a'
        },
        {
            sequence: $.chord.stringToSequence('B'),
            matched: function () { return 'b'; },
            lookup: 'lookup b'
        },
        {
            sequence: [$.chord.stringToSequence('C')],
            matched: function () { return 'c'; },
            lookup: 'lookup c'
        }],
    	result = $.chord.flattenSequenceMap(input);

    equal(result.length, 4);

    deepEqual(result[0].sequence, $.chord.stringToSequence('A'));
    equal(result[0].matched.call(), 'a');
    equal(result[0].lookup, 'lookup a');

    deepEqual(result[1].sequence, $.chord.stringToSequence('A'));
    equal(result[1].matched.call(), 'a');
    equal(result[1].lookup, 'lookup a');

    deepEqual(result[2].sequence, $.chord.stringToSequence('B'));
    equal(result[2].matched.call(), 'b');
    equal(result[2].lookup, 'lookup b');

    deepEqual(result[3].sequence, $.chord.stringToSequence('C'));
    equal(result[3].matched.call(), 'c');
    equal(result[3].lookup, 'lookup c');

});

/*
    Chord prototyping test
*/
module('chord prototype')
test('chord creation', function () {
    
    var element = $('<div>');

    equal(element.data('chord'), undefined, 'no initial chord data');

    element.chord();

    ok(element.data('chord') !== undefined, 'chord data present');
    ok(element.hasClass('chord'), 'chord class added to element');
    ok(element.data('chord').options !== undefined, 'defaults set on creation');

});

test('chord creation overridden defaults options', function () {

    var element = $('<div>'),
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

            sequenceMap: [
                {
                sequence: $.chord.literalStringToSequence('dog'),
                lookup: "dog",
                matched: undefined
                }
            ],

            paused: true
        },
        data = element.chord(options).data('chord');

    deepEqual(element.data('chord').options, options, 'defaults overridden');

});

test('chord destroy', function () {

    var element = $('<div>');
    
    element.chord();
    element.chord('destroy');
    
    equal(element.data('chord'), undefined, 'no chord data');
    ok(!element.hasClass('chord'), 'chord class not on element');
    
});

test('can push to sequence buffer', function () {

    var element = $('<div>'),
        data = element.chord().data('chord'),
        sequence = $.chord.literalStringToSequence('dog');
    
    equal(data.sequenceBuffer.length, 0, 'sequence buffer starts at length 0');

    element.chord('pushSequence', sequence);

    deepEqual(data.sequenceBuffer, sequence, 'sequence buffer contains pushed sequence');

});

test('can clear sequence buffer', function () {

    var element = $('<div>'),
        data = element.chord().data('chord'),
        sequence = $.chord.literalStringToSequence('dog');

    element.chord('pushSequence', sequence);
    ok(data.sequenceBuffer.length > 0, 'sequence buffer contains data');

    element.chord('clearSequenceBuffer');
    ok(data.sequenceBuffer.length === 0, 'sequence buffer contains data');

});

test('can pause', function () {

    var element = $('<div>'),
        options = element.chord({ paused: false }).data('chord').options;
    
    equal(options.paused, false, 'starts in non-paused state');
    
    element.chord('pause')
    equal(options.paused, true, 'in paused state');

    element.chord('pause')
    equal(options.paused, true, 'stays in paused state');

});

test('can resume', function () {

    var element = $('<div>'),
        options = element.chord({ paused: true }).data('chord').options;

    equal(options.paused, true, 'starts in paused state');

    element.chord('resume')
    equal(options.paused, false, 'in non-paused state');

    element.chord('resume')
    equal(options.paused, false, 'stays in non-paused state');

});

test('can toggle pause', function () {

    var element = $('<div>'),
        options = element.chord({ paused: false }).data('chord').options;

    equal(options.paused, false, 'starts in non-paused state');

    element.chord('togglePause')
    equal(options.paused, true, 'in paused state');

    element.chord('togglePause')
    equal(options.paused, false, 'in non-paused state');

});

test('can bind new sequence', function () {

    var element = $('<div>'),
        sequenceMap = element.chord().data('chord').options.sequenceMap,
        sequenceMapping = {
            sequence: $.chord.literalStringToSequence('dog'),
            lookup: 'lookup',
            matched: undefined
        };

    equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.chord('bind', sequenceMapping);

    deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound');

})

test('can double bind new sequence', function () {

    var element = $('<div>'),
        sequenceMap = element.chord().data('chord').options.sequenceMap,
        sequenceMapping = {
            sequence: $.chord.literalStringToSequence('dog'),
            lookup: 'lookup',
            matched: undefined
        };

    equal(sequenceMap.length, 0, 'sequence map starts empty');

    element.chord('bind', sequenceMapping);
    element.chord('bind', sequenceMapping);

    deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound once');
    deepEqual(sequenceMap[1], sequenceMapping, 'sequence mapping bound twice');

})

test('can unbind sequence', function () {

    var element = $('<div>'),
        sequenceMap = element.chord().data('chord').options.sequenceMap,
        sequence1 = $.chord.literalStringToSequence('dog'),
        sequenceMapping1 = {
            sequence: sequence1,
            lookup: 'lookup1',
            matched: undefined
        },
        sequence2 = $.chord.literalStringToSequence('cat'),
        sequenceMapping2 = {
            sequence: sequence2,
            lookup: 'lookup2',
            matched: undefined
        };
        
    element.chord('bind', sequenceMapping1);
    element.chord('bind', sequenceMapping2);
    deepEqual(sequenceMap[0], sequenceMapping1, 'sequence mapping1 exists');
    deepEqual(sequenceMap[1], sequenceMapping2, 'sequence mapping2 exists');

    element.chord('unbind', sequence1);
    equal(sequenceMap.length, 1, 'sequence mapping unbound')
    deepEqual(sequenceMap[0], sequenceMapping2, 'previous mapping2 exists');

})

test('can unbind all matching sequences', function () {

    var element = $('<div>'),
        sequenceMap = element.chord().data('chord').options.sequenceMap,
        sequence = $.chord.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
            lookup: 'lookup',
            matched: undefined
        };

    equal(sequenceMap.length, 0, 'sequence map starts empty')

    element.chord('bind', sequenceMapping);
    element.chord('bind', sequenceMapping);

    deepEqual(sequenceMap[0], sequenceMapping, 'sequence mapping bound once');
    deepEqual(sequenceMap[1], sequenceMapping, 'sequence mapping bound twice');

    element.chord('unbind', sequence);

    equal(sequenceMap.length, 0, 'sequences unbound');

})

test('bind will flatten SequenceMap', function () {

    var element = $('<div>'),
        sequenceMapping = [
            {
                sequence: [$.chord.stringToSequence('A'), $.chord.stringToSequence('A')],
                matched: function () { return 'a'; },
                lookup: 'lookup a'
            },
            {
                sequence: $.chord.stringToSequence('B'),
                matched: function () { return 'b'; },
                lookup: 'lookup b'
            },
            {
                sequence: [$.chord.stringToSequence('C')],
                matched: function () { return 'c'; },
                lookup: 'lookup c'
            }],
        data = element.chord().data('chord').options.sequenceMap;

    element.chord('bind', sequenceMapping);
    deepEqual(element.chord().data('chord').options.sequenceMap, $.chord.flattenSequenceMap(sequenceMapping), 'bind flattened map');

});


test('construct option will flatten SequenceMap', function () {

    var element = $('<div>'),
        sequenceMapping = [
            {
                sequence: [$.chord.stringToSequence('A'), $.chord.stringToSequence('A')],
                matched: function () { return 'a'; },
                lookup: 'lookup a'
            },
            {
                sequence: $.chord.stringToSequence('B'),
                matched: function () { return 'b'; },
                lookup: 'lookup b'
            },
            {
                sequence: [$.chord.stringToSequence('C')],
                matched: function () { return 'c'; },
                lookup: 'lookup c'
            }],
        expectedResult = $.chord.flattenSequenceMap(sequenceMapping),
        data = element.chord({ sequenceMap: sequenceMapping }).data('chord').options.sequenceMap;
        
    deepEqual(element.chord().data('chord').options.sequenceMap, $.chord.flattenSequenceMap(sequenceMapping), 'options flattened map');

});

test('bindLiteralSequence lonely', function() {

    var element = $('<div>'),
        sequenceString = 'chicken',
        data = element.chord().data('chord'),
        sequenceMap = data.options.sequenceMap;
    
    element.chord('bindLiteralSequence', sequenceString);
        
    deepEqual(sequenceMap[0].sequence, $.chord.literalStringToSequence(sequenceString), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');
    
});

test('bindLiteralSequence matched', function () {
   
    var element = $('<div>'),
        sequenceString = 'chicken',
        matched = function () { return 'chicken matched'; },
        data = element.chord().data('chord'),
        sequenceMap = data.options.sequenceMap;

    element.chord('bindLiteralSequence', sequenceString, matched);

    deepEqual(sequenceMap[0].sequence, $.chord.literalStringToSequence(sequenceString, matched), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');
        
});

test('bindLiteralSequence lookup', function () {

    var element = $('<div>'),
        sequenceString = 'chicken',
        lookup = 'chicken lookup',
        data = element.chord().data('chord'),
        sequenceMap = data.options.sequenceMap;

    element.chord('bindLiteralSequence', sequenceString, lookup);

    deepEqual(sequenceMap[0].sequence, $.chord.literalStringToSequence(sequenceString, lookup), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

test('bindLiteralSequence matched lookup', function () {

    var element = $('<div>'),
        sequenceString = 'chicken',
        lookup = 'chicken lookup',
        matched = function () { return 'chicken matched'; },
        data = element.chord().data('chord'),
        sequenceMap = data.options.sequenceMap;

        element.chord('bindLiteralSequence', sequenceString, matched, lookup);

    deepEqual(sequenceMap[0].sequence, $.chord.literalStringToSequence(sequenceString, lookup), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

test('bindSequence lonely', function () {

    var element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        data = element.chord().data('chord'),
        sequenceMap = data.options.sequenceMap;

    element.chord('bindSequence', sequenceString);

    deepEqual(sequenceMap[0].sequence, $.chord.stringToSequence(sequenceString), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

});

test('bindSequence matched', function () {

    var element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        matched = function () { return 'dog matched'; },
    data = element.chord().data('chord'),
    sequenceMap = data.options.sequenceMap;

    element.chord('bindSequence', sequenceString, matched);

    deepEqual(sequenceMap[0].sequence, $.chord.stringToSequence(sequenceString, matched), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    deepEqual(sequenceMap[0].lookup, undefined, 'lookup undefined');

});

test('bindSequence lookup', function () {

    var element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        lookup = 'dog lookup',
        data = element.chord().data('chord'),
        sequenceMap = data.options.sequenceMap;

    element.chord('bindSequence', sequenceString, lookup);

    deepEqual(sequenceMap[0].sequence, $.chord.stringToSequence(sequenceString, lookup), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, undefined, 'matched undefined');
    deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

test('bindSequence matched lookup', function () {

    var element = $('<div>'),
        sequenceString = 'shift+D !alt+O ctrl+!shift+D',
        lookup = 'dog lookup',
        matched = function () { return 'dog matched'; },
    data = element.chord().data('chord'),
    sequenceMap = data.options.sequenceMap;

    element.chord('bindSequence', sequenceString, matched, lookup);

    deepEqual(sequenceMap[0].sequence, $.chord.stringToSequence(sequenceString, lookup), 'sequence assigned');
    deepEqual(sequenceMap[0].matched, matched, 'matched defined');
    deepEqual(sequenceMap[0].lookup, lookup, 'lookup defined');

});

asyncTest('pushSequenceAndAct', 2, function () {
    
    var element = $('<div>'),
        data = element.chord().data('chord'),
        sequence = $.chord.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
            matched: function () {
                ok(true, 'matched triggered');
                done()
            }
        },
        counter = 2;

    function done() { --counter || start(); }

    element.bind('chordMatch', function (e) {
        ok(true, 'custom event triggered');
        done()
    });
    
    element.chord('bind', sequenceMapping);
    element.chord('pushSequenceAndAct', sequence);
    
});

asyncTest('actOnBuffer', 2, function () {

    var element = $('<div>'),
        data = element.chord().data('chord'),
        sequence = $.chord.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
            matched: function () {
                ok(true, 'matched triggered');
                done()
            }
        },
        counter = 2;

    function done() { --counter || start(); }

    element.bind('chordMatch', function (e) {
        ok(true, 'custom event triggered');
        done()
    });

    element.chord('bind', sequenceMapping);
    element.chord('pushSequence', sequence);
    element.chord('actOnBuffer');

});


asyncTest('act on all matches of same sequence', 4, function () {

    var element = $('<div>'),
        data = element.chord().data('chord'),
        sequence = $.chord.literalStringToSequence('dog'),
        sequenceMapping1 = {
            sequence: sequence,
            matched: function () {
                ok(true, 'matched triggered A');
                done()
            }
        },
        sequenceMapping2 = {
            sequence: sequence,
            matched: function () {
                ok(true, 'matched triggered B');
                done()
            }
        },
        counter = 4;

    function done() { --counter || start(); }

    element.bind('chordMatch', function (e) {
        ok(true, 'custom event triggered');
        done()
    });

    element.chord('bind', sequenceMapping1);
    element.chord('bind', sequenceMapping2);
    element.chord('pushSequence', sequence);
    element.chord('actOnBuffer');

});

asyncTest('act on all matches of alternate sequences', 4, function () {

    var element = $('<div>'),
        data = element.chord().data('chord'),
        sequence1 = $.chord.literalStringToSequence('dog'),
        sequenceMapping1 = {
            sequence: sequence1,
            matched: function () {
                ok(true, 'matched triggered A');
                done()
            }
        },
        sequence2 = $.chord.literalStringToSequence('og'),
        sequenceMapping2 = {
            sequence: sequence2,
            matched: function () {
                ok(true, 'matched triggered B');
                done()
            }
        },
        counter = 4;

    function done() { --counter || start(); }

    element.bind('chordMatch', function (e) {
        ok(true, 'custom event triggered');
        done()
    });

    element.chord('bind', sequenceMapping1);
    element.chord('bind', sequenceMapping2);
    element.chord('pushSequence', sequence1);
    element.chord('actOnBuffer');

});

test('key event adds to buffer', function () {

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName}).data('chord'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = 42,
        shiftState = true,
        altState = true,
        ctrlState = true,
        sequencePart = $.chord.makeSequencePart(keyCode, shiftState, altState, ctrlState);

    
    equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);
    deepEqual(sequenceBuffer[0], sequencePart, 'key event adds to buffer');
    
});

asyncTest('key event acts', 2, function () {

    function done() { --counter || start(); }

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName }).data('chord'),
        sequence = $.chord.literalStringToSequence('d'),
        sequenceMapping = {
            sequence: sequence,
            matched: function () {
                ok(true, 'matched triggered');
                done()
            }
        },
        counter = 2

    element.bind('chordMatch', function (e) {
        ok(true, 'custom event triggered');
        done()
    });

    element.chord('bind', sequenceMapping);
    
    e.which = $.chord.scanCodeMap['D'];
    e.shiftKey = false;
    e.altKey = false;
    e.ctrlKey = false;
    element.trigger(e);

});


test('buffer length auto expands', function () {

    var element = $('<div>'),
        bufferLength = 1,
        sequenceString = 'this is a longer sequence',
        sequenceMapping = {
            sequence: $.chord.literalStringToSequence(sequenceString),
            lookup: 'lookup',
            matched: undefined
        },
        data = element.chord({ maxBufferLength: bufferLength, sequenceMap: [sequenceMapping] }).data('chord');
    
    equal(data.options.maxBufferLength, sequenceString.length, 'buffer stretched');

});

test('buffer length auto expands on bind', function () {
    
    var element = $('<div>'),
        bufferLength = 1,
        sequenceString = 'this is a longer sequence',
        data = element.chord({ maxBufferLength: bufferLength }).data('chord'),
        sequenceMapping = {
            sequence: $.chord.literalStringToSequence(sequenceString),
            lookup: 'lookup',
            matched: undefined
        };

        equal(data.options.maxBufferLength, bufferLength, 'buffer length as set');

        element.chord('bind', sequenceMapping);

        equal(data.options.maxBufferLength, sequenceString.length, 'buffer stretched');

});

test('buffer length pushed to maxBufferLength', function () {

    var element = $('<div>'),
        bufferLength = 5,
        sequence = $.chord.literalStringToSequence('a'),
        data = element.chord({ maxBufferLength: bufferLength }).data('chord'),
        i;
    
    equal(data.sequenceBuffer.length, 0, 'buffer starts at 0 size');

    for (i = 0; i < bufferLength + 5; i++) {
        element.chord('pushSequence', sequence);
    }

    equal(data.sequenceBuffer.length, bufferLength, 'buffer equal to max length');

});

test('option clearBufferOnMatch true', function () {

    var element = $('<div>'),
        data = element.chord({clearBufferOnMatch: true}).data('chord'),
        sequence = $.chord.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
        };
    
    element.chord('bind', sequenceMapping);
    element.chord('pushSequenceAndAct', sequence);

    equal(data.sequenceBuffer.length, 0, 'sequence buffer empty');

});

test('option clearBufferOnMatch false', function () {

    var element = $('<div>'),
        data = element.chord({ clearBufferOnMatch: false }).data('chord'),
        sequence = $.chord.literalStringToSequence('dog'),
        sequenceMapping = {
            sequence: sequence,
        };

    element.chord('bind', sequenceMapping);
    element.chord('pushSequenceAndAct', sequence);

    equal(data.sequenceBuffer.length, 3, 'sequence buffer not empty');

});

test('option capture shift true', function () {

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, captureShift: true }).data('chord'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chord.scanCodeMap.Shift,
        shiftState = true,
        altState = false,
        ctrlState = false,
        sequencePart = $.chord.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    deepEqual(sequenceBuffer[0], sequencePart, 'key event adds shift to buffer');

});

test('option capture shift false', function () {

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, captureShift: false }).data('chord'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chord.scanCodeMap.Shift,
        shiftState = true,
        altState = false,
        ctrlState = false,
        sequencePart = $.chord.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    equal(sequenceBuffer.length, 0, 'key event does not add shift to buffer');

});

test('option capture ctrl true', function () {

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, captureCtrl: true }).data('chord'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chord.scanCodeMap.Control,
        shiftState = false,
        altState = false,
        ctrlState = true,
        sequencePart = $.chord.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    deepEqual(sequenceBuffer[0], sequencePart, 'key event adds ctrl to buffer');

});

test('option capture ctrl false', function () {

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, captureCtrl: false }).data('chord'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chord.scanCodeMap.Control,
        shiftState = false,
        altState = false,
        ctrlState = true,
        sequencePart = $.chord.makeSequencePart(keyCode, shiftState, altState, ctrlState);

    equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    equal(sequenceBuffer.length, 0, 'key event does not add ctrl to buffer');

});

test('option capture alt true', function () {

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, captureAlt: true }).data('chord'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chord.scanCodeMap.Alt,
        shiftState = false,
        altState = true,
        ctrlState = false,
        sequencePart = $.chord.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    deepEqual(sequenceBuffer[0], sequencePart, 'key event adds alt to buffer');

});

test('option capture alt false', function () {

    var element = $('<div>'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, captureAlt: false }).data('chord'),
        sequenceBuffer = data.sequenceBuffer,
        keyCode = $.chord.scanCodeMap.Alt,
        shiftState = false,
        altState = true,
        ctrlState = false,
        sequencePart = $.chord.makeSequencePart(keyCode, shiftState, altState, ctrlState);


    equal(sequenceBuffer.length, 0, 'sequence buffer is empty');
    e.which = keyCode;
    e.shiftKey = shiftState;
    e.altKey = altState;
    e.ctrlKey = ctrlState;

    element.trigger(e);

    equal(sequenceBuffer.length, 0, 'key event does not add alt to buffer');

});

test('option ignoreFormElements false', function () {

    var element = $('<div>'),
        formElement = $('<input>').attr('type', 'text'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, ignoreFormElements: false }).data('chord');

    element.append(formElement);
        
    e.which = $.chord.scanCodeMap.D;
    e.shiftKey = false;
    e.altKey = false;
    e.ctrlKey = false;

    equal(data.sequenceBuffer.length, 0, 'sequence buffer is empty');
    formElement.trigger(e);
    equal(data.sequenceBuffer.length, 1, 'sequence buffer has been pushed to');
        
});

test('option ignoreFormElements true', function () {

    var element = $('<div>'),
        formElement = $('<input>').attr('type', 'text'),
        eventName = 'custom_key_event',
        e = $.Event(eventName),
        data = element.chord({ keyEvent: eventName, ignoreFormElements: true }).data('chord');

    element.append(formElement);

    e.which = $.chord.scanCodeMap.D;
    e.shiftKey = false;
    e.altKey = false;
    e.ctrlKey = false;

    equal(data.sequenceBuffer.length, 0, 'sequence buffer is empty');
    formElement.trigger(e);
    equal(data.sequenceBuffer.length, 0, 'sequence buffer has not been pushed to');

});

test('literalStringToSequence throws error on unrecognized character', function () {
        
    for (var i = 0; i <= 255; i++) {

        var charString = String.fromCharCode(i);
        if (!charString.match(/[A-Za-z0-9 ]/)) {

            throws(
                function () {
                    $.chord.literalStringToSequence(charString);
                },
                "raised error message on unrecognized character code " + i
            );
        }
    }

});

test('literalStringToSequence does not throw error on recognized character', function () {

    for (var i = 0; i <= 255; i++) {

        var charString = String.fromCharCode(i);

        if (charString.match(/[A-Za-z0-9 ]/)) {
            $.chord.literalStringToSequence(charString);
            ok( true, "no raised error message on recognized character code " + i + " ('" + charString + "')");
        }
    }

});

test('stringToSequence throws error on NaN keycode', function () {
    throws(
        function () {
            $.chord.stringToSequence('[potato]');
        },
        "raised error message on NaN keycode"
    );
});

test('stringToSequence throws error on invalid keycode', function () {

    for (var i = -10; i <= 265; i++) {

        if (i >= 0 && i <= 255) {
            continue;
        }

        var charString = "[" + i + "]";

        throws(
            function () {
                $.chord.stringToSequence(charString);
            },
            "raised error message on keycode '" + charString + "'"
        );

    }
});

test('stringToSequence does not throw error on valid keycode', function () {

    for (var i = 0; i <= 255; i++) {
        var charString = "[" + i + "]";
        $.chord.stringToSequence(charString);
        ok(true, "no raised error message on recognized key code " + i + " ('" + charString + "')");
    }
});

test('stringToSequence does not throw error on recognized sequence', function () {

    for (var item in $.chord.scanCodeMap) {

        $.chord.stringToSequence(item + " shift+" + item + " ctrl+" + item + " alt+" + item + " shift+ctrl+alt+" + item);
        ok(true, "no raised error message on recognized sequence '" + item + "'");
    }
    
});

test('stringToSequence throws error on unrecognized sequence', function () {

    throws(
        function () {
            $.chord.stringToSequence('Potato');
        },
        "raised error message on unrecognized sequence"
    );

});