#About

jQuery.Chord is a plug-in library for jQuery 1.3+ that lets you detect and act upon user keyboard input. This is accomplished by wiring Chord up to listen for key sequences, known as chords, entered by a user.

Chord was inspired by John Resig's [jQuery.hotkeys](https://github.com/jeresig/jquery.hotkeys). Though we are big fans of jQuery.hotkeys (and John) the plugin lacks functionality we have included in Chord.

A proud supporter of #mousehate

##Features

 - Trigger events on single, or multiple key presses. Includes Shift, Alt, and Control options
 - Cross browser compatibility
 - Custom 'chordMatch' event that may be listened for by user code
 - Optionally ignore input on form elements
 - Storage of user readable buffer of key presses
 - Pause and Re-Start key capturing and event firing
 - Optional automatic timeout of key buffering
 - Optional Greedy matching
 - Multiple instances allowed on a single page
 - Extensible jQuery like definition of javascript code
 - ...


#Usage

Chord may be attached to any DOM node in order to listen for sequences of keyboard activity within that node and its descendants. In its simplest form Chord can be enabled like this:

    $(expression).chord('bindLiteralSequence', 'hello', function () { console.log('world') });

##Advanced Usage

*Also, be sure to check out the **Code Snippet** section below that contains useful  examples and hints*

While the above is great for simple keyboard input it is Chord's more advance uses where it begins to sing. Chord offers a variety of configuration options and makes it easy to handle a number of key sequences with a single configuration. A more advanced form of the above would look likes this:

    $(expression).chord({
        sequenceMap: [{
            sequence: $.chord.literalStringToSequence('hello'),
            matched: function () {
                console.log('world')
            }
        }]
    });

Which admittedly looks unnecessarily more complicated until you realize it allows you to do things like this:

    $(expression).chord('bind', [{
        sequence: $.chord.literalStringToSequence('mouse'),
        matched: function () {
            console.log('squeak!')
        }
    }, {
        sequence: [
        $.chord.literalStringToSequence('cow'),
        $.chord.literalStringToSequence('bull'), ],
        matched: function () {
            console.log('moo!')
        }
    }]);


##Options
In the above examples we are making use of Chord's `options` object which may contain the following, otherwise defaults are used:

- **captureShift** `(bool)` default: `[false]`
Treat shift as a key press. 

- **captureAlt** `(bool)` default: `[false]`
Treat alt as a key press.

- **captureCtrl** `(bool)` default: `[false]`
Treat ctrl as a key press.        

- **ignoreFormElements** `(bool)` default: `[true]`
Ignore key presses within form elements

- **keyEvent** `(string)` default: `[keyup]`
the key event that triggers listening. other options are keydown (or any event that stores the key code *not ASCII char code* within the 'which' property of the event)

- **maxBufferLength** `(int)` default: `[5]`
the length of the key buffer. Note that the buffer will be auto expanded in order to maintain at minimum the length of the longest sequence to be detected. Modifying this allows for a greater depth of key press history to be kept if desired

- **clearBufferOnMatch** `(bool)` default: `[true]`
determines if the key buffer should be cleared on a match

- **paused** `(bool)` default: `[false]`
determines if chord on the element should start paused (not collecting key)

- **bufferTimeoutMs** `(int)` default: `[0]`
timeout length for key buffer clearing in ms (value of <1 means no timeout)

- **greedyTimeoutMs** `(int)` default: `[0]`
timeout length since last recording of a key press before executing a match event. This is reset by next key press. (value of <1 means no greedy matching)

- **sequenceMap** `(object array)` default: `[empty array]`
an array of objects defining sequence mapping. Defaults to an empty array. Mapping object may have the following attributes

 - **sequence** - a sequence, array of sequences, or array of sequence parts
to create a sequence from a string use
`$.chord.literalStringToSequence(str)`
or to create a part use
`$.chord.makeSequencePart(keyCode, shift, alt, ctrl)`

 - **matched** - optional function that will be called on sequence completion

 - **lookup** - optional lookup code that will be passed to the custom `chordMatch` event on sequence completion

##Methods

- **clearSequenceBuffer**
clear the sequence buffer, effectively resetting the memory of previously pressed keys
`$(expression).chord('clearSequenceBuffer')`

