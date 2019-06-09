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