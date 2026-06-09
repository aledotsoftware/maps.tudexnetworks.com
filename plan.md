1. **Refactor custom file upload element to a native `<button>` in `openfiles.js`:**
   - Use `replace_with_git_merge_diff` to modify `src/js/components/openfiles/openfiles.js`.
   - Locate `let divaux = document.createElement("div");` around line 97.
   - Change `document.createElement("div")` to `document.createElement("button")`.
   - Set `divaux.type = "button";` to explicitly declare its behavior.
   - Remove `divaux.setAttribute("role", "button");` and `divaux.setAttribute("tabindex", "0");` as they are no longer necessary for native buttons.
   - Remove the custom `keydown` event listener for "Enter" and " " handling. Native buttons will automatically fire a `click` event when these keys are pressed.
   - Locate `let icon_file = document.createElement("div");` around line 403. This is the delete file action.
   - Change `document.createElement("div")` to `document.createElement("button")`.
   - Set `icon_file.type = "button";`.
   - Set `icon_file.className = "btn-delete-file";` for targeted styling.
   - Remove `icon_file.setAttribute("role", "button");` and `icon_file.setAttribute("tabindex", "0");`.
   - Remove the custom `keydown` event listener for `icon_file`.

2. **Add CSS styles for native buttons in `openfiles.css`:**
   - Use `replace_with_git_merge_diff` to modify `src/js/components/openfiles/openfiles.css` to add reset and focus styles for the `.upload` button (at the bottom, or near `.upload` definition) and the `.btn-delete-file` button:
     ```css
     button.upload {
       background: transparent;
       border: none;
       padding: 0;
       outline-offset: -2px;
     }
     button.upload:focus-visible {
       outline: 2px solid #64FFDA;
       outline-offset: 2px;
     }
     button.btn-delete-file {
       background: transparent;
       border: none;
       padding: 0;
       cursor: pointer;
       display: inline-flex;
       align-items: center;
       justify-content: center;
     }
     button.btn-delete-file:focus-visible {
       outline: 2px solid #64FFDA;
       outline-offset: 2px;
       border-radius: 50%;
     }
     ```

3. **Install Playwright for verification:**
   - Use `run_in_bash_session` to install Playwright in an isolated directory:
     `mkdir -p /home/jules/verification && cd /home/jules/verification && pnpm init && pnpm add playwright && pnpm dlx playwright install chromium`

4. **Start local test server:**
   - Use `run_in_bash_session` to run `python3 -m http.server 3000 &` to serve the application.

5. **Write the verification Playwright script:**
   - Use `run_in_bash_session` with a heredoc (`cat << 'EOF' > verify.mjs`) to write the test script:
     ```javascript
     import { chromium } from '/home/jules/verification/node_modules/playwright/index.mjs';

     (async () => {
       const browser = await chromium.launch();
       const page = await browser.newPage();
       await page.goto('http://localhost:3000');
       await page.waitForTimeout(1000);

       await page.evaluate(() => {
          import('/src/js/components/openfiles/openfiles.js').then(module => {
          }).catch(console.error);

          const logo_upload = document.createElement("div");
          logo_upload.className = "wrapper";

          const divaux = document.createElement("button");
          divaux.id = "logo_upload_container";
          divaux.className = "upload";
          divaux.setAttribute("aria-label", "Abrir archivo");

          document.body.appendChild(divaux);
       });

       await page.waitForTimeout(500);
       await page.focus('#logo_upload_container');
       await page.keyboard.press('Tab');
       await page.screenshot({ path: 'focus_visible.png', fullPage: true });

       await browser.close();
     })();
     ```

6. **Execute verification script and verify images:**
   - Run `node verify.mjs` using `run_in_bash_session`.
   - Use `read_image_file` to review `focus_visible.png`.

7. **Kill local server:**
   - Run `kill $(lsof -t -i :3000) 2>/dev/null` using `run_in_bash_session`.

8. **Verify syntax:**
   - Use `run_in_bash_session` with `node --check src/js/components/openfiles/openfiles.js` to ensure there are no syntax errors introduced.

9. **Complete pre-commit steps:**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
