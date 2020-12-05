let foreignCapitalMenuLists = [  //外资模块
  {
    name: "outBound",
    ch: "中国对外投资",
    en: "China's outbound investment",
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
        ch: " 中国对“一带一路”沿线国家投资",
        en: "FDI outflows in Belt and Road Initiative (BRI) countries",
        cloudFun: ['FDIOutflowsBRICountry'],
        splitList: ['中', '国', '对', '一', '带', '一', '路', '沿', '线', '国', '家', '投', '资', 'FDI', 'outflows', 'in', 'Belt ', 'and', 'Road', 'Initiative', 'BRI', 'countries'],
        active: false,
        isIndent: true
      },
      {
        name: "overseasProjects",
        ch: "中国对外承包工程",
        en: "Overseas projects",
        cloudFun: ['ForeignContract', 'ForeignContractAnnualRank', 'ForeignContractNewConRank'],
        splitList: ['中', '国', '对', '外', '承', '包', '工', '程', 'Overseas', 'projects'],
        active: false,
        isIndent: true
      },
      {
        name: "internationalLabor",
        ch: "中国对外劳务合作",
        en: "International labor",
        cloudFun: ['LaborServiceCooperation', 'LaborServiceTop10AnnualRank', 'LaborServiceIndustry'],
        splitList: ['中', '国', '对', '外', '劳', '务', '合', '作', 'International', 'labor'],
        active: false,
        isIndent: true
      },
      {
        name: "outstocks",
        ch: "中国对外直接投资存量",
        en: "FDI stocks",
        cloudFun: ['FDIOutflowsInflows'],
        splitList: ['中', '国', '对', '外', '直', '接', '投', '资', '存', '量', 'FDI', 'stocks'],
        active: false
      },
      {
        name: "outstocksByDestination",
        ch: "对外直接投资存量按国家和地区统计",
        en: "FDI stocks by destination",
        cloudFun: ['FDIStock', 'FDITop20Stock'],
        splitList: ['对', '外', '直', '接', '投', '资', '存', '量', '按', '国', '家', '和', '地', '区', '统', '计', 'FDI', 'stocks', 'by', 'destination'],
        active: false,
        isIndent: true
      },
    ]
  },
  {
    name: "inBound",
    ch: "外商投资中国",
    en: "China's inbound investment",
    active: false,
    children: [
      {
        name: "inflows",
        ch: "实际使用外资",
        en: "FDI inflows",
        cloudFun: ['InwardFDI'],
        splitList: ['实', '际', '使', '用', '外', '资', 'FDI', 'inflows'],
        active: false,
        isIndent: true
      },
      {
        name: "majorForeignInvestors",
        ch: "主要对华投资国家/地区",
        en: "Major foreign investors",
        cloudFun: ['MajorInvestors', 'MajorTop15Investors'],
        splitList: ['主', '要', '对', '华', '投', '资', '国', '家', '地', '区', 'Major', 'foreign', 'investors'],
        active: false,
        isIndent: true
      },
      {
        name: "foreignInvestIndustry",
        ch: "外商直接投资主要行业",
        en: "Foreign investment by industry",
        cloudFun: ['ForeignInvestmentMainIndustries'],
        splitList: ['外', '商', '直', '接', '投', '资', '主', '要', '行', '业', 'Foreign', 'investment', ' by', ' industry'],
        active: false,
        isIndent: true
      },
      {
        name: "foreignInvestTax",
        ch: "外商投资企业税收统计",
        en: "Tax revenue from foreign investment enterprises",
        cloudFun: ['ForeignInvestment'],
        splitList: ['外', '商', '投', '资', '企', '业', '税', '收', '统', '计', 'Tax', 'revenue', 'from', 'foreign ', 'investment', 'enterprises'],
        active: false,
        isIndent: true
      },
      {
        name: "beltAndRoadInvest",
        ch: "“一带一路”沿线国家对华投资情况",
        en: "Investment from Belt and Road Initiative (BRI) countries",
        cloudFun: ['BRIInvestors'],
        splitList: ['一', '带', '一', '路', '沿', '线', '国', '家', '对', '华', '投', '资', '情', '况', 'Investment', 'from', 'Belt', 'and', 'Road', 'Initiative', 'BRI', 'countries'],
        active: false,
        isIndent: true
      }
    ]
  },
  {
    name: "twoWayInvestment",
    ch: "双向直接投资",
    en: "FDI outflows vs. inflows",
    active: false,
    children: [
      {
        name: "outflowsVsInflows",
        ch: "双向直接投资",
        en: "FDI outflows vs. inflows",
        cloudFun: ['FDIOutflowsInflows', 'FDIOutflow', 'InwardFDI'],
        splitList: ['双', '向', '直', '接', '投', '资', 'China', 'FDI', 'outflows', 'vs', 'inflows'],
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
        cloudFun: [],//所需的数据库表名
        splitList: ['中', '国', '货', '物', '进', '出', '口', '总', '值', 'Total', 'trade', 'volume', 'of', 'goods'],
        active: false,
      },
      {
        name: "goodsByOrigin",
        ch: "货物进出口总值按国别/地区统计",
        en: "Import and export by origin",
        cloudFun: [],
        splitList: ['货', '物', '进', '出', '口', '总', '值', '按', '国', '别', '地', '区', '统', '计', 'Import', 'and', 'export', 'by', 'origin'],
        active: false,
      },
      {
        name: "goodsByCommodity",
        ch: "货物进出口总值按商品类别统计",
        en: "Import and export by commodity",
        cloudFun: [],
        splitList: ['货', '物', '进', '出', '口', '总', '值', '按', '商', '品', '类', '别', '统', '计', 'Import', 'and', 'export', 'by', 'commodity'],
        active: false,
      },
      {
        name: "goodsByEnterpriseType",
        ch: "货物进出口按企业性质统计",
        en: "Import and export by enterprise type",
        cloudFun: [],
        splitList: ['货', '物', '进', '出', '口', '按', '企', '业', '性', '质', '统', '计', 'Import', 'and', 'export', 'by', 'enterprise', 'type'],
        active: false,
      }, {
        name: "goodsByCustomRegime",
        ch: "货物进出口总值按贸易方式统计",
        en: "Import and export by custom regime",
        cloudFun: [],
        splitList: ["货", "物", "进", "出", "口", "总", "值", "按", "贸", "易", "方", "式", "统", "计", "Import", "and", "export", "by", "custom", "regime"],
        active: false,
      }, {
        name: "foreignInvestedEnterprises",
        ch: "外商投资企业进出口总值",
        en: "Trade volume of foreign-invested enterprises",
        cloudFun: [],
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
        cloudFun: [],
        splitList: ["中", "国", "服", "务", "贸", "易", "进", "出", "口", "总", "值", "Total", "trade", "volume", "of", "services"],
        active: false,
      },
      {
        name: "serviceType",
        ch: "服务贸易分类统计",
        en: "Trade volume by service type",
        cloudFun: [],
        splitList: ["服", "务", "贸", "易", "分", "类", "统", "计", "Trade", "volume", "by", "service", "type"],
        active: false,
      },
    ]
  }
];
let getsearchMenuLists = function () {
  let menu2Nav = [];
  let allMenu1Nav = [];
  let MenuLists = JSON.parse(JSON.stringify(foreignCapitalMenuLists));
  let MenuListsTrade = JSON.parse(JSON.stringify(foreignTradeMenuLists));
  allMenu1Nav = [...MenuLists, ...MenuListsTrade];
  allMenu1Nav.map(async (item) => {
    if (item.children) {
      menu2Nav = [...menu2Nav, ...item.children]
    }
  });
  return menu2Nav;
}
let searchMenuLists = getsearchMenuLists();
console.log(searchMenuLists)


export { foreignCapitalMenuLists, foreignTradeMenuLists, searchMenuLists };
