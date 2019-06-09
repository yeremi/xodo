#Xodo
#### My personal javascript library
In 2013 I worked on a project where it was necessary to have a javascript library with specific functionalities (neither more nor less), it needed to be crossbrowser and also work well in different browser versions. There were other requirements the library needed to keep, such as being light and fast. Obviously jQuery was my first choice.

Currently jQuery is used by 73.8% of all websites, that is the JavaScript library market share of 97.4%. By 2013 the percentage was not much different and jQuery 2.0 beta was being tested. You can read about that year's jQuery status at this link: https://blog.jquery.com/2013/01/14/the-state-of-jquery-2013/

After testing some javascript libraries, I decided to write my own little javascript library to work with along with Sizzle Js , which also belongs to jQuery. At the time Sizzle was working on v1.10.6-pre version and I developed my my library to work along with that version of Sizzle.

JQuery helped me a lot to understand how ECMA standardization worked and also about Isomorphic JavaScript that in that time was considerate as a future of web apps by Airbnb Engineering. So I started to develop Xodo, my personal javascript library, which was used in the project I was working on at the time.

This is the short list of features that have been implemented. You can use Xodo as a case study and / or apprenticeship, or if you want, you can also use it in some personal project but under your responsibility since I have recovered the library from my backup and have not made adjustments or improvements.

## Methods

##### Element Methods
```javascript
width()
height()
remove()
```

##### Style Methods
```javascript
hasClass()
addClass()
removeClass()
css()
style()
```

##### DOM Manipulation methods
```javascript
html()
append()
prepend()
```

## Events handler
```javascript
onload()
ready()
bindEvent()
unbindEvent()
resize()
```

## Usage example
```javascript
xdo(window).onload(function () {
    //Css
    xdo('#someElement').css({
        background: '#f5f5f5',
        padding: '5px'
    });

    // Click
    xdo('#someElement').bindEvent("click", function () {
        xdo('#someElement').css({
            background: '#ff00ff'
        });
    });
    // xdoMatrix
    new xdoMatrix(
        elem,                   // accept just document.getElementBy('someid')
        [[300, 150, 'width']],  // from 300 to 150 - width
        650,                    // duration
        'ease',                 // 'ease' default
        function(){}            // callback
    );
});
```