# EPUB Chapter Exporter

A web application to upload an EPUB file, group its chapters, and copy the text content of those groups. This tool is designed to be a simple, client-side utility that runs entirely in your browser.

## ✨ Features

- **Client-Side Processing:** All file processing happens in your browser. Your files are never uploaded to a server.
- **EPUB 2 & 3 Support:** Parses chapters from both `NCX` (EPUB 2) and `NAV` (EPUB 3) table of contents.
- **Custom Chapter Detection:** Use a manual pattern (e.g., `Chapter *` or `第*章`) if automatic detection fails.
- **Chapter Grouping:** Combine multiple chapters into a single group for easy copying.
- **Progressive Web App (PWA):** Installable on your desktop or mobile device for offline access.
- **Clean Text Extraction:** Extracts text content from HTML, attempting to preserve paragraph breaks.

## 🚀 Live Demo & Installation

You can use the live version of the app here (replace `YOUR_USERNAME` with your GitHub username):

**[https://YOUR_USERNAME.github.io/epub-chapter-exporter/](https://YOUR_USERNAME.github.io/epub-chapter-exporter/)**

To install the app for offline use:
1.  Open the link above in a modern browser (like Chrome, Edge, or Firefox).
2.  Click the "Install App" button in the header.
3.  Follow the prompts to add it to your Home Screen or Desktop.

## 📖 How to Use

1.  **Upload File:** Click the "Upload EPUB File" button and select your `.epub` file.
2.  **Adjust Grouping:** Change the "Chapters per Group" number to your desired size.
3.  **(Optional) Manual Pattern:** If chapters aren't detected correctly, enter a pattern that matches your chapter titles (use `*` as a wildcard) and click "Update".
4.  **Copy Content:** Click the "Copy" button next to a chapter group to copy all its text to your clipboard.

## 💻 Development Setup

To run this project locally, you'll need [Node.js](https://nodejs.org/) (v18+) installed.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/YOUR_USERNAME/epub-chapter-exporter.git
    cd epub-chapter-exporter
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The application will be running at `http://localhost:5173` (or the next available port).

## 📦 Building for Production

To create a production build:

```sh
npm run build
```

This will generate the static files in the `dist/` directory.

## 🌐 Deployment to GitHub Pages

The project is pre-configured for deployment to GitHub Pages.

1.  Make sure the `base` property in `vite.config.ts` is set to your repository name (which is currently `'/epub-chapter-exporter/'`).
2.  Build the project using `npm run build`.
3.  Deploy the contents of the `dist` folder to the `gh-pages` branch of your repository. You can use a tool like `gh-pages` to simplify this process.

## 🛠️ Tech Stack

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **EPUB Parsing:** [JSZip](https://stuk.github.io/jszip/) (client-side)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
