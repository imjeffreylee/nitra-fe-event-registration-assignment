# Technical Specification: Shared Registration Composable

## 1. Overview
The multi-step registration wizard currently manages its form state by reading and writing to `localStorage` independently on each step page. This design introduces duplicate parsing logic, verbose lifecycles, and synchronization risks across pages. 

We will introduce a shared Vue 3 Composable (`src/composables/useRegistration.js`) that maintains a single, unified reactive state object in-memory (singleton pattern) and automatically synchronizes mutations to `localStorage` via Vue `watch` side-effects.

---

## 2. Architecture & Data Flow

```
                      +-----------------------------+
                      |   useRegistration Store     |
                      |  (Singleton Reactive State)  |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                     |                     |
     +---------v---------+ +---------v---------+ +---------v---------+
     | AttendeeInfoPage  | |   SessionsPage    | |    AddonsPage     |
     +---------+---------+ +---------+---------+ +---------+---------+
               |                     |                     |
               +---------------------+---------------------+
                                     |
                          +----------v----------+
                          |     ReviewPage      |
                          +----------+----------+
                                     | (on success)
                                     v
                        +------------+------------+
                        |    clearRegistration    |
                        | (Wipe state & storage)  |
                        +-------------------------+
```

### 2.1 State Definition & Key Mappings
The global state will be modeled as a single reactive object. To maintain backward compatibility with the existing system and preserve user data, properties in the state will map to their exact `localStorage` keys as follows:

| Composable State Property | `localStorage` Key | Type | Fallback/Default |
|---------------------------|---------------------|------|------------------|
| `ticketType` | `'selected_ticket'` | String | `'vip'` |
| `fullName` | `'attendee_full_name'` | String | `''` |
| `email` | `'attendee_email'` | String | `''` |
| `phone` | `'attendee_phone'` | String | `''` |
| `company` | `'attendee_company'` | String | `''` |
| `jobTitle` | `'attendee_job_title'` | String | `''` |
| `shippingAddress` | `'attendee_shipping_address'` | String | `''` |
| `selectedSessions` | `'selected_sessions'` | Array (String) | `[]` |
| `selectedWorkshops` | `'selected_workshops'` | Array (String) | `[]` |
| `selectedMeals` | `'selected_meals'` | Array (String) | `[]` |
| `selectedMerchandise` | `'selected_merchandise'` | Object | `{}` |

### 2.2 Storage Synchronization & Reactivity Safety
To ensure components can destructure properties from the composable without losing reactivity, the composable will export the state wrapped in `toRefs(state)`.

Vue `watch` wrappers will observe individual properties of the state:
- Primitive values (e.g., `fullName`) will use shallow watches.
- Collection values (e.g., `selectedSessions`, `selectedMerchandise`) will use deep watches.
- All watchers will synchronize state changes to `localStorage` using the exact keys mapped above.

---

## 3. Detailed Component Refactoring Plans

### 3.1 Composable (`src/composables/useRegistration.js`)
*   Initialize state from `localStorage` values, providing robust fallbacks (e.g., parsing JSON safely).
*   Create watches for automatic persistence.
*   Export `clearRegistration()` utility function which specifically target-removes the registration keys listed in section 2.1 using `localStorage.removeItem()` rather than `localStorage.clear()` (to avoid wiping unrelated storage data).

### 3.2 Attendee Info Page (`src/pages/AttendeeInfoPage.vue`)
*   Bind form inputs directly to the destructured `toRefs` reactive properties from the composable.
*   Wipe all localized state properties and lifecycle loaders.
*   Keep the computed `hasMerchandise` property linked to the shared state's `selectedMerchandise` dictionary. This ensures dynamic address validation still works seamlessly.

### 3.3 Sessions Page (`src/pages/SessionsPage.vue`)
*   Extract `selectedSessions` from the composable.
*   Remove local watchers and parsing logic.

### 3.4 Add-ons Page (`src/pages/AddonsPage.vue`)
*   Bind selection arrays and objects (`selectedWorkshops`, `selectedMeals`, `selectedMerchandise`) directly from the composable.
*   Provide standard mutators like `updateMerchQty` and `updateMerchSize` to directly modify the shared `selectedMerchandise` dictionary.

### 3.5 Review Page (`src/pages/ReviewPage.vue`)
*   Read all final selections from the composable to render the static summary.
*   Enable the "Submit Registration" button on the `ActionBar` by setting `:show-next="true"` (or omitting `:show-next`), changing the label, and registering a `@next` handler.
*   Create a submit handler that simulates registration submission, triggers `clearRegistration()`, and routes the user to a success state or shows a success notification.

---

## 4. Verification Plan
*   **Compilation & Build:** Run `yarn build` to verify standard type, syntax, and bundler compliance.
*   **Functional Verification:**
    *   Verify input entries on step 1 persist to Step 2 and 3.
    *   Verify refreshing the page at any step preserves input selections.
    *   Verify that submitting the form on the Review Page successfully triggers state clear.
