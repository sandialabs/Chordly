/*
    jQuery Chord - A hot key jQuery plug-in
    ------------------------

    jQuery Chord is a plug-in library for jQuery 1.3+ that may be used to detect and act upon key
    sequences entered by a user.

    Chord may be attached to any DOM node in order to listen for sequences of key activity within 
    that node and those nested within.

    Usage:

        $('#adiv').chord(options);

    Options:
        options may contain the following, otherwise defaults are used
        
        captureShift    (bool)    [false]
            Treat shift as a key press.
        
        captureAlt  (bool)  [false]
            Treat alt as a key press.
        
        captureCtrl (bool)  [false]
            Treat control as a key press.

        ignoreFormElements  (bool)  [true]
            Ignore key presses within form elements

        keyEvent    (string)    ['keyup']
            the key event that triggers listening. other option is keydown (or any event that 
            stores the key code (not ASCII char code) within the 'which' var of the event)

        maxBufferLength (int)   [5]
            the length of the key buffer. Note that the buffer will be auto expanded in order to
            maintain at minimum the length of the longest sequence to be detected. Modifying this
            allows for a greater depth of key press history to be kept if desired

        clearBufferOnMatch (bool)   [true]
            determines if the key buffer should be cleared on a match

        paused (bool)  [false]
            determines if chord on the element should start paused (not collecting key)

	    bufferTimeoutMs (int) [0]
	        timeout length for key buffer clearing in ms (value of <1 means no timeout)

        greedyTimeoutMs (int) [0]
            timeout length since last recording of a key press before executing a match event. This is reset by next key press. (value of <1 means no greedy matching)

        sequenceMap (object array)  [empty array]
            an array of objects defining sequence mapping. Defaults to an empty array. Mapping 
            object may have the following attributes

                {
                    sequence    -   a sequence, array of sequences, or array of sequence parts
                                    to create a sequence from a string use 
                                        $.chord.literalStringToSequence(str) 
                                    or to create a part use
                                        $.chord.makeSequencePart(keyCode, shift, alt, ctrl)

                    matched  -   optional function that will be called on sequence completion
                        
                    lookup  -   optional lookup code that will be passed to the custom 'chordMatch'
                                event on sequence completion

                }

        Example:

        $('#adiv').chord(
                    {
                        captureShift: false,
                        captureAlt: false,
                        captureCtrl: false,
                        ignoreFormElements: true,
                        keyEvent: 'keyup',
                        maxBufferLength: 5,
                        clearBufferOnMatch: true,
                        paused: false,
                        sequenceMap:
                            [
                                {
                                    sequence: $.chord.literalStringToSequence('cat'),
                                    matched: function () { console.log('meow!') }
                                    lookup: 'cat call'
                                },
                                {
                                    sequence: [
                                        $.chord.StringToSequence('[68] [79] [71]'),
                                        $.chord.literalStringToSequence('puppy')
                                    ],
                                    matched: function () { console.log('bark!') }
                                },
                                {
                                    sequence: [
                                        $.chord.makeSequencePart($.chord.scanCodeMap.P),
                                        $.chord.makeSequencePart($.chord.scanCodeMap.I),
                                        $.chord.makeSequencePart($.chord.scanCodeMap.G),
                                    ],
                                    matched: function () { console.log('oink!') }	
                            ]
                    });
    
    Methods:
        clearSequenceBuffer -   clear the sequence buffer, effectively resetting the memory of 
                                previously pressed keys
                                $('#adiv').chord('clearSequenceBuffer')

        destroy -   destroy the chord instance unbinding events and removing data from element
                    $('#adiv').chord('destroy')

        pause   -   pause the chord instance
                    $('#adiv').chord('pause')

        resume  -   resume the chord instance
                    $('#adiv').chord('resume')

        togglePause -   pause/resume chord instance if was unpaused/paused
                        $('#adiv').chord('togglePause')

        bind(args)  -   bind new sequence(s)
                    -   args[0] array of sequence/lookup/matched objects to add to the sequenceMap
                        $('#adiv').chord('bind', {
                            sequence: $.chord.literalStringToSequence('mouse'),
                            matched: function () { console.log('squeak!') }
                        });

        unbind(args)    -   unbind each occurrence of a sequence 
                            args[0] the sequence to unbind

                            $('#adiv').chord('unbind', $.chord.literalStringToSequence('mouse'));

                        
        actOnBuffer   - act on data in buffer as if a listen event has occurred
                        $('#adiv').chord('actOnBuffer')

        pushSequence(args)   -   push a sequence onto the buffer. Note that this will not cause a 
                            listen to be fired. You must call actOnBuffer if a reaction is desired.
                            To push and act on buffer call pushSequenceAndAct
                            args[0] -   sequence to push (array of sequence parts)
                            
                            $('#adiv').chord('pushSequence', $.chord.literalStringToSequence('dog'))

        pushSequenceAndActOnBuffer(args)   -   push a sequence onto the buffer and act upon it
                            args[0] -   sequence to push (array of sequence parts)
                            
                            $('#adiv').chord('pushSequenceAndAct', $.chord.literalStringToSequence('dog'))

    Events:
        chord also makes available a custom 'chordMatch' event.
        This event object will contain the following NEW properties
        ability to execute a function with parameters 
            originalEvent   -   the original triggering event event
            lookup      -   the lookup as defined in the sequence map
            sequence    -   the sequence that triggered the event
            sequenceString  -   the triggering sequence as a string

            $('#adiv').on('chordMatch', function (e) {
                    console.log('chordMatch event:');
                    console.log('\t event:', e);
                    console.log('\t lookup:', e.lookup);
                    console.log('\t sequence:', e.sequence);
                    console.log('\t sequenceString:', e.sequenceString);
                    console.log('\t originalEvent:', e.originalEvent);
            });

*/
;(function ($, window, document, undefined) {

    "use strict";

    var optionDefaults = {

            captureShift: false, // don't treat shift as a individual key press
            captureAlt: false, // don't treat alt as a individual  key press
            captureCtrl: false, // don't treat ctrl as a individual key press

            ignoreFormElements: true, // don't capture key events on form elements

            keyEvent: 'keyup', // event(s) to trigger the hot key check

            maxBufferLength: 5, // default buffer length

            clearBufferOnMatch: true, // clear buffer on match

            sequenceMap: [], // mapping of sequences

            paused: false, // true key listening is paused

            bufferTimeoutMs: 0,	// timeout length for key buffer clearing (value of 0 means no timeout)

            greedyTimeoutMs: 0  /// timeout length since last recording of a key press before executing a match event (reset by next key press)
        },
        identifiedBrowser = (navigator.userAgent.indexOf('Opera') !== -1
            ? 'Opera'
            : navigator.userAgent.indexOf('Firefox') !== -1
                ? 'Firefox'
                : navigator.userAgent.indexOf('Chrome') !== -1
                    ? 'Chrome'
                    : navigator.userAgent.indexOf('MSIE') !== -1
                        ? 'IE'
                        : 'Unknown'),

        privateScanCodeMap = {
            // based on http://unixpapa.com/js/key.html

            Shift: 16,
            Control: 17,
            Alt: 19,

            0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57,

            // DANGER!!! Opera treats keypad scan codes differently than IE/Chrome/Firefox
            Kpd0: (identifiedBrowser !== 'Opera' ? 96 : 48),
            Kpd1: (identifiedBrowser !== 'Opera' ? 97 : 49),
            Kpd2: (identifiedBrowser !== 'Opera' ? 98 : 50),
            Kpd3: (identifiedBrowser !== 'Opera' ? 99 : 51),
            Kpd4: (identifiedBrowser !== 'Opera' ? 100 : 52),
            Kpd5: (identifiedBrowser !== 'Opera' ? 101 : 53),
            Kpd6: (identifiedBrowser !== 'Opera' ? 102 : 54),
            Kpd7: (identifiedBrowser !== 'Opera' ? 103 : 55),
            Kpd8: (identifiedBrowser !== 'Opera' ? 104 : 56),
            Kpd9: (identifiedBrowser !== 'Opera' ? 105 : 57),
            KpdAstrik: (identifiedBrowser !== 'Opera' ? 106 : 42),
            KpdPlus: (identifiedBrowser !== 'Opera' ? 107 : 43),
            KpdDash: (identifiedBrowser !== 'Opera' ? 109 : 45),
            KpdPeriod: (identifiedBrowser !== 'Opera' ? 110 : 78),
            KpdForwardSlash: (identifiedBrowser !== 'Opera' ? 111 : 47),
            KpdAlt5: 12, // character code on the number pad w/o num lock in place of 5
            KpdAltEnter: 13, // character code on the number pad w/o num lock in place of Enter

            A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76,
            M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88,
            Y: 89, Z: 90,

            // DANGER!!! these scan codes may be different outside of IE/Chrome/Opera
            SemiColon: (identifiedBrowser === 'Firefox' || identifiedBrowser === 'Opera') ? 59 : 186,
            Equals: (identifiedBrowser === 'Firefox' || identifiedBrowser === 'Opera') ? 61 : 187,
            Comma: (identifiedBrowser === 'Opera' ? 44 : 188),
            Dash: (identifiedBrowser === 'Firefox') ? 109 : (identifiedBrowser === 'Opera' ? 45 : 189),
            Period: (identifiedBrowser === 'Opera' ? 46 : 190),
            ForwardSlash: (identifiedBrowser === 'Opera' ? 47 : 191),
            Tick: (identifiedBrowser === 'Opera' ? 96 : 192),
            OpenBracket: (identifiedBrowser === 'Opera' ? 91 : 219),
            BackSlash: (identifiedBrowser === 'Opera' ? 92 : 220),
            CloseBracket: (identifiedBrowser === 'Opera' ? 93 : 221),
            SingleQuote: (identifiedBrowser === 'Opera' ? 39 : 222),

            BkSpace: 8,
            Tab: 9,
            Enter: 13,
            Esc: 27,
            Space: 32,

            Insert: 45,
            Delete: 46,
            Home: 36,
            End: 35,
            PageUp: 33,
            PageDown: 34,

            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,

            CapsLock: 20,
            NumLock: 144,
            ScrollLock: 145,

            LeftArrow: 37,
            UpArrow: 38,
            RightArrow: 39,
            DownArrow: 40
        };
    
    /*
    // invert an arbitrary map
    */
    function invertMapping(input) {

        var inversion = {};

        $.each(input, function (index, element) {
            inversion[element] = index;
        });

        return inversion;
    }


    /*
    //	Lookup tables and miscellaneous functions for interacting with chord
    */
    $.chord = {

        scanCodeMap: privateScanCodeMap,
        inverseScanCodeMap: invertMapping(privateScanCodeMap),

        /*
        // Make a sequence part (single atomic index of sequence) 
        //  keyCode:    the key code to check for
        //  [shift=null]:   the state of shift to check for (null ignores state)
        //  [alt=null]: the state of alt to check for (null ignores state)
        //  [ctrl=null]:    the state of ctrl to check for (null ignores state)
        */
        makeSequencePart: function (keyCode, shift, alt, ctrl) {
            return {
                keyCode: keyCode,
                shift: (shift === undefined) ? null : shift,
                alt: (alt === undefined) ? null : alt,
                ctrl: (ctrl === undefined) ? null : ctrl
            };
        },

        /*
        // test key equality between buffer part and sequence part
        //  null value of sequence part modifiers are unchecked
        //  keyBufferPart:  the portion of the key buffer to compare
        //  sequencePart:   the portion of the sequence to compare
        */
        keysEqual: function (keyBufferPart, sequencePart) {

            return keyBufferPart.keyCode === sequencePart.keyCode
                && (sequencePart.shift === null || keyBufferPart.shift === sequencePart.shift)
                && (sequencePart.alt === null || keyBufferPart.alt === sequencePart.alt)
                && (sequencePart.ctrl === null || keyBufferPart.ctrl === sequencePart.ctrl);
        },

        /*
        // Convert a literal string to a sequence definition
        //  can handle alpha numeric and space characters, all else are ignored
        //  numbers are assumed to be keyboard top row, not num pad
        //  input:  the string input to convert to a sequence
        */
        literalStringToSequence: function (input) {

            var sequence = [],
                keyCode,
                c,
                i;

            input = input.toLowerCase();    // TRIVIA: for the sake of normalization this was a toUpperCase but apparently "ß" (char 223) becomes "SS" under that conversion. Hence the seemingly meaningless but crucial toLower case followed by toUpperCase of individual chars

            for (i = 0; i < input.length; i++) {

                c = input.charAt(i);

                if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
                    keyCode = $.chord.scanCodeMap[c.toString().toUpperCase()];
                } else if (c === ' ') {
                    keyCode = $.chord.scanCodeMap.Space;
                } else {
                    throw "Encountered unrecognized character '" + c + "' (char code:" + c.charCodeAt(0) + ")  in literal string sequence '" + input + "' at index " + i + "; Literal string to a sequence must be alpha numeric or space.";
                }

                sequence.push($.chord.makeSequencePart(keyCode));
            }

            return sequence;
        },

        /*
        // Convert a string of a specific format to a sequence
        //  input:  the string input to convert to a sequence
        //      format is whitespace delimited keys (from $.chord.KeyCodeMap) or square bracket
        //      surrounded scan code prefixed with optional modifiers followed plus sign
        //      e.g.: '!shift+A ctrl+shift+Q' or 'L' or '[76]' or 'shift+[76]' or 'UpArrow alt+Space'
        //
        //      modifier (alt/shift/ctrl) state is ignored unless explicitly specified. Duplicate
        //      modifiers are ignored. If on state is desired apply modifier itself, if off state 
        //      is desired prefix modifier with a bang (i.e. '!') character. The negation of a 
        //      modifier overwrites explicit inclusion of redundant modifiers.
        */
        stringToSequence: function (input) {

            var sequence = [];

            var keyStrings = input.split(/\s+/); // split string on whitespace

            for (var i = 0; i < keyStrings.length; i++) {

                var keyString = keyStrings[i];

                // negative modifier overrides positive inclusion
                var shift = keyString.indexOf('!shift') === -1 ? keyString.indexOf('shift') === -1 ? null : true : false;
                var alt = keyString.indexOf('!alt') === -1 ? keyString.indexOf('alt') === -1 ? null : true : false;
                var ctrl = keyString.indexOf('!ctrl') === -1 ? keyString.indexOf('ctrl') === -1 ? null : true : false;

                var key = keyString.replace(/^((!?shift\+)|(!?alt\+)|(!?ctrl\+))*/, '');

                var keyCode;

                if (key.indexOf('[') !== -1 && key.indexOf(']') !== -1) { // explicit key code
                                        
                    keyCode = parseInt(key.substr(1, key.length - 2), 10);  // remove first and last characters
                    
                    if (isNaN(keyCode)) {
                        throw "Encountered unrecognized keycode '" + key + "' in string sequence '" + input + "' at index " + i + ".";
                    } else if(keyCode <0 || keyCode>255) {
                        throw "Encountered out of range keycode '" + key + "' in string sequence '" + input + "' at index " + i + ". Keycode must be between 0 and 255.";
                    }

                } else {
                    keyCode = $.chord.scanCodeMap[key];

                    if (keyCode === undefined) {
                        throw "Encountered unrecognized sequence element '" + key + "' in string sequence '" + input + "' at index " + i + ". See $.chord.scanCodeMap for valid sequence elements";
                    }

                }

                sequence.push($.chord.makeSequencePart(keyCode, shift, alt, ctrl));
            }

            return sequence;

        },

        /*
        // Convert a sequence into a user readable string. Inversion of the stringToSequence method
        //  input:  the sequence to convert into a string
        */
        sequenceToString: function (sequence) {

            var keyStr = [];

            $.each(sequence, function (index, key) {

                var keySymbol = $.chord.inverseScanCodeMap[key.keyCode];

                var str = (key.shift === null ? '' : (key.shift ? '' : '!') + 'shift+')
                    + (key.alt === null ? '' : (key.alt ? '' : '!') + 'alt+')
                    + (key.ctrl === null ? '' : (key.ctrl ? '' : '!') + 'ctrl+')
                    + (keySymbol === undefined ? ('[' + key.keyCode + ']') : keySymbol);

                keyStr.push(str);

            });

            return keyStr.join(' ');

        },

        /*
        // Flatten a sequence map (extract arrays of sequences into single sequences and mapping)
        //  the sequence map to flatten
        */
        flattenSequenceMap: function (sequenceMap) {

            var flatSequenceMap = [];

            $.each(sequenceMap, function (index, sequenceEntry) {

                var sequenceEntryArray;

                if (sequenceEntry.sequence.length > 0 && sequenceEntry.sequence[0] instanceof Array) {
                    sequenceEntryArray = sequenceEntry.sequence;
                } else {
                    sequenceEntryArray = [sequenceEntry.sequence];
                }

                $.each(sequenceEntryArray, function (index2, subEntry) {

                    var flatSequence = {
                        sequence: subEntry,
                        matched: sequenceEntry.matched,
                        lookup: sequenceEntry.lookup
                    };

                    flatSequenceMap.push(flatSequence);

                });
            });

            return flatSequenceMap;

        },

    };

    /*
    //  primary chord plug-in executor
    */
    $.fn.chord = function () {

        var option = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1, arguments.length);

        return this.each(function () {

            var $this = $(this),
                data = $this.data('chord'),
                options = (typeof option === 'object' && option);

            // chord is not defined on the associated element, define it
            if (!data) {
                data = new Chord(this, options);
                $this.data('chord', data);
                $this.addClass('chord');
            }

            // string was passed
            if (typeof option === 'string') {
                data[option](args);
            }

        });
    };

    /*
    // Chord constructor
    //  used for constructing hot key checking, or modifying options on an element
    //  element:    the element to affect with hot keys
    //  options:    the chord options
    */
    function Chord(element, options) {

        this.$element = $(element);
        this.options = $.extend({}, optionDefaults, options);
	this.bufferTimeout = null;

        // post processing
        this.options.sequenceMap = $.chord.flattenSequenceMap(this.options.sequenceMap); // flatten sequence map
        this._expandBufferLength();

        // initialize key sequence buffer as empty
        this.sequenceBuffer = [];

        // initialize and construct prototype
        this._init();
    }
    
    /*
    //  Chord prototype
    */
    Chord.prototype = {

        constructor: Chord,

        /*
        //  Initialize key event listening 
        */
        _init: function () {

            var $this = this,
                keyEvent = this.options.keyEvent,
                ignoreFormElements = this.options.ignoreFormElements;

            // function that is called on event trigger, explicitly defined so that it may be destroyed
            function eventCall(e) {

                // check of form element ignoring 
                if (!(ignoreFormElements && ['button', 'checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'textarea', 'time', 'url', 'week'].indexOf(e.target.type) !== -1)) {
                    $this._listen(e);
                }

            }

            this.$element.bind(keyEvent, eventCall);

            return this.$element;

        },

        /*
        //  called on key event, listen for appropriate key presses and keep history if appropriate
        */
        _listen: function (e) {

            if (this.options.paused) { // don't do anything if paused
                return;
            }

            var act = this._pushSequencePartFromEvent(e); // get key info from event and push to history
            
            if (act) {

                // clear greedy timeout (if set)
                if (this.greedyTimeout != null) {
                    clearTimeout(this.greedyTimeout);
                }

                // deal with greedy by setting timer
                if (this.options.greedyTimeoutMs > 0) {

                    var $this = this;
                    this.greedyTimeout = setTimeout(function () {
                        $this.actOnBuffer(e); // check for matches and act
                    }, this.options.greedyTimeoutMs);

                } else { // non-greedy

                    this.actOnBuffer(e); // check for matches and act
                }
                                
            }
        },

        /*
        //  capture key press (as sequence part) from an event with a 'which' property
        */
        _pushSequencePartFromEvent: function (e) {

            var keyCode = e.which,
                sequencePart = $.chord.makeSequencePart(keyCode, e.shiftKey, e.altKey, e.ctrlKey);

            // if modifier keys aren't to be trapped simply ignore and return
            if ((!this.options.captureShift && keyCode === $.chord.scanCodeMap.Shift)
                || (!this.options.captureAlt && keyCode === $.chord.scanCodeMap.Alt)
                || (!this.options.captureCtrl && keyCode === $.chord.scanCodeMap.Control)) {
                return false;
            }

            this._pushSequencePart(sequencePart);

            return true;
        },

        /*
        // Push a sequence part to the buffer
        //  sequencePart    -   sequence part to be pushed
        */
        _pushSequencePart: function (sequencePart) {

            // prevent buffer over run
            if (this.sequenceBuffer.length > this.options.maxBufferLength - 1) {
                this.sequenceBuffer.splice(0, 1);
            }

            this.sequenceBuffer.push(sequencePart);

    	    // clear timeout (if set) so that buffer will not be cleared
	        if(this.bufferTimeout != null) {
    	        clearTimeout(this.bufferTimeout);
	        }

	        // create new time out to clear buffer
	        if(this.options.bufferTimeoutMs > 0) {
	            var $this = this;
    	    	this.bufferTimeout = setTimeout( function() {
    	    	    $this.clearSequenceBuffer();
    	    	}, this.options.bufferTimeoutMs);
	        }

        },

        /*
        // match sequence parts on the buffer
        //  sequence:   the sequence to match
        */
        _sequenceMatch: function (sequence) {

            var sequenceLength = sequence.length,
                keyBufferLength = this.sequenceBuffer.length,
                keyBufferSubSequence,
                i;

            if (sequenceLength > keyBufferLength) { // sequence longer than buffer
                return false;
            }

            keyBufferSubSequence = this.sequenceBuffer.slice(keyBufferLength - sequenceLength);

            for (i = 0; i < sequenceLength; i++) {
                if (!$.chord.keysEqual(keyBufferSubSequence[i], sequence[i])) {
                    return false;
                }
            }

            return true;
        },

        /*
        //  expand the buffer length as appropriate in order to be at minimum the size of the 
        //  the longest registered sequence
        */
        _expandBufferLength: function () {

            var maxLen = 0;

            $.each(this.options.sequenceMap, function (index, item) {
                if (item.sequence.length > maxLen) {
                    maxLen = item.sequence.length;
                }
            });

            // increase buffer size if too small
            if (this.options.maxBufferLength < maxLen) {
                this.options.maxBufferLength = maxLen;
            }

        },

        /*
        //  clear the sequence buffer, effectively resetting the memory or previously pressed keys
        */
        clearSequenceBuffer: function () {
            this.sequenceBuffer = [];
        },

        /*
        //	check buffer for matches
        //	on the match trigger a chord match listener, and clear buffer if appropriate
        */
        actOnBuffer: function (e) {

            var $this = this,
                matchFound = false;

            $.each(this.options.sequenceMap, function (index, sequenceEntry) {

                var sequence = sequenceEntry.sequence;

                if ($this._sequenceMatch(sequence)) { // match found

                    if (typeof sequenceEntry.matched === 'function') { // if a function is to be called on match call it
                        sequenceEntry.matched.apply(e, [e]);
                    }

                    // Event triggering. Create new event and associate appropriate values to it
                    var chordMatchEvent = $.Event('chordMatch');
                    chordMatchEvent.originalEvent = e;
                    chordMatchEvent.lookup = sequenceEntry.lookup;
                    chordMatchEvent.sequence = sequence;
                    chordMatchEvent.sequenceString = $.chord.sequenceToString(sequence);

                    $this.$element.trigger(chordMatchEvent); // trigger event

                    matchFound = true;

                }
            });


            if (matchFound && $this.options.clearBufferOnMatch) { // clear buffer if appropriate
                $this.clearSequenceBuffer();
            }
        },

        /*
        // Pause listening
        */
        pause: function () {
            this.options.paused = true;
        },

        /*
        // resume listening
        */
        resume: function () {
            this.options.paused = false;
        },

        /*
        // toggle pause/resume
        */
        togglePause: function () {
            this.options.paused = !this.options.paused;
        },

        /*
        //  destroy chord
        */
        destroy: function () {
            this.$element.unbind(this.keyEvent, this.eventCall);
            this.$element.removeClass('chord');
            this.$element.removeData('chord');
        },

        /*
        //  bind new sequence(s)
        //  args[0] array of sequence/lookup/matched objects to add to the sequenceMap
        */
        bind: function (args) {

            var sequenceMap = this.options.sequenceMap,
                sequences = args[0] instanceof Array
                    ? $.chord.flattenSequenceMap(args[0])
                    : $.chord.flattenSequenceMap([args[0]]);

            $.each(sequences, function (index, sequence) {
                sequenceMap.push(sequence);
            });

            this._expandBufferLength(); // expand the buffer length if needed for the new sequence
        },

        /*
        // bind a literal sequence string to a matched method / lookup string
        //  arg[0]  string literal to be converted into a sequence
        //  arg[1]  [optional] matched callback method or lookup value
        //  arg[2]  [optional] lookup value (if arg[1] was a matched callback)
        */
        bindLiteralSequence: function (args) {

            this.bind([{
                sequence: $.chord.literalStringToSequence(args[0]),
                matched: typeof args[1] === 'function' ? args[1] : undefined,
                lookup: typeof args[1] === 'string' ? args[1] : args[2]
            }]);
        },

        /*
        // bind a sequence string to a matched method / lookup string
        //  arg[0]  string to be converted into a sequence
        //  arg[1]  [optional] matched callback method or lookup value
        //  arg[2]  [optional] lookup value (if arg[1] was a matched callback)
        */
        bindSequence: function (args) {

            this.bind([{
                sequence: $.chord.stringToSequence(args[0]),
                matched: typeof args[1] === 'function' ? args[1] : undefined,
                lookup: typeof args[1] === 'string' ? args[1] : args[2]
            }]);
        },

        /*
        // unbind each occurrence of a sequence
        //  args[0] -   the sequence to unbind
        */
        unbind: function (args) {

            var sequenceAsString = $.chord.sequenceToString(args[0]);

            // find sequences from end to start removing as they are encountered
            for (var i = this.options.sequenceMap.length - 1; i > -1; i--) {
                if (sequenceAsString === $.chord.sequenceToString(this.options.sequenceMap[i].sequence)) {
                    this.options.sequenceMap.splice(i, 1);
                }
            }

        },

        /*
        // Push a sequence to the buffer
        //  arg[0]  -   the sequence (array of sequence parts) to push
        */
        pushSequence: function (args) {

            var $this = this;

            $.each(args[0], function (index, sequencePart) {
                $this._pushSequencePart(sequencePart);
            });

        },

        /*
        // Push sequence to the buffer, and act
        //  arg[0]  -   the sequence (array of sequence parts) to push
        */
        pushSequenceAndAct: function (args) {
            this.pushSequence(args);
            this.actOnBuffer();
        },
            
    };


})(jQuery, window, document);
