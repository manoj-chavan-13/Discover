const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: String,
  title: String,
  body: String,
});

const Url = mongoose.model("Url", urlSchema);

async function crawlAndIndex(urls) {
  for (const url of urls) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const title = $("title").text() || "No Title";
      const body = $("body").text();

      const newUrl = new Url({ url, title, body });
      await newUrl.save(); // Save to MongoDB
    } catch (error) {
      console.error(`Failed to retrieve ${url}: ${error.message}`);
    }
  }
}

module.exports = { crawlAndIndex };
