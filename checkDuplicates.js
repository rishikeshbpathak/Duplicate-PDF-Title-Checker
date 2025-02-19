const fs = require("fs");
const path = require("path");
const pdfjsLib = require("pdfjs-dist");
const express = require("express");

const pdfDirectory = "./PDF-FILE"; // Change to your directory

// Generate a timestamp for the filename
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputFilePath = `./reports/final_report_${timestamp}.json`;

// Create Express server for downloading
const app = express();
const PORT = 3000;

app.get("/download", (req, res) => {
    res.download(outputFilePath, `final_report_${timestamp}.json`, (err) => {
        if (err) console.error("❌ Error in downloading:", err);
    });
});

async function extractTitles(pdfPath) {
    const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data: dataBuffer }).promise;

    let titles = {};
    let fileName = path.basename(pdfPath, ".pdf");

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const pageText = textContent.items.map(item => item.str.trim()).filter(str => str.length > 0);
        if (pageText.length > 0) {
            const title = pageText[0].toLowerCase().trim();

            if (!titles[title]) {
                titles[title] = [];
            }
            titles[title].push(i);
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
                let titleKey = `title-${count}`;
                formattedTitles.push({ [titleKey]: `${title}-page-${pages.join(",")}` });
                count++;
            }
        }

        if (formattedTitles.length > 0) {
            jsonData[fileName] = formattedTitles;
        }
    }

    if (!fs.existsSync("./reports")) {
        fs.mkdirSync("./reports");
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
    console.log(`✅ Final report generated: ${outputFilePath}`);
    console.log(`📥 Download report: http://localhost:${PORT}/download`);
}

// Start the script and server
generateJsonReport(pdfDirectory).then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}).catch(console.error);
