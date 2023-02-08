const selectors = {
    current_price: "#root > div > div:nth-child(3) > div > div:nth-child(1) > div > div > div > div.col-sm-7.ps-sm-5.animation-element.bounce-down.charthelpmobile.headermobilebiewtwo.in-view > div > div.desktop.d-flex.flex-column > div.d-flex.align-items-center.my-1 > h3",
    opening_price: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(1) > h3",
    closing_price: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(2) > h3",
    absolute_change: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(3) > h3",
    minimum_price: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(4) > h3",
    maximum_price: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(5) > h3",
    annualized_volatility: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(6) > h3",
    one_year: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div.summarsectiontimframes > div > button:nth-child(4)",
    three_year: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div.summarsectiontimframes > div > button:nth-child(3)",
    five_year: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div.summarsectiontimframes > div > button:nth-child(2)",
    all: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div.summarsectiontimframes > div > button:nth-child(1)",
    six_month: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div.summarsectiontimframes > div > button:nth-child(5)",
    three_month: "#root > div > div:nth-child(3) > div > div.row.row-attributes.details-section.my-5 > div > div.detailsdesktop > div:nth-child(2) > div:nth-child(1) > div > div.summarsectiontimframes > div > button:nth-child(6)",
    price_change_percentage: "#root > div > div:nth-child(3) > div > div:nth-child(1) > div > div > div > div.col-sm-7.ps-sm-5.animation-element.bounce-down.charthelpmobile.headermobilebiewtwo.in-view > div > div.desktop.d-flex.flex-column > div.d-flex.align-items-center.my-1 > div > div > div.chartchangepercent",
    searchResultCount: "#root > div > div.row.row-attributes.search-result-section.my-5.footerbottom > div > div.row.row-attributes > div > div:nth-child(1) > div > p > font:nth-child(2)",
    
}

module.exports = selectors;