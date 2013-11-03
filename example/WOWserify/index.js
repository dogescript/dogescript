var dogescript = require('../../');

var input  = document.getElementsByClassName('dogescript')[0];
var output = document.getElementsByClassName('javascript')[0];

input.addEventListener('keyup', function () {
    output.value = dogescript(input.value);
});

output.value = dogescript(input.value);
