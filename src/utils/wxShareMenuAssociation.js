export default{
    //外资
    //中国对外直接投资流量
    outflowsChart:'outflows/outflowsPage',//中国对外直接投资流量
    //对外直接投资流量按国家和地区统计
    flowsByContinentChart:'outflowsByDestination/outflowsByContinentPage',//(按大洲统计)
    flowsByCRIContinentChart:'outflowsByDestination/outflowsByCountryRegionPage',//(按各洲内国家/地区统计)
    flowsByDestinationChart:'outflowsByDestination/outflowsByDestinationPage',//(按国家/地区统计)
    flowsTwentyDestinationChart:'outflowsByDestination/outflowsTop20Page',//(历年前20位国家/地区)
    //对外直接投资流量行业分布情况
    outflowsByIndustryChart:'outflowsByIndustry/outflowsByIndustryPage',//中国对外直接投资流量行业分布情况
    economyByIndustryChart:'outflowsByIndustry/mainEconomiesPage',//中国对主要经济体投资按行业统计
    //中国对“一带一路”沿线国家投资
    nonFinancialToBRIChart:'outflowsInBeltAndRoad/outflowsBRICountriesPage',//中国对“一带一路”沿线国家非金融类直接投资
    newContractAmountToBRIChart:'outflowsInBeltAndRoad/newContractTotalValuePage',//新签合同额
    amountGrowthToBRIChart:'outflowsInBeltAndRoad/completedContractRevenuePage',//完成营业额
    //中国对外承包工程
    amountGrowthToOPChart:'overseasProjects/completedContractPage',//完成营业额
    newContractAmountToOPChart:'overseasProjects/newContractPage',//新签合同额
    topTenCountriesToOPChart:'overseasProjects/top10MarketPage',//合同额前十国家和地区
    topTenProjectToOPChart:'overseasProjects/top10ProjectPage',//合同额前十项目
    //中国对外劳务合作
    tradeVolumeChart:'internationalLabor/workersNumberPage',//派出人数
    topTenDestOfWorkersChart:'internationalLabor/top10ByYearPage',//年度派出各类劳务人员前10位目的地国家
    topTenDestOfNumOfWorkersChart:'internationalLabor/top10ByYearEndPage',//12月末在外各类劳务人员前10位国家
    industryOfWorkersNumChart:'internationalLabor/workersByIndustryPage',//派出人数主要行业
   //中国对外直接投资存量
   outstocksChart:'stocks/stocksPage',//中国对外直接投资存量
   flowsAndStocksChart:'stocks/outflowsVsStocksPage',//中国对外直接投资流量与存量
   //对外直接投资存量按国家和地区统计
   stocksByContinentChart:'stocksByDestination/stocksByContinentPage',//按大洲统计
   stocksByCRIContinentChart:'stocksByDestination/stocksByCountryRegionPage',//按各洲内国家/地区统计
   stocksByDestinationChart:'stocksByDestination/stocksByDestinationPage',//按国家和地区统计
   stocksTwentyDestinationChart:'stocksByDestination/stocksTop20Page',//历年前20位国家/地区
   //实际使用外资
   inflowsChart:'inflows/inflowsPage',//实际使用外资
   //主要对华投资国家/地区
   investProportionInChinaChart:'majorInvestorsChina/byCountryRegionPage',//国家/地区投资比重
   stateDirectInvestInChinaChart:'majorInvestorsChina/byMajorCountryRegionPage',//部分国家/地区对华直接投资
   topFifteenCountriesChart:'majorInvestorsChina/top15InvestorsPage',//前15位对华投资国家/地区
   //外商直接投资主要行业
   numEnterprisesChart:'investmentByIndustry/startEnterprisesNumberPage',//新设立外商投资企业
   inflowsToChinaChart:'investmentByIndustry/investmentByIndustryPage',//实际使用外资金额按行业统计
   //外商投资企业税收统计
   foreignInvestTaxChart:'taxRevenue/taxRevenuePage',//外商投资企业税收统计
   //“一带一路”沿线国家对华投资情况
   numEnterprisesBRIChart:'investmentFromBeltAndRoad/enterprisesNumberPage',//新设立企业数
   inflowsToChinaBRIChart:'investmentFromBeltAndRoad/foreignInvestmentPage',//实际投入外资金额
   //双向直接投资
   outflowsVsInflowsChart:'iutflowsVsInflows/outflowsVsInflowsPage',//双向直接投资
    //外贸
    //中国货物进出口总值
    goodsTotalChart:'goodsTradeVolume/goodsTradeVolumePage',// 中国货物进出口总值
    goodsTradeBalanceChart:'goodsTradeVolume/tradeBalancePage',//中国货物进出口贸易差额
    //货物进出口总值按国别/地区统计
    tradeByOriginChart:'importExportByOrigin/importExportByOriginPage',//货物进出口总值(国别/地区)
    //货物进出口总值按商品类别统计
    tradeByCommodityChart:'importExportByCommodity/importExportByCommodityPage',//货物进出口总值按商品类别统计
    //货物进出口总值按企业性质统计
    tradeByEnterpriseTypeChart:'importExportByEnterpriseType/importExportByEnterpriseTypePage',//货物进出口总值按企业性质统计
    //货物进出口总值按贸易方式统计
    tradeByCustomRegimeChart:'importExportByCustomRegime/importExportByCustomRegimePage',//货物进出口总值按贸易方式统计
    //外商投资企业进出口总值
    foreignInvestedEnterprisesChart:'foreignInvestedEnterprises/foreignInvestedEnterprisesPage',//外商投资企业进出口总值
    //中国服务贸易进出口总值
    totalTradeInServicesChart:'servicesTradeVolume/servicesTradeVolumePage',//中国服务贸易进出口总值
    //服务贸易分类统计
    volumeByServiceTypeChart:'tradeVolumeByServiceType/tradeVolumeByServiceTypePage',//服务贸易分类统计
    // 宏观经济
    grossDomesticProductChart:'grossDomesticProduct/grossDomesticProductPage',//国内生产总值
    consumerPriceIndexChart:'consumerPriceIndex/consumerPriceIndexPage',//消费者价格指数CPI
    purchasingManagersIndexChart:'purchasingManagersIndex/purchasingManagersIndexPage',//采购经理人指数
    unemployRegisterChart:'unemployment/registerPage',//登记失业率
    unemployExamineChart:'unemployment/investigationPage',//调查失业率
    producerPriceIndexChart:'producerPriceIndex/producerPriceIndexPage',//工业生产者出厂价格指数
    industryAddValueChart:'industryGrowthValue/industryGrowthValuePage',//工业增加值
    industrialProfitsChart:'industrialProfits/industrialProfitsPage',//工业企业利润
    salesConsumerGoodsChart:'consumerGoodsTotal/consumerGoodsTotalPage',//社会消费品零售总额
    investmentFixedAssetsChart:'investmentInFixedAssets/investmentInFixedAssetsPage',//固定资产投资（不含农户）
    nationalFinanceChart:'nationalRevenue/nationalRevenuePage',//国家财政收支
    moneySupplyChart:'moneySupply/moneySupplyPage',//货币供应量 (M2)
    foreignCurrencyReservesChart:'foreignCurrencyReserves/foreignCurrencyReservesPage'//国家外汇储备
}