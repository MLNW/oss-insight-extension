let activeTabId;
let target;

/**
 * @param {string} url
 * @returns string
 */
function cleanUrl(url) {
  return url.split("?")[0];
}

/**
 * Checks whether the provided URL is valid for analysis with OSS Insight.
 * @param {string} url the URL to check
 * @returns {false | string} false if the URL is invalid, otherwise the correct redirection target
 */
function validUrl(url) {
  if (!url.startsWith("https://github.com/")) return false;
  // TODO: Test if this may fail
  let remainder = url.split("https://github.com/")[1];

  // Base URL
  if (remainder.length === 0) return false;

  // Known invalid URLs
  const ignoredUrls = [
    "account",
    "codespaces",
    "issues",
    "new",
    "notifications",
    "pulls",
    "sponsors",
  ];
  if (ignoredUrls.some((ignore) => remainder.startsWith(ignore))) return false;

  // The users path usually redirects somewhere else, if it does not the second
  // part should be the user name
  if (remainder.startsWith("users")) return remainder.split("/")[1];

  // Most likely valid URLs where the first or the first two parts are interesting
  // any query parameters must be removed
  let parts = remainder.split("/");

  // TODO: Could this happen?
  if (parts.length === 0) return false;

  let result;
  if (parts.length === 1) result = parts[0];
  if (parts.length === 2) result = parts.join("/");
  if (parts.length > 3) result = `${parts[0]}/${parts[1]}`;

  return cleanUrl(result);
  // https://github.com/MLNW
  // https://github.com/MLNW?tab=packages
  // https://github.com/MLNW?tab=repositories
  // https://github.com/users/MLNW/projects/2
  // https://github.com/MLNW/xyz
  // https://github.com/MLNW/xyz/pulls
}

// A function to determine whether the URL of the tab is one we want the browser action for
function checkUrl(tab) {
  console.log(tab.url);

  const redirectTarget = validUrl(tab.url);
  if (redirectTarget) {
    // If the URL matches, enable the browser action
    browser.browserAction.setIcon({ path: "icon-active.png", tabId: tab.id });
    browser.browserAction.setTitle({
      title: `Click to redirect to ${redirectTarget}`,
      tabId: tab.id,
    });
    activeTabId = tab.id;
    target = redirectTarget;
  } else {
    // Otherwise, disable the browser action
    browser.browserAction.setIcon({ path: "icon-inactive.png", tabId: tab.id });
    browser.browserAction.setTitle({ title: "Inactive", tabId: tab.id });
    if (activeTabId === tab.id) {
      activeTabId = undefined;
      target = undefined;
    }
  }
}

// Listen for any changes to the URL of any tab
browser.tabs.onUpdated.addListener((_id, _changeInfo, tab) => {
  checkUrl(tab);
});

// Listen for tab activation
browser.tabs.onActivated.addListener(({ tabId }) => {
  browser.tabs.get(tabId).then(checkUrl);
});

// Listen for browser action click
browser.browserAction.onClicked.addListener((tab) => {
  if (activeTabId === tab.id) {
    let newUrl = "https://ossinsight.io/analyze/" + target;

    // Open a new tab with the new URL
    browser.tabs.create({ url: newUrl });
  }
});
