let foreignCapitalMenuLists = [  //外资模块
  {
    name: "outBound",
    ch: "中国对外投资",
    en: "China's outward FDI",
    active: false,
    children: [
      {
        name: "outflows",
        ch: "中国对外直接投资流量",
        en: "FDI outflows",
        cloudFun: ['FDIOutflowYear', 'FDIOutflow'],
        splitList: ['中', '国', '对', '外', '直', '接', '投', '资', '流', '量', 'FDI', 'outflows'],
        active: false,
      },
      {
        name: "outflowsByDestination",
        ch: "对外直接投资流量按国家和地区统计",
        en: "FDI outflows by destination",
        cloudFun: ['FDIOutflowDestination', 'FDITop20Outflow'],
        splitList: ['对', '外', '直', '接', '投', '资', '流', '量', '按', '国', '家', '和', '地', '区', '统', '计', 'FDI ', 'outflows', 'by', 'destination'],
        active: false,
        isIndent: true
      },
      {
        name: "outflowsByIndustry",
        ch: "对外直接投资流量行业分布情况",
        en: "FDI outflows by industry",
        cloudFun: ['FDIOutflowsIndustry', 'FDIMajorEconomiesIndustry'],
        splitList: ['对', '外', '直', '接', '投', '资', '流', '量', '行', '业', '分', '布', '情', '况', 'FDI', 'outflows', 'by', 'industry'],
        active: false,
        isIndent: true
      },
      {
        name: "outflowsBeltAndRoad",
        ch: "中国对“一带一路”沿线国家投资",
        en: "FDI outflows into countries along the Belt and Road",
        cloudFun: ['FDIOutflowsBRICountry'],
        splitList: ['中', '国', '对', '一', '带', '一', '路', '沿', '线', '国', '家', '投', '资', 'FDI','outflows','into','countries','along','the','Belt','and','Road'],
        active: false,
        isIndent: true
      },
      {
        name: "overseasProjects",
        ch: "中国对外承包工程",
        en: "Overseas contracted projects",
        cloudFun: ['ForeignContract', 'ForeignContractAnnualRank', 'ForeignContractNewConRank'],
        splitList: ['中', '国', '对', '外', '承', '包', '工', '程', 'Overseas','contracted', 'projects'],
        active: false,
        isIndent: true
      },
      {
        name: "internationalLabor",
        ch: "中国对外劳务合作",
        en: "Overseas labor service cooperation",
        cloudFun: ['LaborServiceCooperation', 'LaborServiceTop10AnnualRank', 'LaborServiceIndustry'],
        splitList: ['中', '国', '对', '外', '劳', '务', '合', '作', 'Overseas','labor','service','cooperation'],
        active: false,
        isIndent: true
      },
      {
        name: "outstocks",
        ch: "中国对外直接投资存量",
        en: "Outward FDI stocks",
        cloudFun: ['FDIOutflowsInflows'],
        splitList: ['中', '国', '对', '外', '直', '接', '投', '资', '存', '量','Outward','FDI', 'stocks'],
        active: false
      },
      {
        name: "outstocksByDestination",
        ch: "对外直接投资存量按国家和地区统计",
        en: "Outward FDI stocks by destination",
        cloudFun: ['FDIStock', 'FDITop20Stock'],
        splitList: ['对', '外', '直', '接', '投', '资', '存', '量', '按', '国', '家', '和', '地', '区', '统', '计','Outward','FDI', 'stocks', 'by', 'destination'],
        active: false,
        isIndent: true
      },
    ]
  },
  {
    name: "inBound",
    ch: "中国外商投资",
    en: "China's inward FDI",
    active: false,
    children: [
      {
        name: "inflows",
        ch: "实际使用外资",
        en: "Actual use of foreign capital",
        cloudFun: ['InwardFDI'],
        splitList: ['实', '际', '使', '用', '外', '资', 'Actual', 'use','of','foreign','capital',],
        active: false,
        isIndent: true
      },
      {
        name: "majorForeignInvestors",
        ch: "主要对华投资国家/地区",
        en: "Major countries and regions investing in China",
        cloudFun: ['MajorInvestors', 'MajorTop15Investors'],
        splitList: ['主', '要', '对', '华', '投', '资', '国', '家', '地', '区', "Major", "countries", "and", "regions", "investing", "in", "China"],
        active: false,
        isIndent: true
      },
      {
        name: "foreignInvestIndustry",
        ch: "外商直接投资主要行业",
        en: "FDI inflows by industry",
        cloudFun: ['ForeignInvestmentMainIndustries'],
        splitList: ['外', '商', '直', '接', '投', '资', '主', '要', '行', '业', 'Foreign', "FDI", "inflows", "by", "industry"],
        active: false,
        isIndent: true
      },
      {
        name: "foreignInvestTax",
        ch: "外商投资企业税收统计",
        en: "Tax revenue from foreign-invested enterprises",
        cloudFun: ['ForeignInvestment'],
        splitList: ['外', '商', '投', '资', '企', '业', '税', '收', '统', '计', "Tax", "revenue", "from", "foreign-invested", "enterprises"],
        active: false,
        isIndent: true
      },
      {
        name: "beltAndRoadInvest",
        ch: "“一带一路”沿线国家对华投资情况",
        en: "Investment from countries along the Belt and Road",
        cloudFun: ['BRIInvestors'],
        splitList: ['一', '带', '一', '路', '沿', '线', '国', '家', '对', '华', '投', '资', '情', '况',"Investment", "from", "countries", "along", "the", "Belt", "and", "Road"],
        active: false,
        isIndent: true
      }
    ]
  },
  {
    name: "twoWayInvestment",
    ch: "双向直接投资",
    en: "FDI outflows vs. actual use of foreign capital",
    active: false,
    children: [
      {
        name: "outflowsVsInflows",
        ch: "双向直接投资",
        en: "FDI outflows vs. actual use of foreign capital",
        cloudFun: ['FDIOutflowsInflows', 'FDIOutflow', 'InwardFDI'],
        splitList: ['双', '向', '直', '接', '投', '资', 'China', 'FDI', 'outflows', 'vs', 'actual','use','of','foreign','capital'],
        active: false,
        isIndent: true
      }
    ]
  }
];
let foreignTradeMenuLists = [  //外贸模块
  {

    name: "goodsTrade",
    ch: "货物贸易",
    en: "Trade of goods",
    active: false,
    children: [
      {
        name: "goodsTotal",
        ch: "中国货物进出口总值",
        en: "Total trade volume of goods",
        cloudFun: ['TotalTradeGoods','TotalTradeGoodsMonth'],//所需的数据库表名
        splitList: ['中', '国', '货', '物', '进', '出', '口', '总', '值', 'Total', 'trade', 'volume', 'of', 'goods'],
        active: false,
      },
      {
        name: "goodsByOrigin",
        ch: "货物进出口总值按国家/地区统计",
        en: "Imports and exports by origin",
        cloudFun: ['ImportExportOrigin'],
        splitList: ['货', '物', '进', '出', '口', '总', '值', '按', '国', '别', '地', '区', '统', '计', 'Import', 'and', 'export', 'by', 'origin'],
        active: false,
      },
      {
        name: "goodsByCommodity",
        ch: "货物进出口总值按商品类别统计",
        en: "Imports and exports by commodity (HS section)",
        cloudFun: ['ImportExportCommodity'],
        splitList: ['货', '物', '进', '出', '口', '总', '值', '按', '商', '品', '类', '别', '统', '计', 'Import', 'and', 'export', 'by', 'commodity', 'HS', 'section'],
        active: false,
      },
      {
        name: "goodsByEnterpriseType",
        ch: "货物进出口总值按企业性质统计",
        en: "Imports and exports by enterprise type",
        cloudFun: ['ImportExportEnterprise'],
        splitList: ['货', '物', '进', '出', '口', '按', '企', '业', '性', '质', '统', '计', 'Import', 'and', 'export', 'by', 'enterprise', 'type'],
        active: false,
      }, {
        name: "goodsByCustomRegime",
        ch: "货物进出口总值按贸易方式统计",
        en: "Imports and exports by custom regime",
        cloudFun: ['ImportExportCustomRegime'],
        splitList: ["货", "物", "进", "出", "口", "总", "值", "按", "贸", "易", "方", "式", "统", "计", "Import", "and", "export", "by", "custom", "regime"],
        active: false,
      }, {
        name: "foreignInvestedEnterprises",
        ch: "外商投资企业进出口总值",
        en: "Trade volume of foreign-invested enterprises",
        cloudFun: ['ForeignInvestedTradeEns'],
        splitList: ["外", "商", "投", "资", "企", "业", "进", "出", "口", "总", "值", "Trade", "volume", "of", "foreign-invested", "enterprises"],
        active: false,
      },
    ]
  },
  {
    name: "servicesTrade",
    ch: "服务贸易",
    en: "Trade of services",
    active: false,
    children: [
      {
        name: "servicesTotal",
        ch: "中国服务贸易进出口总值",
        en: "Total trade volume of services",
        cloudFun: ['TotalTradeServicesVolume'],
        splitList: ["中", "国", "服", "务", "贸", "易", "进", "出", "口", "总", "值", "Total", "trade", "volume", "of", "services"],
        active: false,
      },
      {
        name: "serviceType",
        ch: "服务贸易分类统计",
        en: "Trade volume by service type",
        cloudFun: ['TradeServicesTypeVolume'],
        splitList: ["服", "务", "贸", "易", "分", "类", "统", "计", "Trade", "volume", "by", "service", "type"],
        active: false,
      },
    ]
  }
];
let economicIndicatorsMenuLists = [  //宏观经济指标模块
  {
    name: "grossDomesticProduct",
    ch: "国内生产总值",
    en: "Gross Domestic Product (GDP)",
    cloudFun: ['GDP','GDPQuarterly'],//所需的数据库表名
    splitList: ["国", "内", "生", "产", "总", "值", "Gross", "Domestic", "Product", "GDP"],
    active: false,
  },
  {
    name: "consumerPriceIndex",
    ch: "消费者价格指数",
    en: "Consumer Price Index (CPI)",
    cloudFun: ['CPI','MonthlyCPI'],
    splitList: ["消", "费", "者", "价", "格", "指", "数", "Consumer", "Price", "Index", "CPI"],
    active: false,
  },
  {
    name: "purchasingManagersIndex",
    ch: "采购经理人指数",
    en: "Purchasing Managers' Index (PMI)",
    cloudFun: ['PMI'],
    splitList: ["采", "购", "经", "理", "人", "指", "数", "Purchasing", "Managers’", "Index", "PMI"],
    active: false,
  },
  {
    name: "unemployment",
    ch: "失业率",
    en: "Unemployment",
    cloudFun: ['Unemployment','UnemploymentQuarter','UnemploymentMonth'],
    splitList: ["失", "业", "率", "Unemployment"],
    active: false,
  }, {
    name: "producerPriceIndex",
    ch: "工业生产者出厂价格指数",
    en: "Producer Price Index (PPI)",
    cloudFun: ['PPI','MonthPPI'],
    splitList: ["工", "业", "生", "产", "者", "出", "厂", "价", "格", "指", "数", "Producer", "Price", "Index", "PPI"],
    active: false,
  }, {
    name: "industryAddValue",
    ch: "工业增加值",
    en: "Industrial value-added",
    cloudFun: ['GIVA'],
    splitList: ["工", "业", "增", "加", "值", "Growth", "of", "industrial", "value-added"],
    active: false,
  }, {
    name: "industrialProfits",
    ch: "工业企业利润",
    en: "Industrial profits",
    cloudFun: ['IndustrialProfit'],
    splitList: ["工", "业", "企", "业", "利", "润", "Industrial", "profits"],
    active: false,
  }, {
    name: "salesConsumerGoods",
    ch: "社会消费品零售总额",
    en: "Total retail sales of consumer goods",
    cloudFun: ['ConsumerSaleGoods','ConsumerSaleGoodsMonth'],
    splitList: ["社", "会", "消", "费", "品", "零", "售", "总", "额", "Total", "retail", "sales", "of", "consumer", "goods"],
    active: false,
  }, {
    name: "investmentFixedAssets",
    ch: "固定资产投资（不含农户）",
    en: "Investment in fixed assets (excluding rural households)",
    cloudFun: ['InvestmentFixedAssests'],
    splitList: ["固", "定", "资", "产", "投", "资", "不", "含", "农", "户", "Investment", "in", "fixed", "assets", "Excluding", "rural", "households"],
    active: false,
  }, {
    name: "nationalFinance",
    ch: "国家财政收支",
    en: "National revenue and expenditure",
    cloudFun: ['NationalRevenueExpenditure','NationalRevenueExpenditureMonth'],
    splitList: ["国", "家", "财", "政", "收", "支", "National", "revenue", "and", "expenditure"],
    active: false,
  }, {
    name: "moneySupply",
    ch: "货币供应量 (M2)",
    en: "Money supply (M2)",
    cloudFun: ['MoneySupply'],
    splitList: ["货", "币", "供", "应", "量", "M2", "Money", "supply", "(M2)"],
    active: false,
  }, {
    name: "foreignCurrencyReserves",
    ch: "国家外汇储备",
    en: "Foreign exchange reserves",
    cloudFun: ['ForeignCurrencyReserve'],
    splitList: ["国", "家", "外", "汇", "储", "备", "Foreign", "currency", "reserves"],
    active: false,
  }
];
let getsearchMenuLists = function () {
  let menu2Nav = [];
  let allMenu1Nav = [];
  let MenuLists = JSON.parse(JSON.stringify(foreignCapitalMenuLists));
  let MenuListsTrade = JSON.parse(JSON.stringify(foreignTradeMenuLists));
  let MenuListSeconomic = JSON.parse(JSON.stringify(economicIndicatorsMenuLists));
  allMenu1Nav = [...MenuLists, ...MenuListsTrade];
  allMenu1Nav.map(async (item) => {
    if (item.children) {
      menu2Nav = [...menu2Nav, ...item.children]
    }
  });
  menu2Nav = [...menu2Nav, ...MenuListSeconomic];
  return menu2Nav;
}
let searchMenuLists = getsearchMenuLists();


export { foreignCapitalMenuLists, foreignTradeMenuLists, searchMenuLists, economicIndicatorsMenuLists };
