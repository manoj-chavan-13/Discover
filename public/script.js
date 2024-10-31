let currentPage = 1;
let isFetching = false; // To prevent multiple fetches at the same time

document
  .getElementById("searchForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const query = document.getElementById("query").value;
    currentPage = 1; // Reset to the first page
    document.getElementById("results").innerHTML = ""; // Clear previous results

    // Show loading spinner for the first search
    showLoading(true);
    hideShortcuts(true);
    await fetchResults(query);
    showLoading(false); // Hide after fetching results

    // Reset infinite scroll listener after a new search
    window.removeEventListener("scroll", handleScroll); // Remove existing scroll listener
    window.addEventListener("scroll", handleScroll); // Attach new scroll listener
  });

async function fetchResults(query) {
  try {
    if (isFetching) return; // Prevent concurrent fetches
    isFetching = true;

    // Only show loading message for additional results
    if (currentPage > 1) {
      showLoadingMore(true);
    }

    const response = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ query, page: currentPage }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const result = await response.json();
    displayResults(result);

    currentPage++; // Increment page for next load
    isFetching = false; // Allow new fetch requests

    // Hide loading message after results are displayed
    if (currentPage > 1) {
      showLoadingMore(false);
    }
  } catch (error) {
    console.error("Error:", error);
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>An error occurred while searching.</p>";
    isFetching = false;
    showLoadingMore(false);
  }
}

function displayResults(result) {
  const resultsDiv = document.getElementById("results");

  // Display local results
  result.localResults.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <a href="${item.url}" target="_blank">${item.url}</a>
        `;
    resultsDiv.appendChild(card);
  });

  // Display web results
  result.webResults.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
          <div class="card-header">
            <img src="${item.favicon}" alt="Favicon" class="favicon">
            <h3>${item.title || item.domain}</h3>
          </div>
          <a href="${item.url}" target="_blank">${item.url}</a>
          <p>${item.description}</p>
        `;
    resultsDiv.appendChild(card);
  });

  if (
    result.localResults.length === 0 &&
    result.webResults.length === 0 &&
    currentPage === 1
  ) {
    resultsDiv.innerHTML = "<p>No results found.</p>";
  }
}

// Infinite scroll handler
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetching) {
    const query = document.getElementById("query").value;
    fetchResults(query); // Fetch more results
  }
}

function showLoading(isLoading) {
  const resultsDiv = document.getElementById("results");
  const loadingMoreMessage = document.getElementById("loadingMoreMessage");

  if (isLoading) {
    // Clear the results div and show loading spinner
    resultsDiv.innerHTML = '<div class="loader"></div>'; // Use the spinner class for consistent styling
    loadingMoreMessage.style.display = "none"; // Hide loading more message
  } else {
    // Remove the spinner and hide loading message
    const spinner = resultsDiv.querySelector(".loader");
    if (spinner) {
      spinner.remove(); // Remove the spinner
    }
  }
}

// Function to show/hide "Loading more results" message
function showLoadingMore(isLoading) {
  const loadingMoreMessage = document.getElementById("loadingMoreMessage");
  if (isLoading) {
    loadingMoreMessage.style.display = "block"; // Show loading more message
    loadingMoreMessage.innerHTML = '<div class="loader"></div>'; // Add spinner to loading message
  } else {
    loadingMoreMessage.style.display = "none"; // Hide loading message
  }
}

function hideShortcuts(isHidden) {
  const shortcutsDiv = document.querySelector(".shortcut-links");
  const shortcutsHeader = document.querySelector("h2");
  if (isHidden) {
    shortcutsDiv.style.display = "none";
    shortcutsHeader.style.display = "none";
  } else {
    shortcutsDiv.style.display = "flex";
    shortcutsHeader.style.display = "block";
  }
}

// Attach scroll event listener for infinite scroll
window.addEventListener("scroll", handleScroll);
