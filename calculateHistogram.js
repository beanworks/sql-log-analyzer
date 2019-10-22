module.exports = (array, name) => {
    console.log(`Calculating ${name} histogram`)
    return array.reduce((acc, cv) => {
        if (!acc[cv]) {
            acc[cv] = 1;
        } else {
            acc[cv] += 1;
        }

        return acc;
    }, {});
}