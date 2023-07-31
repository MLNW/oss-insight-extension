import browser from "webextension-polyfill";
import { sanitze } from "./utils";

let activeTabId: number | undefined;
let target: string | undefined;

// A function to determine whether the URL of the tab is one we want the browser action for
function checkUrl(tab: browser.Tabs.Tab) {
  const redirectTarget = sanitze(tab.url);
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
