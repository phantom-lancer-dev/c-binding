import React, { useState } from "react";

// Define the structure for method details
interface MethodDetail {
  name: string;
  description: string;
  simpleExplanation?: string; // Added
  mentalModel?: string; // Added
  params?: string;
  usage?: string;
  pitfalls?: string;
  example?: string;
  details?: string; // General details, overloads, return values etc.
}

// Define the structure for nodes
interface NodeData {
  description: string;
  simpleExplanation?: string; // Added
  mentalModel?: string; // Added
  children?: string[];
  methods?: MethodDetail[];
  accessedVia?: string; // How this interface/concept is typically accessed
}

const MindMap = () => {
  // Node expanded state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "IWebDriver": true, // Start with IWebDriver expanded
    "IWebElement": false,
    "IAlert": false,
    "INavigation": false,
    "IOptions": false,
    "ITargetLocator": false,
    "ICookieJar": false,
    "Actions API": false,
    "ITimeouts": false,
    "IWindow": false,
    "IJavaScriptExecutor": false,
    "ITakesScreenshot": false,
    "ILocatable": false,
    "ISearchContext": false,
  });

  // Method expanded state
  const [expandedMethods, setExpandedMethods] = useState<Record<string, boolean>>({});

  // Node data structure - enriched with report details AND simple explanations/mental models
  const nodes: Record<string, NodeData> = {
    "IWebDriver": {
      description: "Primary interface for controlling a web browser instance. Central command hub for automation. Engineered to mirror human actions.",
      simpleExplanation: "The main controller for the browser. It's your starting point to open pages, find elements, close the browser, and access more specialized controls.",
      mentalModel: "Think of it as the driver of a car (the browser). You (your code) give instructions to the driver, who then interacts with the car's controls (steering wheel, pedals, navigation system, etc.).",
      children: ["INavigation", "IOptions", "ITargetLocator"], // Simplified children based on access methods
      methods: [
        {
          name: "FindElement(By by)",
          description: "Locates the *first* web element matching the specified criteria.",
          simpleExplanation: "Finds the very first element on the page that matches your search criteria (like ID, name, or XPath).",
          mentalModel: "Like using \"Find\" (Ctrl+F) in a document or browser, but it stops searching as soon as it finds the first match.",
          params: "By by: The locator strategy object. The By class offers static methods: By.Id(), By.Name(), By.XPath(), By.CssSelector(), By.LinkText(), By.PartialLinkText(), By.TagName(), By.ClassName().",
          usage: "Interacting with a single, unique element (e.g., clicking a specific button, entering text into a specific field). Foundational step before interaction.",
          pitfalls: "Throws NoSuchElementException if no element is found (requires handling). Avoid brittle locators (e.g., index-based XPath). Overly complex XPath can impact performance.",
          example: "IWebDriver driver = new ChromeDriver();\ndriver.Navigate().GoToUrl(\"https://example.com/login\");\nIWebElement usernameField = driver.FindElement(By.Id(\"username\"));\nIWebElement passwordField = driver.FindElement(By.Name(\"password\"));\nIWebElement loginButton = driver.FindElement(By.XPath(\"//button[text()='Login']\"));",
          details: "Crucial first step in automation. Returns an IWebElement object. Flexibility comes from the various By strategies. No direct method overloads, but By provides versatility."
        },
        {
          name: "FindElements(By by)",
          description: "Locates *all* web elements matching the specified criteria.",
          simpleExplanation: "Finds all the elements on the page that match your search criteria and gives you a list of them.",
          mentalModel: "Like using \"Find All\" in a document editor, gathering every instance that matches your search into a list you can look through.",
          params: "By by: The locator strategy object (same options as FindElement).",
          usage: "Verifying multiple elements (e.g., checking all links, getting all items in a list), iterating through a list of elements.",
          pitfalls: "Ensure the criteria correctly selects only the desired elements.",
          example: "ReadOnlyCollection<IWebElement> errorMessages = driver.FindElements(By.ClassName(\"error\"));\n// Check if any errors exist:\nif (errorMessages.Count > 0) { /* handle errors */ }",
          details: "Returns a ReadOnlyCollection<IWebElement>. Returns an *empty collection* (not null, no exception) if no elements are found, allowing for graceful handling."
        },
        {
          name: "Navigate()",
          description: "Accesses the INavigation interface for browser history and URL navigation.",
          simpleExplanation: "Gives you access to the browser's navigation controls (back, forward, refresh, go to URL).",
          mentalModel: "Like using the browser's address bar and the back/forward/refresh buttons. Navigate() gets you the object that controls those specific functions.",
          usage: "Returns an INavigation object to control browser navigation (GoToUrl, Back, Forward, Refresh).",
          details: "Entry point property, does not take parameters itself. Acts like the browser's navigation bar (address bar, back/forward/refresh buttons).",
          example: "// See INavigation methods for specific examples like:\ndriver.Navigate().GoToUrl(\"https://example.com\");"
        },
        {
          name: "Manage()",
          description: "Accesses interfaces for managing browser settings like timeouts, cookies, and window properties.",
          simpleExplanation: "Gives you access to settings and controls for the browser session itself, like managing timeouts, cookies, or the browser window.",
          mentalModel: "Think of Manage() as opening the browser's Settings or Preferences panel through your code. You're not directly interacting with the web page's content, but rather configuring the browser's behavior or state around that content.",
          usage: "Returns an IOptions object, which provides access to further management interfaces (Cookies, Timeouts, Window).",
          details: "Acts like accessing the browser's control panel or settings menu. Entry point property, no parameters itself. Essential for configuring the browser environment for robust tests.",
          example: "// See IOptions, ICookieJar, ITimeouts, IWindow methods for specific examples like:\ndriver.Manage().Window.Maximize();\ndriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);"
        },
        {
          name: "SwitchTo()",
          description: "Accesses the ITargetLocator interface for switching the WebDriver's focus between different contexts (frames, windows, alerts).",
          simpleExplanation: "Lets you change the context WebDriver is focused on, like moving to a different browser window, a frame within the page, or an alert pop-up.",
          mentalModel: "Imagine you have multiple windows open or sections within a page (like frames). SwitchTo() is like telling your automation \"Now, pay attention to this specific window\" or \"this specific frame\" or \"that alert message\".",
          usage: "Returns an ITargetLocator object. Essential for interacting with elements not in the main document.",
          details: "Entry point property, no parameters itself. Directs WebDriver's attention to specific UI parts (frames, new windows/tabs, alerts).",
          example: "// See ITargetLocator methods for specific examples like:\ndriver.SwitchTo().Frame(\"myFrame\");\ndriver.SwitchTo().Alert().Accept();"
        },
        {
          name: "Close()",
          description: "Closes the currently focused browser window or tab.",
          simpleExplanation: "Closes the single browser window or tab that WebDriver is currently focused on.",
          mentalModel: "Like clicking the 'X' button on a single browser tab or window. If it's the last window open, it might close the whole browser, but its primary job is closing the current one.",
          usage: "Closing individual tabs or windows during a test while keeping others open. Similar to clicking the 'X' on a single tab/window.",
          pitfalls: "If it's the last window associated with the WebDriver session, it *may* quit the entire browser process (behavior can vary). Using Close() when Quit() is needed can lead to resource leaks if other windows/processes remain.",
          example: "driver.Close(); // Closes the current window/tab",
          details: "No parameters or overloads. Focus shifts to another window if available after close, but the specific window is driver-dependent."
        },
        {
          name: "Quit()",
          description: "Closes *all* browser windows associated with the session, terminates the underlying browser process, and ends the WebDriver session.",
          simpleExplanation: "Closes all browser windows/tabs opened by WebDriver during the session and completely shuts down the browser process it started.",
          mentalModel: "Like choosing \"Exit\" or \"Quit\" from the browser's main menu – it closes everything related to that browser instance and cleans up resources.",
          usage: "Best practice for cleanup at the end of a test session or suite to release all system resources. Completely exits the browser application started by WebDriver.",
          pitfalls: "Ends the entire session; no further commands can be sent to this driver instance afterwards.",
          example: "driver.Quit(); // Closes all windows and ends session",
          details: "No parameters or overloads. Ensures clean termination and prevents resource leaks."
        },
        {
            name: "Title", // Property
            description: "Gets the title of the currently focused browser window/tab.",
            simpleExplanation: "Gets the text shown in the browser's title bar or tab for the current page.",
            mentalModel: "Like reading the text label on the current browser tab.",
            usage: "Verifying the title of the loaded page for assertion.",
            example: "string pageTitle = driver.Title;\nAssert.AreEqual(\"Expected Page Title\", pageTitle);",
            details: "Returns a string. Read-only property."
        },
        {
            name: "CurrentWindowHandle", // Property
            description: "Gets the unique identifier (handle) of the currently focused browser window/tab.",
            simpleExplanation: "Gets the unique ID code for the browser window or tab WebDriver is currently focused on.",
            mentalModel: "Think of each browser window/tab having a unique name tag. This gets you the name tag of the one you're currently looking at.",
            usage: "Storing the handle of the original window before switching to a new one, so you can switch back.",
            example: "string originalHandle = driver.CurrentWindowHandle;",
            details: "Returns a string handle. Read-only property."
        },
        {
            name: "WindowHandles", // Property
            description: "Gets a collection of unique identifiers (handles) for all open windows/tabs associated with the current WebDriver session.",
            simpleExplanation: "Gets a list of all the unique ID codes for every browser window or tab currently open in this WebDriver session.",
            mentalModel: "Like asking for a list of all the unique name tags for every window/tab that belongs to this browser instance.",
            usage: "Iterating through all open window handles to find and switch to a specific new window/tab.",
            example: "ReadOnlyCollection<string> allHandles = driver.WindowHandles;\nforeach (string handle in allHandles) { /* ... */ }",
            details: "Returns a ReadOnlyCollection<string>. Read-only property."
        }
      ]
    },
    "IWebElement": {
      description: "Represents an individual HTML element on a webpage. Enables interaction with located elements.",
      simpleExplanation: "Represents a specific thing on a web page you've found (like a button, link, input field, or paragraph). You use it to interact with that specific thing.",
      mentalModel: "Once FindElement locates something (like a specific button), IWebElement is like having a direct handle or reference to that specific button. You can then tell that specific button to Click() or ask it for its Text.",
      methods: [
        {
          name: "Click()",
          description: "Simulates a mouse click (left-click) on the element.",
          simpleExplanation: "Simulates a user clicking on this element.",
          mentalModel: "Like moving your mouse pointer over the element and clicking the left mouse button.",
          usage: "Interacting with buttons, links, checkboxes, radio buttons. Triggers associated events. Waits for page load if click causes navigation.",
          pitfalls: "Element must be visible and enabled (interactable). Reference might become stale after click (StaleElementReferenceException) if page reloads/changes - re-find the element. Use waits (explicit/implicit) if element is not immediately interactable.",
          example: "IWebElement loginButton = driver.FindElement(By.Id(\"login\"));\nloginButton.Click();",
          details: "Performs a click at the element's center point. No parameters or overloads."
        },
        {
          name: "SendKeys(string text)",
          description: "Simulates typing text into an editable element (e.g., <input>, <textarea>).",
          simpleExplanation: "Simulates typing text into this element (if it's an input field or text area).",
          mentalModel: "Like clicking into a text box and then typing characters from your keyboard into it. You can also tell it to \"press\" special keys like Enter or Tab.",
          params: "string text: The sequence of characters or Keys constants to send.",
          usage: "Filling out form fields, search boxes. Can use Keys class for special keys (e.g., Keys.Enter, Keys.Tab, Keys.Control + 'a').",
          pitfalls: "Element must be editable and visible. Doesn't clear existing text by default; use Clear() first if needed. Ensure element has focus (clicking it first might help). For complex key combinations, consider Actions API.",
          example: "IWebElement searchBox = driver.FindElement(By.Name(\"q\"));\nsearchBox.Clear(); // Optional: clear existing text\nsearchBox.SendKeys(\"Selenium WebDriver\" + Keys.Enter);",
          details: "Appends text if called multiple times without Clear()."
        },
        {
          name: "GetAttribute(string attributeName)",
          description: "Retrieves the current value of a specified HTML attribute of the element.",
          simpleExplanation: "Gets the value of a specific HTML property (attribute) of the element, like the 'href' of a link or the 'value' of an input box.",
          mentalModel: "Like using the browser's \"Inspect Element\" tool to look at the underlying HTML code for that element and reading the value written inside one of its tags (e.g., reading the URL from <a href=\"URL_HERE\">).",
          params: "string attributeName: Name of the HTML attribute (e.g., 'href', 'value', 'class', 'id', 'src', 'style', 'checked', 'disabled').",
          usage: "Verifying element properties (e.g., link URL, image source, input value), extracting data, checking element state (e.g., if a checkbox is 'checked').",
          pitfalls: "Returns null or empty string if the attribute does not exist (handle this). Distinguish HTML attributes from DOM properties (sometimes they differ, e.g., boolean attributes like 'checked').",
          example: "IWebElement link = driver.FindElement(By.LinkText(\"Download\"));\nstring url = link.GetAttribute(\"href\");\n\nIWebElement checkbox = driver.FindElement(By.Id(\"terms\"));\nbool isChecked = !string.IsNullOrEmpty(checkbox.GetAttribute(\"checked\")); // Check if 'checked' attribute exists",
          details: "Returns the attribute value as a string."
        },
        {
          name: "Text", // Property
          description: "Retrieves the rendered, *visible* text content of the element, including its sub-elements.",
          simpleExplanation: "Gets the visible text content that a user sees inside this element (and any elements inside it).",
          mentalModel: "Like highlighting the text displayed within that element on the web page and copying it.",
          usage: "Verifying displayed messages, labels, headings, paragraph content.",
          pitfalls: "Only gets *visible* text (text hidden by CSS will not be returned). May include unwanted leading/trailing whitespace or newlines (consider using .Trim()).",
          example: "IWebElement messageElement = driver.FindElement(By.ClassName(\"status-message\"));\nstring message = messageElement.Text;\nAssert.AreEqual(\"Success!\", message.Trim());",
          details: "Returns a string. Read-only property. Concatenates text from descendant elements."
        },
        {
          name: "Displayed", // Property
          description: "Checks if the element is currently rendered and visible on the page.",
          simpleExplanation: "Checks if the element is currently visible on the page to a user.",
          mentalModel: "Like visually checking if you can actually see the element on the screen right now (it might exist in the code but be hidden).",
          usage: "Verifying element visibility before interaction. Handling dynamically appearing/disappearing elements. Asserting UI state.",
          pitfalls: "Element can be present in the DOM but not displayed (returns false). Use this check before attempting actions like Click() on elements that might be hidden.",
          example: "IWebElement errorMsg = driver.FindElement(By.Id(\"error\"));\nif (errorMsg.Displayed)\n{\n    Console.WriteLine(\"Error is visible: \" + errorMsg.Text);\n}",
          details: "Returns a boolean. An element is generally considered displayed if it has non-zero height and width and is not hidden via CSS (e.g., display: none, visibility: hidden)."
        },
        {
          name: "Enabled", // Property
          description: "Checks if the element is enabled for interaction (typically for form elements like buttons, inputs).",
          simpleExplanation: "Checks if the element is active and usable (not grayed out or disabled).",
          mentalModel: "Like looking at a button or input field and checking if it's currently clickable/typable, or if it's grayed out.",
          usage: "Ensuring interactive elements (buttons, inputs) are enabled before attempting actions like Click() or SendKeys(). Asserting UI state.",
          pitfalls: "Attempting actions on disabled elements might cause errors (e.g., ElementNotInteractableException) or simply have no effect. Check this property before interaction.",
          example: "IWebElement submitButton = driver.FindElement(By.Id(\"submit\"));\nif (submitButton.Enabled)\n{\n    submitButton.Click();\n} else {\n    Console.WriteLine(\"Submit button is disabled.\");\n}",
          details: "Returns a boolean. Read-only property."
        },
        {
            name: "Clear()",
            description: "Clears the text content of an editable element (e.g., <input type='text'>, <textarea>).",
            simpleExplanation: "Deletes any text currently inside an editable element (like an input field or text area).",
            mentalModel: "Like selecting all the text within a text box and hitting the Delete key.",
            usage: "Resetting form fields before entering new data to ensure the field contains only the intended input.",
            pitfalls: "Only works on editable elements. Throws exception if called on non-editable elements.",
            example: "IWebElement usernameField = driver.FindElement(By.Id(\"username\"));\nusernameField.Clear();\nusernameField.SendKeys(\"newUser\");",
            details: "No parameters or return value."
        },
        {
            name: "Submit()",
            description: "Submits the form this element belongs to. If the element is a submit button, it clicks it. If it's any other element within a form, it triggers the form's submit action.",
            simpleExplanation: "If the element is inside a form, this triggers the form's submission (like clicking the main submit button for that form).",
            mentalModel: "Like hitting the Enter key while focused inside a form field, or clicking the form's main 'Submit' / 'Login' / 'Search' button. It submits the whole form the element belongs to.",
            usage: "Convenient way to submit forms without explicitly finding and clicking the submit button.",
            pitfalls: "Element must be inside a <form> tag. If the element is not in a form, a NoSuchElementException might be thrown.",
            example: "IWebElement passwordField = driver.FindElement(By.Id(\"password\"));\npasswordField.SendKeys(\"secret\");\npasswordField.Submit(); // Submits the form containing the password field",
            details: "No parameters or return value."
        },
        {
            name: "TagName", // Property
            description: "Gets the HTML tag name of this element (e.g., 'input', 'a', 'div').",
            simpleExplanation: "Gets the HTML tag name of the element (like 'input', 'a', 'div', 'button').",
            mentalModel: "Like using \"Inspect Element\" and looking at the very beginning of the element's HTML code to see what kind of tag it is (e.g., <a> for a link, <input> for an input field).",
            usage: "Verifying the type of an element, useful in assertions or conditional logic.",
            example: "IWebElement element = driver.FindElement(By.Id(\"someId\"));\nstring tag = element.TagName;\nAssert.AreEqual(\"button\", tag.ToLower());",
            details: "Returns the tag name as a lowercase string. Read-only property."
        },
        {
            name: "Location", // Property
            description: "Gets the coordinates (X, Y) of the element's top-left corner relative to the top-left corner of the page rendering.",
            simpleExplanation: "Gets the X and Y coordinates of the element's top-left corner on the page.",
            mentalModel: "Like using a ruler on your screen to measure how far down and how far right the top-left corner of the element is.",
            usage: "Advanced interactions, visual testing, determining element position.",
            example: "Point location = element.Location;\nConsole.WriteLine($\"Element Location: X={location.X}, Y={location.Y}\");",
            details: "Returns a System.Drawing.Point object. Read-only property."
        },
        {
            name: "Size", // Property
            description: "Gets the height and width of the element's rendered dimensions.",
            simpleExplanation: "Gets the height and width of the element in pixels.",
            mentalModel: "Like using a ruler on your screen to measure the dimensions (width and height) of the element's bounding box.",
            usage: "Verifying element dimensions, responsive design testing.",
            example: "Size size = element.Size;\nConsole.WriteLine($\"Element Size: Width={size.Width}, Height={size.Height}\");",
            details: "Returns a System.Drawing.Size object. Read-only property."
        },
        {
            name: "Selected", // Property
            description: "Checks if a selectable element (<option>, <input type='checkbox'>, <input type='radio'>) is currently selected.",
            simpleExplanation: "Checks if an element that can be selected (like a checkbox, radio button, or dropdown option) is currently selected or checked.",
            mentalModel: "Like looking at a checkbox or radio button to see if it currently has a checkmark or dot inside it.",
            usage: "Verifying the state of checkboxes, radio buttons, or selected options in a dropdown.",
            example: "IWebElement checkbox = driver.FindElement(By.Id(\"agree\"));\nif (checkbox.Selected)\n{\n    Console.WriteLine(\"Checkbox is selected.\");\n}",
            details: "Returns a boolean. Read-only property."
        },
        {
            name: "GetCssValue(string propertyName)",
            description: "Gets the computed value of a specified CSS property for this element.",
            simpleExplanation: "Gets the calculated style value of a CSS property for the element (like its 'color', 'font-size', or 'background-color').",
            mentalModel: "Like using the browser's \"Inspect Element\" tool and looking at the \"Computed\" styles tab to see the final, rendered value of a specific style rule (e.g., finding out the exact shade of blue used for the element's text color).",
            params: "string propertyName: The name of the CSS property (e.g., 'color', 'font-size', 'background-color', 'display').",
            usage: "Verifying element styling, checking computed styles.",
            example: "string color = element.GetCssValue(\"color\");\nstring display = element.GetCssValue(\"display\");\nConsole.WriteLine($\"Element color: {color}, display: {display}\");",
            details: "Returns the computed style value as a string (e.g., colors might be returned as rgba or hex). Property names are typically hyphenated (CSS standard)."
        },
        { // Added method specific to IWebElement context
            name: "FindElement(By by)",
            description: "Finds the first descendant element matching the criteria *within this element*.",
            simpleExplanation: "Finds the first element inside this current element that matches the search criteria.",
            mentalModel: "Like focusing your search only within a specific section (the current element) of the page, instead of searching the whole page. It finds the first match within that boundary.",
            params: "By by: The locator strategy object.",
            usage: "Locating elements relative to a known parent element, improving locator robustness and reducing search scope.",
            pitfalls: "Throws NoSuchElementException if no descendant element matches. Search is limited to children, grandchildren, etc., of the current element.",
            example: "IWebElement formElement = driver.FindElement(By.TagName(\"form\"));\nIWebElement submitButton = formElement.FindElement(By.XPath(\".//button[@type='submit']\")); // Note the '.' prefix in XPath for relative search",
            details: "Returns an IWebElement. Essential for component-based testing."
        },
        { // Added method specific to IWebElement context
            name: "FindElements(By by)",
            description: "Finds all descendant elements matching the criteria *within this element*.",
            simpleExplanation: "Finds all elements inside this current element that match the search criteria and gives you a list.",
            mentalModel: "Like searching for all matches, but restricting your search to only look within the boundaries of the current element you're holding onto.",
            params: "By by: The locator strategy object.",
            usage: "Getting all items within a specific list container, finding all rows within a specific table section.",
            pitfalls: "Returns an empty list if no matching descendants are found.",
            example: "IWebElement listContainer = driver.FindElement(By.Id(\"item-list\"));\nReadOnlyCollection<IWebElement> items = listContainer.FindElements(By.TagName(\"li\"));\nConsole.WriteLine($\"Found {items.Count} list items.\");",
            details: "Returns a ReadOnlyCollection<IWebElement>."
        }
      ]
    },
    "INavigation": {
      accessedVia: "driver.Navigate()",
      description: "Provides methods for controlling the browser's navigation: moving to URLs and traversing history. Programmatic access to browser navigation controls.",
      simpleExplanation: "Controls the browser's history and loading of URLs.",
      mentalModel: "It's the programmatic equivalent of the browser's address bar (for typing URLs) and the Back, Forward, and Refresh buttons.",
      methods: [
        {
          name: "GoToUrl(string url) / GoToUrl(Uri url)",
          description: "Navigates the current browser window/tab to the specified URL.",
          simpleExplanation: "Tells the browser to load a new web page from the specified URL.",
          mentalModel: "Like typing a web address into the browser's address bar and hitting Enter.",
          params: "string url or System.Uri url: The web address (URL) to load.",
          usage: "Opening the application's start page, moving between different pages/sections, accessing external resources.",
          pitfalls: "Ensure URL is correct, accessible, and properly formatted (including protocol like http/https). Automation script must wait for page load completion *after* navigation before interacting with elements.",
          example: "driver.Navigate().GoToUrl(\"https://www.selenium.dev\");\ndriver.Navigate().GoToUrl(new Uri(\"https://example.com/login\"));",
          details: "Two overloads provided for convenience (string or Uri object). Uri object can be useful for complex/programmatically constructed URLs."
        },
        {
          name: "Back()",
          description: "Navigates the browser back one step in the session's history.",
          simpleExplanation: "Makes the browser go back one step in its browsing history.",
          mentalModel: "Like clicking the browser's \"Back\" button.",
          usage: "Simulating the user clicking the browser's 'Back' button. Useful for testing multi-step flows involving backward navigation.",
          pitfalls: "Relies on the browser session having a history. May have no effect if there is no previous page in the history. Avoid relying on specific history states between independent tests.",
          example: "driver.Navigate().GoToUrl(\"https://page1.com\");\ndriver.Navigate().GoToUrl(\"https://page2.com\");\ndriver.Navigate().Back(); // Goes back to page1.com",
          details: "No parameters or overloads."
        },
        {
          name: "Forward()",
          description: "Navigates the browser forward one step in the session's history.",
          simpleExplanation: "Makes the browser go forward one step in its browsing history (if you've gone back).",
          mentalModel: "Like clicking the browser's \"Forward\" button.",
          usage: "Simulating the user clicking the browser's 'Forward' button (typically only active after navigating back).",
          pitfalls: "Relies on having navigated back previously. May have no effect if there is no subsequent page in the forward history.",
          example: "driver.Navigate().GoToUrl(\"https://page1.com\");\ndriver.Navigate().GoToUrl(\"https://page2.com\");\ndriver.Navigate().Back(); // Back to page1\ndriver.Navigate().Forward(); // Forward to page2 again",
          details: "No parameters or overloads."
        },
        {
          name: "Refresh()",
          description: "Reloads the current webpage in the browser.",
          simpleExplanation: "Reloads the current web page.",
          mentalModel: "Like clicking the browser's \"Refresh\" or \"Reload\" button.",
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
      simpleExplanation: "Used to tell WebDriver to change its focus to a different window, frame, or alert.",
      mentalModel: "Think of it as the control panel for directing WebDriver's attention. You use it to say \"Look over here now!\" - whether \"here\" is a pop-up alert, a frame embedded in the page, or a different browser window/tab.",
      methods: [
        {
          name: "Frame(int frameIndex / string frameNameOrId / IWebElement frameElement)", // Combined overloads for brevity
          description: "Switches focus to a frame/iframe using its zero-based index, 'name'/'id' attribute, or a located IWebElement.",
          simpleExplanation: "Switches WebDriver's focus into a specific frame or iframe within the current page.",
          mentalModel: "Imagine a webpage with embedded mini-pages (iframes) inside it. This is like telling WebDriver to \"step inside\" one of those specific mini-pages to interact with elements there.",
          params: "int frameIndex | string frameNameOrId | IWebElement frameElement",
          usage: "Interacting with elements inside frames/iframes.",
          pitfalls: "Must switch back (DefaultContent/ParentFrame). Using index is brittle. Name/ID must be unique/stable. Element must be a frame. Throws NoSuchFrameException or StaleElementReferenceException on errors.",
          example: "driver.SwitchTo().Frame(0); // By index\ndriver.SwitchTo().Frame(\"myContentFrame\"); // By name/ID\nIWebElement frameEl = driver.FindElement(By.CssSelector(\"iframe.embed\"));\ndriver.SwitchTo().Frame(frameEl); // By element",
          details: "Directs subsequent commands to the specified frame."
        },
        {
          name: "ParentFrame()",
          description: "Switches focus from the currently selected frame to its immediate parent frame.",
          simpleExplanation: "Switches WebDriver's focus from inside a frame back out to the frame containing it.",
          mentalModel: "If you've stepped inside an iframe (\"mini-page\"), this is like telling WebDriver to \"step back out\" to the page or frame that holds it.",
          usage: "Navigating out of nested iframes to interact with elements in the containing frame.",
          pitfalls: "If the current context is already the top-level document or a frame directly within it, the context remains unchanged. Useful only when inside a nested frame.",
          example: "// Assuming driver is focused inside 'childFrame' which is inside 'parentFrame'\ndriver.SwitchTo().ParentFrame(); // Focus moves to 'parentFrame'",
          details: "No parameters. Useful for navigating frame hierarchies."
        },
        {
          name: "DefaultContent()",
          description: "Switches focus back to the main document of the page (the top-level frame or default context).",
          simpleExplanation: "Switches WebDriver's focus back to the main page content, out of any frames.",
          mentalModel: "Regardless of how many frames deep you've gone, this is like telling WebDriver to \"go back to the main, top-level page\".",
          usage: "Essential step to return to the main page content after interacting with elements inside *any* frame or iframe.",
          pitfalls: "Forgetting to switch back will result in subsequent findElement/findelements calls failing if the target element is not within the currently focused frame (likely NoSuchElementException).",
          example: "driver.SwitchTo().Frame(\"myFrame\");\n// ... interact with elements inside the frame ...\ndriver.SwitchTo().DefaultContent(); // Switch back to the main page\n// ... interact with elements on the main page ...",
          details: "No parameters. Resets focus to the top-level browsing context."
        },
         {
          name: "Window(string windowNameOrHandle)",
          description: "Switches focus to a different browser window or tab.",
          simpleExplanation: "Switches WebDriver's focus to a different browser window or tab, using its unique ID (handle) or name.",
          mentalModel: "Like clicking on a different browser tab or window on your screen to bring it to the front and make it the active one.",
          params: "string windowNameOrHandle: The 'name' assigned via window.open() or the unique window handle (obtained from driver.WindowHandles or driver.CurrentWindowHandle).",
          usage: "Interacting with elements in newly opened windows or tabs (e.g., after clicking a link with target='_blank').",
          pitfalls: "Need to get the target window handle first (usually by comparing driver.WindowHandles before and after the action that opens the new window). Throws NoSuchWindowException if the handle/name is invalid or the window is closed.",
          example: "string originalWindow = driver.CurrentWindowHandle;\n// ... action that opens new window ...\nReadOnlyCollection<string> handles = driver.WindowHandles;\nstring newWindowHandle = handles.FirstOrDefault(h => h != originalWindow);\nif (newWindowHandle != null) { driver.SwitchTo().Window(newWindowHandle); }",
          details: "Directs subsequent commands to the specified window/tab."
        },
        {
          name: "NewWindow(WindowType typeHint)",
          description: "Opens a new browser window or tab and automatically switches the WebDriver's focus to it. (Selenium 4+ feature).",
          simpleExplanation: "Opens a completely new browser window or tab and switches WebDriver's focus to it.",
          mentalModel: "Like clicking \"File > New Window\" or \"File > New Tab\" in your browser.",
          params: "WindowType typeHint: An enum specifying whether to open a new Tab (WindowType.Tab) or a new Window (WindowType.Window).",
          usage: "Programmatically opening and switching to a new tab/window for testing multi-window scenarios.",
          pitfalls: "Need to store the original window handle if you intend to switch back.",
          example: "string originalHandle = driver.CurrentWindowHandle;\n// Open and switch to a new tab\ndriver.SwitchTo().NewWindow(WindowType.Tab);\ndriver.Navigate().GoToUrl(\"https://newtab.com\");\n// Switch back to the original tab\ndriver.SwitchTo().Window(originalHandle);",
          details: "Returns the IWebDriver instance focused on the new window/tab."
        },
        {
          name: "Alert()",
          description: "Switches focus to the currently displayed JavaScript alert, confirmation, or prompt dialog.",
          simpleExplanation: "Switches WebDriver's focus to a JavaScript alert, confirmation, or prompt dialog box that has popped up.",
          mentalModel: "Like acknowledging that a pop-up message (alert) has appeared and getting ready to interact specifically with that pop-up (to accept, dismiss, or get text from it).",
          usage: "Allows interaction with the alert via the returned IAlert object (Accept, Dismiss, Text, SendKeys).",
          pitfalls: "Throws NoAlertPresentException if no JavaScript alert is currently open on the page. Execution is often blocked until the alert is handled.",
          example: "IAlert alert = driver.SwitchTo().Alert();\nstring text = alert.Text;\nalert.Accept();",
          details: "Returns an IAlert object. Does not take parameters."
        },
         {
          name: "ActiveElement()",
          description: "Gets the IWebElement corresponding to the element that currently has focus.",
          simpleExplanation: "Gets the element that currently has focus on the page (like the input field the cursor is blinking in).",
          mentalModel: "Like asking the browser, \"Which specific element on the page is currently active or has the keyboard cursor right now?\"",
          usage: "Finding where keyboard focus is, interacting with the active element without needing a specific locator.",
          pitfalls: "Returns the <body> element if no specific element has focus. The element returned might change dynamically.",
          example: "IWebElement focusedElement = driver.SwitchTo().ActiveElement();\nfocusedElement.SendKeys(\"Typing into focused element\");",
          details: "Returns an IWebElement representing the currently focused DOM element."
         }
      ]
    },
    "IAlert": {
      accessedVia: "driver.SwitchTo().Alert()",
      description: "Represents a JavaScript alert, confirmation, or prompt dialog. Provides methods to interact with it.",
      simpleExplanation: "Represents a JavaScript alert, confirmation, or prompt pop-up and lets you interact with it.",
      mentalModel: "It's your handle to interact with those simple browser pop-up boxes that demand immediate attention (the ones that often pause page interaction until dealt with).",
      methods: [
        {
          name: "Accept()",
          description: "Simulates clicking the 'OK' or positive confirmation button on the dialog.",
          simpleExplanation: "Clicks the 'OK' or 'Yes' button on the pop-up.",
          mentalModel: "Like clicking the positive confirmation button (\"OK\") on an alert or confirm dialog.",
          usage: "Acknowledging simple alerts, confirming actions ('Yes'/'OK' on confirmations), accepting input entered into prompts.",
          pitfalls: "On prompts, typically called after SendKeys.",
          example: "IAlert alert = driver.SwitchTo().Alert();\nalert.Accept();",
          details: "Dismisses the alert. Applicable to simple, confirmation, and prompt alerts."
        },
        {
          name: "Dismiss()",
          description: "Simulates clicking the 'Cancel' or negative confirmation button on the dialog.",
          simpleExplanation: "Clicks the 'Cancel' or 'No' button on the pop-up (or closes it if there's only 'OK').",
          mentalModel: "Like clicking the negative or cancellation button (\"Cancel\") on a confirm/prompt dialog, or the \"OK\" button on a simple alert (as dismissing and accepting are the same for basic alerts).",
          usage: "Dismissing confirmation dialogs ('No'/'Cancel'), canceling prompt dialogs.",
          pitfalls: "Behavior on simple alerts (which usually only have 'OK') might vary by browser (might act like Accept or do nothing).",
          example: "IAlert confirm = driver.SwitchTo().Alert();\nconfirm.Dismiss();",
          details: "Dismisses the alert. Applicable to confirmation and prompt alerts."
        },
        {
          name: "Text", // Property
          description: "Retrieves the text message displayed within the alert dialog.",
          simpleExplanation: "Gets the message text displayed within the pop-up box.",
          mentalModel: "Like reading the message written inside the alert/confirm/prompt pop-up.",
          usage: "Verifying the content of the alert message (e.g., error messages, confirmation questions).",
          pitfalls: "Ensure alert is present before accessing Text (otherwise NoAlertPresentException).",
          example: "IAlert alert = driver.SwitchTo().Alert();\nstring message = alert.Text;\nAssert.IsTrue(message.Contains(\"Are you sure?\"));",
          details: "Returns the text as a string. Read-only property."
        },
        {
          name: "SendKeys(string text)",
          description: "Enters the specified text into the input field of a prompt dialog.",
          simpleExplanation: "Types text into the input field of a prompt pop-up.",
          mentalModel: "If the pop-up is asking for input (a prompt dialog), this is like typing your answer into its text box.",
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
      simpleExplanation: "Provides access to various browser-level management interfaces like cookies, timeouts, and window manipulation.",
      mentalModel: "Think of this as the main 'Settings' menu you get after clicking Manage(). From here, you can navigate to specific sub-menus like 'Cookies', 'Timeouts', or 'Window Size'.",
      methods: [
         {
             name: "Cookies", // Property
             description: "Provides access to the ICookieJar interface for managing browser cookies.",
             simpleExplanation: "Gives access to the ICookieJar interface for managing browser cookies.",
             mentalModel: "Like clicking on the 'Cookies' or 'Site Data' section within the browser's settings panel.",
             usage: "Returns an ICookieJar object to Add, Get, or Delete cookies for the current session.",
             example: "ICookieJar cookieJar = driver.Manage().Cookies;\ncookieJar.AddCookie(myAuthCookie);",
             details: "Read-only property returning ICookieJar."
         },
         {
             name: "Timeouts()",
             description: "Provides access to the ITimeouts interface for configuring various wait times.",
             simpleExplanation: "Gives access to the ITimeouts interface for setting various wait times (implicit waits, page load waits, script waits).",
             mentalModel: "Like going to a 'Timeout Settings' or 'Advanced Configuration' area where you can tell the browser how long to wait for certain operations before giving up.",
             usage: "Returns an ITimeouts object to set ImplicitWait, PageLoadTimeout, and ScriptTimeout.",
             pitfalls: "Overly long implicit waits slow tests significantly. Understand the difference between implicit and explicit waits.",
             example: "ITimeouts timeouts = driver.Manage().Timeouts();\ntimeouts.ImplicitWait = TimeSpan.FromSeconds(5);",
             details: "Returns an ITimeouts object." // Note: In C#, Timeouts is often used like a property chain: driver.Manage().Timeouts().ImplicitWait = ...
         },
         {
             name: "Window", // Property
             description: "Provides access to the IWindow interface for managing browser window size, position, and state.",
             simpleExplanation: "Gives access to the IWindow interface for controlling the browser window's size and position.",
             mentalModel: "Like accessing the controls that let you Maximize, Minimize, or resize the actual browser window itself.",
             usage: "Returns an IWindow object to Maximize, Minimize, set Size/Position, etc.",
             example: "IWindow window = driver.Manage().Window;\nwindow.Maximize();\nwindow.Size = new Size(1280, 720);",
             details: "Read-only property returning IWindow."
         }
      ]
    },
    "ICookieJar": {
        accessedVia: "driver.Manage().Cookies",
        description: "Provides methods for managing browser cookies within the current session: adding, retrieving, and deleting cookies.",
        simpleExplanation: "Allows you to manage the browser's cookies for the current domain (add, get, delete).",
        mentalModel: "It's the cookie manager. Think of it like opening the browser's developer tools or settings section specifically designed for viewing, adding, and deleting cookies stored for the website you're on.",
        methods: [
            {
                name: "AddCookie(Cookie cookie)",
                description: "Adds a specific cookie to the browser's cookie storage for the current session.",
                simpleExplanation: "Adds a specific cookie to the browser's storage for the current site.",
                mentalModel: "Like manually creating a new cookie with a specific name, value, and expiration date in the browser's cookie storage.",
                params: "Cookie cookie: A Selenium Cookie object containing details like name, value, domain, path, expiry date, IsSecure, IsHttpOnly.",
                usage: "Setting cookies for authentication (bypassing login), testing scenarios dependent on specific cookie values, maintaining session state.",
                pitfalls: "Cookie domain must match the current page's domain or be a parent domain. Cookie path must be appropriate. You must be on the domain (or a subdomain) for which you want to set the cookie *before* calling AddCookie. Ensure expiry date is correct.",
                example: "// Assumes driver is navigated to example.com or a subdomain\nCookie ck = new Cookie(\"sessionId\", \"123xyz\", \".example.com\", \"/\", DateTime.Now.AddDays(1));\ndriver.Manage().Cookies.AddCookie(ck);",
                details: "The Cookie class is in the OpenQA.Selenium namespace."
            },
            {
                name: "GetCookieNamed(string name)",
                description: "Retrieves a single cookie from the browser's storage based on its name.",
                simpleExplanation: "Retrieves a specific cookie by its name.",
                mentalModel: "Like searching for a cookie with a particular name in the browser's cookie list and reading its details.",
                params: "string name: The name of the cookie to retrieve.",
                usage: "Verifying that a cookie has been set correctly, retrieving a cookie's value for validation or use.",
                pitfalls: "Returns null if no cookie with the given name is found for the current domain/path.",
                example: "Cookie sessionCookie = driver.Manage().Cookies.GetCookieNamed(\"sessionId\");\nif (sessionCookie != null)\n{\n    Console.WriteLine(\"Session Value: \" + sessionCookie.Value);\n}",
                details: "Returns a Cookie object or null."
            },
            {
                name: "AllCookies", // Property (originally GetCookies() method, but often accessed like a property in C# examples)
                description: "Retrieves all cookies visible to the current page (based on domain and path).",
                simpleExplanation: "Gets a list of all cookies visible to the current page/domain.",
                mentalModel: "Like looking at the entire list of cookies currently stored in the browser for the website you are visiting.",
                usage: "Inspecting all cookies for the current context, debugging cookie issues, logging cookie information.",
                example: "ReadOnlyCollection<Cookie> allCookies = driver.Manage().Cookies.AllCookies;\nforeach (Cookie currentCookie in allCookies)\n{\n    Console.WriteLine($\"Cookie: {currentCookie.Name}={currentCookie.Value}\");\n}",
                details: "Returns a ReadOnlyCollection<Cookie>. Returns an empty collection if no cookies are found."
            },
            {
                name: "DeleteCookie(Cookie cookie)",
                description: "Deletes a specific cookie from the browser's storage. Matching is done based on the cookie's name.",
                simpleExplanation: "Deletes a specific cookie (usually matched by name).",
                mentalModel: "Like finding a specific cookie in the browser's list and clicking the 'Delete' or 'Remove' button for it.",
                params: "Cookie cookie: The Cookie object representing the cookie to delete (only the name is typically used for matching).",
                usage: "Removing a specific cookie, e.g., simulating logout by deleting a session cookie.",
                pitfalls: "The domain/path of the passed Cookie object are usually ignored; deletion happens based on name for the current context.",
                example: "Cookie ckToDelete = driver.Manage().Cookies.GetCookieNamed(\"tempPref\");\nif (ckToDelete != null) { driver.Manage().Cookies.DeleteCookie(ckToDelete); }",
                details: "Deletes the cookie matching the name of the provided Cookie object."
            },
            {
                name: "DeleteCookieNamed(string name)",
                description: "Deletes a cookie with the specified name from the current domain/path.",
                simpleExplanation: "Deletes a cookie directly by specifying its name.",
                mentalModel: "Like typing the name of the cookie you want to remove into a search box in the cookie manager and hitting 'Delete'.",
                params: "string name: The name of the cookie to delete.",
                usage: "Removing a cookie based on its name, clearing specific preferences or session tokens.",
                pitfalls: "Has no effect if no cookie with that name exists.",
                example: "driver.Manage().Cookies.DeleteCookieNamed(\"userPreference\");",
                details: "More direct way to delete by name compared to DeleteCookie."
            },
            {
                name: "DeleteAllCookies()",
                description: "Deletes all cookies visible to the current page (current domain/path).",
                simpleExplanation: "Deletes all cookies for the current domain/context.",
                mentalModel: "Like clicking the \"Clear All Cookies for this Site\" button in the browser's settings or developer tools.",
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
      simpleExplanation: "Used for creating sequences of complex user interactions like mouse movements, drag-and-drop, holding down keys, or right-clicks, which simple Click() or SendKeys() can't handle.",
      mentalModel: "Think of it as choreographing a detailed sequence of user actions. Instead of just a simple click, you're defining a series of steps: \"move mouse here\", \"press button down\", \"move mouse there\", \"release button\". You build the whole dance routine first, then call Perform() to execute it.",
      methods: [
        {
          name: "MoveToElement(IWebElement element)",
          description: "Moves the mouse cursor to the center of the specified web element.",
          simpleExplanation: "Moves the virtual mouse cursor to the middle of the specified element.",
          mentalModel: "Like hovering your mouse pointer directly over a specific button or link without clicking it. Often used to trigger hover menus.",
          params: "IWebElement element: The target element to move the mouse cursor to.",
          usage: "Triggering hover events (to reveal menus, tooltips), preparing for context clicks or other actions on the element.",
          pitfalls: "Element must be visible and exist in the DOM. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement mainMenu = driver.FindElement(By.Id(\"menu\"));\nactions.MoveToElement(mainMenu).Perform();",
          details: "Part of building an action sequence."
        },
        {
          name: "Click(IWebElement element)",
          description: "Performs a mouse left-click action on the specified web element.",
          simpleExplanation: "Performs a standard left-click on the specified element (within an Actions sequence).",
          mentalModel: "Like specifically adding a \"left-click on this element\" step into your choreographed sequence.",
          params: "IWebElement element: The target element to click.",
          usage: "Standard click action, often used within a chain (e.g., after MoveToElement). Can sometimes work on elements where element.Click() fails.",
          pitfalls: "Element must be interactable. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement subMenuItem = driver.FindElement(By.Id(\"submenu-item\"));\nactions.MoveToElement(mainMenu).Click(subMenuItem).Perform();",
          details: "Adds a click action (mouse down + mouse up) to the sequence."
        },
         {
          name: "Click()", // Overload without element
          description: "Performs a mouse left-click action at the current mouse cursor position.",
          simpleExplanation: "Performs a left-click at the current position of the virtual mouse cursor.",
          mentalModel: "Like adding a \"left-click right where the mouse pointer is now\" step to your sequence. Useful after moving the mouse with MoveToElement or MoveByOffset.",
          usage: "Clicking after moving the cursor to a specific offset or element.",
          pitfalls: "Relies on the mouse cursor being in the correct position from previous actions. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nactions.MoveToElement(canvas).MoveByOffset(10, 10).Click().Perform();",
          details: "Clicks where the virtual mouse cursor currently is."
        },
        {
          name: "DoubleClick(IWebElement element)",
          description: "Performs a double-click action on the specified web element.",
          simpleExplanation: "Performs a double left-click on the specified element.",
          mentalModel: "Like adding a \"double-click this element\" step to your sequence.",
          params: "IWebElement element: The target element to double-click.",
          usage: "Testing UI elements that respond specifically to double-click events.",
          pitfalls: "Element must be interactable. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement item = driver.FindElement(By.Id(\"list-item\"));\nactions.DoubleClick(item).Perform();",
          details: "Adds a double-click action to the sequence."
        },
         {
          name: "DoubleClick()", // Overload without element
          description: "Performs a double-click action at the current mouse cursor position.",
          simpleExplanation: "Performs a double left-click at the current mouse position.",
          mentalModel: "Like adding a \"double-click right where the mouse pointer is now\" step to your sequence.",
          usage: "Double-clicking after positioning the mouse.",
          pitfalls: "Relies on correct cursor position. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nactions.MoveToElement(target).DoubleClick().Perform();",
          details: "Double-clicks where the virtual mouse cursor currently is."
        },
        {
          name: "ContextClick(IWebElement element)",
          description: "Performs a right-click (context click) action on the specified web element.",
          simpleExplanation: "Performs a right-click on the specified element.",
          mentalModel: "Like adding a \"right-click this element\" step to your sequence (to open a context menu).",
          params: "IWebElement element: The target element to right-click.",
          usage: "Testing custom context menus or other right-click specific functionality.",
          pitfalls: "Element must be interactable. Ensure Perform() is called. Automating the resulting context menu often requires further steps.",
          example: "Actions actions = new Actions(driver);\nIWebElement item = driver.FindElement(By.Id(\"clickable-item\"));\nactions.ContextClick(item).Perform();",
          details: "Adds a right-click action to the sequence."
        },
         {
          name: "ContextClick()", // Overload without element
          description: "Performs a right-click (context click) action at the current mouse cursor position.",
          simpleExplanation: "Performs a right-click at the current mouse position.",
          mentalModel: "Like adding a \"right-click right where the mouse pointer is now\" step to your sequence.",
          usage: "Right-clicking after positioning the mouse.",
          pitfalls: "Relies on correct cursor position. Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nactions.MoveToElement(target).ContextClick().Perform();",
          details: "Right-clicks where the virtual mouse cursor currently is."
        },
        {
          name: "DragAndDrop(IWebElement source, IWebElement target)",
          description: "Performs a drag-and-drop operation by clicking and holding the 'source' element, moving to the 'target' element, and releasing.",
          simpleExplanation: "Clicks and holds the 'source' element, moves the mouse to the 'target' element, and then releases the mouse button.",
          mentalModel: "Like choreographing the entire drag-and-drop motion: \"grab this item\", \"drag it over to that spot\", \"let go\".",
          params: "IWebElement source: The element to drag. IWebElement target: The element to drop onto.",
          usage: "Testing drag-and-drop interfaces (e.g., reordering lists, moving items between containers).",
          pitfalls: "Both elements must be interactable. Can be complex to get working reliably depending on the UI implementation (sometimes requires intermediate MoveToElement steps or DragAndDropToOffset). Ensure Perform() is called.",
          example: "Actions actions = new Actions(driver);\nIWebElement draggable = driver.FindElement(By.Id(\"drag-me\"));\nIWebElement droppable = driver.FindElement(By.Id(\"drop-here\"));\nactions.DragAndDrop(draggable, droppable).Perform();",
          details: "Adds a composite action (click-and-hold, move, release) to the sequence."
        },
        {
            name: "SendKeys(string keysToSend)", // Overload without element
            description: "Sends a sequence of key strokes to the currently focused element on the page.",
            simpleExplanation: "Sends keyboard input to whatever element currently has focus on the page.",
            mentalModel: "Like adding a \"type these keys now\" step to your sequence, assuming the cursor is already in the right place.",
            params: "string keysToSend: The sequence of characters or Keys constants.",
            usage: "Typing into the active element, sending global shortcuts (if applicable).",
            pitfalls: "Relies on the correct element having focus. Use the SendKeys(IWebElement, string) overload for targeting specific elements. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\n// Assuming input field already has focus\nactions.SendKeys(\"Text for focused element\").Perform();",
            details: "Sends keys to wherever the current focus is."
        },
        {
            name: "SendKeys(IWebElement element, string keysToSend)",
            description: "Sends a sequence of key strokes specifically to the given web element.",
            simpleExplanation: "Sends keyboard input specifically to the provided element.",
            mentalModel: "Like adding a \"click into this specific field, then type these keys\" step into your sequence. More reliable than the version without an element.",
            params: "IWebElement element: The target element. string keysToSend: The keys sequence.",
            usage: "Reliably sending input to a specific field within an Actions chain.",
            pitfalls: "Element should be interactable/editable. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\nIWebElement input = driver.FindElement(By.Id(\"myInput\"));\nactions.SendKeys(input, \"Targeted text\").Perform();",
            details: "Focuses the element (if needed) before sending keys."
        },
        {
            name: "KeyDown(string theKey) / KeyDown(IWebElement element, string theKey)",
            description: "Simulates pressing a key down without releasing it.",
            simpleExplanation: "Simulates pressing and holding down a specific key (like Shift, Ctrl, Alt).",
            mentalModel: "Like adding a \"press and don't release the Shift key\" step to your sequence. Must be paired with a KeyUp.",
            params: "string theKey (use Keys class constants like Keys.Shift, Keys.Control) / Optional IWebElement target.",
            usage: "Simulating holding down modifier keys (Shift, Control, Alt) for key combinations or actions like multi-select.",
            pitfalls: "Must be paired with a corresponding KeyUp action or Release() to release the key. Ensure Perform() is called.",
            example: "// Simulate Ctrl+A (Select All)\nActions actions = new Actions(driver);\nactions.KeyDown(Keys.Control).SendKeys(\"a\").KeyUp(Keys.Control).Perform();",
            details: "Targets the specified element or the currently focused element."
        },
        {
            name: "KeyUp(string theKey) / KeyUp(IWebElement element, string theKey)",
            description: "Simulates releasing a previously pressed key.",
            simpleExplanation: "Simulates releasing a key that was previously held down.",
            mentalModel: "Like adding a \"now release the Shift key\" step, completing an action started with KeyDown.",
            params: "string theKey (use Keys class constants) / Optional IWebElement target.",
            usage: "Releasing modifier keys after performing actions while they were held down.",
            pitfalls: "Should correspond to a previous KeyDown action. Ensure Perform() is called.",
            example: "// Simulate Ctrl+A (Select All)\nActions actions = new Actions(driver);\nactions.KeyDown(Keys.Control).SendKeys(\"a\").KeyUp(Keys.Control).Perform();",
            details: "Targets the specified element or the currently focused element."
        },
         {
            name: "Perform()",
            description: "Executes the entire sequence of actions that have been built using the Actions class methods.",
            simpleExplanation: "Executes the entire sequence of actions that you've built up using the other Actions methods. Nothing happens until you call this.",
            mentalModel: "This is the \"Play\" button for your choreographed action sequence. You define all the steps (MoveToElement, ClickAndHold, Release, etc.), and Perform() tells the browser to actually do them all in order.",
            usage: "***Mandatory*** step. Must be called at the end of an Actions chain to actually perform the composed interactions on the browser.",
            pitfalls: "Forgetting to call Perform() is a common mistake; it results in none of the chained actions being executed.",
            example: "// All Actions examples MUST end with .Perform() like:\nActions actions = new Actions(driver);\nactions.MoveToElement(element).Click().Perform();",
            details: "Compiles and sends the sequence of actions to the browser driver for execution."
        },
        {
            name: "ClickAndHold(IWebElement element)",
            description: "Performs a mouse left-click on an element and holds the button down.",
            simpleExplanation: "Clicks the left mouse button on an element and keeps it held down.",
            mentalModel: "Like adding the first part of a drag action: \"press the mouse button down on this element and keep it held\". Needs a Release later.",
            params: "IWebElement element: The target element.",
            usage: "Starting point for custom drag-and-drop sequences or interactions requiring a held mouse button.",
            pitfalls: "Must be paired with a Release() action later in the chain. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\nactions.ClickAndHold(source).MoveToElement(target).Release().Perform();"
        },
         {
            name: "Release(IWebElement element)", // Often used without element param too
            description: "Releases the left mouse button over a specified element or at the current location.",
            simpleExplanation: "Releases the left mouse button while the cursor is over the specified element.",
            mentalModel: "Like adding the final step of a drag action: \"now let go of the mouse button while hovering over this target area\". Completes a ClickAndHold.",
            params: "IWebElement element (optional): The element over which to release the mouse button.",
            usage: "Completing a drag-and-drop or other action initiated with ClickAndHold.",
            pitfalls: "Assumes the mouse button is currently held down. Ensure Perform() is called.",
            example: "Actions actions = new Actions(driver);\nactions.ClickAndHold(source).MoveToElement(target).Release(target).Perform();\n// Or simply release at current position:\nactions.ClickAndHold(source).MoveByOffset(100, 50).Release().Perform();"
        },
      ]
    },
    "ITimeouts": {
      accessedVia: "driver.Manage().Timeouts()",
      description: "Interface to configure time limits for various browser operations.",
      simpleExplanation: "Configures how long WebDriver should wait for certain operations (like finding elements or page loads) before giving up and throwing an error.",
      mentalModel: "Think of setting timers or deadlines for the browser. \"Wait up to X seconds for the page to load,\" or \"Keep trying to find this element for up to Y seconds before telling me it's not there.\"",
      methods: [
        { name: "ImplicitWait", description: "Sets a default wait time (TimeSpan) for FindElement/FindElements to find an element before throwing NoSuchElementException.", simpleExplanation:"Sets a default maximum time WebDriver should wait when trying to find any element before throwing a \"not found\" error.", mentalModel:"Like setting a global rule: \"Whenever you're looking for an element using FindElement or FindElements, keep trying for up to this many seconds if you don't see it immediately.\"", pitfalls: "Applies globally. Can slow down tests if set high. Often debated vs Explicit Waits.", params:"TimeSpan time" },
        { name: "PageLoad", description: "Sets the time limit (TimeSpan) for a page load to complete before throwing an exception.", simpleExplanation:"Sets the maximum time WebDriver should wait for a page to fully load after navigation before timing out.", mentalModel:"Like setting a timer specifically for page loading: \"When I tell you to go to a URL, wait up to this many seconds for the page load to complete.\"", params:"TimeSpan time"},
        { name: "AsynchronousJavaScript", description: "Sets the time limit (TimeSpan) for an asynchronous script (ExecuteAsyncScript) to finish before throwing an exception.", simpleExplanation:"Sets the maximum time WebDriver should wait for an asynchronous JavaScript snippet (executed via ExecuteAsyncScript) to finish.", mentalModel:"Like setting a timer for background JavaScript tasks you start: \"When I run this async script, wait up to this many seconds for it to signal that it's done.\"", params:"TimeSpan time"}
      ]
    },
    "IWindow": {
      accessedVia: "driver.Manage().Window",
      description: "Interface to manage the current browser window's size, position, and state.",
      simpleExplanation: "Controls the size, position, and state (maximized, minimized, full screen) of the current browser window.",
      mentalModel: "It's the set of controls for manipulating the actual browser window frame itself, like grabbing the corners to resize it, hitting the maximize button, or moving it around your desktop.",
      methods: [
        { name: "Size", description: "Gets or sets the outer window size (System.Drawing.Size).", simpleExplanation:"Gets or sets the width and height of the browser window.", mentalModel:"Like reading or changing the dimensions (width x height) of the window itself." },
        { name: "Position", description: "Gets or sets the window position (System.Drawing.Point).", simpleExplanation:"Gets or sets the X and Y coordinates of the top-left corner of the browser window on your screen.", mentalModel:"Like reading or changing where the window is located on your monitor(s)." },
        { name: "Maximize()", description: "Maximizes the browser window.", simpleExplanation:"Makes the browser window fill the entire screen (like clicking the maximize button).", mentalModel:"Like clicking the square 'Maximize' button in the window's title bar." },
        { name: "Minimize()", description: "Minimizes the browser window (support varies).", simpleExplanation:"Minimizes the browser window to the taskbar.", mentalModel:"Like clicking the '_' 'Minimize' button in the window's title bar." },
        { name: "FullScreen()", description: "Sets the window to full screen mode (like F11).", simpleExplanation:"Puts the browser window into full-screen mode (hiding toolbars, like pressing F11).", mentalModel:"Like pressing the F11 key in most browsers to make the content take up the absolute entire screen." }
      ]
    },
    "IJavaScriptExecutor": {
      description: "Interface to execute JavaScript code within the context of the currently selected frame or window.",
      simpleExplanation: "Allows you to run custom JavaScript code directly within the browser page from your test script.",
      mentalModel: "Think of it as opening the browser's developer console (like pressing F12) and typing JavaScript commands directly into it, but doing it programmatically from your C# code. It's a way to do things that standard WebDriver commands might not support easily.",
      accessedVia: "Typically by casting the IWebDriver instance: ((IJavaScriptExecutor)driver)...",
      methods: [
        { name: "ExecuteScript(string script, params object[] args)", description: "Executes JavaScript synchronously in the browser. Can return values.", simpleExplanation:"Runs a piece of JavaScript code immediately and can return a result (like a number, string, boolean, or even a web element).", mentalModel:"Like typing a JavaScript command into the developer console and hitting Enter. It runs right away. You can pass values from your C# code into the script.", params: "string script: The JS code. params object[] args: Arguments accessible via `arguments[0]`, `arguments[1]`, etc. in the script." },
        { name: "ExecuteAsyncScript(string script, params object[] args)", description: "Executes JavaScript asynchronously. The script must signal completion by calling the provided callback (usually `arguments[arguments.length - 1]`).", simpleExplanation:"Runs a piece of JavaScript code that might take some time to finish (asynchronous). The script needs to explicitly signal when it's done.", mentalModel:"Like running a JavaScript command in the console that performs a background task (e.g., waiting for something). Your C# code waits until the script calls a special callback function to say \"I'm finished!\".", params: "string script: The async JS code. params object[] args: Arguments + callback." }
      ]
    },
    "ITakesScreenshot": {
      description: "Interface to capture screenshots of the current browser window.",
      simpleExplanation: "Allows you to capture a screenshot of the current content visible in the browser window.",
      mentalModel: "Like pressing the \"Print Screen\" button on your keyboard, but specifically capturing just the content area of the browser window controlled by WebDriver.",
      accessedVia: "Typically by casting the IWebDriver instance: ((ITakesScreenshot)driver)...",
      methods: [
        { name: "GetScreenshot()", description: "Captures a screenshot of the current window.", simpleExplanation:"Takes a screenshot of the current browser viewport and returns it as an object you can save.", mentalModel:"The action of actually taking the picture. It gives you back the image data.", usage:"Returns a Screenshot object, which can be saved to a file.", example: "Screenshot ss = ((ITakesScreenshot)driver).GetScreenshot();\nss.SaveAsFile(\"screenshot.png\", ScreenshotImageFormat.Png);" }
      ]
    },
    "ILocatable": {
        description: "Interface providing methods to get the physical location of an element on the page. Implemented by IWebElement.",
        simpleExplanation: "Provides ways to get the precise physical coordinates of an element on the screen, potentially after scrolling it into view.",
        mentalModel: "Think of it as a more advanced toolset for figuring out exactly where an element is physically located within the browser's display area, potentially needing to scroll the page first to even find its coordinates accurately. (Note: IWebElement.Location often suffices).",
        methods: [
            { name: "LocationOnScreenOnceScrolledIntoView", description: "Gets location after scrolling element into view.", simpleExplanation:"Scrolls the element into the visible part of the browser window first, then gets its coordinates relative to the screen.", mentalModel:"Like scrolling the page until you can see the element, then using a ruler to measure its position on the screen." },
            { name: "Coordinates", description: "Provides advanced location details relative to viewport/DOM.", simpleExplanation:"Provides access to more detailed coordinate information (relative to viewport, etc.).", mentalModel:"An advanced measurement tool giving different coordinate perspectives (relative to the visible window, the whole document, etc.)." },
        ]
    },
    "ISearchContext": {
        description: "Defines the basic contract for finding elements. Implemented by both IWebDriver (searches entire DOM) and IWebElement (searches within that element's subtree).",
        simpleExplanation: "Defines the basic ability to find elements using FindElement and FindElements. It's the fundamental contract for searching.",
        mentalModel: "It represents the capability to search. Both the whole browser (IWebDriver) and individual elements (IWebElement) have this capability. When you use FindElement(s) on IWebDriver, the search context is the entire page. When you use it on an IWebElement, the search context is limited to just that element and its children.",
        methods: [
            { name: "FindElement(By by)", description: "Finds the first descendant element matching the criteria.", simpleExplanation:"Finds the first descendant element matching the criteria within the current context (whole page or within an element).", mentalModel:"The core \"find the first one\" action, applied within the current scope (either page-wide or element-specific)." },
            { name: "FindElements(By by)", description: "Finds all descendant elements matching the criteria.", simpleExplanation:"Finds all descendant elements matching the criteria within the current context.", mentalModel:"The core \"find all of them\" action, applied within the current scope." }
        ]
    },
  };

  // Colors for nodes (consistent)
  const colors: Record<string, string> = {
    "IWebDriver": "#4A90E2", "IWebElement": "#50C878", "INavigation": "#9B59B6", "ITargetLocator": "#F39C12",
    "IAlert": "#F5A623", "IOptions": "#E74C3C", "ICookieJar": "#E67E22", "Actions API": "#34495E",
    "ITimeouts": "#16A085", "IWindow": "#2980B9", "IJavaScriptExecutor": "#8E44AD", "ITakesScreenshot": "#1ABC9C",
    "ILocatable": "#F1C40F", "ISearchContext": "#D35400",
  };

  // Toggle node expansion
  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

   // Toggle method expansion
  const toggleMethod = (methodKey: string) => {
    setExpandedMethods(prev => ({ ...prev, [methodKey]: !prev[methodKey] }));
  };

 // *** UPDATED renderNode function START ***
 // Render a node and its children
 const renderNode = (id: string, level = 0) => {
    const node = nodes[id];
    if (!node) return null;

    const isNodeExpanded = expandedNodes[id];
    const hasMethods = node.methods && node.methods.length > 0;
    const backgroundColor = colors[id] || "#6c757d";

    const nodeHasExpandableContent = (node.children && node.children.length > 0) ||
                                      hasMethods ||
                                      node.simpleExplanation ||
                                      node.mentalModel;

    return (
      <div key={id} className="mb-2" style={{ marginLeft: `${level * 20}px` }}>
        <div
          className="flex items-center p-2 rounded cursor-pointer shadow-sm hover:shadow"
          style={{ backgroundColor, color: "white" }}
          onClick={() => toggleNode(id)}
        >
          {/* Icon */}
          <span className="mr-2 font-bold text-lg flex-shrink-0" style={{ minWidth: '15px', display: 'inline-block', textAlign: 'center' }}>
            {nodeHasExpandableContent ? (isNodeExpanded ? "−" : "+") : ""}
          </span>

          {/* Middle section (Name + Description) */}
          {/* Takes up available space, allows shrinking, adds margin before AccessedVia */}
          <div className="flex-grow min-w-0 mr-2">
            {/* Name */}
            <span className="font-bold">{id}</span>
            {/* Description */}
            {node.description && (
               /* Display as block to wrap below name if needed, adjust styling */
              <span className="block text-sm opacity-90"> - {node.description}</span>
            )}
          </div>

          
        </div>

        {/* --- REST OF THE renderNode function remains the same --- */}
        {isNodeExpanded && (
          <div className="ml-4 mt-1 mb-2 pl-3 border-l-2" style={{ borderColor: backgroundColor }}>
            {/* Node Simple Explanation & Mental Model */}
            {node.simpleExplanation && (
                 <div className="mt-2 mb-2 p-2 bg-blue-50 rounded border border-blue-200 text-sm">
                     <strong className="font-semibold text-blue-800">💡 Simple Explanation:</strong>
                     <p className="mt-1 text-gray-700">{node.simpleExplanation}</p>
                 </div>
            )}
            {node.mentalModel && (
                 <div className="mb-2 p-2 bg-yellow-50 rounded border border-yellow-300 text-sm">
                     <strong className="font-semibold text-yellow-800">🧠 Mental Model:</strong>
                      <p className="mt-1 text-gray-700 italic">{node.mentalModel}</p>
                 </div>
            )}

            {/* Render Methods */}
            {hasMethods && (
              <div className="mt-3">
                <h4 className="font-semibold mb-1 text-gray-700">Methods / Properties:</h4>
                {node.methods?.map((method, index) => {
                    const methodKey = `${id}-${method.name}`;
                    const isMethodExpanded = expandedMethods[methodKey];
                    const hasDetails = !!(method.simpleExplanation || method.mentalModel || method.details || method.usage || method.pitfalls || method.params || method.example);

                    return (
                        <div key={index} className="mb-1.5">
                            <div
                                className={`text-sm bg-gray-100 p-1.5 rounded ${hasDetails ? 'cursor-pointer hover:bg-gray-200' : ''} flex items-center`}
                                onClick={hasDetails ? () => toggleMethod(methodKey) : undefined}
                            >
                                <span className="mr-2 font-medium" style={{ minWidth: '12px', display: 'inline-block', textAlign: 'center' }}>
                                   {hasDetails ? (isMethodExpanded ? "▾" : "▸") : <span className="text-gray-400">▪</span>}
                                </span>
                                <span className="font-mono text-blue-700">{method.name}</span>
                                <span className="ml-2 text-gray-600 text-xs italic hidden sm:inline">- {method.description}</span>
                            </div>
                            {hasDetails && isMethodExpanded && (
                                <div className="text-xs bg-gray-50 p-3 pl-4 mt-0.5 mb-1 rounded border border-gray-200 ml-4 whitespace-pre-wrap shadow-sm">
                                    {method.simpleExplanation && (
                                        <div className="mb-2 pb-1 border-b border-gray-200">
                                            <strong className="font-semibold text-blue-700">💡 Simple Explanation:</strong>
                                            <p className="mt-0.5 text-gray-700">{method.simpleExplanation}</p>
                                        </div>
                                    )}
                                    {method.mentalModel && (
                                        <div className="mb-2 pb-1 border-b border-gray-200">
                                            <strong className="font-semibold text-yellow-700">🧠 Mental Model:</strong>
                                            <p className="mt-0.5 text-gray-700 italic">{method.mentalModel}</p>
                                        </div>
                                    )}
                                    {method.params && <p className="mb-1.5"><strong className="font-semibold text-gray-800">Parameters:</strong> <code className="text-purple-700 bg-gray-200 px-1 rounded text-[11px]">{method.params}</code></p>}
                                    {method.usage && <p className="mb-1.5"><strong className="font-semibold text-gray-800">Usage:</strong> {method.usage}</p>}
                                    {method.details && <p className="mb-1.5"><strong className="font-semibold text-gray-800">Details:</strong> {method.details}</p>}
                                    {method.pitfalls && <p className="mb-1.5"><strong className="font-semibold text-red-700">Pitfalls:</strong> {method.pitfalls}</p>}
                                    {method.example && <div className="mt-1.5"><strong className="font-semibold text-gray-800">Example:</strong> <pre className="bg-gray-200 p-1.5 rounded text-[11px] overflow-x-auto mt-0.5"><code>{method.example}</code></pre></div>}
                                </div>
                            )}
                        </div>
                    );
                })}
              </div>
            )}

            {/* Render Children */}
            {node.children && node.children.length > 0 && (
              <div className="mt-3">
                 <h4 className="font-semibold mb-1 text-gray-700">Related Interfaces (Accessed Via):</h4>
                {node.children.map(childId => renderNode(childId, level + 1))}
              </div>
            )}
          </div>
        )}
      </div>
    );
 };
 // *** UPDATED renderNode function END ***


    // Render the relationships view (no changes needed here)
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

  // Main component return (no major structural changes, just calls renderNode)
  return (
    <div className="p-4 font-sans max-w-6xl mx-auto"> {/* Increased max-width slightly */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Selenium .NET Bindings Interfaces Mind Map</h2>
      <p className="mb-4 text-sm text-gray-600">
        Click on interface names (<span className="font-bold text-lg mx-1">+</span>/<span className="font-bold text-lg mx-1">−</span>) to expand/collapse details including Simple Explanations and Mental Models.
        Click on method/property names (<span className="font-medium mx-1">▸</span>/<span className="font-medium mx-1">▾</span>) to view detailed information.
      </p>

       {/* Buttons remain the same */}
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
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> {/* Increased gap slightly */}
            {renderNode("INavigation")}
            {renderNode("ITargetLocator")}
            {renderNode("IAlert")}
            {renderNode("IOptions")}
            {renderNode("ICookieJar")}
            {renderNode("Actions API")}
       </div>

      {/* Render Less Detailed Interfaces */}
       <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Other Related Interfaces</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> {/* Increased gap slightly */}
                {renderNode("ITimeouts")}
                {renderNode("IWindow")}
                {renderNode("IJavaScriptExecutor")}
                {renderNode("ITakesScreenshot")}
                {renderNode("ILocatable")}
                {renderNode("ISearchContext")}
             </div>
       </div>

      {/* Render Relationships */}
      {renderRelationships()}
    </div>
  );
};

export default MindMap;