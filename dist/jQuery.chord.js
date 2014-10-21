/* jQuery.chord 0.1.3 built 21-10-2014 */
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
(function(a, b, c, d) {
    "use strict";
    var e = {
        captureShift: false,
        // don't treat shift as a individual key press
        captureAlt: false,
        // don't treat alt as a individual  key press
        captureCtrl: false,
        // don't treat ctrl as a individual key press
        ignoreFormElements: true,
        // don't capture key events on form elements
        keyEvent: "keyup",
        // event(s) to trigger the hot key check
        maxBufferLength: 5,
        // default buffer length
        clearBufferOnMatch: true,
        // clear buffer on match
        sequenceMap: [],
        // mapping of sequences
        paused: false,
        // true key listening is paused
        bufferTimeoutMs: 0,
        // timeout length for key buffer clearing (value of 0 means no timeout)
        greedyTimeoutMs: 0
    }, f = navigator.userAgent.indexOf("Opera") !== -1 ? "Opera" : navigator.userAgent.indexOf("Firefox") !== -1 ? "Firefox" : navigator.userAgent.indexOf("Chrome") !== -1 ? "Chrome" : navigator.userAgent.indexOf("MSIE") !== -1 ? "IE" : "Unknown", g = {
        // based on http://unixpapa.com/js/key.html
        Shift: 16,
        Control: 17,
        Alt: 19,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        // DANGER!!! Opera treats keypad scan codes differently than IE/Chrome/Firefox
        Kpd0: f !== "Opera" ? 96 : 48,
        Kpd1: f !== "Opera" ? 97 : 49,
        Kpd2: f !== "Opera" ? 98 : 50,
        Kpd3: f !== "Opera" ? 99 : 51,
        Kpd4: f !== "Opera" ? 100 : 52,
        Kpd5: f !== "Opera" ? 101 : 53,
        Kpd6: f !== "Opera" ? 102 : 54,
        Kpd7: f !== "Opera" ? 103 : 55,
        Kpd8: f !== "Opera" ? 104 : 56,
        Kpd9: f !== "Opera" ? 105 : 57,
        KpdAstrik: f !== "Opera" ? 106 : 42,
        KpdPlus: f !== "Opera" ? 107 : 43,
        KpdDash: f !== "Opera" ? 109 : 45,
        KpdPeriod: f !== "Opera" ? 110 : 78,
        KpdForwardSlash: f !== "Opera" ? 111 : 47,
        KpdAlt5: 12,
        // character code on the number pad w/o num lock in place of 5
        KpdAltEnter: 13,
        // character code on the number pad w/o num lock in place of Enter
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        // DANGER!!! these scan codes may be different outside of IE/Chrome/Opera
        SemiColon: f === "Firefox" || f === "Opera" ? 59 : 186,
        Equals: f === "Firefox" || f === "Opera" ? 61 : 187,
        Comma: f === "Opera" ? 44 : 188,
        Dash: f === "Firefox" ? 109 : f === "Opera" ? 45 : 189,
        Period: f === "Opera" ? 46 : 190,
        ForwardSlash: f === "Opera" ? 47 : 191,
        Tick: f === "Opera" ? 96 : 192,
        OpenBracket: f === "Opera" ? 91 : 219,
        BackSlash: f === "Opera" ? 92 : 220,
        CloseBracket: f === "Opera" ? 93 : 221,
        SingleQuote: f === "Opera" ? 39 : 222,
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
    function h(b) {
        var c = {};
        a.each(b, function(a, b) {
            c[b] = a;
        });
        return c;
    }
    /*
    //	Lookup tables and miscellaneous functions for interacting with chord
    */
    a.chord = {
        scanCodeMap: g,
        inverseScanCodeMap: h(g),
        /*
        // Make a sequence part (single atomic index of sequence) 
        //  keyCode:    the key code to check for
        //  [shift=null]:   the state of shift to check for (null ignores state)
        //  [alt=null]: the state of alt to check for (null ignores state)
        //  [ctrl=null]:    the state of ctrl to check for (null ignores state)
        */
        makeSequencePart: function(a, b, c, e) {
            return {
                keyCode: a,
                shift: b === d ? null : b,
                alt: c === d ? null : c,
                ctrl: e === d ? null : e
            };
        },
        /*
        // test key equality between buffer part and sequence part
        //  null value of sequence part modifiers are unchecked
        //  keyBufferPart:  the portion of the key buffer to compare
        //  sequencePart:   the portion of the sequence to compare
        */
        keysEqual: function(a, b) {
            return a.keyCode === b.keyCode && (b.shift === null || a.shift === b.shift) && (b.alt === null || a.alt === b.alt) && (b.ctrl === null || a.ctrl === b.ctrl);
        },
        /*
        // Convert a literal string to a sequence definition
        //  can handle alpha numeric and space characters, all else are ignored
        //  numbers are assumed to be keyboard top row, not num pad
        //  input:  the string input to convert to a sequence
        */
        literalStringToSequence: function(b) {
            var c = [], d, e, f;
            b = b.toLowerCase();
            // TRIVIA: for the sake of normalization this was a toUpperCase but apparently char 223 (S Sharp/Eszett) becomes "SS" under that conversion. Hence the seemingly meaningless but crucial toLower case followed by toUpperCase of individual chars
            for (f = 0; f < b.length; f++) {
                e = b.charAt(f);
                if (e >= "a" && e <= "z" || e >= "0" && e <= "9") {
                    d = a.chord.scanCodeMap[e.toString().toUpperCase()];
                } else if (e === " ") {
                    d = a.chord.scanCodeMap.Space;
                } else {
                    throw "Encountered unrecognized character '" + e + "' (char code:" + e.charCodeAt(0) + ")  in literal string sequence '" + b + "' at index " + f + "; Literal string to a sequence must be alpha numeric or space.";
                }
                c.push(a.chord.makeSequencePart(d));
            }
            return c;
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
        stringToSequence: function(b) {
            var c = [];
            var e = b.split(/\s+/);
            // split string on whitespace
            for (var f = 0; f < e.length; f++) {
                var g = e[f];
                // negative modifier overrides positive inclusion
                var h = g.indexOf("!shift") === -1 ? g.indexOf("shift") === -1 ? null : true : false;
                var i = g.indexOf("!alt") === -1 ? g.indexOf("alt") === -1 ? null : true : false;
                var j = g.indexOf("!ctrl") === -1 ? g.indexOf("ctrl") === -1 ? null : true : false;
                var k = g.replace(/^((!?shift\+)|(!?alt\+)|(!?ctrl\+))*/, "");
                var l;
                if (k.indexOf("[") !== -1 && k.indexOf("]") !== -1) {
                    // explicit key code
                    l = parseInt(k.substr(1, k.length - 2), 10);
                    // remove first and last characters
                    if (isNaN(l)) {
                        throw "Encountered unrecognized keycode '" + k + "' in string sequence '" + b + "' at index " + f + ".";
                    } else if (l < 0 || l > 255) {
                        throw "Encountered out of range keycode '" + k + "' in string sequence '" + b + "' at index " + f + ". Keycode must be between 0 and 255.";
                    }
                } else {
                    l = a.chord.scanCodeMap[k];
                    if (l === d) {
                        throw "Encountered unrecognized sequence element '" + k + "' in string sequence '" + b + "' at index " + f + ". See $.chord.scanCodeMap for valid sequence elements";
                    }
                }
                c.push(a.chord.makeSequencePart(l, h, i, j));
            }
            return c;
        },
        /*
        // Convert a sequence into a user readable string. Inversion of the stringToSequence method
        //  input:  the sequence to convert into a string
        */
        sequenceToString: function(b) {
            var c = [];
            a.each(b, function(b, e) {
                var f = a.chord.inverseScanCodeMap[e.keyCode];
                var g = (e.shift === null ? "" : (e.shift ? "" : "!") + "shift+") + (e.alt === null ? "" : (e.alt ? "" : "!") + "alt+") + (e.ctrl === null ? "" : (e.ctrl ? "" : "!") + "ctrl+") + (f === d ? "[" + e.keyCode + "]" : f);
                c.push(g);
            });
            return c.join(" ");
        },
        /*
        // Flatten a sequence map (extract arrays of sequences into single sequences and mapping)
        //  the sequence map to flatten
        */
        flattenSequenceMap: function(b) {
            var c = [];
            a.each(b, function(b, d) {
                var e;
                if (d.sequence.length > 0 && d.sequence[0] instanceof Array) {
                    e = d.sequence;
                } else {
                    e = [ d.sequence ];
                }
                a.each(e, function(a, b) {
                    var e = {
                        sequence: b,
                        matched: d.matched,
                        lookup: d.lookup
                    };
                    c.push(e);
                });
            });
            return c;
        }
    };
    /*
    //  primary chord plug-in executor
    */
    a.fn.chord = function() {
        var b = arguments[0];
        var c = Array.prototype.slice.call(arguments, 1, arguments.length);
        return this.each(function() {
            var d = a(this), e = d.data("chord"), f = typeof b === "object" && b;
            // chord is not defined on the associated element, define it
            if (!e) {
                e = new i(this, f);
                d.data("chord", e);
                d.addClass("chord");
            }
            // string was passed
            if (typeof b === "string") {
                e[b](c);
            }
        });
    };
    /*
    // Chord constructor
    //  used for constructing hot key checking, or modifying options on an element
    //  element:    the element to affect with hot keys
    //  options:    the chord options
    */
    function i(b, c) {
        this.$element = a(b);
        this.options = a.extend({}, e, c);
        this.bufferTimeout = null;
        // post processing
        this.options.sequenceMap = a.chord.flattenSequenceMap(this.options.sequenceMap);
        // flatten sequence map
        this._expandBufferLength();
        // initialize key sequence buffer as empty
        this.sequenceBuffer = [];
        // initialize and construct prototype
        this._init();
    }
    /*
    //  Chord prototype
    */
    i.prototype = {
        constructor: i,
        /*
        //  Initialize key event listening 
        */
        _init: function() {
            var a = this, b = this.options.keyEvent, c = this.options.ignoreFormElements;
            // function that is called on event trigger, explicitly defined so that it may be destroyed
            function d(b) {
                // check of form element ignoring 
                if (!(c && [ "button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "textarea", "time", "url", "week" ].indexOf(b.target.type) !== -1)) {
                    a._listen(b);
                }
            }
            this.$element.bind(b, d);
            return this.$element;
        },
        /*
        //  called on key event, listen for appropriate key presses and keep history if appropriate
        */
        _listen: function(a) {
            if (this.options.paused) {
                // don't do anything if paused
                return;
            }
            var b = this._pushSequencePartFromEvent(a);
            // get key info from event and push to history
            if (b) {
                // clear greedy timeout (if set)
                if (this.greedyTimeout !== null) {
                    clearTimeout(this.greedyTimeout);
                }
                // deal with greedy by setting timer
                if (this.options.greedyTimeoutMs > 0) {
                    var c = this;
                    this.greedyTimeout = setTimeout(function() {
                        c.actOnBuffer(a);
                    }, this.options.greedyTimeoutMs);
                } else {
                    // non-greedy
                    this.actOnBuffer(a);
                }
            }
        },
        /*
        //  capture key press (as sequence part) from an event with a 'which' property
        */
        _pushSequencePartFromEvent: function(b) {
            var c = b.which, d = a.chord.makeSequencePart(c, b.shiftKey, b.altKey, b.ctrlKey);
            // if modifier keys aren't to be trapped simply ignore and return
            if (!this.options.captureShift && c === a.chord.scanCodeMap.Shift || !this.options.captureAlt && c === a.chord.scanCodeMap.Alt || !this.options.captureCtrl && c === a.chord.scanCodeMap.Control) {
                return false;
            }
            this._pushSequencePart(d);
            return true;
        },
        /*
        // Push a sequence part to the buffer
        //  sequencePart    -   sequence part to be pushed
        */
        _pushSequencePart: function(a) {
            // prevent buffer over run
            if (this.sequenceBuffer.length > this.options.maxBufferLength - 1) {
                this.sequenceBuffer.splice(0, 1);
            }
            this.sequenceBuffer.push(a);
            // clear timeout (if set) so that buffer will not be cleared
            if (this.bufferTimeout !== null) {
                clearTimeout(this.bufferTimeout);
            }
            // create new time out to clear buffer
            if (this.options.bufferTimeoutMs > 0) {
                var b = this;
                this.bufferTimeout = setTimeout(function() {
                    b.clearSequenceBuffer();
                }, this.options.bufferTimeoutMs);
            }
        },
        /*
        // match sequence parts on the buffer
        //  sequence:   the sequence to match
        */
        _sequenceMatch: function(b) {
            var c = b.length, d = this.sequenceBuffer.length, e, f;
            if (c > d) {
                // sequence longer than buffer
                return false;
            }
            e = this.sequenceBuffer.slice(d - c);
            for (f = 0; f < c; f++) {
                if (!a.chord.keysEqual(e[f], b[f])) {
                    return false;
                }
            }
            return true;
        },
        /*
        //  expand the buffer length as appropriate in order to be at minimum the size of the 
        //  the longest registered sequence
        */
        _expandBufferLength: function() {
            var b = 0;
            a.each(this.options.sequenceMap, function(a, c) {
                if (c.sequence.length > b) {
                    b = c.sequence.length;
                }
            });
            // increase buffer size if too small
            if (this.options.maxBufferLength < b) {
                this.options.maxBufferLength = b;
            }
        },
        /*
        //  clear the sequence buffer, effectively resetting the memory or previously pressed keys
        */
        clearSequenceBuffer: function() {
            this.sequenceBuffer = [];
        },
        /*
        //	check buffer for matches
        //	on the match trigger a chord match listener, and clear buffer if appropriate
        */
        actOnBuffer: function(b) {
            var c = this, d = false;
            a.each(this.options.sequenceMap, function(e, f) {
                var g = f.sequence;
                if (c._sequenceMatch(g)) {
                    // match found
                    if (typeof f.matched === "function") {
                        // if a function is to be called on match call it
                        f.matched.apply(b, [ b ]);
                    }
                    // Event triggering. Create new event and associate appropriate values to it
                    var h = a.Event("chordMatch");
                    h.originalEvent = b;
                    h.lookup = f.lookup;
                    h.sequence = g;
                    h.sequenceString = a.chord.sequenceToString(g);
                    c.$element.trigger(h);
                    // trigger event
                    d = true;
                }
            });
            if (d && c.options.clearBufferOnMatch) {
                // clear buffer if appropriate
                c.clearSequenceBuffer();
            }
        },
        /*
        // Pause listening
        */
        pause: function() {
            this.options.paused = true;
        },
        /*
        // resume listening
        */
        resume: function() {
            this.options.paused = false;
        },
        /*
        // toggle pause/resume
        */
        togglePause: function() {
            this.options.paused = !this.options.paused;
        },
        /*
        //  destroy chord
        */
        destroy: function() {
            this.$element.unbind(this.keyEvent, this.eventCall);
            this.$element.removeClass("chord");
            this.$element.removeData("chord");
        },
        /*
        //  bind new sequence(s)
        //  args[0] array of sequence/lookup/matched objects to add to the sequenceMap
        */
        bind: function(b) {
            var c = this.options.sequenceMap, d = b[0] instanceof Array ? a.chord.flattenSequenceMap(b[0]) : a.chord.flattenSequenceMap([ b[0] ]);
            a.each(d, function(a, b) {
                c.push(b);
            });
            this._expandBufferLength();
        },
        /*
        // bind a literal sequence string to a matched method / lookup string
        //  arg[0]  string literal to be converted into a sequence
        //  arg[1]  [optional] matched callback method or lookup value
        //  arg[2]  [optional] lookup value (if arg[1] was a matched callback)
        */
        bindLiteralSequence: function(b) {
            this.bind([ {
                sequence: a.chord.literalStringToSequence(b[0]),
                matched: typeof b[1] === "function" ? b[1] : d,
                lookup: typeof b[1] === "string" ? b[1] : b[2]
            } ]);
        },
        /*
        // bind a sequence string to a matched method / lookup string
        //  arg[0]  string to be converted into a sequence
        //  arg[1]  [optional] matched callback method or lookup value
        //  arg[2]  [optional] lookup value (if arg[1] was a matched callback)
        */
        bindSequence: function(b) {
            this.bind([ {
                sequence: a.chord.stringToSequence(b[0]),
                matched: typeof b[1] === "function" ? b[1] : d,
                lookup: typeof b[1] === "string" ? b[1] : b[2]
            } ]);
        },
        /*
        // unbind each occurrence of a sequence
        //  args[0] -   the sequence to unbind
        */
        unbind: function(b) {
            var c = a.chord.sequenceToString(b[0]);
            // find sequences from end to start removing as they are encountered
            for (var d = this.options.sequenceMap.length - 1; d > -1; d--) {
                if (c === a.chord.sequenceToString(this.options.sequenceMap[d].sequence)) {
                    this.options.sequenceMap.splice(d, 1);
                }
            }
        },
        /*
        // Push a sequence to the buffer
        //  arg[0]  -   the sequence (array of sequence parts) to push
        */
        pushSequence: function(b) {
            var c = this;
            a.each(b[0], function(a, b) {
                c._pushSequencePart(b);
            });
        },
        /*
        // Push sequence to the buffer, and act
        //  arg[0]  -   the sequence (array of sequence parts) to push
        */
        pushSequenceAndAct: function(a) {
            this.pushSequence(a);
            this.actOnBuffer();
        }
    };
})(jQuery, window, document);