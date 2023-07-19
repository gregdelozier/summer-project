// example program for testing

function create_hello_string(name) {
    return "hello, " + name + "!"
}

function create_goodbye_string(name) {
    return "goodbye, " + name + "!"
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message)
    }
}

function test_create_hello_string() {
    console.log("testing hello")
    assert(create_hello_string("world") == "hello, world!", "ERROR, chs function is broken")
}

function test_create_goodbye_string() {
    console.log("testing goodbye")
    assert(create_goodbye_string("world") == "goodbye, world!", "ERROR, cgs function is broken")
}

console.log("testing...");
test_create_hello_string();
test_create_goodbye_string();
console.log("pass.")