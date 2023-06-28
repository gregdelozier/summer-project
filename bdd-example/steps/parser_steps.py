import parser

@given(u'that we have loaded the parser library')
def step_impl(context):
    _ = parser.parse("2")

@when(u'we parse the string "{s}"')
def step_impl(context, s):
    context.result = parser.parse(s)

@then(u'we will get the numerical value {n}')
def step_impl(context, n):
    assert context.result == float(n)

