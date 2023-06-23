# module parser

def parse(s):
    print(s)
    sign = 1
    if s[0] == '-':
        sign = -sign
        s = s[1:]
        return parse(s) * sign
    if (not type(s) == str) or (s == '.') or (s == ''):
        raise Exception(f"Can not parse {[s]}.")
    fractional = False
    total = 0
    column_value = 1
    for c in s:
        assert c in "0123456789."
        if c == ".": 
            if fractional: 
                raise Exception(f"Can not parse {[s]}.")
            fractional = True
            continue
        if fractional: 
            column_value = column_value / 10
            total = total + (ord(c) - ord("0")) * column_value
        else:
            total = total * 10 + ord(c) - ord("0")
    return total * sign

