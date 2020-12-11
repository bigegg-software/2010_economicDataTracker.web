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
import goodsTotal from "@/views/foreignTrade/goodsTrade/sharePages/GoodsTotal";
//中国货物进出口贸易差额
import goodsTradeBalance from "@/views/foreignTrade/goodsTrade/sharePages/GoodsTradeBalance";
//货物出口总值(国家/地区)
import tradeByOrigin from "@/views/foreignTrade/goodsTrade/sharePages/TradeByOrigin";
//货物出口总值(商品类别)
import tradeByCommodity from "@/views/foreignTrade/goodsTrade/sharePages/TradeByCommodity";
//货物出口总值(企业性质)
import tradeByEnterpriseType from "@/views/foreignTrade/goodsTrade/sharePages/TradeByEnterpriseType";
//货物出口总值(贸易方式)
import tradeByCustomRegime from "@/views/foreignTrade/goodsTrade/sharePages/TradeByCustomRegime";
//外商投资企业进出口总值
import foreignInvestedEnterprises from "@/views/foreignTrade/goodsTrade/sharePages/ForeignInvestedEnterprises";
// 中国服务贸易进出口总值
import totalTradeInServices from "@/views/foreignTrade/servicesTrade/sharePages/TotalTradeInServices";
// 服务贸易分类统计
import volumeByServiceType from "@/views/foreignTrade/servicesTrade/sharePages/VolumeByServiceType";
// ------------------------宏观经济指标模块-------------------------
//国内生产总值
import grossDomesticProduct from "@/views/economicIndicators/sharePages/GrossDomesticProduct";
//消费者价格指数
import consumerPriceIndex from "@/views/economicIndicators/sharePages/ConsumerPriceIndex";
//采购经理人指数
import purchasingManagersIndex from "@/views/economicIndicators/sharePages/PurchasingManagersIndex";
//登记失业率
import unemployRegister from "@/views/economicIndicators/sharePages/UnemployRegister";
//调查失业率
import unemployExamine from "@/views/economicIndicators/sharePages/UnemployExamine";
//工业生产者出厂价格指数
import producerPriceIndex from "@/views/economicIndicators/sharePages/ProducerPriceIndex";
//工业增加值
import industryAddValue from "@/views/economicIndicators/sharePages/IndustryAddValue";
//工业企业利润
import industrialProfits from "@/views/economicIndicators/sharePages/IndustrialProfits";
//社会消费品零售总额
import salesConsumerGoods from "@/views/economicIndicators/sharePages/SalesConsumerGoods";
//固定资产投资（不含农户）
import investmentFixedAssets from "@/views/economicIndicators/sharePages/InvestmentFixedAssets";
//国家财政收支
import nationalFinance from "@/views/economicIndicators/sharePages/NationalFinance";
//货币供应量 (M2)
import moneySupply from "@/views/economicIndicators/sharePages/MoneySupply";
//国家外汇储备
import foreignCurrencyReserves from "@/views/economicIndicators/sharePages/ForeignCurrencyReserves";

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
    goodsTotal, //中国货物进出口总值
    goodsTradeBalance, //中国货物进出口贸易差额
    tradeByOrigin, //货物出口总值按国家和地区统计
    tradeByCommodity, //货物出口总值(商品类别)
    tradeByEnterpriseType, //货物出口总值(企业性质)
    tradeByCustomRegime, //货物出口总值(贸易方式)
    foreignInvestedEnterprises, //外商投资企业进出口总值
    //服务贸易
    totalTradeInServices, // 中国服务贸易进出口总值
    volumeByServiceType, // 服务贸易分类统计

    // ------------------------宏观经济指标模块-------------------------
    //国内生产总值
    grossDomesticProduct,
    //消费者价格指数
    consumerPriceIndex,
    //采购经理人指数
    purchasingManagersIndex,
    //登记失业率
    unemployRegister,
    //调查失业率
    unemployExamine,
    //工业生产者出厂价格指数
    producerPriceIndex,
    //工业增加值
    industryAddValue,
    //工业企业利润
    industrialProfits,
    //社会消费品零售总额
    salesConsumerGoods,
    //固定资产投资（不含农户）
    investmentFixedAssets,
    //国家财政收支
    nationalFinance,
    //货币供应量 (M2)
    moneySupply,
    //国家外汇储备
    foreignCurrencyReserves
  }
};
</script>

<style></style>
