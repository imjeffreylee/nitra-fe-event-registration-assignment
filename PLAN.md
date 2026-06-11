# Project Plan & Reflection: Nitra Event Registration

## How you planned and broke down the task
- **Design Review & Component Classification:** Reviewed the design prototype and categorized components into layouts (`MainLayout.vue`), pages (`AttendeeInfoPage.vue`, `SessionsPage.vue`, etc.), main components (`OrderSummary.vue`, `TicketTypeSection.vue`), and highly reusable UI components (`FormField.vue`, `ActionBar.vue`, `PageContainer.vue`).
- **Scaffolding & Mocking:** Established the UI structures with the classified components and bound them to mock data to build a static visual prototype.
- **Core Functionality Integration:** Implemented the step-by-step page-routing flow and state transition logic.
- **State Refactoring & Centralization:** Refactored the independent `sessionStorage` parsing/persistence code across steps into a unified, reactive singleton Vue 3 Composable (`useRegistration.js`).
- **Conflict & Validation Logic:** Integrated the overlap-detection algorithms for schedule slots and connected dynamic required checks (e.g., shipping address).
- **i18n & Fine-Tuning:** Applied multi-language localization (English and Italian) across all UI copies, and polished responsive web design (RWD) for seamless mobile views.

---

## Key decisions and why you made them
1. **Singleton Composable Pattern for State Management:**
   - **Why:** Rather than pulling in a heavier state-management library like Pinia, a custom Vue 3 reactive singleton was constructed inside `useRegistration.js`. Defining `const state = reactive(...)` outside the exported hook function ensures that all pages share a single, reactive in-memory state object.
2. **Session Storage (`sessionStorage`) over Local Storage (`localStorage`):**
   - **Why:** Using `sessionStorage` ensures that form entries survive page refreshes within the same tab, but are cleared when the tab is closed or a new session is opened. This prevents sensitive attendee information from lingering indefinitely or bleeding across concurrent registration tabs.
3. **Targeted State and Storage Reset (`clearRegistration`):**
   - **Why:** Instead of invoking `sessionStorage.clear()`, which might wipe unrelated cache/tokens, `clearRegistration()` resets the singleton reactive state properties in-memory to their default states and calls `sessionStorage.removeItem()` specifically on the registration-related keys.

---

## Why you chose each additional dependency (what problem it solves, alternatives you considered)
- **No Additional Third-Party Dependencies:**
   - **Why:** During planning, third-party libraries (such as `lodash` for cloning or `vee-validate` for form handling) were considered. However, I decided to build all validation rules and object operations using native modern JavaScript (ES6+) and standard Vue 3 reactivity primitives. This keeps the application bundle ultra-lightweight, minimizes supply-chain vulnerability risks, and leverages Quasar and Vue's native capabilities to their fullest.

---

## How you used AI tools (prompts, conversations, what worked / what didn’t)
- **What Worked:**
  - **Conflict-Detection Algorithm:** Brainstormed the schedule interval overlap logic (`areOverlapping`) with AI, evaluating boundary edge cases (such as exact back-to-back sessions). The formula `sA < eB && sB < eA` was suggested and implemented, which is much cleaner than multiple nested range checks.
  - **i18n Schema Structure:** AI was utilized to draft corresponding translation key-value mappings for Italian (`it`) and US English (`en-US`) to ensure completeness.
- **What Didn't Work:**
  - **Overloaded Components:** AI initially suggested putting validation error messages directly inside individual page page-components. This led to duplicate validator functions and synchronization issues. I pivoted by refactoring all computed validation helpers (e.g., `emailErrorMessage`, `phoneErrorMessage`) directly into the shared `useRegistration.js` store, ensuring a single source of truth.

---

## Any challenges encountered and how you solved them
1. **Dynamic Form Requirements (Shipping Address):**
   - **Challenge:** The shipping address field in Step 1 is optional by default, but must become strictly required if the user adds any merchandise in Step 3.
   - **Solution:** Solved by defining a computed `isRequired` map inside `useRegistration.js`. It checks if any merchandise item has a quantity greater than zero. The `AttendeeInfoPage` dynamically reads from this reactive computed property to toggle form field indicators, and the `ReviewPage` uses it for unified submit-time validation.
2. **Back-to-Back Stepper & Success Redirection:**
   - **Challenge:** On successful submission, the system needs to render a summary success screen and reset the wizard state, but navigating away or refreshing could break the success screen if state was instantly cleared.
   - **Solution:** Created an internal `isSubmitted` state toggle on `ReviewPage.vue`. When the user clicks submit, we snapshot the necessary summary details (`registrationDetails`), flag `isSubmitted = true`, and safely invoke `clearRegistration()` to clean up the store and storage. The success state is rendered in-place using `<Success>` while ensuring the registration flow is fully reset for subsequent entries.

---

## What you would improve given more time
1. **Comprehensive Automated Testing:**
   - Add unit tests (using Vitest) targeting the `useRegistration.js` validations and overlap conflict detection logic, ensuring reliability as future schedule slots are added.
2. **Asynchronous API Integration:**
   - Replace the simulation of submission with an actual Axios/Fetch POST request to a mock server, handling loading overlays, transaction timeouts, and retry logic.
3. **Debounced/Real-Time Field Validation UX:**
   - Although step validation is deferred to step-submit, adding debounced real-time field status feedback (e.g., validating email format *while typing* but not instantly showing errors before they finish) would greatly improve the input experience.
