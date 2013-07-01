var FlagBack = require('./flag-back'),
    fb = new FlagBack();

setTimeout(fb.flag(), 100);
setTimeout(fb.flag(), 200);
setTimeout(fb.flag(), 300);
setTimeout(fb.flag(), 1000);

fb.back(function() {
    console.log('hello world!');
});

fb.back(function() {
    console.log('hello world!');
});