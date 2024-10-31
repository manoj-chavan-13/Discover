# Discover: A Simple Search Engine

![image](https://github.com/user-attachments/assets/04c7567f-a05e-4d76-9522-315a3e6d9052)


## Overview
Discover is a simple web application designed to demonstrate how search engines work by fetching results from Google. It allows users to input a query and retrieve both local and web-based search results, showcasing the use of web scraping techniques and data manipulation in JavaScript.

## Features
- Local search results from a predefined dataset.
- Web results fetched from Google, including titles, URLs, and descriptions.
- Basic pagination support for navigating through search results.

## Technologies Used
- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for Node.js to handle HTTP requests.
- **Cheerio**: Library for parsing and manipulating HTML.
- **node-fetch**: Lightweight module that enables `fetch` API functionality in Node.js.
- **HTML/CSS**: For building the front-end interface.

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/discover.git
   cd discover
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000/` to access the application.

### Usage
1. Enter your search query in the input field.
2. Click the "Search" button to retrieve results.
3. View local results from the sample dataset as well as web results fetched from Google.
4. Navigate through pages of results if necessary.

## How It Works
- **Local Data**: The application contains a sample dataset representing local search results.
- **Web Scraping**: For web results, the application fetches data from Google search results using the `node-fetch` library and parses the HTML response with Cheerio.
- **Descriptions**: It fetches the meta descriptions of the web results after initial retrieval to provide more context.

## Limitations
- This project demonstrates basic functionality and may not handle edge cases or be optimized for production use.
- Web scraping may violate Google’s terms of service, and this project is intended for educational purposes only.

## Contributing
Contributions are welcome! If you have suggestions for improvements or features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements
- Thanks to the creators of Node.js, Express, Cheerio, and node-fetch for making this project possible.
