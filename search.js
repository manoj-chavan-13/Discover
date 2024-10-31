const Url = require("./crawler").Url;

async function search(query) {
  const results = await Url.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { body: { $regex: query, $options: "i" } },
    ],
  });
  return results;
}

module.exports = { search };
