import React, { useState } from "react";
// Define the structure for method details
interface MethodDetail {
  name: string;
  description: string;
  params?: string;
  usage?: string;
  pitfalls?: string;
  example?: string;
  details?: string; // General details, overloads, return values etc.
}

// Define the structure for nodescd
interface NodeData {
  description: string;
  children?: string[];
  methods?: MethodDetail[];
  accessedVia?: string; // How this interface/concept is typically accessed
}

const MindMap = () => {
  // Node expanded state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "IWebDriver": true,
    "IWebElement": false,
    "IAlert": false,
    "INavigation": false,
    "IOptions": false,
    "ITargetLocator": false,
    "ICookieJar": false,
    "Actions API": false, // Representing IAction concept via Actions class
    "ITimeouts": false,
    "IWindow": false,
    "IJavaScriptExecutor": false,
    "ITakesScreenshot": false,
    "ILocatable": false,
    "ISearchContext": false,
  });

  // Method expanded state
  const [expandedMethods, setExpandedMethods] = useState<Record<string, boolean>>({});

  // Node data structure - enriched with report details
  const nodes: Record<string, NodeData> = {
    "IWebDriver": {
      description: "Primary interface for controlling a web browser instance. Central command hub for automation. Engineered to mirror human actions.",
      children: ["INavigation", "IOptions", "ITargetLocator"], // Simplified children based on access methods
      methods: [
        {
          name: "FindElement(By by)",
          description: "Locates the *first* web element matching the specified criteria.",
          params: "By by: The locator strategy object. The By class offers static methods: By.Id(), By.Name(), By.XPath(), By.CssSelector(), By.LinkText(), By.PartialLinkText(), By.TagName(), By.ClassName().",
          usage: "Interacting with a single, unique element (e.g., clicking a specific button, entering text into a specific field). Foundational step before interaction.",
          pitfalls: "Throws NoSuchElementException if no element is found (requires handling). Avoid brittle locators (e.g., index-based XPath). Overly complex XPath can impact performance.",
          example: "IWebDriver driver = new ChromeDriver();\ndriver.Navigate().GoToUrl(\"https://example.com/login\");\nIWebElement usernameField = driver.FindElement(By.Id(\"username\"));\nIWebElement passwordField = driver.FindElement(By.Name(\"password\"));\nIWebElement loginButton = driver.FindElement(By.XPath(\"//button[text()='Login']\"));",
          details: "Crucial first step in automation. Returns an IWebElement object. Flexibility comes from the various By strategies. No direct method overloads, but By provides versatility."
        },
        {
          name: "FindElements(By by)",
          description: "Locates *all* web elements matching the specified criteria.",
          params: "By by: The locator strategy object (same options as FindElement).",
          usage: "Verifying multiple elements (e.g., checking all links, getting all items in a list), iterating through a list of elements.",
          pitfalls: "Ensure the criteria correctly selects only the desired elements.",
          example: "ReadOnlyCollection<IWebElement> errorMessages = driver.FindElements(By.ClassName(\"error\"));\n// Check if any errors exist:\nif (errorMessages.Count > 0) { /* handle errors */ }",
          details: "Returns a ReadOnlyCollection<IWebElement>. Returns an *empty collection* (not null, no exception) if no elements are found, allowing for graceful handling."
        },
        {
          name: "Navigate()",
          description: "Accesses the INavigation interface for browser history and URL navigation.",
          usage: "Returns an INavigation object to control browser navigation (GoToUrl, Back, Forward, Refresh).",
          details: "Entry point property, does not take parameters itself. Acts like the browser's navigation bar (address bar, back/forward/refresh buttons).",
          example: "// See INavigation methods for specific examples like:\ndriver.Navigate().GoToUrl(\"https://example.com\");"
        },
        {
          name: "Manage()",
          description: "Accesses interfaces for managing browser settings like timeouts, cookies, and window properties.",
          usage: "Returns an IOptions object, which provides access to further management interfaces (Cookies, Timeouts, Window).",
          details: "Acts like accessing the browser's control panel or settings menu. Entry point property, no parameters itself. Essential for configuring the browser environment for robust tests.",
          example: "// See IOptions, ICookieJar, ITimeouts, IWindow methods for specific examples like:\ndriver.Manage().Window.Maximize();\ndriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);"
        },
        {
          name: "SwitchTo()",
          description: "Accesses the ITargetLocator interface for switching the WebDriver's focus between different contexts (frames, windows, alerts).",
          usage: "Returns an ITargetLocator object. Essential for interacting with elements not in the main document.",
          details: "Entry point property, no parameters itself. Directs WebDriver's attention to specific UI parts (frames, new windows/tabs, alerts).",
          example: "// See ITargetLocator methods for specific examples like:\ndriver.SwitchTo().Frame(\"myFrame\");\ndriver.SwitchTo().Alert().Accept();"
        },
        {
          name: "Close()",
          description: "Closes the currently focused browser window or tab.",
          usage: "Closing individual tabs or windows during a test while keeping others open. Similar to clicking the 'X' on a single tab/window.",
          pitfalls: "If it's the last window associated with the WebDriver session, it *may* quit the entire browser process (behavior can vary). Using Close() when Quit() is needed can lead to resource leaks if other windows/processes remain.",
          example: "driver.Close(); // Closes the current window/tab",
          details: "No parameters or overloads. Focus shifts to another window if available after close, but the specific window is driver-dependent."
        },
        {
          name: "Quit()",
          description: "Closes *all* browser windows associated with the session, terminates the underlying browser process, and ends the WebDriver session.",
          usage: "Best practice for cleanup at the end of a test session or suite to release all system resources. Completely exits the browser application started by WebDriver.",
          pitfalls: "Ends the entire session; no further commands can be sent to this driver instance afterwards.",
          example: "driver.Quit(); // Closes all windows and ends session",
          details: "No parameters or overloads. Ensures clean termination and prevents resource leaks."
        },
        {
            name: "Title",
            description: "Gets the title of the currently focused browser window/tab.",
            usage: "Verifying the title of the loaded page for assertion.",
            example: "string pageTitle = driver.Title;\nAssert.AreEqual(\"Expected Page Title\", pageTitle);",
            details: "Returns a string. Read-only property."
        },
        {
            name: "CurrentWindowHandle",
            description: "Gets the unique identifier (handle) of the currently focused browser window/tab.",
            usage: "Storing the handle of the original window before switching to a new one, so you can switch back.",
            example: "string originalHandle = driver.CurrentWindowHandle;",
            details: "Returns a string handle. Read-only property."
        },
        {
            name: "WindowHandles",
            description: "Gets a collection of unique identifiers (handles) for all open windows/tabs associated with the current WebDriver session.",
            usage: "Iterating through all open window handles to find and switch to a specific new window/tab.",
            example: "ReadOnlyCollection<string> allHandles = driver.WindowHandles;\nforeach (string handle in allHandles) { /* ... */ }",
            details: "Returns a ReadOnlyCollection<string>. Read-only property."
        }
      ]
    },
    "IWebElement": {
      description: "Represents an individual HTML element on a webpage. Enables interaction with located elements.",
      methods: [
        {
          name: "Click()",
          description: "Simulates a mouse click (left-click) on the element.",
          usage: "Interacting with buttons, links, checkboxes, radio buttons. Triggers associated events. Waits for page load if click causes navigation.",
          pitfalls: "Element must be visible and enabled (interactable). Reference might become stale after click (StaleElementReferenceException) if page reloads/changes - re-find the element. Use waits (explicit/implicit) if element is not immediately interactable.",
          example: "IWebElement loginButton = driver.FindElement(By.Id(\"login\"));\nloginButton.Click();",
          details: "Performs a click at the element's center point. No parameters or overloads."
        },
        {
          name: "SendKeys(string text)",
          description: "Simulates typing text into an editable element (e.g., <input>, <textarea>).",
          params: "string text: The sequence of characters or Keys constants to send.",
          usage: "Filling out form fields, search boxes. Can use Keys class for special keys (e.g., Keys.Enter, Keys.Tab, Keys.Control + 'a').",
          pitfalls: "Element must be editable and visible. Doesn't clear existing text by default; use Clear() first if needed. Ensure element has focus (clicking it first might help). For complex key combinations, consider Actions API.",
          example: "IWebElement searchBox = driver.FindElement(By.Name(\"q\"));\nsearchBox.Clear(); // Optional: clear existing text\nsearchBox.SendKeys(\"Selenium WebDriver\" + Keys.Enter);",
          details: "Appends text if called multiple times without Clear()."
        },
        {
          name: "GetAttribute(string attributeName)",
          description: "Retrieves the current value of a specified HTML attribute of the element.",
          params: "string attributeName: Name of the HTML attribute (e.g., 'href', 'value', 'class', 'id', 'src', 'style', 'checked', 'disabled').",
          usage: "Verifying element properties (e.g., link URL, image source, input value), extracting data, checking element state (e.g., if a checkbox is 'checked').",
          pitfalls: "Returns null or empty string if the attribute does not exist (handle this). Distinguish HTML attributes from DOM properties (sometimes they differ, e.g., boolean attributes like 'checked').",
          example: "IWebElement link = driver.FindElement(By.LinkText(\"Download\"));\nstring url = link.GetAttribute(\"href\");\n\nIWebElement checkbox = driver.FindElement(By.Id(\"terms\"));\nbool isChecked = !string.IsNullOrEmpty(checkbox.GetAttribute(\"checked\")); // Check if 'checked' attribute exists",
          details: "Returns the attribute value as a string."
        },
        {
          name: "Text",
          description: "Retrieves the rendered, *visible* text content of the element, including its sub-elements.",
          usage: "Verifying displayed messages, labels, headings, paragraph content.",
          pitfalls: "Only gets *visible* text (text hidden by CSS will not be returned). May include unwanted leading/trailing whitespace or newlines (consider using .Trim()).",
          example: "IWebElement messageElement = driver.FindElement(By.ClassName(\"status-message\"));\nstring message = messageElement.Text;\nAssert.AreEqual(\"Success!\", message.Trim());",
          details: "Returns a string. Read-only property. Concatenates text from descendant elements."
        },
        {
          name: "Displayed",
          description: "Checks if the element is currently rendered and visible on the page.",
          usage: "Verifying element visibility before interaction. Handling dynamically appearing/disappearing elements. Asserting UI state.",
          pitfalls: "Element can be present in the DOM but not displayed (returns false). Use this check before attempting actions like Click() on elements that might be hidden.",
          example: "IWebElement errorMsg = driver.FindElement(By.Id(\"error\"));\nif (errorMsg.Displayed)\n{\n    Console.WriteLine(\"Error is visible: \" + errorMsg.Text);\n}",
          details: "Returns a boolean. An element is generally considered displayed if it has non-zero height and width and is not hidden via CSS (e.g., display: none, visibility: hidden)."
        },
        {
          name: "Enabled",
          description: "Checks if the element is enabled for interaction (typically for form elements like buttons, inputs).",
          usage: "Ensuring interactive elements (buttons, inputs) are enabled before attempting actions like Click() or SendKeys(). Asserting UI state.",
          pitfalls: "Attempting actions on disabled elements might cause errors (e.g., ElementNotInteractableException) or simply have no effect. Check this property before interaction.",
          example: "IWebElement submitButton = driver.FindElement(By.Id(\"submit\"));\nif (submitButton.Enabled)\n{\n    submitButton.Click();\n} else {\n    Console.WriteLine(\"Submit button is disabled.\");\n}",
          details: "Returns a boolean. Read-only property."
        },
        {
            name: "Clear()",
            description: "Clears the text content of an editable element (e.g., <input type='text'>, <textarea>).",
            usage: "Resetting form fields before entering new data to ensure the field contains only the intended input.",
            pitfalls: "Only works on editable elements. Throws exception if called on non-editable elements.",
            example: "IWebElement usernameField = driver.FindElement(By.Id(\"username\"));\nusernameField.Clear();\nusernameField.SendKeys(\"newUser\");",
            details: "No parameters or return value."
        },
        {
            name: "Submit()",
            description: "Submits the form this element belongs to. If the element is a submit button, it clicks it. If it's any other element within a form, it triggers the form's submit action.",
            usage: "Convenient way to submit forms without explicitly finding and clicking the submit button.",
            pitfalls: "Element must be inside a <form> tag. If the element is not in a form, a NoSuchElementException might be thrown.",
            example: "IWebElement passwordField = driver.FindElement(By.Id(\"password\"));\npasswordField.SendKeys(\"secret\");\npasswordField.Submit(); // Submits the form containing the password field",
            details: "No parameters or return value."
        },
        {
            name: "TagName",
            description: "Gets the HTML tag name of this element (e.g., 'input', 'a', 'div').",
            usage: "Verifying the type of an element, useful in assertions or conditional logic.",
            example: "IWebElement element = driver.FindElement(By.Id(\"someId\"));\nstring tag = element.TagName;\nAssert.AreEqual(\"button\", tag.ToLower());",
            details: "Returns the tag name as a lowercase string. Read-only property." },
        {
            name: "Location",
            description: "Gets the coordinates (X, Y) of the element's top-left corner relative to the top-left corner of the page rendering.",
            usage: "Advanced interactions, visual testing, determining element position.",
            example: "Point location = element.Location;\nConsole.WriteLine($\"Element Location: X={location.X}, Y={location.Y}\");",
            details: "Returns a System.Drawing.Point object. Read-only property."
        },
        {
            name: "Size",
            description: "Gets the height and width of the element's rendered dimensions.",
            usage: "Verifying element dimensions, responsive design testing.",
            example: "Size size = element.Size;\nConsole.WriteLine($\"Element Size: Width={size.Width}, Height={size.Height}\");",
            details: "Returns a System.Drawing.Size object. Read-only property."
        },
        {
            name: "Selected",
            description: "Checks if a selectable element (<option>, <input type='checkbox'>, <input type='radio'>) is currently selected.",
            usage: "Verifying the state of checkboxes, radio buttons, or selected options in a dropdown.",
            example: "IWebElement checkbox = driver.FindElement(By.Id(\"agree\"));\nif (checkbox.Selected)\n{\n    Console.WriteLine(\"Checkbox is selected.\");\n}",
            details: "Returns a boolean. Read-only property."
        },
        {
            name: "GetCssValue(string propertyName)",
            description: "Gets the computed value of a specified CSS property for this element.",
            params: "string propertyName: The name of the CSS property (e.g., 'color', 'font-size', 'background-color', 'display').",
            usage: "Verifying element styling, checking computed styles.",
            example: "string color = element.GetCssValue(\"color\");\nstring display = element.GetCssValue(\"display\");\nConsole.WriteLine($\"Element color: {color}, display: {display}\");",
            details: "Returns the computed style value as a string (e.g., colors might be returned as rgba or hex). Property names are typically hyphenated (CSS standard)."
        }
      ]
    },
    "INavigation": {
      accessedVia: "driver.Navigate()",
      description: "Provides methods for controlling the browser's navigation: moving to URLs and traversing history. Programmatic access to browser navigation controls.",
      methods: [
        {
          name: "GoToUrl(string url) / GoToUrl(Uri url)",
          description: "Navigates the current browser window/tab to the specified URL.",
          params: "string url or System.Uri url: The web address (URL) to load.",
          usage: "Opening the application's start page, moving between different pages/sections, accessing external resources.",
          pitfalls: "Ensure URL is correct, accessible, and properly formatted (including protocol like http/https). Automation script must wait for page load completion *after* navigation before interacting with elements.",
          example: "driver.Navigate().GoToUrl(\"https://www.selenium.dev\");\ndriver.Navigate().GoToUrl(new Uri(\"https://example.com/login\"));",
          details: "Two overloads provided for convenience (string or Uri object). Uri object can be useful for complex/programmatically constructed URLs."
        },
        {
          name: "Back()",
          description: "Navigates the browser back one step in the session's history.",
          usage: "Simulating the user clicking the browser's 'Back' button. Useful for testing multi-step flows involving backward navigation.",
          pitfalls: "Relies on the browser session having a history. May have no effect if there is no previous page in the history. Avoid relying on specific history states between independent tests.",
          example: "driver.Navigate().GoToUrl(\"https://page1.com\");\ndriver.Navigate().GoToUrl(\"https://page2.com\");\ndriver.Navigate().Back(); // Goes back to page1.com",
          details: "No parameters or overloads."
        },
        {
          name: "Forward()",
          description: "Navigates the browser forward one step in the session's history.",
          usage: "Simulating the user clicking the browser's 'Forward' button (typically only active after navigating back).",
          pitfalls: "Relies on having navigated back previously. May have no effect if there is no subsequent page in the forward history.",
          example: "driver.Navigate().GoToUrl(\"https://page1.com\");\ndriver.Navigate().GoToUrl(\"https://page2.com\");\ndriver.Navigate().Back(); // Back to page1\ndriver.Navigate().Forward(); // Forward to page2 again",
          details: "No parameters or overloads."
        },
        {
          name: "Refresh()",
          description: "Reloads the current webpage in the browser.",
          usage: "Ensuring the automation script is working with the latest version of the page content, especially in dynamic web applications or after actions that update the page without full navigation. Equivalent to pressing F5 or clicking the refresh button.",
          pitfalls: "Refreshing unnecessarily slows down test execution. Use only when needed (e.g., to reflect server-side changes).",
          example: "driver.Navigate().Refresh(); // Reloads the current page",
          details: "No parameters or overloads."
        }
      ]
    },
     "ITargetLocator": {
      accessedVia: "driver.SwitchTo()",
      description: "Provides methods to switch the WebDriver's focus between different browser contexts: frames, windows, and alerts.",
      methods: [
        {
          name: "Frame(int frameIndex)",
          description: "Switches focus to a frame/iframe using its zero-based index.",
          params: "int frameIndex: The 0-based index of the frame in the page source (window.frames[index]).",
          usage: "Switching to a frame when its index is known and stable.",
          pitfalls: "Indices can change if frames are added/removed/reordered, making this less robust. Remember to switch back (DefaultContent/ParentFrame). Throws NoSuchFrameException if index is invalid.",
          example: "driver.SwitchTo().Frame(0); // Switch to the first frame",
          details: "Directs subsequent commands to the specified frame."
        },
        {
          name: "Frame(string frameNameOrId)",
          description: "Switches focus to a frame/iframe using its 'name' or 'id' attribute.",
          params: "string frameNameOrId: The value of the 'name' or 'id' attribute of the frame.",
          usage: "Preferred method when the frame has a stable and unique name or ID.",
          pitfalls: "Name/ID might not be unique or could change. Remember to switch back. Throws NoSuchFrameException if not found.",
          example: "driver.SwitchTo().Frame(\"myContentFrame\"); // Switch by name or ID",
          details: "WebDriver checks for 'name' first, then 'id'. Directs subsequent commands to the specified frame."
        },
        {
          name: "Frame(IWebElement frameElement)",
          description: "Switches focus to a frame/iframe using a previously located IWebElement representing the frame element.",
          params: "IWebElement frameElement: An IWebElement object that refers to a <frame> or <iframe> tag.",
          usage: "Useful when the frame lacks a stable index/name/ID but can be reliably located via other strategies (XPath, CSS).",
          pitfalls: "The IWebElement reference must be valid (not stale) and must point to a frame/iframe element. Remember to switch back. Throws NoSuchFrameException if the element is not a frame, or StaleElementReferenceException.",
          example: "IWebElement frameWebElement = driver.FindElement(By.CssSelector(\"iframe.embed\"));\ndriver.SwitchTo().Frame(frameWebElement);",
          details: "Directs subsequent commands to the specified frame."
        },
        {
          name: "Window(string windowNameOrHandle)",
          description: "Switches focus to a different browser window or tab.",
          params: "string windowNameOrHandle: The 'name' assigned via window.open() or the unique window handle (obtained from driver.WindowHandles or driver.CurrentWindowHandle).",
          usage: "Interacting with elements in newly opened windows or tabs (e.g., after clicking a link with target='_blank').",
          pitfalls: "Need to get the target window handle first (usually by comparing driver.WindowHandles before and after the action that opens the new window). Throws NoSuchWindowException if the handle/name is invalid or the window is closed.",
          example: "string originalWindow = driver.CurrentWindowHandle;\n// ... action that opens new window ...\nReadOnlyCollection<string> handles = driver.WindowHandles;\nstring newWindowHandle = handles.FirstOrDefault(h => h != originalWindow);\nif (newWindowHandle != null) { driver.SwitchTo().Window(newWindowHandle); }",
          details: "Directs subsequent commands to the specified window/tab."
        },
        {
          name: "Alert()",
          description: "Switches focus to the currently displayed JavaScript alert, confirmation, or prompt dialog.",
          usage: "Allows interaction with the alert via the returned IAlert object (Accept, Dismiss, Text, SendKeys).",
          pitfalls: "Throws NoAlertPresentException if no JavaScript alert is currently open on the page. Execution is often blocked until the alert is handled.",
          example: "IAlert alert = driver.SwitchTo().Alert();\nstring text = alert.Text;\nalert.Accept();",
          details: "Returns an IAlert object. Does not take parameters."
        },
        {
          name: "ParentFrame()",
          description: "Switches focus from the currently selected frame to its immediate parent frame.",
          usage: "Navigating out of nested iframes to interact with elements in the containing frame.",
          pitfalls: "If the current context is already the top-level document or a frame directly within it, the context remains unchanged. Useful only when inside a nested frame.",
          example: "// Assuming driver is focused inside 'childFrame' which is inside 'parentFrame'\ndriver.SwitchTo().ParentFrame(); // Focus moves to 'parentFrame'",
          details: "No parameters. Useful for navigating frame hierarchies."
        },
        {
          name: "DefaultContent()",
          description: "Switches focus back to the main document of the page (the top-level frame or default context).",
          usage: "Essential step to return to the main page content after interacting with elements inside *any* frame or iframe.",
          pitfalls: "Forgetting to switch back will result in subsequent findElement/findelements calls failing if the target element is not within the currently focused frame (likely NoSuchElementException).",
          example: "driver.SwitchTo().Frame(\"myFrame\");\n// ... interact with elements inside the frame ...\ndriver.SwitchTo().DefaultContent(); // Switch back to the main page\n// ... interact with elements on the main page ...",
          details: "No parameters. Resets focus to the top-level browsing context."
        },
        {
          name: "NewWindow(WindowType typeHint)",
          description: "Opens a new browser window or tab and automatically switches the WebDriver's focus to it. (Selenium 4+ feature).",
          params: "WindowType typeHint: An enum specifying whether to open a new Tab (WindowType.Tab) or a new Window (WindowType.Window).",
          usage: "Programmatically opening and switching to a new tab/window for testing multi-window scenarios.",
          pitfalls: "Need to store the original window handle if you intend to switch back.",
          example: "string originalHandle = driver.CurrentWindowHandle;\n// Open and switch to a new tab\ndriver.SwitchTo().NewWindow(WindowType.Tab);\ndriver.Navigate().GoToUrl(\"https://newtab.com\");\n// Switch back to the original tab\ndriver.SwitchTo().Window(originalHandle);",
          details: "Returns the IWebDriver instance focused on the new window/tab."
        }
      ]
    },
    "IAlert": {
      accessedVia: "driver.SwitchTo().Alert()",
      description: "Represents a JavaScript alert, confirmation, or prompt dialog. Provides methods to interact with it.",
      methods: [
        {
          name: "Accept()",
          description: "Simulates clicking the 'OK' or positive confirmation button on the dialog.",
          usage: "Acknowledging simple alerts, confirming actions ('Yes'/'OK' on confirmations), accepting input entered into prompts.",
          pitfalls: "On prompts, typically called after SendKeys.",
          example: "IAlert alert = driver.SwitchTo().Alert();\nalert.Accept();",
          details: "Dismisses the alert. Applicable to simple, confirmation, and prompt alerts."
        },
        {
          name: "Dismiss()",
          description: "Simulates clicking the 'Cancel' or negative confirmation button on the dialog.",
          usage: "Dismissing confirmation dialogs ('No'/'Cancel'), canceling prompt dialogs.",
          pitfalls: "Behavior on simple alerts (which usually only have 'OK') might vary by browser (might act like Accept or do nothing).",
          example: "IAlert confirm = driver.SwitchTo().Alert();\nconfirm.Dismiss();",
          details: "Dismisses the alert. Applicable to confirmation and prompt alerts."
        },
        {
          name: "Text",
          description: "Retrieves the text message displayed within the alert dialog.",
          usage: "Verifying the content of the alert message (e.g., error messages, confirmation questions).",
          pitfalls: "Ensure alert is present before accessing Text (otherwise NoAlertPresentException).",
          example: "IAlert alert = driver.SwitchTo().Alert();\nstring message = alert.Text;\nAssert.IsTrue(message.Contains(\"Are you sure?\"));",
          details: "Returns the text as a string. Read-only property."
        },
        {
          name: "SendKeys(string text)",
          description: "Enters the specified text into the input field of a prompt dialog.",
          params: "string text: The text to enter into the prompt.",
          usage: "Providing input required by JavaScript prompt() dialogs.",
          pitfalls: "Only applicable to *prompt* alerts. Throws UnhandledAlertException or similar if used on simple or confirmation alerts (which lack input fields). Call Accept() or Dismiss() afterwards to close the prompt.",
          example: "IAlert prompt = driver.SwitchTo().Alert();\nprompt.SendKeys(\"My Input Text\");\nprompt.Accept();",
          details: "Simulates typing into the prompt's text box."
        }
      ]
    },
    "IOptions": {
      accessedVia: "driver.Manage()",
      description: "Acts as a gateway to interfaces for managing cookies (ICookieJar), timeouts (ITimeouts), and the browser window (IWindow).",
      methods: [
         {
             name: "Cookies",
             description: "Provides access to the ICookieJar interface for managing browser cookies.",
             usage: "Returns an ICookieJar object to Add, Get, or Delete cookies for the current session.",
             example: "ICookieJar cookieJar = driver.Manage().Cookies;\ncookieJar.AddCookie(myAuthCookie);",
             details: "Read-only property returning ICookieJar."
         },
         {
             name: "Timeouts()",
             description: "Provides access to the ITimeouts interface for configuring various wait times.",
             usage: "Returns an ITimeouts object to set ImplicitWait, PageLoadTimeout, and ScriptTimeout.",
             pitfalls: "Overly long implicit waits slow tests significantly. Understand the difference between implicit and explicit waits.",
             example: "ITimeouts timeouts = driver.Manage().Timeouts();\ntimeouts.ImplicitWait = TimeSpan.FromSeconds(5);",
             details: "Returns an ITimeouts object." // Note: In C#, Timeouts is often used like a property chain: driver.Manage().Timeouts().ImplicitWait = ...
         },
         {
             name: "Window",
             description: "Provides access to the IWindow interface for managing browser window size, position, and state.",
             usage: "Returns an IWindow object to Maximize, Minimize, set Size/Position, etc.",
             example: "IWindow window = driver.Manage().Window;\nwindow.Maximize();\nwindow.Size = new Size(1280, 720);",
             details: "Read-only property returning IWindow."
         }
         // NOTE: Browser capabilities (headless, proxy, extensions etc.) are set via browser-specific *Options classes (e.g., ChromeOptions, FirefoxOptions) passed during WebDriver *creation*, not through the IOptions interface obtained via driver.Manage().
      ]
    },
    "ICookieJar": {
        accessedVia: "driver.Manage().Cookies",
        description: "Provides methods for managing browser cookies within the current session: adding, retrieving, and deleting cookies.",
        methods: [
            {
                name: "AddCookie(Cookie cookie)",
                description: "Adds a specific cookie to the browser's cookie storage for the current session.",
                params: "Cookie cookie: A Selenium Cookie object containing details like name, value, domain, path, expiry date, IsSecure, IsHttpOnly.",
                usage: "Setting cookies for authentication (bypassing login), testing scenarios dependent on specific cookie values, maintaining session state.",
                pitfalls: "Cookie domain must match the current page's domain or be a parent domain. Cookie path must be appropriate. You must be on the domain (or a subdomain) for which you want to set the cookie *before* calling AddCookie. Ensure expiry date is correct.",
                example: "// Assumes driver is navigated to example.com or a subdomain\nCookie ck = new Cookie(\"sessionId\", \"123xyz\", \".example.com\", \"/\", DateTime.Now.AddDays(1));\ndriver.Manage().Cookies.AddCookie(ck);",
                details: "The Cookie class is in the OpenQA.Selenium namespace."
            },
            {
                name: "GetCookieNamed(string name)",
                description: "Retrieves a single cookie from the browser's storage based on its name.",
                params: "string name: The name of the cookie to retrieve.",
                usage: "Verifying that a cookie has been set correctly, retrieving a cookie's value for validation or use.",
                pitfalls: "Returns null if no cookie with the given name is found for the current domain/path.",
                example: "Cookie sessionCookie = driver.Manage().Cookies.GetCookieNamed(\"sessionId\");\nif (sessionCookie != null)\n{\n    Console.WriteLine(\"Session Value: \" + sessionCookie.Value);\n}",
                details: "Returns a Cookie object or null."
            },
            {
                name: "GetCookies()",
                description: "Retrieves all cookies visible to the current page (based on domain and path).",
                usage: "Inspecting all cookies for the current context, debugging cookie issues, logging cookie information.",
                example: "ReadOnlyCollection<Cookie> allCookies = driver.Manage().Cookies.GetCookies();\nforeach (Cookie currentCookie in allCookies)\n{\n    Console.WriteLine($\"Cookie: {currentCookie.Name}={currentCookie.Value}\");\n}",
                details: "Returns a ReadOnlyCollection<Cookie>. Returns an empty collection if no cookies are found."
            },
            {
                name: "DeleteCookie(Cookie cookie)",
                description: "Deletes a specific cookie from the browser's storage. Matching is done based on the cookie's name.",
                params: "Cookie cookie: The Cookie object representing the cookie to delete (only the name is typically used for matching).",
                usage: "Removing a specific cookie, e.g., simulating logout by deleting a session cookie.",
                pitfalls: "The domain/path of the passed Cookie object are usually ignored; deletion happens based on name for the current context.",
                example: "Cookie ckToDelete = driver.Manage().Cookies.GetCookieNamed(\"tempPref\");\nif (ckToDelete != null) { driver.Manage().Cookies.DeleteCookie(ckToDelete); }",
                details: "Deletes the cookie matching the name of the provided Cookie object."
            },
            {
                name: "DeleteCookieNamed(string name)",
                description: "Deletes a cookie with the specified name from the current domain/path.",
                params: "string name: The name of the cookie to delete.",
                usage: "Removing a cookie based on its name, clearing specific preferences or session tokens.",
                pitfalls: "Has no effect if no cookie with that name exists.",
                example: "driver.Manage().Cookies.DeleteCookieNamed(\"userPreference\");",
                details: "More direct way to delete by name compared to DeleteCookie."
            },
            {
                name: "DeleteAllCookies()",
                description: "Deletes all cookies visible to the current page (current domain/path).",
                usage: "Ensuring a clean browser state before starting a test or between test cases to prevent interference. Simulating clearing browser data.",
                pitfalls: "Use carefully mid-test, as it removes *all* cookies, potentially including authentication or session cookies needed for subsequent steps.",
                example: "driver.Manage().Cookies.DeleteAllCookies();",
                details: "No parameters. Affects only cookies for the current context."
            }
        ]
    },
     "Actions API": { // Representing concept, accessed via Actions class constructor
      accessedVia: "new Actions(driver)",
      description: "Provides mechanisms for building and performing sequences of complex user interactions like mouse movements, drag-and-drop, keyboard actions (holding keys), context clicks, etc. Uses a builder pattern.",
      methods: [
        {
          name: "MoveToElement(IWebElement element)",
          description: "Moves the mouse cursor to the center of the specified web element.",
          params: "IWebElement element: The target element to move the mouse cursor to.",
          usage: "Triggering hover events (to reveal menus, tooltips), preparing for context clicks or other actions on the element.",
          pitfalls: "Element must be visible and exist in the DOM. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement mainMenu = driver.FindElement(By.Id(\"menu\"));\nactions.MoveToElement(mainMenu).Perform();",
          details: "Part of building an action sequence."
        },
        {
          name: "Click(IWebElement element)",
          description: "Performs a mouse left-click action on the specified web element.",
          params: "IWebElement element: The target element to click.",
          usage: "Standard click action, often used within a chain (e.g., after MoveToElement). Can sometimes work on elements where element.Click() fails.",
          pitfalls: "Element must be interactable. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement subMenuItem = driver.FindElement(By.Id(\"submenu-item\"));\nactions.MoveToElement(mainMenu).Click(subMenuItem).Perform();",
          details: "Adds a click action (mouse down + mouse up) to the sequence."
        },
         {
          name: "Click()", // Overload without element
          description: "Performs a mouse left-click action at the current mouse cursor position.",
          usage: "Clicking after moving the cursor to a specific offset or element.",
          pitfalls: "Relies on the mouse cursor being in the correct position from previous actions. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nactions.MoveToElement(canvas).MoveByOffset(10, 10).Click().Perform();",
          details: "Clicks where the virtual mouse cursor currently is."
        },
        {
          name: "DoubleClick(IWebElement element)",
          description: "Performs a double-click action on the specified web element.",
          params: "IWebElement element: The target element to double-click.",
          usage: "Testing UI elements that respond specifically to double-click events.",
          pitfalls: "Element must be interactable. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement item = driver.FindElement(By.Id(\"list-item\"));\nactions.DoubleClick(item).Perform();",
          details: "Adds a double-click action to the sequence."
        },
         {
          name: "DoubleClick()", // Overload without element
          description: "Performs a double-click action at the current mouse cursor position.",
          usage: "Double-clicking after positioning the mouse.",
          pitfalls: "Relies on correct cursor position. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nactions.MoveToElement(target).DoubleClick().Perform();",
          details: "Double-clicks where the virtual mouse cursor currently is."
        },
        {
          name: "ContextClick(IWebElement element)",
          description: "Performs a right-click (context click) action on the specified web element.",
          params: "IWebElement element: The target element to right-click.",
          usage: "Testing custom context menus or other right-click specific functionality.",
          pitfalls: "Element must be interactable. Ensure Perform() is called. Automating the resulting context menu often requires further steps.",
          example: "Actions actions = new Actions(driver);\nIWebElement item = driver.FindElement(By.Id(\"clickable-item\"));\nactions.ContextClick(item).Perform();",
          details: "Adds a right-click action to the sequence."
        },
         {
          name: "ContextClick()", // Overload without element
          description: "Performs a right-click (context click) action at the current mouse cursor position.",
          usage: "Right-clicking after positioning the mouse.",
          pitfalls: "Relies on correct cursor position. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nactions.MoveToElement(target).ContextClick().Perform();",
          details: "Right-clicks where the virtual mouse cursor currently is."
        },
        {
          name: "DragAndDrop(IWebElement source, IWebElement target)",
          description: "Performs a drag-and-drop operation by clicking and holding the 'source' element, moving to the 'target' element, and releasing.",
          params: "IWebElement source: The element to drag. IWebElement target: The element to drop onto.",
          usage: "Testing drag-and-drop interfaces (e.g., reordering lists, moving items between containers).",
          pitfalls: "Both elements must be interactable. Can be complex to get working reliably depending on the UI implementation (sometimes requires intermediate MoveToElement steps or DragAndDropToOffset). Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement draggable = driver.FindElement(By.Id(\"drag-me\"));\nIWebElement droppable = driver.FindElement(By.Id(\"drop-here\"));\nactions.DragAndDrop(draggable, droppable).Perform();",
          details: "Adds a composite action (click-and-hold, move, release) to the sequence."
        },
        {
            name: "SendKeys(string keysToSend)", // Overload without element
            description: "Sends a sequence of key strokes to the currently focused element on the page.",
            params: "string keysToSend: The sequence of characters or Keys constants.",
            usage: "Typing into the active element, sending global shortcuts (if applicable).",
            pitfalls: "Relies on the correct element having focus. Use the SendKeys(IWebElement, string) overload for targeting specific elements. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\n// Assuming input field already has focus\nactions.SendKeys(\"Text for focused element\").Perform();",
            details: "Sends keys to wherever the current focus is."
        },
        {
            name: "SendKeys(IWebElement element, string keysToSend)",
            description: "Sends a sequence of key strokes specifically to the given web element.",
            params: "IWebElement element: The target element. string keysToSend: The keys sequence.",
            usage: "Reliably sending input to a specific field within an Actions chain.",
            pitfalls: "Element should be interactable/editable. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\nIWebElement input = driver.FindElement(By.Id(\"myInput\"));\nactions.SendKeys(input, \"Targeted text\").Perform();",
            details: "Focuses the element (if needed) before sending keys."
        },
        {
            name: "KeyDown(string theKey) / KeyDown(IWebElement element, string theKey)",
            description: "Simulates pressing a key down without releasing it.",
            params: "string theKey (use Keys class constants like Keys.Shift, Keys.Control) / Optional IWebElement target.",
            usage: "Simulating holding down modifier keys (Shift, Control, Alt) for key combinations or actions like multi-select.",
            pitfalls: "Must be paired with a corresponding KeyUp action or Release() to release the key. Ensure Perform() is called.",
            example: "// Simulate Ctrl+A (Select All)\nActions actions = new Actions(driver);\nactions.KeyDown(Keys.Control).SendKeys(\"a\").KeyUp(Keys.Control).Perform();",
            details: "Targets the specified element or the currently focused element."
        },
        {
            name: "KeyUp(string theKey) / KeyUp(IWebElement element, string theKey)",
            description: "Simulates releasing a previously pressed key.",
            params: "string theKey (use Keys class constants) / Optional IWebElement target.",
            usage: "Releasing modifier keys after performing actions while they were held down.",
            pitfalls: "Should correspond to a previous KeyDown action. Ensure Perform() is called.",
            example: "// Simulate Ctrl+A (Select All)\nActions actions = new Actions(driver);\nactions.KeyDown(Keys.Control).SendKeys(\"a\").KeyUp(Keys.Control).Perform();",
            details: "Targets the specified element or the currently focused element."
        },
         {
            name: "Perform()",
            description: "Executes the entire sequence of actions that have been built using the Actions class methods.",
            usage: "***Mandatory*** step. Must be called at the end of an Actions chain to actually perform the composed interactions on the browser.",
            pitfalls: "Forgetting to call Perform() is a common mistake; it results in none of the chained actions being executed.",
            example: "// All Actions examples MUST end with .Perform() like:\nActions actions = new Actions(driver);\nactions.MoveToElement(element).Click().Perform();",
            details: "Compiles and sends the sequence of actions to the browser driver for execution."
        },
        {
            name: "ClickAndHold(IWebElement element)",
            description: "Performs a mouse left-click on an element and holds the button down.",
            params: "IWebElement element: The target element.",
            usage: "Starting point for custom drag-and-drop sequences or interactions requiring a held mouse button.",
            pitfalls: "Must be paired with a Release() action later in the chain. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\nactions.ClickAndHold(source).MoveToElement(target).Release().Perform();"
        },
         {
            name: "Release(IWebElement element)",
            description: "Releases the left mouse button over a specified element.",
            params: "IWebElement element: The element over which to release the mouse button.",
            usage: "Completing a drag-and-drop or other action initiated with ClickAndHold.",
            pitfalls: "Assumes the mouse button is currently held down. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\nactions.ClickAndHold(source).MoveToElement(target).Release(target).Perform();"
        },
        // Other Actions methods like MoveByOffset, DragAndDropToOffset, Pause exist too.
      ]
    },
    // --- Interfaces below are less detailed in the provided report but kept for structure ---
    "ITimeouts": {
      accessedVia: "driver.Manage().Timeouts()",
      description: "Interface to configure time limits for various browser operations.",
      methods: [
        { name: "ImplicitWait", description: "Sets a default wait time (TimeSpan) for FindElement/FindElements to find an element before throwing NoSuchElementException.", pitfalls: "Applies globally. Can slow down tests if set high. Often debated vs Explicit Waits."},
        { name: "PageLoad", description: "Sets the time limit (TimeSpan) for a page load to complete before throwing an exception.", params:"TimeSpan time"},
        { name: "AsynchronousJavaScript", description: "Sets the time limit (TimeSpan) for an asynchronous script (ExecuteAsyncScript) to finish before throwing an exception.", params:"TimeSpan time"}
      ]
    },
    "IWindow": {
      accessedVia: "driver.Manage().Window",
      description: "Interface to manage the current browser window's size, position, and state.",
      methods: [
        { name: "Size", description: "Gets or sets the outer window size (System.Drawing.Size)." },
        { name: "Position", description: "Gets or sets the window position (System.Drawing.Point)." },
        { name: "Maximize()", description: "Maximizes the browser window." },
        { name: "Minimize()", description: "Minimizes the browser window (support varies)." },
        { name: "FullScreen()", description: "Sets the window to full screen mode (like F11)." }
      ]
    },
    "IJavaScriptExecutor": {
      description: "Interface to execute JavaScript code within the context of the currently selected frame or window.",
      accessedVia: "Typically by casting the IWebDriver instance: ((IJavaScriptExecutor)driver)...",
      methods: [
        { name: "ExecuteScript(string script, params object[] args)", description: "Executes JavaScript synchronously in the browser. Can return values.", params: "string script: The JS code. params object[] args: Arguments accessible via `arguments[0]`, `arguments[1]`, etc. in the script." },
        { name: "ExecuteAsyncScript(string script, params object[] args)", description: "Executes JavaScript asynchronously. The script must signal completion by calling the provided callback (usually `arguments[arguments.length - 1]`).", params: "string script: The async JS code. params object[] args: Arguments + callback." }
      ]
    },
    "ITakesScreenshot": {
      description: "Interface to capture screenshots of the current browser window.",
      accessedVia: "Typically by casting the IWebDriver instance: ((ITakesScreenshot)driver)...",
      methods: [
        { name: "GetScreenshot()", description: "Captures a screenshot of the current window.", usage:"Returns a Screenshot object, which can be saved to a file.", example: "Screenshot ss = ((ITakesScreenshot)driver).GetScreenshot();\nss.SaveAsFile(\"screenshot.png\", ScreenshotImageFormat.Png);" }
      ]
    },
    "ILocatable": {
        description: "Interface providing methods to get the physical location of an element on the page. Implemented by IWebElement.",
        methods: [
            { name: "LocationOnScreenOnceScrolledIntoView", description: "Gets location after scrolling element into view." },
            { name: "Coordinates", description: "Provides advanced location details relative to viewport/DOM." },
            // Note: Basic Location and Size properties are directly on IWebElement.
        ]
    },
    "ISearchContext": {
        description: "Defines the basic contract for finding elements. Implemented by both IWebDriver (searches entire DOM) and IWebElement (searches within that element's subtree).",
        methods: [
            // FindElement/FindElements are the core methods, detailed under IWebDriver/IWebElement
            { name: "FindElement(By by)", description: "Finds the first descendant element matching the criteria." },
            { name: "FindElements(By by)", description: "Finds all descendant elements matching the criteria." }
        ]
    },
  };


  // Colors for nodes
  const colors: Record<string, string> = {
    "IWebDriver": "#4A90E2", // Blue
    "IWebElement": "#50C878", // Green
    "INavigation": "#9B59B6", // Purple
    "ITargetLocator": "#F39C12", // Orange
    "IAlert": "#F5A623", // Yellow-Orange
    "IOptions": "#E74C3C", // Red
    "ICookieJar": "#E67E22", // Dark Orange
    "Actions API": "#34495E", // Dark Blue/Grey
    "ITimeouts": "#16A085", // Teal
    "IWindow": "#2980B9", // Medium Blue
    "IJavaScriptExecutor": "#8E44AD", // Dark Purple
    "ITakesScreenshot": "#1ABC9C", // Turquoise
    "ILocatable": "#F1C40F", // Yellow
    "ISearchContext": "#D35400", // Pumpkin
  };

  // Toggle node expansion
  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

   // Toggle method expansion
  const toggleMethod = (methodKey: string) => {
    setExpandedMethods(prev => ({
        ...prev,
        [methodKey]: !prev[methodKey]
    }));
  };


  // Render a node and its children
  const renderNode = (id: string, level = 0) => {
    const node = nodes[id];
    if (!node) return null;

    const isNodeExpanded = expandedNodes[id];
    const hasMethods = node.methods && node.methods.length > 0;
    const backgroundColor = colors[id] || "#6c757d"; // Default grey

    // Check if any method under this node has details to expand
    const nodeHasExpandableMethods = node.methods?.some(method =>
        method.details || method.usage || method.pitfalls || method.params || method.example
    ) ?? false;

    return (
      <div key={id} className="mb-2" style={{ marginLeft: `${level * 20}px` }}>
        <div
          className="flex items-center p-2 rounded cursor-pointer shadow-sm hover:shadow"
          style={{ backgroundColor, color: "white" }}
          onClick={() => toggleNode(id)}
        >
          <span className="mr-2 font-bold text-lg" style={{ minWidth: '15px', display: 'inline-block', textAlign: 'center' }}>
             {/* Show expand/collapse icon if node has children OR expandable methods */}
            {(node.children && node.children.length > 0) || nodeHasExpandableMethods ? (isNodeExpanded ? "−" : "+") : ""}
          </span>
          <span className="font-bold">{id}</span>
          {node.description && (
            <span className="ml-2 text-sm opacity-90 italic"> - {node.description}</span>
          )}
           {node.accessedVia && (
            <span className="ml-auto mr-2 text-xs px-2 py-2 text-white  bg-opacity-100 rounded font-semibold">Accessed via: {node.accessedVia}</span>
          )}
        </div>

        {isNodeExpanded && (
          <div className="ml-4 mt-1 mb-2 pl-3 border-l-2" style={{ borderColor: backgroundColor }}>
            {/* Render Methods */}
            {hasMethods && (
              <div className="mt-2">
                <h4 className="font-semibold mb-1 text-gray-700">Methods / Properties:</h4>
                {node.methods?.map((method, index) => {
                    const methodKey = `${id}-${method.name}`;
                    const isMethodExpanded = expandedMethods[methodKey];
                    const hasDetails = !!(method.details || method.usage || method.pitfalls || method.params || method.example);

                    return (
                        <div key={index} className="mb-1">
                            <div
                                className={`text-sm bg-gray-100 p-1.5 rounded ${hasDetails ? 'cursor-pointer hover:bg-gray-200' : ''} flex items-center`}
                                onClick={hasDetails ? () => toggleMethod(methodKey) : undefined} // Only allow click if there are details
                            >
                                <span className="mr-2 font-medium" style={{ minWidth: '12px', display: 'inline-block', textAlign: 'center' }}>
                                   {hasDetails ? (isMethodExpanded ? "▾" : "▸") : ""}
                                </span>
                                <span className="font-mono text-blue-700">{method.name}</span>
                                <span className="ml-2 text-gray-600 text-xs italic">- {method.description}</span>
                            </div>
                            {/* Conditionally render details only if expanded and details exist */}
                            {hasDetails && isMethodExpanded && (
                                <div className="text-xs bg-gray-50 p-2 pl-4 mt-0.5 mb-1 rounded border border-gray-200 ml-4 whitespace-pre-wrap"> {/* Use whitespace-pre-wrap */}
                                    {method.params && <p className="mb-1"><strong className="font-semibold text-gray-800">Parameters:</strong> <code className="text-purple-700 bg-gray-200 px-1 rounded">{method.params}</code></p>}
                                    {method.usage && <p className="mb-1"><strong className="font-semibold text-gray-800">Usage:</strong> {method.usage}</p>}
                                    {method.details && <p className="mb-1"><strong className="font-semibold text-gray-800">Details:</strong> {method.details}</p>}
                                    {method.pitfalls && <p className="mb-1"><strong className="font-semibold text-red-700">Pitfalls:</strong> {method.pitfalls}</p>}
                                    {method.example && <div className="mt-1"><strong className="font-semibold text-gray-800">Example:</strong> <pre className="bg-gray-200 p-1.5 rounded text-xs overflow-x-auto mt-0.5"><code>{method.example}</code></pre></div>}
                                </div>
                            )}
                        </div>
                    );
                })}
              </div>
            )}

            {/* Render Children */}
            {node.children && node.children.length > 0 && (
              <div className="mt-2">
                 <h4 className="font-semibold mb-1 text-gray-700">Related Interfaces (Accessed Via):</h4>
                {node.children.map(childId => renderNode(childId, level + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

    // Render the relationships view (Simplified as direct inheritance isn't the focus of the report)
    const renderRelationships = () => {
        return (
          <div className="mt-6 bg-gray-100 p-4 rounded shadow-sm">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Key Access Relationships</h3>
            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
              <li><code className="font-mono bg-gray-200 px-1 rounded">driver.Navigate()</code> returns <span className="font-semibold">INavigation</span></li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">driver.Manage()</code> returns <span className="font-semibold">IOptions</span> (which provides access to Cookies, Timeouts, Window properties/methods)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">driver.SwitchTo()</code> returns <span className="font-semibold">ITargetLocator</span> (which provides access to Frame, Window, Alert, etc. methods)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">driver.Manage().Cookies</code> returns <span className="font-semibold">ICookieJar</span></li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">driver.Manage().Timeouts()</code> returns <span className="font-semibold">ITimeouts</span> (or allows setting timeout properties directly)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">driver.Manage().Window</code> returns <span className="font-semibold">IWindow</span></li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">driver.SwitchTo().Alert()</code> returns <span className="font-semibold">IAlert</span></li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">new Actions(driver)</code> creates an object to build sequences using the <span className="font-semibold">Actions API</span> methods (requires <code className="font-mono bg-gray-200 px-1 rounded">.Perform()</code>)</li>
              <li><span className="font-semibold">IWebElement</span> instances are returned by <code className="font-mono bg-gray-200 px-1 rounded">driver.FindElement()</code> and <code className="font-mono bg-gray-200 px-1 rounded">driver.FindElements()</code> (and also by <code className="font-mono bg-gray-200 px-1 rounded">element.FindElement/s()</code>)</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">(IJavaScriptExecutor)driver</code> allows casting to use <span className="font-semibold">IJavaScriptExecutor</span> methods</li>
              <li><code className="font-mono bg-gray-200 px-1 rounded">(ITakesScreenshot)driver</code> allows casting to use <span className="font-semibold">ITakesScreenshot</span> methods</li>
            </ul>
          </div>
        );
      };


  return (
    <div className="p-4 font-sans max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Selenium .NET Bindings Interfaces Mind Map</h2>
      <p className="mb-4 text-sm text-gray-600">Click on interface names (<span className="font-bold text-lg mx-1">+</span>/<span className="font-bold text-lg mx-1">−</span>) to expand/collapse details. Click on method names (<span className="font-medium mx-1">▸</span>/<span className="font-medium mx-1">▾</span>) to view detailed information derived from the research report.</p>

       <div className="flex flex-wrap mb-4 gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => {
            const newState: Record<string, boolean> = {};
            Object.keys(nodes).forEach(key => { newState[key] = true; });
            setExpandedNodes(newState);
          }}
        >
          Expand All Interfaces
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => {
            const newState: Record<string, boolean> = {};
            Object.keys(nodes).forEach(key => { newState[key] = false; });
            setExpandedNodes(newState);
            setExpandedMethods({}); // Collapse methods too
          }}
        >
          Collapse All Interfaces
        </button>
      </div>

      {/* Render Core Interfaces First */}
      <div className="mb-4">
        {renderNode("IWebDriver")}
      </div>
      <div className="mb-4">
        {renderNode("IWebElement")}
      </div>

       {/* Render Other Key Interfaces/Concepts */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderNode("INavigation")}
            {renderNode("ITargetLocator")}
            {renderNode("IAlert")}
            {renderNode("IOptions")}
            {renderNode("ICookieJar")}
            {renderNode("Actions API")}
       </div>

      {/* Render Less Detailed Interfaces */}
       <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Other Related Interfaces</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNode("ITimeouts")}
                {renderNode("IWindow")}
                {renderNode("IJavaScriptExecutor")}
                {renderNode("ITakesScreenshot")}
                {renderNode("ILocatable")}
                {renderNode("ISearchContext")}
             </div>
       </div>


      {renderRelationships()}
    </div>
  );
};

export default MindMap;