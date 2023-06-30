from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

@given(u'that we have navigated to {website}')
def step_impl(context, website):
    context.browser = webdriver.Chrome()
    context.browser.get("http://" + website)
    time.sleep(3)
    assert "Amazon" in context.browser.title


@when(u'we search for "{item}"')
def step_impl(context, item):
    search_box = context.browser.find_element(By.ID, "twotabsearchtextbox")
    search_box.clear()
    search_box.send_keys(item)
    search_box.send_keys(Keys.RETURN)
    time.sleep(3)


@then(u'we find items from "{vendor}"')
def step_impl(context, vendor):
    page = context.browser.page_source
    assert vendor in page
    time.sleep(5)
    context.browser.close()