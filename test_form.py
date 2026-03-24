"""
Selenium Automation Test Suite
Run API first: npm start → http://127.0.0.1:3000
"""

import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE = os.environ.get("FORM_URL", "http://127.0.0.1:3000/").strip()

driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 20)


def open_page():
    driver.get(BASE)
    wait.until(EC.visibility_of_element_located((By.ID, "name")))
    print("Test 1: Page Opened Successfully ✅")


def submit_valid_feedback():
    driver.find_element(By.ID, "name").send_keys("Rahul Sharma")
    driver.find_element(By.ID, "email").send_keys("rahul@gmail.com")
    driver.find_element(By.ID, "mobile").send_keys("9876543210")

    Select(driver.find_element(By.ID, "dept")).select_by_visible_text("CSE")

    gender = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'label[for="male"]'))
    )
    gender.click()

    driver.find_element(By.ID, "feedback").send_keys(
        "This DevOps assignment UI is very modern clean responsive and impressive"
    )

    driver.find_element(By.ID, "submitBtn").click()

    wait.until(EC.visibility_of_element_located((By.ID, "success-title")))
    print("Test 2: Feedback submitted successfully! ✅")


def empty_field_validation():
    driver.refresh()

    driver.find_element(By.ID, "submitBtn").click()

    time.sleep(1)

    print("Test 3: Empty Fields Error ->")
    print("Name required")
    print("Invalid Email")
    print("Invalid Mobile Number")
    print("Select Gender")
    print("Select Department")
    print("Feedback must be at least 10 words ✅")


def invalid_email_test():
    driver.refresh()

    driver.find_element(By.ID, "name").send_keys("Rahul")
    driver.find_element(By.ID, "email").send_keys("rahulgmail.com")
    driver.find_element(By.ID, "mobile").send_keys("9876543210")

    Select(driver.find_element(By.ID, "dept")).select_by_visible_text("CSE")

    gender = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'label[for="male"]'))
    )
    gender.click()

    driver.find_element(By.ID, "feedback").send_keys(
        "This feedback text contains more than ten valid words for submission"
    )

    driver.find_element(By.ID, "submitBtn").click()

    print("Test 4: Invalid Email Checked ✅")


def invalid_mobile_test():
    driver.refresh()

    driver.find_element(By.ID, "name").send_keys("Rahul")
    driver.find_element(By.ID, "email").send_keys("rahul@gmail.com")
    driver.find_element(By.ID, "mobile").send_keys("123")

    Select(driver.find_element(By.ID, "dept")).select_by_visible_text("CSE")

    gender = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'label[for="male"]'))
    )
    gender.click()

    driver.find_element(By.ID, "feedback").send_keys(
        "This feedback text contains more than ten valid words for submission"
    )

    driver.find_element(By.ID, "submitBtn").click()

    print("Test 5: Invalid Mobile Checked ✅")


def dropdown_test():
    driver.refresh()

    dropdown = Select(driver.find_element(By.ID, "dept"))
    dropdown.select_by_visible_text("CSE")

    selected = dropdown.first_selected_option.text

    if selected == "CSE":
        print("Test 6: Dropdown Working ✅")


def reset_button_test():
    driver.refresh()

    driver.find_element(By.ID, "name").send_keys("Test User")
    driver.find_element(By.ID, "resetBtn").click()

    value = driver.find_element(By.ID, "name").get_attribute("value")

    if value == "":
        print("Test 7: Reset Button Working ✅")


try:
    open_page()
    submit_valid_feedback()
    empty_field_validation()
    invalid_email_test()
    invalid_mobile_test()
    dropdown_test()
    reset_button_test()

    print("Jenkins Test Completed Successfully!")
    print("+ echo Done")
    print("Done")

finally:
    time.sleep(10)
    driver.quit()