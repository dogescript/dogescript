dogescript = require('../../index');

rundoge = function(src)
{
  window.eval(dogescript(src));
}

var input  = document.getElementsByClassName('dogescript')[0];
var output = document.getElementsByClassName('javascript')[0];

input.addEventListener('keyup', function () {
    output.value = dogescript(input.value, true);
});

output.value = dogescript(input.value, true);

