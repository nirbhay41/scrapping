const chromium = require("chrome-aws-lambda");
const { readExcelFile, scrapeInfiniteScrollItems, writeToJSON } = require('./util');
const parse = require('./parser');
const selectors = require("./selectors");

const changeSetting = async (page,setting) => {
  if(!setting.isUSD){
    await page.click("#navbarSupportedContent > div > div:nth-child(2) > button") 

    await Promise.all([
      page.click("#USD"),
      page.waitForNavigation({
        waitUntil: "networkidle2"
      })
    ])

    setting.isUSD = true
  }

  if(!setting.en_us){
    await page.click("#navbarSupportedContent > div > div:nth-child(4) > button")

    await Promise.all([
        page.click("#navbarSupportedContent > div > div.show.dropdown > div > a:nth-child(4)"),
        page.waitForNavigation({
            waitUntil: "networkidle2"
        })
    ])

    setting.en_us = true;
  }
}

async function scrape() {
  console.log("-----Scraping Started-----");

  // const executablePath = await chromium.executablePath;
  const browser = await chromium.puppeteer.launch({
		args: chromium.args,
		defaultViewport: null,
		executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
		headless: false,
	});

  const parsedExcel = await readExcelFile("Reference_Models.xlsx")
  const scrappedData = [];

  const setting = { isUSD: false, en_us: false };

  // no 9 remaining
  for(let workSheetNo = 11; workSheetNo<12; workSheetNo++){
    const brandname = parsedExcel[workSheetNo].brandname;

    for(let j = 0;j<parsedExcel[workSheetNo].ref.length;j++){
      if(parsedExcel[workSheetNo].ref[j] !== "null"){
        console.log(`${j+1}) Currently Scrapping: ${brandname} ${parsedExcel[workSheetNo].ref[j]}`);

        const searchPage = await browser.newPage();
        searchPage.setDefaultNavigationTimeout(0);
        const encodedWatchName = brandname+" "+parsedExcel[workSheetNo].ref[j]
        await searchPage.goto(`https://watchanalytics.io/search/${encodeURIComponent(encodedWatchName)}`,{waitUntil: 'networkidle0'});

        await changeSetting(searchPage,setting);

        const resultFound = !! await searchPage.$(selectors.searchResultCount)
        let searchResultCount = 0;

        if(resultFound){
          searchResultCount = parseInt(await searchPage.$eval(selectors.searchResultCount,el => el.textContent));
        }

        if(searchResultCount > 0){
          console.log(`${searchResultCount} Watches Found`);

          const watchesLink = await scrapeInfiniteScrollItems(searchPage,searchResultCount);
          await searchPage.close();

          const watchPage = await browser.newPage();
          watchPage.setDefaultTimeout(0);

          for(let watchLink of watchesLink){
            await watchPage.goto(watchLink,{waitUntil: 'networkidle0'});
            await parse(watchPage,scrappedData);
          }

          console.log(`Scrapped Data Length: ${scrappedData.length}`);
          await watchPage.close();
        }else await searchPage.close();
      }
    }
  }

  await browser.close();

  await writeToJSON(scrappedData);
  console.log("Successfully written to JSON");

  // await client.close();
}

scrape();

module.exports = { scrape }