const fs = require('fs');
const { db,client } = require('./lib/client')
let Excel = require('exceljs');
let path = require('path');

const getBrandName = (worksheetCount) => {
    switch(worksheetCount){
        case 1:
            return "Rolex";
        case 2:
            return "Audemars Piguet";
        case 3:
            return "Patek Philippe";
        case 4:
            return "Richard Mille";
        case 5:
            return "Jaeger-LeCoultre";
        case 6:
            return "Hublot";
        case 7:
            return "IWC";
        case 8:
            return "Omega";
        case 9:
            return "Breitling";
        case 10:
            return "A. Lange & Sohne";
        case 11:
            return "Cartier";
        case 12:
            return "Vacheron Constantin";
    }
}

const readExcelFile = async (filename) => {
    let wb = new Excel.Workbook();
    let filePath = path.resolve(__dirname,filename);
    let parsedData = [];

    await wb.xlsx.readFile(filePath);
    let worksheets = wb.worksheets;
    let worksheetCount = 1;

    for(let worksheet of worksheets){
        let worksheetData = {brandname: getBrandName(worksheetCount),ref: []};

        for (i = 1; i <= worksheet.rowCount; i++) {
            if(worksheet.getRow(i).getCell(1).value && typeof worksheet.getRow(i).getCell(1).value === "object")
                worksheetData.ref.push(worksheet.getRow(i).getCell(1).value.text);
            else worksheetData.ref.push(worksheet.getRow(i).getCell(1).value+"");
        }

        worksheetCount++;
        parsedData.push(worksheetData);
    }

    return parsedData;
}

const writeToJSON = (data) => {
    fs.writeFile("result.json", JSON.stringify(data), function(err) {
            if (err) throw err;
            console.log('Written Successfully to result.json');
        }
    )
}

const writeToDB = async (scrapedData) => {
    const res = await db.collection("watches_market_data")
    .insertMany(scrapedData)
    
    if(res.acknowledged){
        console.log(`Inserted ${res.insertedCount} documents`);
    }
}

const readFromDB = async () => {
    const watches_db = client.db("watches");

    const query = {Brandname: {$in: ["Rolex Used","Rolex New","Richard Mille","Patek Philippe","Audemars Piguet"]}} 
    const res = watches_db.collection("watches")
    .find(query)
    .limit(10)

    // console.log(res);
    await res.forEach(console.dir);
}

const extractItems = async (page) => {
    const watchLinks = await page.$$eval('.grid-container a', watches => {
      const _watchLinks = [];
      
      for(let watch of watches){
        _watchLinks.push(watch.href);
      }
      
      return _watchLinks;
    })
  
    return watchLinks;
}
  
const scrapeInfiniteScrollItems = async (page,itemTargetCount,scrollDelay = 2000) => {
      let items = await extractItems(page);
      try {
        let previousHeight;
        while (items.length < itemTargetCount) {
          items = await extractItems(page);
          previousHeight = await page.evaluate('document.body.scrollHeight');
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
          await delay(scrollDelay)
        }
      } catch(e) {
          console.log(e);
      }
      return items;
}
  
const delay = (time) => {
    return new Promise(function(resolve) { 
      setTimeout(resolve, time)
    });
}

module.exports = { writeToJSON,writeToDB,readExcelFile,readFromDB,scrapeInfiniteScrollItems }