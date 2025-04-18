# Web to Markdown CLI

A command-line tool that converts web pages to markdown and copies the result to your clipboard; it's great for processing web pages for LLMs.

## Features

- Extracts meaningful content from web pages (headings, paragraphs, lists)
- Removes navigation, headers, footers, scripts, and other noise
- Copies the result directly to your clipboard
- Run with a simple terminal command(``save-md --url [url]`` or ``save-md --u [url]``)

## Installation
### Requirements

- Node.js
- npm

### Install from repo

```bash
# Clone the repository
git clone https://github.com/yourusername/web-to-markdown.git
cd web-to-markdown

# Install dependencies
npm i

# Install the package globally
npm i -g
```

## Usage

```bash
# Run the package
save-md --url https://example.com/
```

The tool will then:

- Fetch the web page
- Extract the important content
- Convert it to markdown
- Copy the result to your clipboard

### Customization

You can customize the content extraction by modifying the CSS selectors in the ``processMarkdown`` function.