const puppeteer = require("puppeteer");
const fs = require("fs");
const { processHTML } = require("./parser");
const parsedJSON = require("../data.json");

const writeToJSON = (data,set) => {
  const finalData = {data,set: Array.from(set)}
  fs.writeFileSync("result.json", JSON.stringify(finalData), (err) => {
    if (err) throw err;
    console.log("Written Successfully to result.json");
  })
}

const scrappedData = []
const set = new Set();

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  let acceptTerms = false;

  try {
    // Open every link from the parsed JSON file
    for (let i = 0; i < parsedJSON.length; i++) {
      if (!set.has(parsedJSON[i]["reference_no"])) {
        set.add(parsedJSON[i]["reference_no"]);

        const page = await browser.newPage();
        await page.goto(parsedJSON[i].buynow[0], { waitUntil: "networkidle0" });

        // Accepting Data privacy terms
        if (!acceptTerms) {
          await page.click("#modal-content > div > button"),
          await page.waitForTimeout(1000);
          acceptTerms = true;
        }

        const el = await page.$$("#wt-watches > div > a");

        let result = {
          brand: parsedJSON[i].brand,
          model: parsedJSON[i].model,
          reference_no: parsedJSON[i].reference_no,
          listed_price: [],
          year_of_production: [],
          movement: "",
          caliber: "",
          power_reserve: "",
          no_of_jewels: "",
          case_material: "",
          case_diameter: "",
          water_resistance: "",
          bezel_material: "",
          crystal: "",
          dial: [],
          dial_numerals: "",
          bracelet_material: "",
          bracelet_color: "",
          clasp: "",
          clasp_material: "",
          functions: "",
        }

        for (let j = 0;j<el.length;j++) {
          let watchPage;

          try {
            const url = await (await el[j].getProperty("href")).jsonValue();
            watchPage = await browser.newPage();
            watchPage.setDefaultNavigationTimeout(0);
            await watchPage.goto(url);
            const content = await watchPage.content();
            result = await processHTML(content, watchPage, result);
          } catch (err) {
            console.log("IN CATCH");
            console.log(err);
            continue;
          } finally {
            await watchPage.close();
          }
        }

        scrappedData.push(result);
        await page.close();
      }
    }
    
    writeToJSON(scrappedData,set);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

try{
  main()
}catch(err){
  console.log("IN MAIN CATCH");
  console.log(err);
  writeToJSON(scrappedData,set);
}

process.on("SIGINT", () => {
  console.log("PRESSED CTRL+C");
  console.log({ scrappedData });
  writeToJSON(scrappedData,set);
});
