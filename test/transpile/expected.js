function iota (n) { 
var series = Array.apply(null, {length:n})
.map(Number.call, Number);
return series;
}
