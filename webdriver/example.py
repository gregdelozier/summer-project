from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

browser = webdriver.Chrome()
browser.get("http://www.amazon.com")

assert "Amazon" in browser.title

search_box = browser.find_element(By.ID, "twotabsearchtextbox")
search_box.clear()
search_box.send_keys("clock")
search_box.send_keys(Keys.RETURN)

page = browser.page_source
assert "Digital" in page
assert "Analog" in page

time.sleep(5)
browser.close()