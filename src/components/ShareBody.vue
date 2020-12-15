<template>
  <component
    :is="tabComponent"
    :isShowTable="isShowTable"
    :isFullScreen="isFullScreen"
    :describeData="describeData"
  ></component>
</template>

<script>
// 中国对外投资模块
// 中国对外投资流量
import outflowsChart from "@/views/foreignCapital/outbound/sharePages/OutflowsChart";
// 中国对外直接投资存量
import outstocksChart from "@/views/foreignCapital/outbound/sharePages/OutstocksChart";
import flowsAndStocksChart from "@/views/foreignCapital/outbound/sharePages/FlowsAndStocksChart";
//中国对外直接投资存量按国家和地区统计
import stocksByContinentChart from "@/views/foreignCapital/outbound/sharePages/StocksByContinentChart";
import stocksByCRIContinentChart from "@/views/foreignCapital/outbound/sharePages/StocksByCRIContinentChart";
import stocksByDestinationChart from "@/views/foreignCapital/outbound/sharePages/StocksByDestinationChart";
import stocksTwentyDestinationChart from "@/views/foreignCapital/outbound/sharePages/StocksTwentyDestinationChart";
//中国对外直接投资流量按国家和地区统计
import flowsByContinentChart from "@/views/foreignCapital/outbound/sharePages/FlowsByContinentChart";
import flowsByCRIContinentChart from "@/views/foreignCapital/outbound/sharePages/FlowsByCRIContinentChart";
import flowsByDestinationChart from "@/views/foreignCapital/outbound/sharePages/FlowsByDestinationChart";
import flowsTwentyDestinationChart from "@/views/foreignCapital/outbound/sharePages/FlowsTwentyDestinationChart";
// 中国对外直接投资流量行业分布情况
import outflowsByIndustryChart from "@/views/foreignCapital/outbound/sharePages/OutflowsByIndustryChart";
import economyByIndustryChart from "@/views/foreignCapital/outbound/sharePages/EconomyByIndustryChart";
// 中国对“一带一路”沿线国家直接投资情况
import nonFinancialToBRIChart from "@/views/foreignCapital/outbound/sharePages/NonFinancialToBRIChart";
import amountGrowthToBRIChart from "@/views/foreignCapital/outbound/sharePages/AmountGrowthToBRIChart";
import newContractAmountToBRIChart from "@/views/foreignCapital/outbound/sharePages/NewContractAmountToBRIChart";
// 中国对外承包工程，，，
import amountGrowthToOPChart from "@/views/foreignCapital/outbound/sharePages/AmountGrowthToOPChart";
import newContractAmountToOPChart from "@/views/foreignCapital/outbound/sharePages/NewContractAmountToOPChart";
import topTenCountriesToOPChart from "@/views/foreignCapital/outbound/sharePages/TopTenCountriesToOPChart";
import topTenProjectToOPChart from "@/views/foreignCapital/outbound/sharePages/TopTenProjectToOPChart";
// 中国对外劳务合作，，，
import tradeVolumeChart from "@/views/foreignCapital/outbound/sharePages/TradeVolumeChart";
import topTenDestOfWorkersChart from "@/views/foreignCapital/outbound/sharePages/TopTenDestOfWorkersChart";
import topTenDestOfNumOfWorkersChart from "@/views/foreignCapital/outbound/sharePages/TopTenDestOfNumOfWorkersChart";
import industryOfWorkersNumChart from "@/views/foreignCapital/outbound/sharePages/IndustryOfWorkersNumChart";

