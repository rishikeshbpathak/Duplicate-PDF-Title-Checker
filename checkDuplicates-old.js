const fs = require("fs");
const path = require("path");
const pdfjsLib = require("pdfjs-dist");

// Directory containing PDFs
const pdfDirectory = "./PDF-FILE"; // Change this to your directory

async function extractTitles(pdfPath) {
    const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data: dataBuffer }).promise;

    let titles = {};
    let fileName = path.basename(pdfPath, ".pdf"); // Remove .pdf extension

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Extract all text items
        const pageText = textContent.items.map(item => item.str.trim()).filter(str => str.length > 0);

        if (pageText.length > 0) {
            const title = pageText[0].toLowerCase().trim(); // Normalize text

            if (!titles[title]) {
                titles[title] = [];
            }
            titles[title].push(i); // Store page number
        }
    }

    return { fileName, titles };
}

async function generateJsonReport(directory) {
    const files = fs.readdirSync(directory).filter(file => file.endsWith(".pdf"));
    let jsonData = {};

    for (const file of files) {
        const pdfPath = path.join(directory, file);
        console.log(`🔍 Processing: ${file}`);

        const { fileName, titles } = await extractTitles(pdfPath);
        let formattedTitles = [];
        let count = 1;

        for (const [title, pages] of Object.entries(titles)) {
            if (pages.length > 1) {
                let titleKey = `duplicate-title-${count}`;
                formattedTitles.push({
                    [titleKey]: `${title}-page-${pages.join(",")}`
                });
                count++;
            }
        }

        if (formattedTitles.length > 0) {
            jsonData[fileName] = formattedTitles;
        }
    }

    let outputFilePath = `./reports/final_report.json`;

    // Ensure reports directory exists
    if (!fs.existsSync("./reports")) {
        fs.mkdirSync("./reports");
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
    console.log(`✅ Final report generated: ${outputFilePath}`);
}

// Run the script
generateJsonReport(pdfDirectory).catch(console.error);
