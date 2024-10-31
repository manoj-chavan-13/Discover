import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Adjust path as needed
});

// Sample local data for demonstration
const localData = [
  {
    title: "Local Result 1",
    url: "http://localresult1.com",
    description: "Description for local result 1",
  },
  {
    title: "Local Result 2",
    url: "http://localresult2.com",
    description: "Description for local result 2",
  },
  // Add more as needed
];

// Function to fetch local results based on query and paging token
async function fetchLocalResults(query, pagingToken) {
  const startIndex = (pagingToken - 1) * 10;
  const filteredData = localData.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  );
  const paginatedResults = filteredData.slice(startIndex, startIndex + 10);
  return { results: paginatedResults, nextPageToken: pagingToken + 1 };
}

// Function to fetch web results from Google
async function fetchWebResults(query, pagingToken) {
  try {
    const response = await fetch(
      `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${
        (pagingToken - 1) * 10
      }`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const body = await response.text();
    const $ = cheerio.load(body);
    const results = [];

    $("a").each((index, element) => {
      const url = $(element).attr("href");
      const title = $(element).find("h3").text();

      const match = url.match(/url\?q=(.+?)&/);
      if (match) {
        const cleanUrl = decodeURIComponent(match[1]);
        if (title && cleanUrl) {
          const favicon = `https://www.google.com/s2/favicons?domain=${
            new URL(cleanUrl).hostname
          }`;

          results.push({
            title,
            url: cleanUrl,
            description: "Fetching description...",
            favicon,
          });
        }
      }
    });

    // Resolve description later to prevent blocking fetch
    for (const result of results) {
      try {
        const pageResponse = await fetch(result.url);
        const pageBody = await pageResponse.text();
        const page$ = cheerio.load(pageBody);
        result.description =
          page$('meta[name="description"]').attr("content") ||
          "No description available";
      } catch (error) {
        console.error(`Error fetching details for ${result.url}:`, error);
      }
    }

    return { results, nextPageToken: pagingToken + 1 };
  } catch (error) {
    console.error("Error fetching web results:", error);
    throw error;
  }
}

// Endpoint to handle search requests
app.post("/search", async (req, res) => {
  const query = req.body.query.trim().toLowerCase();
  const pagingToken = parseInt(req.body.pagingToken) || 1;

  // Fetch local and web results
  const localResults = await fetchLocalResults(query, pagingToken);
  const webResults = await fetchWebResults(query, pagingToken);

  res.json({
    localResults: localResults.results,
    webResults: webResults.results,
    nextPageToken: pagingToken + 1,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