// 外商投资中国模块
// 实际使用外资
import inflowsChart from "@/views/foreignCapital/inbound/sharePages/InflowsChart";
//主要对华投资国家/地区
import investProportionInChinaChart from "@/views/foreignCapital/inbound/sharePages/InvestProportionInChinaChart";
import stateDirectInvestInChinaChart from "@/views/foreignCapital/inbound/sharePages/StateDirectInvestInChinaChart";
import topFifteenCountriesChart from "@/views/foreignCapital/inbound/sharePages/TopFifteenCountriesChart";
//外商直接投资主要行业
import numEnterprisesChart from "@/views/foreignCapital/inbound/sharePages/NumEnterprisesChart";
import inflowsToChinaChart from "@/views/foreignCapital/inbound/sharePages/InflowsToChinaChart";
// 外商投资企业税收统计
import foreignInvestTaxChart from "@/views/foreignCapital/inbound/sharePages/ForeignInvestTaxChart";
//"一带一路"沿线国家对华投资情况
import numEnterprisesBRIChart from "@/views/foreignCapital/inbound/sharePages/NumEnterprisesBRIChart";
import inflowsToChinaBRIChart from "@/views/foreignCapital/inbound/sharePages/InflowsToChinaBRIChart";
// 双向直接投资模块
// 双向直接投资
import outflowsVsInflowsChart from "@/views/foreignCapital/twoWayInvestment/sharePages/OutflowsVsInflowsChart";
// ------------------------外贸模块-------------------------
//中国货物进出口总值
import goodsTotalChart from "@/views/foreignTrade/goodsTrade/sharePages/GoodsTotalChart";
//中国货物进出口贸易差额
import goodsTradeBalanceChart from "@/views/foreignTrade/goodsTrade/sharePages/GoodsTradeBalanceChart";
//货物出口总值(国家/地区)
import tradeByOriginChart from "@/views/foreignTrade/goodsTrade/sharePages/TradeByOriginChart";
//货物出口总值(商品类别)
import tradeByCommodityChart from "@/views/foreignTrade/goodsTrade/sharePages/TradeByCommodityChart";
//货物出口总值(企业性质)
import tradeByEnterpriseTypeChart from "@/views/foreignTrade/goodsTrade/sharePages/TradeByEnterpriseTypeChart";
//货物出口总值(贸易方式)
import tradeByCustomRegimeChart from "@/views/foreignTrade/goodsTrade/sharePages/TradeByCustomRegimeChart";
//外商投资企业进出口总值
import foreignInvestedEnterprisesChart from "@/views/foreignTrade/goodsTrade/sharePages/ForeignInvestedEnterprisesChart";
// 中国服务贸易进出口总值
import totalTradeInServicesChart from "@/views/foreignTrade/servicesTrade/sharePages/TotalTradeInServicesChart";
// 服务贸易分类统计
import volumeByServiceTypeChart from "@/views/foreignTrade/servicesTrade/sharePages/VolumeByServiceTypeChart";
// ------------------------宏观经济指标模块-------------------------
//国内生产总值
import grossDomesticProductChart from "@/views/economicIndicators/sharePages/GrossDomesticProductChart";
//消费者价格指数
import consumerPriceIndexChart from "@/views/economicIndicators/sharePages/ConsumerPriceIndexChart";
//采购经理人指数
import purchasingManagersIndexChart from "@/views/economicIndicators/sharePages/PurchasingManagersIndexChart";
//登记失业率
import unemployRegisterChart from "@/views/economicIndicators/sharePages/UnemployRegisterChart";
//调查失业率
import unemployExamineChart from "@/views/economicIndicators/sharePages/UnemployExamineChart";
//工业生产者出厂价格指数
import producerPriceIndexChart from "@/views/economicIndicators/sharePages/ProducerPriceIndexChart";
//工业增加值
import industryAddValueChart from "@/views/economicIndicators/sharePages/IndustryAddValueChart";
//工业企业利润
import industrialProfitsChart from "@/views/economicIndicators/sharePages/IndustrialProfitsChart";
//社会消费品零售总额
import salesConsumerGoodsChart from "@/views/economicIndicators/sharePages/SalesConsumerGoodsChart";
//固定资产投资（不含农户）
import investmentFixedAssetsChart from "@/views/economicIndicators/sharePages/InvestmentFixedAssetsChart";
//国家财政收支
import nationalFinanceChart from "@/views/economicIndicators/sharePages/NationalFinanceChart";
//货币供应量 (M2)
import moneySupplyChart from "@/views/economicIndicators/sharePages/MoneySupplyChart";
//国家外汇储备
import foreignCurrencyReservesChart from "@/views/economicIndicators/sharePages/ForeignCurrencyReservesChart";

