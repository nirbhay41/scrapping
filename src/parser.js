const cheerio = require('cheerio');
const selectors = require('./selectors');

const getSummaryByTime = async (key,result,page,selector) => {
    const el = await page.$(selector)

    if(el){
        await page.evaluate(element => element.click(), el);
        content = await page.content();
        const $ = cheerio.load(content);

        result.summary[key].opening_price = $(selectors.opening_price).text()
        result.summary[key].closing_price = $(selectors.closing_price).text()
        result.summary[key].absolute_change = $(selectors.absolute_change).text()
        result.summary[key].minimum_price = $(selectors.minimum_price).text()
        result.summary[key].maximum_price = $(selectors.maximum_price).text()
        result.summary[key].annualized_volatility = $(selectors.annualized_volatility).text()
        result.price_change_percentage[key] = $(selectors.price_change_percentage).text()
    }
}

const processHTML = async (content,page) => {
    let $ = cheerio.load(content);
    const result = {}
    
    // for getting brand name
    result.brand = $(selectors.brand).text()

    // for getting model name
    let model = $(selectors.model).text()
    console.log("Model: ",model);
    model = model.replace(result.brand+" ","");
    result.model = model;

    result.reference_no = $(selectors.reference_no).text()
    result.retail_price = $(selectors.retail_price).text()
    result.current_price = $(selectors.current_price).text()
    result.dial = $(selectors.dial).text()
    result.material = $(selectors.material).text()
    result.diameter = $(selectors.diameter).text()
    result.complications = $(selectors.complications).text()
    result.caliber = $(selectors.caliber).text()
    result.movement = $(selectors.movement).text()
    result.power_reserve = $(selectors.power_reserve).text()
    result.crystal = $(selectors.crystal).text()
    result.water_resistance = $(selectors.water_resistance).text()

    // for summary
    result.summary = {"3m": {},"6m": {},"1y": {},"3y": {},"5y": {},all: {}}
    result.price_change_percentage = {"3m": "","6m": "","1y": "","3y": "","5y": "",all: ""}

    await getSummaryByTime("3m",result,page,selectors.three_month)
    await getSummaryByTime("6m",result,page,selectors.six_month)
    await getSummaryByTime("1y",result, page,selectors.one_year)
    await getSummaryByTime("3y",result,page,selectors.three_year)
    await getSummaryByTime("5y",result,page,selectors.five_year)
    await getSummaryByTime("all",result,page,selectors.all)

    // for buy now links
    result.buynow = []

    $("#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(2) > div > div > div")
    .each((_,val) => {
        result.buynow.push($(val).find("a").attr("href"))
    })

    return result;
}

module.exports = {
    processHTML,
}