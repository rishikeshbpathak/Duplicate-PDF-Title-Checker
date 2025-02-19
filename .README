# PDF Duplicate Checker

This Node.js project processes multiple PDF files, extracts the first text from each page, identifies duplicate titles, and generates a JSON report listing duplicates. It also provides an Express server to download the generated report.

## Features
- Extracts text from PDFs using `pdfjs-dist`
- Identifies duplicate titles appearing on multiple pages
- Generates a JSON report listing duplicate titles per PDF
- Provides an Express server to download the report

## Prerequisites
Ensure you have **Node.js** installed on your system.

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/your-repo/pdf-duplicate-checker.git
   cd pdf-duplicate-checker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Creating Sample PDFs (Optional)
If you need test PDFs, you can generate them using `pdfkit`:
1. Install `pdfkit`:
   ```sh
   npm install pdfkit
   ```
2. Run the script to generate sample PDFs:
   ```sh
   node generatePdfs.js
   ```
   This creates two PDFs inside the `PDF-FILE` directory.

## Running the Script
To process PDFs and generate the report, run:
```sh
node checkDuplicates.js
```

## Downloading the Report
After running the script, the JSON report is available for download at:
```
http://localhost:3000/download
```

## File Structure
```
/pdf-duplicate-checker
│-- PDF-FILE/          # Folder containing PDF files
│-- reports/           # Folder where reports are saved
│-- checkDuplicates.js # Main script for processing PDFs
│-- generatePdfs.js    # Script to generate sample PDFs
│-- README.md          # Project documentation
│-- package.json       # Node.js dependencies
```

## Dependencies
- `pdfjs-dist`: Extracts text from PDFs
- `express`: Serves the report for download
- `pdfkit` (optional): Generates test PDFs

## License
This project is open-source. Feel free to modify and improve it!