export default {
  props: {
    tabComponent: {
      type: String,
      required: true
    },
    isShowTable: {},
    isFullScreen: {},
    describeData: {}
  },
  data() {
    return {};
  },
  components: {
    // 中国对外投资流量
    outflowsChart, //中国对外投资流量
    // 中国对外直接投资存量
    outstocksChart, // 中国对外直接投资存量
    flowsAndStocksChart, //中国对外直接投资流量与存量
    //中国对外直接投资存量按国家和地区统计
    stocksByContinentChart, //按大洲统计
    stocksByCRIContinentChart, //按各洲内国家/地区统计
    stocksByDestinationChart, //按国家和地区统计
    stocksTwentyDestinationChart, //历年前20位国家
    //中国对外直接投资流量按国家和地区统计
    flowsByContinentChart, //按大洲统计
    flowsByCRIContinentChart, //按各洲内国家/地区统计
    flowsByDestinationChart, //按国家和地区统计
    flowsTwentyDestinationChart, //历年前20位国家
    // 中国对外直接投资流量行业分布情况
    outflowsByIndustryChart, //中国对外直接投资流量行业分布情况
    economyByIndustryChart, // 中国对主要经济体投资按行业统计
    // 中国对“一带一路”沿线国家直接投资情况
    nonFinancialToBRIChart, // 中国对“一带一路”沿线国家非金融类直接投资情况
    amountGrowthToBRIChart, //完成营业额
    newContractAmountToBRIChart, //新签合同额
    // 中国对外承包工程
    amountGrowthToOPChart, //完成营业额
    newContractAmountToOPChart, //新签合同额
    topTenCountriesToOPChart, // 前十国别（市场）
    topTenProjectToOPChart, // 前十项目
    // 中国对外劳务合作
    tradeVolumeChart, //派出人数
    topTenDestOfWorkersChart, //年度派出各类劳务人员前10位目的地国家
    topTenDestOfNumOfWorkersChart, //12月末在外各类劳务人员前10位国家
    industryOfWorkersNumChart, //派出人数主要行业

    // 外商投资中国模块
    //实际使用外资
    inflowsChart, // 实际使用外资
    //主要对华投资国家/地区
    investProportionInChinaChart, //国家和地区对华投资比重
    stateDirectInvestInChinaChart, //年度部分国家/地区对华直接投资
    topFifteenCountriesChart, // 前15位国家/地区
    //外商直接投资主要行业
    numEnterprisesChart, //开办企业数
    inflowsToChinaChart, // 实际使用外资金额
    //外商投资企业税收统计
    foreignInvestTaxChart, //外商投资企业税收统计
    //"一带一路"沿线国家对华投资    情况
    numEnterprisesBRIChart, //企业数
    inflowsToChinaBRIChart, //实际投入外资金额

    // 双向直接投资模块
    //双向直接投资
    outflowsVsInflowsChart, //双向直接投资
    // ----------------外贸模块----------------
    // 货物贸易
    //中国货物进出口总值
    goodsTotalChart, //中国货物进出口总值
    goodsTradeBalanceChart, //中国货物进出口贸易差额
    tradeByOriginChart, //货物出口总值按国家和地区统计
    tradeByCommodityChart, //货物出口总值(商品类别)
    tradeByEnterpriseTypeChart, //货物出口总值(企业性质)
    tradeByCustomRegimeChart, //货物出口总值(贸易方式)
    foreignInvestedEnterprisesChart, //外商投资企业进出口总值
    //服务贸易
    totalTradeInServicesChart, // 中国服务贸易进出口总值
    volumeByServiceTypeChart, // 服务贸易分类统计

    // ------------------------宏观经济指标模块-------------------------
    //国内生产总值
    grossDomesticProductChart,
    //消费者价格指数
    consumerPriceIndexChart,
    //采购经理人指数
    purchasingManagersIndexChart,
    //登记失业率
    unemployRegisterChart,
    //调查失业率
    unemployExamineChart,
    //工业生产者出厂价格指数
    producerPriceIndexChart,
    //工业增加值
    industryAddValueChart,
    //工业企业利润
    industrialProfitsChart,
    //社会消费品零售总额
    salesConsumerGoodsChart,
    //固定资产投资（不含农户）
    investmentFixedAssetsChart,
    //国家财政收支
    nationalFinanceChart,
    //货币供应量 (M2)
    moneySupplyChart,
    //国家外汇储备
    foreignCurrencyReservesChart
  }
};
</script>

<style></style>
