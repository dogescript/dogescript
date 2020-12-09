// naive fizzbuzz
function fizz(n) {

    var ans = '';
    if (n % 3 === 0) {
        ans += 'fizz';
    }
    if (n % 5 === 0) {
        ans += 'buzz';
    }

    // return number
    if (ans === '') {
        return n;
    }

    return ans;
}

for (n = 1; n <= 100; n++) {
    var res = fizz(n);
    console.log(res);
}
