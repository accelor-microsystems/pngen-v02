export const generateChecksum = (number) => {
    var evenDig = [];
    var oddDig = [];
    for (let i = 0; i < number.length; i++) {

        if (i % 2 === 0) {
            var n = String(number[i] * 2)
            if (n.length > 1) {
                var x = parseInt(n[0]) + parseInt(n[1])
                console.log(x)
                evenDig.push(x)
            }
            else {
                evenDig.push(number[i] * 2)
            }
        }
        else {
            var n = String(number[i] * 3)
            if (n.length > 1) {
                var x = parseInt(n[0]) + parseInt(n[1])
                console.log(x)
                oddDig.push(x)
            }
            else {
                oddDig.push(number[i] * 3)
            }
        }
    }

    var checksum_first = sumArray(evenDig) % 10
    var checksum_second = sumArray(oddDig) % 10

    console.log(evenDig, oddDig)
    console.log(checksum_first, checksum_second)

    number = parseInt(number + checksum_first + checksum_second)

    return number
}

function sumArray(arr) {
    return arr.reduce((sum, current) => (sum + current), 0);
}