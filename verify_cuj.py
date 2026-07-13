from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8081")
    page.wait_for_timeout(2000)

    # Click the FAB to add a new debt
    page.get_by_test_id("fab").click()
    page.wait_for_timeout(500)

    # Fill out the add debt form
    page.get_by_test_id("input-title").fill("Laptop")
    page.wait_for_timeout(500)

    page.get_by_test_id("input-amount").fill("1500")
    page.wait_for_timeout(500)

    page.get_by_test_id("radio-credito").click()
    page.wait_for_timeout(500)

    page.get_by_test_id("input-dueDate").fill("2024-12-01")
    page.wait_for_timeout(500)

    page.get_by_test_id("input-description").fill("Compra de equipo")
    page.wait_for_timeout(500)

    # Save
    page.get_by_test_id("btn-save").click()
    page.wait_for_timeout(1000)

    # Verify debt on home screen and go to detail
    page.get_by_text("Laptop").click()
    page.wait_for_timeout(1000)

    # Mark as paid
    page.get_by_test_id("btn-mark-paid").click()
    page.wait_for_timeout(500)

    # Handle Alert OK (Playwright handles dialogs automatically by accepting them if no listener is there, but let's be explicit if needed, however wait to see if it just proceeds)
    page.wait_for_timeout(1000)

    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        # Accept alerts automatically
        page.on("dialog", lambda dialog: dialog.accept())
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
