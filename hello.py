def create_hello_string(name):
    if name == "" or name == None:
        return "hello!"
    return "hello, " + name + "!"

def test_create_hello_string():
    assert create_hello_string("world") == "hello, world!"
    assert create_hello_string("Greg") == "hello, Greg!"
    assert create_hello_string("") == "hello!"

if __name__ == "__main__":
    test_create_hello_string()
    print("pass.")