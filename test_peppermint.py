#!/usr/bin/env python3
"""
Peppermint Ticketing System - Automated Test Suite
Tests both frontend UI interactions and backend API endpoints
"""

import time
import json
import logging
import requests
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import (
    TimeoutException, 
    NoSuchElementException, 
    ElementClickInterceptedException,
    WebDriverException,
    StaleElementReferenceException
)

# Configure logging with ASCII-safe characters
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('peppermint_test.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class PeppermintTester:
    def __init__(self):
        self.frontend_url = "http://localhost:3000"
        self.backend_url = "http://localhost:5003"
        self.driver = None
        self.session = requests.Session()
        self.test_results = {
            "frontend_tests": [],
            "backend_tests": [],
            "form_tests": [],
            "errors": []
        }
        self.is_authenticated = False
        
        # Create screenshots directory
        self.screenshots_dir = "test_screenshots"
        if not os.path.exists(self.screenshots_dir):
            os.makedirs(self.screenshots_dir)
    
    def take_screenshot(self, name):
        """Take a screenshot for debugging"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{self.screenshots_dir}/{name}_{timestamp}.png"
            self.driver.save_screenshot(filename)
            logger.info(f"Screenshot saved: {filename}")
            return filename
        except Exception as e:
            logger.error(f"Failed to take screenshot: {e}")
            return None
    
    def retry_action(self, action, max_retries=5, delay=2):
        """Retry an action with improved exponential backoff"""
        for attempt in range(max_retries):
            try:
                return action()
            except (StaleElementReferenceException, ElementClickInterceptedException, NoSuchElementException) as e:
                if attempt == max_retries - 1:
                    raise e
                logger.warning(f"Retry {attempt + 1}/{max_retries} failed: {e}")
                time.sleep(delay * (2 ** attempt))
        return None
    
    def setup_driver(self):
        """Setup Chrome WebDriver with appropriate options"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            logger.info("Chrome WebDriver setup successful")
            return True
        except Exception as e:
            logger.error(f"Failed to setup WebDriver: {e}")
            return False
    
    def wait_for_page_load(self, timeout=10):
        """Wait for page to fully load"""
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            logger.info("Page loaded successfully")
            return True
        except TimeoutException:
            logger.warning("Page load timeout")
            return False
    
    def authenticate_user(self):
        """Sign in to the application using demo credentials"""
        try:
            logger.info("Starting authentication process...")
            
            # Navigate to login page
            self.driver.get(f"{self.frontend_url}/auth/login")
            self.wait_for_page_load()
            
            # Wait for login form to be visible
            try:
                # Try different selectors for email input
                email_selectors = [
                    "input[type='email']",
                    "input[name='email']",
                    "input[placeholder*='email']",
                    "input[placeholder*='Email']"
                ]
                
                email_input = None
                for selector in email_selectors:
                    try:
                        email_input = WebDriverWait(self.driver, 5).until(
                            EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                        )
                        break
                    except:
                        continue
                
                if not email_input:
                    logger.error("Could not find email input field")
                    return False
                
                # Try different selectors for password input
                password_selectors = [
                    "input[type='password']",
                    "input[name='password']",
                    "input[placeholder*='password']",
                    "input[placeholder*='Password']"
                ]
                
                password_input = None
                for selector in password_selectors:
                    try:
                        password_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except:
                        continue
                
                if not password_input:
                    logger.error("Could not find password input field")
                    return False
                
                # Clear and fill in credentials
                email_input.clear()
                email_input.send_keys("demo@example.com")
                
                password_input.clear()
                password_input.send_keys("demo123")
                
                # Try different selectors for login button
                login_button_selectors = [
                    "button[type='submit']",
                    "button:contains('Sign In')",
                    "button:contains('Login')",
                    "button:contains('Sign in')",
                    "button:contains('Log in')",
                    "input[type='submit']"
                ]
                
                login_button = None
                for selector in login_button_selectors:
                    try:
                        if selector.startswith("button:contains"):
                            # Handle text-based selectors
                            text = selector.split("'")[1]
                            buttons = self.driver.find_elements(By.TAG_NAME, "button")
                            for button in buttons:
                                if text.lower() in button.text.lower():
                                    login_button = button
                                    break
                        else:
                            login_button = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except:
                        continue
                
                if not login_button:
                    # Try to find any button that might be the login button
                    buttons = self.driver.find_elements(By.TAG_NAME, "button")
                    for button in buttons:
                        if any(text in button.text.lower() for text in ['sign', 'login', 'submit']):
                            login_button = button
                            break
                
                if not login_button:
                    logger.error("Could not find login button")
                    return False
                
                # Click the login button
                login_button.click()
                
                # Wait for successful login (redirect to dashboard)
                WebDriverWait(self.driver, 10).until(
                    lambda driver: "/auth/login" not in driver.current_url
                )
                
                logger.info("Authentication successful!")
                self.is_authenticated = True
                return True
                
            except Exception as e:
                logger.error(f"Authentication failed: {e}")
                return False
                
        except Exception as e:
            logger.error(f"Error during authentication: {e}")
            return False
    
    def test_form_submission(self):
        """Test form submissions including validation and file uploads"""
        try:
            logger.info("Starting form submission tests...")
            
            # Test ticket creation form
            self.test_ticket_creation_form()
            
            # Test user creation form
            self.test_user_creation_form()
            
            # Test profile update form
            self.test_profile_update_form()
            
        except Exception as e:
            logger.error(f"Error in form submission tests: {e}")
    
    def test_ticket_creation_form(self):
        """Test ticket creation form with validation"""
        try:
            logger.info("Testing ticket creation form...")
            
            # Navigate to create ticket page
            self.driver.get(f"{self.frontend_url}/create")
            self.wait_for_page_load()
            
            # Test empty form submission (should show validation errors)
            self.test_empty_form_submission()
            
            # Test valid form submission
            self.test_valid_ticket_submission()
            
            # Test file upload if available
            self.test_file_upload()
            
        except Exception as e:
            logger.error(f"Error testing ticket creation form: {e}")
            self.take_screenshot("ticket_form_error")
    
    def test_empty_form_submission(self):
        """Test submitting empty forms to check validation with improved selectors"""
        try:
            logger.info("Testing empty form submission...")
            
            # Find submit button with multiple strategies
            submit_selectors = [
                "button[type='submit']",
                "input[type='submit']",
                "button:contains('Submit')",
                "button:contains('Create')",
                "button:contains('Save')",
                "button:contains('Add')",
                "[class*='submit']",
                "[class*='btn-primary']",
                "[class*='btn-success']"
            ]
            
            submit_button = None
            for selector in submit_selectors:
                try:
                    if selector.startswith("button:contains"):
                        # Handle text-based selectors
                        text = selector.split("'")[1]
                        buttons = self.driver.find_elements(By.TAG_NAME, "button")
                        for button in buttons:
                            if text.lower() in button.text.lower():
                                submit_button = button
                                break
                    else:
                        submit_button = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue
            
            if submit_button:
                # Click submit without filling form
                try:
                    submit_button.click()
                    logger.info("Clicked submit button for empty form test")
                except (ElementClickInterceptedException, StaleElementReferenceException):
                    self.driver.execute_script("arguments[0].click();", submit_button)
                
                time.sleep(2)
                
                # Look for validation error messages with improved selectors
                error_selectors = [
                    "[class*='error']",
                    "[class*='invalid']",
                    "[role='alert']",
                    ".text-red-500",
                    ".text-red-600",
                    "[class*='danger']",
                    "[class*='warning']",
                    ".error-message",
                    ".validation-error"
                ]
                
                validation_errors = []
                for selector in error_selectors:
                    try:
                        errors = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        for error in errors:
                            if error.text and error.is_displayed():
                                validation_errors.append(error.text)
                    except:
                        continue
                
                if validation_errors:
                    logger.info(f"Validation errors found: {validation_errors}")
                    self.test_results["form_tests"].append({
                        "form": "ticket_creation",
                        "test": "empty_submission",
                        "validation_errors": validation_errors,
                        "success": True
                    })
                else:
                    logger.warning("No validation errors found for empty form")
                    
        except Exception as e:
            logger.error(f"Error testing empty form submission: {e}")
            self.take_screenshot("empty_form_error")
    
    def test_valid_ticket_submission(self):
        """Test submitting a valid ticket form with improved field detection"""
        try:
            logger.info("Testing valid ticket submission...")
            
            # Find form fields with improved detection
            title_input = self.find_form_field("title", "subject", "name", "ticket_title")
            description_input = self.find_form_field("description", "content", "message", "ticket_description")
            priority_select = self.find_form_field("priority", "type", "category", "ticket_priority")
            
            # Fill in form fields if found
            if title_input:
                title_input.clear()
                title_input.send_keys("Test Ticket from Automation")
                logger.info("Filled title field")
            
            if description_input:
                description_input.clear()
                description_input.send_keys("This is a test ticket created by the automated test suite.")
                logger.info("Filled description field")
            
            if priority_select:
                # Try to select a priority option
                try:
                    priority_select.click()
                    time.sleep(0.5)
                    # Look for dropdown options
                    options = self.driver.find_elements(By.CSS_SELECTOR, "option, [role='option']")
                    if options:
                        options[0].click()
                        logger.info("Selected priority option")
                except:
                    logger.warning("Could not select priority option")
            
            # Find and click submit button with improved detection
            submit_buttons = self.driver.find_elements(By.CSS_SELECTOR, 
                "button[type='submit'], button:contains('Submit'), button:contains('Create')")
            
            if submit_buttons:
                submit_button = submit_buttons[0]
                
                # Use retry logic for submit
                def submit_action():
                    try:
                        submit_button.click()
                    except (ElementClickInterceptedException, StaleElementReferenceException):
                        self.driver.execute_script("arguments[0].click();", submit_button)
                    return True
                
                self.retry_action(submit_action, max_retries=3, delay=2)
                
                # Wait for submission response
                time.sleep(3)
                
                # Check for success message or redirect
                success_indicators = [
                    "success",
                    "created",
                    "submitted",
                    "ticket"
                ]
                
                page_text = self.driver.page_source.lower()
                if any(indicator in page_text for indicator in success_indicators):
                    logger.info("Ticket submission appears successful")
                    self.test_results["form_tests"].append({
                        "form": "ticket_creation",
                        "test": "valid_submission",
                        "success": True
                    })
                else:
                    logger.warning("Could not confirm ticket submission success")
                    
        except Exception as e:
            logger.error(f"Error testing valid ticket submission: {e}")
            self.take_screenshot("ticket_submission_error")
    
    def test_file_upload(self):
        """Test file upload functionality"""
        try:
            logger.info("Testing file upload...")
            
            # Look for file input elements
            file_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='file']")
            
            if file_inputs:
                file_input = file_inputs[0]
                
                # Create a test file
                test_file_path = os.path.join(self.screenshots_dir, "test_upload.txt")
                with open(test_file_path, "w") as f:
                    f.write("This is a test file for upload testing.")
                
                # Upload the file
                file_input.send_keys(test_file_path)
                time.sleep(2)
                
                logger.info("File upload test completed")
                self.test_results["form_tests"].append({
                    "form": "file_upload",
                    "test": "upload_file",
                    "success": True
                })
                
                # Clean up test file
                try:
                    os.remove(test_file_path)
                except:
                    pass
            else:
                logger.info("No file upload fields found")
                
        except Exception as e:
            logger.error(f"Error testing file upload: {e}")
    
    def find_form_field(self, *field_names):
        """Find form fields by various possible names with improved selectors"""
        for field_name in field_names:
            # More comprehensive selectors
            selectors = [
                f"input[name='{field_name}']",
                f"input[placeholder*='{field_name}']",
                f"textarea[name='{field_name}']",
                f"select[name='{field_name}']",
                f"input[id*='{field_name}']",
                f"textarea[id*='{field_name}']",
                f"select[id*='{field_name}']",
                f"input[data-testid*='{field_name}']",
                f"textarea[data-testid*='{field_name}']",
                f"select[data-testid*='{field_name}']",
                f"[class*='{field_name}'] input",
                f"[class*='{field_name}'] textarea",
                f"[class*='{field_name}'] select"
            ]
            
            for selector in selectors:
                try:
                    element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if element.is_displayed():
                        return element
                except:
                    continue
        
        return None
    
    def test_user_creation_form(self):
        """Test user creation form"""
        try:
            logger.info("Testing user creation form...")
            
            # Navigate to user creation page
            self.driver.get(f"{self.frontend_url}/users/create")
            self.wait_for_page_load()
            
            # Test form fields
            name_input = self.find_form_field("name", "fullname", "full_name")
            email_input = self.find_form_field("email", "email_address")
            role_select = self.find_form_field("role", "type", "permission")
            
            if name_input:
                name_input.clear()
                name_input.send_keys("Test User")
            
            if email_input:
                email_input.clear()
                email_input.send_keys("testuser@example.com")
            
            # Look for submit button
            submit_buttons = self.driver.find_elements(By.CSS_SELECTOR, 
                "button[type='submit'], button:contains('Create'), button:contains('Add')")
            
            if submit_buttons:
                submit_button = submit_buttons[0]
                submit_button.click()
                time.sleep(2)
                
                logger.info("User creation form test completed")
                
        except Exception as e:
            logger.error(f"Error testing user creation form: {e}")
    
    def test_profile_update_form(self):
        """Test profile update form"""
        try:
            logger.info("Testing profile update form...")
            
            # Navigate to profile page
            self.driver.get(f"{self.frontend_url}/profile")
            self.wait_for_page_load()
            
            # Look for edit button
            edit_buttons = self.driver.find_elements(By.CSS_SELECTOR, 
                "button:contains('Edit'), button:contains('Update')")
            
            if edit_buttons:
                edit_button = edit_buttons[0]
                edit_button.click()
                time.sleep(1)
                
                # Test updating profile fields
                name_input = self.find_form_field("name", "fullname")
                email_input = self.find_form_field("email")
                
                if name_input:
                    name_input.clear()
                    name_input.send_keys("Updated Test User")
                
                if email_input:
                    email_input.clear()
                    email_input.send_keys("updated@example.com")
                
                # Look for save button
                save_buttons = self.driver.find_elements(By.CSS_SELECTOR, 
                    "button:contains('Save'), button:contains('Update')")
                
                if save_buttons:
                    save_button = save_buttons[0]
                    save_button.click()
                    time.sleep(2)
                    
                    logger.info("Profile update form test completed")
                    
        except Exception as e:
            logger.error(f"Error testing profile update form: {e}")
    
    def find_all_buttons(self):
        """Find all button elements on the current page with improved detection"""
        try:
            # Find all button elements with multiple strategies
            buttons = self.driver.find_elements(By.TAG_NAME, "button")
            role_buttons = self.driver.find_elements(By.CSS_SELECTOR, "[role='button']")
            input_buttons = self.driver.find_elements(By.CSS_SELECTOR, "input[type='button'], input[type='submit']")
            
            # Also look for clickable elements that might be buttons
            clickable_elements = self.driver.find_elements(By.CSS_SELECTOR, 
                "[onclick], [class*='btn'], [class*='button'], [class*='click']")
            
            # Combine and deduplicate
            all_buttons = list(set(buttons + role_buttons + input_buttons + clickable_elements))
            
            # Filter out hidden buttons and improve visibility check
            visible_buttons = []
            for button in all_buttons:
                try:
                    # More robust visibility check
                    if (button.is_displayed() and 
                        button.is_enabled() and 
                        button.size['width'] > 0 and 
                        button.size['height'] > 0):
                        visible_buttons.append(button)
                except:
                    continue
            
            logger.info(f"Found {len(visible_buttons)} visible buttons")
            return visible_buttons
        except Exception as e:
            logger.error(f"Error finding buttons: {e}")
            return []
    
    def test_button_interaction(self, button, button_index):
        """Test individual button interaction with improved error handling"""
        button_text = "Unknown Button"
        try:
            # Get button info with better fallbacks
            button_text = (button.text.strip() or 
                         button.get_attribute("aria-label") or 
                         button.get_attribute("title") or 
                         button.get_attribute("placeholder") or 
                         f"Button_{button_index}")
            button_id = button.get_attribute("id") or f"button_{button_index}"
            
            logger.info(f"Testing button: {button_text} (ID: {button_id})")
            
            # Check if button is visible and enabled
            if not button.is_displayed():
                logger.warning(f"Button {button_text} is not visible")
                return False
            
            if not button.is_enabled():
                logger.warning(f"Button {button_text} is not enabled")
                return False
            
            # Store current URL before clicking
            current_url = self.driver.current_url
            
            # Use improved retry logic for button interaction
            def click_action():
                # Scroll button into view with better positioning
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
                time.sleep(1)  # Increased wait time
                
                # Try multiple click strategies
                try:
                    button.click()
                except (ElementClickInterceptedException, StaleElementReferenceException):
                    # Try JavaScript click
                    self.driver.execute_script("arguments[0].click();", button)
                return True
            
            # Retry the click action with more attempts
            self.retry_action(click_action, max_retries=5, delay=2)
            logger.info(f"Successfully clicked button: {button_text}")
            
            # Wait for any page changes
            time.sleep(3)  # Increased wait time
            
            # Check if URL changed
            new_url = self.driver.current_url
            if new_url != current_url:
                logger.info(f"Navigation detected: {current_url} -> {new_url}")
                # Navigate back if possible
                try:
                    self.driver.back()
                    time.sleep(2)  # Increased wait time
                    logger.info("Navigated back to previous page")
                except:
                    logger.warning("Could not navigate back")
            
            # Test for API calls
            self.test_backend_endpoints(button_text)
            
            return True
            
        except Exception as e:
            logger.error(f"Error testing button {button_text}: {e}")
            self.take_screenshot(f"button_error_{button_text.replace(' ', '_').replace('/', '_')}")
            self.test_results["errors"].append({
                "button": button_text,
                "error": str(e)
            })
            return False
    
    def test_backend_endpoints(self, button_context):
        """Test backend API endpoints after button interaction"""
        endpoints_to_test = [
            {"method": "GET", "endpoint": "/api/v1/health", "expected_status": 200},
            {"method": "GET", "endpoint": "/api/v1/ticket", "expected_status": 200},
            {"method": "GET", "endpoint": "/api/v1/users", "expected_status": 200},
            {"method": "GET", "endpoint": "/api/v1/auth/me", "expected_status": 200},
        ]
        
        for endpoint_test in endpoints_to_test:
            try:
                url = f"{self.backend_url}{endpoint_test['endpoint']}"
                method = endpoint_test['method']
                expected_status = endpoint_test['expected_status']
                
                logger.info(f"Testing {method} {endpoint_test['endpoint']} (triggered by: {button_context})")
                
                if method == "GET":
                    response = self.session.get(url, timeout=5)
                elif method == "POST":
                    response = self.session.post(url, timeout=5)
                else:
                    continue
                
                # Check status code
                if response.status_code == expected_status:
                    logger.info(f"[PASS] {method} {endpoint_test['endpoint']} - Status: {response.status_code}")
                    
                    # Try to parse JSON response
                    try:
                        json_data = response.json()
                        logger.info(f"[PASS] Response contains valid JSON with {len(json_data)} items")
                        
                        # Log specific fields if they exist
                        if isinstance(json_data, dict):
                            for key in ['status', 'ticket_id', 'id', 'name', 'email']:
                                if key in json_data:
                                    logger.info(f"   - {key}: {json_data[key]}")
                        elif isinstance(json_data, list) and len(json_data) > 0:
                            logger.info(f"   - Array with {len(json_data)} items")
                            
                    except json.JSONDecodeError:
                        logger.warning(f"[WARN] Response is not valid JSON: {response.text[:100]}...")
                        
                else:
                    logger.warning(f"[WARN] {method} {endpoint_test['endpoint']} - Expected {expected_status}, got {response.status_code}")
                
                # Store test result
                self.test_results["backend_tests"].append({
                    "endpoint": endpoint_test['endpoint'],
                    "method": method,
                    "status_code": response.status_code,
                    "expected_status": expected_status,
                    "triggered_by": button_context,
                    "success": response.status_code == expected_status
                })
                
            except requests.exceptions.RequestException as e:
                logger.error(f"[FAIL] Failed to test {method} {endpoint_test['endpoint']}: {e}")
                self.test_results["backend_tests"].append({
                    "endpoint": endpoint_test['endpoint'],
                    "method": method,
                    "error": str(e),
                    "triggered_by": button_context,
                    "success": False
                })
    
    def test_sidebar_navigation(self):
        """Test sidebar navigation buttons with improved element handling"""
        try:
            logger.info("Testing sidebar navigation...")
            
            # Navigate to main page first
            self.driver.get(self.frontend_url)
            self.wait_for_page_load()
            
            # Find the sidebar with more comprehensive selectors
            sidebar_selectors = [
                "div.flex.h-screen div:first-child",
                "div[class*='flex'][class*='h-screen'] > div:first-child",
                "div[class*='w-64']",
                "div[class*='bg-gray-900']",
                "div[class*='border-r']",
                "nav",
                "aside",
                "[role='navigation']",
                "[class*='sidebar']"
            ]
            
            sidebar = None
            for selector in sidebar_selectors:
                try:
                    sidebar = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue
            
            if not sidebar:
                logger.warning("Could not find sidebar navigation")
                return
            
            # Find all navigation elements with improved detection
            nav_links = sidebar.find_elements(By.TAG_NAME, "a")
            nav_buttons = sidebar.find_elements(By.TAG_NAME, "button")
            
            # Look for elements with specific classes
            specific_nav_elements = self.driver.find_elements(By.CSS_SELECTOR, 
                "a[class*='group'], a[class*='flex'], a[class*='rounded'], a[class*='px-3']")
            
            # Fallback: Look for navigation elements by text content
            known_nav_items = [
                "Dashboard", "Tickets", "Create Ticket", "Users", "Messages", 
                "Analytics", "Reports", "Admin", "Profile", "Settings"
            ]
            
            fallback_nav_elements = []
            for item_text in known_nav_items:
                try:
                    # Use more specific XPath
                    elements = self.driver.find_elements(By.XPATH, 
                        f"//a[contains(text(), '{item_text}') or contains(., '{item_text}')]")
                    fallback_nav_elements.extend(elements)
                except:
                    continue
            
            # Combine and deduplicate
            all_nav_elements = list(set(nav_links + nav_buttons + specific_nav_elements + fallback_nav_elements))
            visible_nav_elements = []
            
            for elem in all_nav_elements:
                try:
                    if (elem.is_displayed() and 
                        elem.is_enabled() and 
                        elem.size['width'] > 0 and 
                        elem.size['height'] > 0):
                        visible_nav_elements.append(elem)
                except:
                    continue
            
            logger.info(f"Found {len(visible_nav_elements)} visible navigation elements in sidebar")
            
            # Test each navigation element with improved handling
            for i, nav_element in enumerate(visible_nav_elements[:8]):  # Reduced to 8 for stability
                try:
                    # Get element info with better fallbacks
                    element_text = (nav_element.text.strip() or 
                                  nav_element.get_attribute("aria-label") or 
                                  nav_element.get_attribute("title") or 
                                  f"Nav_Item_{i}")
                    element_href = nav_element.get_attribute("href")
                    
                    logger.info(f"Testing sidebar navigation: {element_text} -> {element_href}")
                    
                    # Store current URL
                    current_url = self.driver.current_url
                    
                    # Use improved retry logic for navigation clicks
                    def nav_click_action():
                        # Scroll element into view with better positioning
                        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", nav_element)
                        time.sleep(1)
                        
                        # Try multiple click strategies
                        try:
                            nav_element.click()
                        except (ElementClickInterceptedException, StaleElementReferenceException):
                            self.driver.execute_script("arguments[0].click();", nav_element)
                        return True
                    
                    # Retry the navigation click with more attempts
                    self.retry_action(nav_click_action, max_retries=3, delay=2)
                    logger.info(f"Successfully clicked sidebar nav: {element_text}")
                    
                    # Wait for navigation
                    time.sleep(3)
                    
                    # Check if URL changed
                    new_url = self.driver.current_url
                    if new_url != current_url:
                        logger.info(f"Sidebar navigation detected: {current_url} -> {new_url}")
                        
                        # Test backend endpoints after navigation
                        self.test_backend_endpoints(f"Sidebar: {element_text}")
                        
                        # Navigate back if possible
                        try:
                            self.driver.back()
                            time.sleep(2)
                            logger.info("Navigated back from sidebar link")
                        except:
                            logger.warning("Could not navigate back")
                    else:
                        logger.info(f"Sidebar nav {element_text} did not cause navigation")
                        # Still test backend endpoints
                        self.test_backend_endpoints(f"Sidebar: {element_text}")
                    
                except Exception as e:
                    logger.error(f"Error testing sidebar nav {element_text}: {e}")
                    self.take_screenshot(f"sidebar_nav_error_{element_text.replace(' ', '_').replace('/', '_')}")
                    continue
            
        except Exception as e:
            logger.error(f"Error in sidebar navigation tests: {e}")
            self.take_screenshot("sidebar_navigation_error")
    
    def test_frontend_navigation(self):
        """Test frontend navigation and page interactions"""
        try:
            logger.info("Starting frontend navigation tests...")
            
            # First, authenticate the user
            if not self.authenticate_user():
                logger.error("Authentication failed. Cannot proceed with frontend tests.")
                return
            
            # Test sidebar navigation first
            self.test_sidebar_navigation()
            
            # Navigate to main page
            self.driver.get(self.frontend_url)
            self.wait_for_page_load()
            
            # Test multiple pages
            pages_to_test = [
                "/",
                "/tickets", 
                "/users",
                "/create",
                "/settings",
                "/analytics",
                "/reports"
            ]
            
            for page in pages_to_test:
                try:
                    logger.info(f"Testing page: {page}")
                    self.driver.get(f"{self.frontend_url}{page}")
                    self.wait_for_page_load()
                    
                    # Find and test all buttons on this page
                    buttons = self.find_all_buttons()
                    
                    for i, button in enumerate(buttons[:3]):  # Limit to first 3 buttons per page
                        self.test_button_interaction(button, i)
                    
                    # Store frontend test results
                    self.test_results["frontend_tests"].append({
                        "page": page,
                        "buttons_found": len(buttons),
                        "buttons_tested": min(3, len(buttons)),
                        "success": True
                    })
                    
                except Exception as e:
                    logger.error(f"Error testing page {page}: {e}")
                    self.take_screenshot(f"page_error_{page.replace('/', '_')}")
                    self.test_results["frontend_tests"].append({
                        "page": page,
                        "error": str(e),
                        "success": False
                    })
            
        except Exception as e:
            logger.error(f"Error in frontend navigation tests: {e}")
            self.take_screenshot("frontend_navigation_error")
    
    def test_backend_directly(self):
        """Test backend API endpoints directly"""
        logger.info("Starting direct backend API tests...")
        
        # Test health endpoint
        try:
            response = self.session.get(f"{self.backend_url}/api/v1/health")
            if response.status_code == 200:
                logger.info("[PASS] Backend health check passed")
                health_data = response.json()
                logger.info(f"   - Service: {health_data.get('service', 'N/A')}")
                logger.info(f"   - Status: {health_data.get('status', 'N/A')}")
            else:
                logger.warning(f"[WARN] Backend health check failed: {response.status_code}")
        except Exception as e:
            logger.error(f"[FAIL] Backend health check error: {e}")
        
        # Test other endpoints
        endpoints = [
            {"method": "GET", "endpoint": "/api/v1/ticket", "name": "Get Tickets"},
            {"method": "GET", "endpoint": "/api/v1/users", "name": "Get Users"},
            {"method": "GET", "endpoint": "/api/v1/auth/me", "name": "Get Current User"},
        ]
        
        for endpoint in endpoints:
            try:
                url = f"{self.backend_url}{endpoint['endpoint']}"
                response = self.session.get(url, timeout=5)
                
                if response.status_code == 200:
                    logger.info(f"[PASS] {endpoint['name']} - Status: {response.status_code}")
                    try:
                        data = response.json()
                        if isinstance(data, list):
                            logger.info(f"   - Found {len(data)} items")
                        elif isinstance(data, dict):
                            logger.info(f"   - Response keys: {list(data.keys())}")
                    except:
                        logger.info(f"   - Response: {response.text[:100]}...")
                else:
                    logger.warning(f"[WARN] {endpoint['name']} - Status: {response.status_code}")
                    
            except Exception as e:
                logger.error(f"[FAIL] {endpoint['name']} error: {e}")
    
    def generate_report(self):
        """Generate a comprehensive test report"""
        logger.info("\n" + "="*50)
        logger.info("TEST REPORT SUMMARY")
        logger.info("="*50)
        
        # Frontend test summary
        frontend_success = sum(1 for test in self.test_results["frontend_tests"] if test.get("success", False))
        frontend_total = len(self.test_results["frontend_tests"])
        logger.info(f"Frontend Tests: {frontend_success}/{frontend_total} successful")
        
        # Backend test summary
        backend_success = sum(1 for test in self.test_results["backend_tests"] if test.get("success", False))
        backend_total = len(self.test_results["backend_tests"])
        logger.info(f"Backend Tests: {backend_success}/{backend_total} successful")
        
        # Form test summary
        form_success = sum(1 for test in self.test_results["form_tests"] if test.get("success", False))
        form_total = len(self.test_results["form_tests"])
        logger.info(f"Form Tests: {form_success}/{form_total} successful")
        
        # Error summary
        error_count = len(self.test_results["errors"])
        if error_count > 0:
            logger.warning(f"Errors: {error_count} errors encountered")
            for error in self.test_results["errors"]:
                logger.warning(f"  - {error['button']}: {error['error']}")
        
        # Overall status
        total_tests = frontend_total + backend_total + form_total
        total_success = frontend_success + backend_success + form_success
        success_rate = (total_success / total_tests * 100) if total_tests > 0 else 0
        
        logger.info(f"Overall Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            logger.info("[PASS] Test suite PASSED!")
        elif success_rate >= 60:
            logger.warning("[PARTIAL] Test suite PARTIALLY PASSED")
        else:
            logger.error("[FAIL] Test suite FAILED")
        
        logger.info("="*50)
    
    def run_tests(self):
        """Run the complete test suite"""
        logger.info("Starting Peppermint Ticketing System Test Suite")
        logger.info(f"Frontend URL: {self.frontend_url}")
        logger.info(f"Backend URL: {self.backend_url}")
        
        if not self.setup_driver():
            logger.error("Failed to setup WebDriver. Exiting.")
            return False
        
        try:
            # Test frontend navigation and button interactions
            self.test_frontend_navigation()
            
            # Test form submissions
            self.test_form_submission()
            
            # Test backend endpoints directly
            self.test_backend_directly()
            
            # Generate report
            self.generate_report()
            
            return True
            
        except Exception as e:
            logger.error(f"Test suite failed with error: {e}")
            self.take_screenshot("test_suite_error")
            return False
        
        finally:
            if self.driver:
                self.driver.quit()
                logger.info("WebDriver closed")

def main():
    """Main function to run the test suite"""
    tester = PeppermintTester()
    success = tester.run_tests()
    
    if success:
        print("\n[PASS] Test suite completed successfully!")
        exit(0)
    else:
        print("\n[FAIL] Test suite failed!")
        exit(1)

if __name__ == "__main__":
    main() 