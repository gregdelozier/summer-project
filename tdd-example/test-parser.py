import parser

def test_single_digits():
    digits = "0123456789"
    for i in range(0,10):
        assert parser.parse(digits[i]) == i


def test_multiple_digits():
    assert parser.parse("10") == 10
    assert parser.parse("12") == 12
    assert parser.parse("3345") == 3345


def test_decimal_numbers():
    assert parser.parse("0.1") == 0.1
    assert parser.parse("0.9") == 0.9
    assert parser.parse("9.19") == 9.19
    assert parser.parse("45.145") == 45.145
    assert 0.145000000 <= parser.parse(".145") <= 0.145000005
    assert parser.parse("1.") == 1


def test_illegal_entries():
    for value in ["", ".", "a", "?", None, "0..1", "0.1.2", "-", "2-"]:
        failure_happened = False
        try:
            _ = parser.parse(value)
        except Exception as e:
            failure_happened = True
        assert failure_happened, f"Failure when parsing {[value]}"

def test_negative_numbers():
    assert parser.parse("-0.1") == -0.1
    assert parser.parse("-0.9") == -0.9
    assert parser.parse("-9.19") == -9.19
    assert parser.parse("-45.145") == -45.145
    assert -0.145000005 <= parser.parse("-.145") <= -0.145000000
    assert parser.parse("-1.") == -1
    assert parser.parse("--2") == 2
    assert parser.parse("-----2") == -2

