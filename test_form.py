"""Selenium test — run API first: npm start  →  http://127.0.0.1:3000"""
import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE = os.environ.get("FORM_URL", "http://127.0.0.1:3000/").strip()

driver = webdriver.Chrome()
driver.maximize_window()

try:
    driver.get(BASE)
    wait = WebDriverWait(driver, 25)

    wait.until(EC.visibility_of_element_located((By.ID, "name"))).send_keys("Rahul Sharma")
    driver.find_element(By.ID, "email").send_keys("rahul@gmail.com")
    driver.find_element(By.ID, "mobile").send_keys("9876543210")
    Select(driver.find_element(By.ID, "dept")).select_by_visible_text("CSE")

    # Visible label click (radio input is display:none — not interactable)
    male_label = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'label[for="male"]')))
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", male_label)
    male_label.click()

    driver.find_element(By.ID, "feedback").send_keys(
        "DevOps assignment UI is very modern and impressive."
    )

    submit = wait.until(EC.element_to_be_clickable((By.ID, "submitBtn")))
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", submit)
    submit.click()

    # Modal loses [hidden] when success
    wait.until(EC.visibility_of_element_located((By.ID, "success-title")))
    print("TEST PASSED SUCCESSFULLY")
    time.sleep(2)
finally:
    driver.quit()
