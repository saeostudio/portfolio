from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path to index.html
        cwd = os.getcwd()
        url = f"file://{cwd}/index.html"

        print(f"Navigating to {url}")
        page.goto(url)

        # Take screenshot of Homepage
        page.screenshot(path="verification/home.png")
        print("Home screenshot taken.")

        # Click on 'Commissioned'
        page.click("text=Commissioned")
        page.wait_for_load_state('networkidle')

        # Take screenshot of Category Page
        page.screenshot(path="verification/category.png")
        print("Category screenshot taken.")

        # Click on first project
        # In the new HTML structure, projects are linked via .project-item
        page.locator(".project-item").first.click()
        page.wait_for_load_state('networkidle')

        # Take screenshot of Project Page
        page.screenshot(path="verification/project.png")
        print("Project screenshot taken.")

        browser.close()

if __name__ == "__main__":
    run()
