const cheerio = require('cheerio');
const selectors = require('./selectors');

const processHTML = async (content,page,R) => {
    const $ = cheerio.load(content);

    const t = await page.evaluate((result) => {
        console.log("Result value inside evaluate: ",{result});

        const processTDS = (tds,result) => {
            let val = tds[1].textContent.trim();
        
            switch(tds[0].textContent){
                case "Movement":
                    if(!result.movement)
                        result.movement = val;
                    return;
                case "Movement/Caliber":
                    if(!result.caliber)
                        result.caliber = val;
                    return;
                case "Power reserve":
                    if(!result.power_reserve)
                        result.power_reserve = val;
                    return;
                case "Number of jewels":
                    if(!result.no_of_jewels)
                        result.no_of_jewels = val;
                    return;
                case "Case material":
                    if(!result.case_material)
                        result.case_material = val;
                    return;
                case "Water resistance":
                    if(!result.water_resistance)
                        result.water_resistance = val;
                    return;
                case "Bezel material":
                    if(!result.bezel_material)
                        result.bezel_material = val;
                    return;
                case "Crystal":
                    if(!result.crystal)
                        result.crystal = val;
                    return;
                case "Dial numerals":
                    if(!result.dial_numerals)
                        result.dial_numerals = val;
                    return;
                case "Bracelet material":
                    if(!result.bracelet_material)
                        result.bracelet_material = val;
                    return;
                case "Bracelet color":
                    if(!result.bracelet_color)
                        result.bracelet_color = val;
                    return;
                case "Clasp":
                    if(!result.clasp)
                        result.clasp = val;
                    return;
                case "Clasp material":
                    if(!result.clasp_material)
                        result.clasp_material = val;
                    return;
            }
        }

        const table = document.querySelector('#detail-page-dealer > section.js-details-and-security-tabs.container.m-b-7.m-b-md-9 > div > div.js-tab.tab.active > section > div > div:nth-child(1) > table')

        let tr;
        if(table) {
            tr = table.querySelectorAll('tr')

            for(let x of tr) {
                if(x) {
                    let tds = x.querySelectorAll('td')
                    if(tds && tds.length > 1){
                        processTDS(tds,result);

                        if(tds[0].textContent === "Case diameter"){
                            if(!result.case_diameter)
                                result.case_diameter = tds[1].querySelector('span').textContent
                        }
                        
                        if(tds[0].textContent === "Price"){
                            let price = tds[1].textContent.trim().match(/-?\d+(?:,\d{3})*(?:\.\d+)?/)
                            if(price){
                                price = "$"+price.join("")
                                result.listed_price.push(price)
                            }
                        }else if(tds[0].textContent === "Dial"){
                            const dial = tds[1].textContent.trim()
                            if(dial && !result.dial.includes(dial))
                                result.dial.push(dial)
                        }else if(tds[0].textContent === "Year of production"){
                            let yop = tds[1].textContent.trim().match(/\d/g)
                            if(yop){
                                yop = yop.join("")
                                if(!result.year_of_production.includes(yop))
                                    result.year_of_production.push(yop);
                            }
                        }
                    }
                }
            }
        }

        return result; 
    },R)
    
    R = {...R,...t};
    
    if(!R.functions)
        R.functions = $("#detail-page-dealer > section.js-details-and-security-tabs.container.m-b-7.m-b-md-9 > div > div.js-tab.tab.active > section > div > div:nth-child(1) > table > tbody:nth-child(5) > tr:nth-child(2) > td")
                        .text().trim()
    
    console.log(R);
    return R;
}

module.exports = {
    processHTML
}