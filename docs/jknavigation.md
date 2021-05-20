#Example J/K Navigation
This is an example snippet of how chordly can be used to accomplish J/K style navigation on a web page. `J` and `K` buttons may be used to optionally navigate tags marked with the `data-selectable` attribute. Once selected a pressing the `Enter` activates the link associated with the current item.

```
<html>
    <head>
        <title>jk Navigation chordly example</title>
        <style>
    
            .jkselected {
                background-color: lightblue;
            }
    
        </style>
    </head>
    
    <body>
        <h1>jk Navigation chordly example</h1>
        
        <h2>list one</h2>
        <ul>
            <li data-selectable="">Lorem ipsum</li>
            <li data-selectable="">dolor <a href="#">sit</a> amet</li>
            <li data-selectable="">consectetur adipiscing elit</li>
            <li data-selectable="">Quisque <a href="#" data-primary-link="">molestie</a> orci</li>
            <li data-selectable="">ac <a href="#" data-primary-link="">dignissim</a> <a href="#">sagittis</a></li>
            <li data-selectable="">Phasellus varius </li>
            <li data-selectable=""><a href="#">elementum</a> <a href="#" data-primary-link="">risus</a></li>
            <li data-selectable=""> adipiscing commodo erat</li>
        </ul>
        
        <h2>list two</h2>
        <ul>
            <li data-selectable="">Lorem ipsum</li>
            <li data-selectable="">dolor <a href="#">sit</a> amet</li>
            <li data-selectable="">consectetur adipiscing elit</li>
            <li data-selectable="">Quisque <a href="#" data-primary-link="">molestie</a> orci</li>
            <li data-selectable="">ac <a href="#" data-primary-link="">dignissim</a> <a href="#">sagittis</a></li>
            <li data-selectable="">Phasellus varius </li>
            <li data-selectable=""><a href="#">elementum</a> <a href="#" data-primary-link="">risus</a></li>
            <li data-selectable=""> adipiscing commodo erat</li>
        </ul>
    
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script type="text/javascript" src="../js/chordly.js"></script>
        <script type="text/javascript">
        
            document.addEventListener("DOMContentLoaded", function () {
        
                const bodyElement = document.querySelector('body');
        
                // navigate with 'j' for next
                bodyElement.pushToChordly('bindSequence', 'J', function () {
                    jkNavigate(true);
        
                });
        
                // navigate with 'k' for previous
                bodyElement.pushToChordly('bindSequence', 'K', function () {
                    jkNavigate(false);
                });
        
                // activate jk navigation element on enter
                bodyElement.pushToChordly('bindSequence', 'Enter', function () {
        
                    // if an item isn't already in focus trigger the first primary link of a selected and visible data-selectable
                    if ($(':focus').length === 0) { // nothing in focus
                        var link = $('[data-selectable].selected:visible').first().find('a[data-primary-link]').first();
                        if (link.length === 1) {
                            window.location = link.attr('href');
                        }
                    }
        
                });
        
                // capture escape anywhere on document
                bodyElement.pushToChordly('bindSequence', 'Esc', function () {
                    $('.jkselected').removeClass('jkselected'); // un select selected elements (from jk navigation)
                });
        
            });
        
            /// jk navigation
            /// navigate across visible elements with "data-selectable" attribute on the page
            /// -----------------------------------------------------------------------------------
            /// increment (bool) - true if next items should be selected, false for previous item
        
            function jkNavigate(increment) {
        
                var selectables = $('[data-selectable]:visible');
        
                if (selectables.length > 0) {
        
                    var current = selectables.index($('.jkselected'));
        
                    var next = increment // move left vs move right
                        ? current >= selectables.length - 1 ? 0 : current + 1 // get next, wrap if needed
                        : current <= 0 ? selectables.length - 1 : current - 1; // get previous, wrap if needed
        
                    var currentSelectable = $(selectables[current]);
                    var nextSelectable = $(selectables[next]);
        
                    currentSelectable.removeClass('jkselected');
                    nextSelectable.addClass('jkselected');
        
                    // make sure selected item is visible within vertical display
                    $('html, body').animate({ scrollTop: nextSelectable.offset().top - 20}, 200);
        
                    $(':focus').blur(); // remove focus from any element that may be in focus
                    // give focus to any link within marked with attribute primary link
                    nextSelectable.find('a[data-primary-link]').first().focus();
        
                }
            }
        
        </script>
    </body>
</html>
```
