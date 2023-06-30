@given(u'we have imported the concatenation library')
def step_impl(context):
    pass


@when(u'we concatenate "{a}" and "{b}"')
def step_impl(context, a, b):
    context.result = a + b


@then(u'we get "{c}"')
def step_impl(context, c):
    assert context.result == c
