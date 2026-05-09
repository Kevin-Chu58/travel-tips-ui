// api/generate-pdf/index.js
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

module.exports = async function (context, req) {
  const { tripId, authToken } = req.body;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    Authorization: `Bearer ${authToken}`,
  });

  await page.goto(
    `https://green-bay-09f55a01e.7.azurestaticapps.net/trips/${tripId}/pdf-preview`,
    { waitUntil: "networkidle0" },
  );

  await page.waitForSelector(".pdf-page");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm",
      bottom: "10mm",
      left: "10mm",
      right: "10mm",
    },
  });

  await browser.close();

  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=trip.pdf",
    },
    body: pdf,
    isRaw: true,
  };
};