- **destroy**
destroy the chord instance unbinding events and removing data from element
`$(expression).chord('destroy')`

- **pause**
pause the chord instance
`$(expression).chord('pause')`

- **resume**
resume the chord instance
`$(expression).chord('resume')`

- **togglePause**
pause/resume chord instance if was unpaused/paused
`$(expression).chord('togglePause')`

- **bind(args)**
bind new sequence(s)
args[0] array of sequence/lookup/matched objects to add to the sequenceMap

        $(expression).chord('bind', {
            sequence: $.chord.literalStringToSequence('mouse'),
            matched: function () {
                console.log('squeak!')
            }
        });

- **unbind(args)**
unbind each occurrence of a sequence
args[0] the sequence to unbind
`$(expression).chord('unbind', $.chord.literalStringToSequence('mouse'));`

- **actOnBuffer**
act on data in buffer as if a listen event has occurred
`$(expression).chord('actOnBuffer')`

- **pushSequence(args)**
push a sequence onto the buffer. Not that this will not cause a listen to be fired. You must call actOnBuffer if a reaction is desired. To push and act on buffer call pushSequenceAndAct
args[0] sequence to push (array of sequence parts)
`$(expression).chord('pushSequence', $.chord.literalStringToSequence('dog'))`

- **pushSequenceAndActOnBuffer(args)**
push a sequence onto the buffer and act upon it
args[0] sequence to push (array of sequence parts)
`$(expression).chord('pushSequenceAndAct', $.chord.literalStringToSequence('dog'))`

##Events
Chord also makes available a custom 'chordMatch' event. This event object will contain the following NEW properties:

- **originalEvent** - the original triggering event event
- **lookup** - the lookup as defined in the sequence map
- **sequence** - the sequence that triggered the event
- **sequenceString** - the triggering sequence as a string

Below is an example of a handler of the chordMatch event.

    $(expression).on('chordMatch', function (e) {
        console.log('chordMatch event:');
        console.log('\t event:', e);
        console.log('\t lookup:', e.lookup);
        console.log('\t sequence:', e.sequence);
        console.log('\t sequenceString:', e.sequenceString);
        console.log('\t originalEvent:', e.originalEvent);
    });
    
    
#Code Snippets

The Sky is the limit with Chord, or at the very least the keyboard. The following are some code examples of how chord may be used to make interacting with your website better.

##Konami Code

This example fires of an method, in this case an alert stating "Konami Code!", when the Konami Code is entered.

    $(document).ready(function () {
        $(document).chord('bindSequence', 'UpArrow UpArrow DownArrow DownArrow LeftArrow RightArrow LeftArrow RightArrow B A Enter', function () { alert("Konami Code!"); });
    });

#Page Redirection

This example shows how chord definition may be chained to have key presses of G then H, G then F, and G then A redirect the browser to home.html, faq.html, and about.html respectively

    $(document).ready(function () {
        $(document).chord('bindSequence', 'G H', function() { window.location = 'home.html'; })
            .chord('bindSequence', 'G F', function() { window.location = 'faq.html'; });
            .chord('bindSequence', 'G A', function() { window.location = 'about.html'; });
    });


##Greedy Sequence Matching

This example shows how Chord may be set up so that it will attempt to match on the longest possible key entry before defaulting to a smaller defined one. In this case entering 'cows' will not trigger the 'cow' event, yet both may still be fired.


    $(document).ready(function () {
       var $document = $(this); 
       
       $document.chord(
        { 
            bufferTimeoutMs: 400, // buffer auto-clears after 400 ms
            greedyTimeoutMs: 225 // wait 225 ms for more keys before declaring a match
        });
        
        
        $document.chord('bindSequence', 'C O W', function() {
            alert("one cow: Moo!");
        });
        
        $document.chord('bindSequence', 'C O W S', function() {
            alert("two cows: Moo! Moo!");
        });        
       
    });


##On Screen 'J/K' Style Navigation

This is an example snippet of how jQuery.Chord can be used to accomplish J/K style navigation on a web page. J and K buttons may be used to optionally navigate tags marked with the 'data-selectable'  attribute. Once selected a pressing the Enter key activates the link associated with the current item.

*see [jQuery Chord example of J/K navigation Gist](https://gist.github.com/rheone/995a97b6e076b044dfba)*

