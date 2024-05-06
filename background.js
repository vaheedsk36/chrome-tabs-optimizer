// Function to update memory usage for a specific tab
function updateMemoryUsage(tabId) {
    chrome.tabs.get(tabId, function(tab) {
      if (!chrome.runtime.lastError && tab.status === "complete") {
        chrome.system.memory.getInfo(function(memoryInfo) {
          const memoryUsage = memoryInfo.availableCapacity;
          const tabMemoryUsage = {
            title: tab.title,
            memory: (memoryUsage / (1024 * 1024)).toFixed(2) + " MB"
          };
          chrome.storage.local.set({ [tabId]: tabMemoryUsage });
        });
      }
    });
  }
  
  // Function to update memory usage for all tabs
  function updateAllTabsMemoryUsage() {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        updateMemoryUsage(tab.id);
      });
    });
  }
  
  // Update memory usage for all tabs on startup
  updateAllTabsMemoryUsage();
  
  // Listen for tab updates to update memory usage dynamically
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      updateMemoryUsage(tabId);
    }
  });
  
  // Remove memory usage data when tab is closed
  chrome.tabs.onRemoved.addListener(function(tabId) {
    chrome.storage.local.remove(tabId.toString());
  });
  