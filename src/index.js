const puppeteer = require('puppeteer');
const cliProgress = require('cli-progress');
const fs = require('fs');
const readExcelFile = require('./excel_reader');
const { processHTML } = require('./parser');

const writeToJSON = (data) => {
  fs.writeFile("result.json", JSON.stringify(data), function(err) {
          if (err) throw err;
          console.log('Written Successfully to result.json');
      }
  )
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  // Reading Excel File 
  const parsedJSON = readExcelFile('watchdata.xlsx')
  
  // For Showing Progress Bar
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(5,0);
  
  // Final Scrapped Data
  const scrappedData = [];

  let isUSD = false;

  // Open every link from the parsed excel file
  for(let item of parsedJSON){
    const page = await browser.newPage();
    await page.goto(item['Source'],{waitUntil: 'networkidle0'});

    if(!isUSD){
      await page.click("#navbarSupportedContent > div > div:nth-child(2) > button") 

      await Promise.all([
        page.click("#USD"),
        page.waitForNavigation({
          waitUntil: "networkidle2"
        })
      ])

      isUSD = true
    }

    const content = await page.content();

    // getting all the data of a watch
    const result = await processHTML(content,page)
    scrappedData.push(result);
    
    await page.close();
    progressBar.increment(1);
  }

  progressBar.stop();
  writeToJSON(scrappedData);

  await browser.close();
}

main();