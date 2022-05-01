//We call the function for math.wasm
const fibc = loadWebAssembly('./math.wasm');

// Let's create a function called loadWebAssembly that converts given file into binary array buffer.
function loadWebAssembly(fileName) {
    // const Module = require('./math.js');
    // const wasm = Module({wasmBinaryFile: './math.wasm'});
    // wasm.onRuntimeInitialized = function() {
    //     console.log(wasm._add(40, 40));
    // };

    const fs = require('fs');
    const buf = fs.readFileSync(fileName);
    return Wasm.instantiateModule(toUnit8Array(buf)).exports;
}

//We call the function for math.wasm

function toUnit8Array(buf) {
    const u = new Uint8Array(buf.length);
    for (let i = 0; i < buf.length; i++) {
        u[i] = buf[i];
    }
    return u;
}

// Function written in Javascript for nth fibonacci
function fibj(n) {
    if (n <= 1)
        return n;
    return fibj(n - 1) + fibj(n - 2);
}

//This function gives the time required for C++ function
function perfoc(n) {
    var startTime = performance.now()

    var c = fibc(n)

    var endTime = performance.now()

    console.log(`Calculating nth Fibonacci with WASM took ${endTime - startTime} milliseconds,nth fibonacci is ${c}`)

}

// This function gives the time required for Javascript function
function perfoj(n) {
    var startTime = performance.now()

    var j = fibj(n)

    var endTime = performance.now()

    console.log(`Calculating nth Fibonacci with JS took ${endTime - startTime} milliseconds, nth fibonacci is ${j}`)

}
