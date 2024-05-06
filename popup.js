document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(null, function(items) {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = '';
    for (let tabId in items) {
      const tab = items[tabId];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="tab-checkbox" data-tabid="${tabId}"></td>
        <td>${tab.title}</td>
        <td>${tab.memory}</td>
        <td><button class="btn btn-danger btn-sm" data-tabid="${tabId}">Kill</button></td>
      `;
      tabsList.appendChild(row);
    }

    // Add event listener to handle tab killing
    tabsList.addEventListener('click', function(event) {
      if (event.target.classList.contains('btn-danger')) {
        const tabId = event.target.getAttribute('data-tabid');
        chrome.tabs.remove(parseInt(tabId, 10));
        // Remove the row from the table
        event.target.closest('tr').remove();
        // Remove the tab's memory usage data from storage
        chrome.storage.local.remove(tabId);
      }
    });

    // Add event listener to handle multi-select killing
    document.getElementById('killAllBtn').addEventListener('click', function() {
      const checkboxes = document.querySelectorAll('.tab-checkbox:checked');
      checkboxes.forEach(function(checkbox) {
        const tabId = checkbox.getAttribute('data-tabid');
        chrome.tabs.remove(parseInt(tabId, 10));
        // Remove the row from the table
        checkbox.closest('tr').remove();
        // Remove the tab's memory usage data from storage
        chrome.storage.local.remove(tabId);
      });
    });

    // Add event listener to handle search
    document.getElementById('searchInput').addEventListener('input', function(event) {
      const searchText = event.target.value.toLowerCase();
      const rows = tabsList.querySelectorAll('tr');
      rows.forEach(function(row) {
        const title = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (title.includes(searchText)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
});
