module.exports = (obj) => {
    var sortable = [];
    for (var key in obj) {
        sortable.push([key, obj[key]]);
    }

    sortable.sort(function(a, b) {
        return (a[1] < b[1]) ? 1 : -1;
    });

    return sortable.reduce((acc, cv) => {
        acc[cv[0]] = cv[1];
        return acc;
    }, {});
}