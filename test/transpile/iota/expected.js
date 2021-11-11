function iota(n) {
    let series = Array.apply(null, {
        "length": n,
    }).map(Number.call, Number);
    return series;
}
