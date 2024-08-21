const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const port = 3000;

async function generatePDF(url) {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // Navigate to the specified URL
        await page.goto(url, { waitUntil: "networkidle0" });

        // Generate PDF from the page content
        const pdf = await page.pdf({ format: "A4" });

        // Close the browser
        await browser.close();

        return pdf

    } catch(error) {
        return error
    }
}


app.get("/", (req, res) => res.send("PDF Downloader"));

app.get('/download', async(req, res) => {
    const url = req.query.url

    if(url) {
        const pdf = await generatePDF(url)

        res.header('Content-Type', 'application/pdf')
        res.header('Content-Disposition', 'attachment; filename="font-license.pdf"')
        res.send(Buffer.from(pdf))
        
    } else {
        res.send("Please provide a url")
    }
})

app.listen(port, () => console.log(`Server ready on port ${port}.`));
