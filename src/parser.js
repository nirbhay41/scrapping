const axios = require('axios');
const selectors = require('./selectors');

const getSummaryByTime = async (key,result,page,selector) => {
    const el = await page.$(selector)

    if(el){
        await page.evaluate(element => element.click(), el);

        result.summary[key].opening_price = await page.$eval(selectors.opening_price, el => el.textContent);
        result.summary[key].closing_price = await page.$eval(selectors.closing_price, el => el.textContent);
        result.summary[key].absolute_change = await page.$eval(selectors.absolute_change, el => el.textContent);
        result.summary[key].minimum_price = await page.$eval(selectors.minimum_price, el => el.textContent);
        result.summary[key].maximum_price = await page.$eval(selectors.maximum_price, el => el.textContent)
        result.summary[key].annualized_volatility = await page.$eval(selectors.annualized_volatility, el => el.textContent)
        result.price_change_percentage[key] = await page.$eval(selectors.price_change_percentage, el => el.textContent)
    }
}

const parse = async (watchPage,scrappedData) => {
    const watchPageUrl = watchPage.url();    
    const watchName = watchPageUrl.substring(watchPageUrl.lastIndexOf('/')+1)

    const fetchUrl = `https://api.watchanalytics.io/v1/products/${watchName}`
    const watchData = (await axios.get(fetchUrl)).data;

    const result = {};

    result.brand = watchData.details.Brand;
    result.model = watchData.name;
    result.reference_no = watchData.ref;
    result.retail_price = watchData.details["Retail price"];
    result.dial = watchData.details.Dial;
    result.material = watchData.details.Material;
    result.diameter = watchData.details.Diameter;
    result.complications = watchData.details.Complications;
    result.caliber = watchData.details.Caliber;
    result.movement = watchData.details.Movement;
    result.power_reserve = watchData.details["Power reserve"];
    result.crystal = watchData.details.Crystal;
    result.water_resistance = watchData.details["Water resistance"];
    result.current_price = await watchPage.$eval(selectors.current_price, el => el.textContent);

    result.summary = {"3m": {},"6m": {},"1y": {},"3y": {},"5y": {},all: {}}
    result.price_change_percentage = {"3m": "","6m": "","1y": "","3y": "","5y": "",all: ""}

    await getSummaryByTime("3m",result,watchPage,selectors.three_month)
    await getSummaryByTime("6m",result,watchPage,selectors.six_month)
    await getSummaryByTime("1y",result, watchPage,selectors.one_year)
    await getSummaryByTime("3y",result,watchPage,selectors.three_year)
    await getSummaryByTime("5y",result,watchPage,selectors.five_year)
    await getSummaryByTime("all",result,watchPage,selectors.all)

    const buynow = [];

    for(let e of watchData.buy_now){
        buynow.push(e.url);
    }

    result.buynow = buynow;
    result.prices = watchData.prices;

    scrappedData.push(result);
}

module.exports = parse;