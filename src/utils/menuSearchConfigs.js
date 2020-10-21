let foreignCapitalMenuLists=[  //外资模块
    {
      name: "outBound",
      ch: "中国对外投资",
      en: "China’s outbound investment",
      active: false,
      children: [
        {
          name: "outflows",
          ch: "中国对外直接投资流量",
          en: "China’s FDI outflows",
          active: false
        },
        {
          name: "outstocks",
          ch: "中国对外直接投资存量",
          en: "China’s FDI stocks",
          active: false
        },
        {
          name: "outstocksByDestination",
          ch: "中国对外直接投资存量按国家和地区统计",
          en: "China’s FDI stocks by destination",
          active: false
        },
        {
          name: "outflowsByDestination",
          ch: "中国对外直接投资流量按国家和地区统计",
          en: "China’s FDI outflows by destination",
          active: false
        },
        {
          name: "outflowsByIndustry",
          ch: "中国对外直接投资流量行业分布情况",
          en: "China’s FDI outflows by industry",
          active: false
        },
        {
          name: "outflowsBeltAndRoad",
          ch: " 中国对“一带一路”沿线国家投资情况",
          en:
            "China’s FDI outflows in Belt and Road Initiative (BRI) countries",
          active: false
        },
        {
          name: "overseasProjects",
          ch: "中国对外承包工程",
          en: "China’s overseas projects",
          active: false
        },
        {
          name: "internationalLabor",
          ch: "中国对外劳务合作",
          en: "China’s international labor",
          active: false
        }
      ]
    },
    {
      name: "inBound",
      ch: "外商投资中国",
      en: "China’s inbound investment",
      active: false,
      children: [
        {
          name: "inflows",
          ch: "实际使用外资",
          en: "China’s FDI inflows",
          active: false
        },
        {
          name: "majorForeignInvestors",
          ch: "主要对华投资国家/地区",
          en: "Major foreign investors of China",
          active: false
        },
        {
          name: "foreignInvestIndustry",
          ch: "外商直接投资主要行业",
          en: "Foreign investment to China by industry",
          active: false
        },
        {
          name: "foreignInvestTax",
          ch: "外商投资企业税收统计",
          en: "Tax revenue from foreign investment enterprises",
          active: false
        },
        {
          name: "beltAndRoadInvest",
          ch: "“一带一路”沿线国家对华投资情况",
          en: "Investment from Belt and Road Initiative (BRI) countries",
          active: false
        }
      ]
    },
    {
      name: "twoWayInvestment",
      ch: "双向直接投资",
      en: "China’s FDI outflows vs. inflows",
      active: false,
      children: [
        {
          name: "outflowsVsInflows",
          ch: "双向直接投资",
          en: "China’s FDI outflows vs. inflows",
          active: false
        }
      ]
    }
  ];
  let searchMenuLists=[
    //   中国对外投资
        {
            name: "outflows",
            ch: "中国对外直接投资流量",
            en: "China’s FDI outflows",
            splitList:['中','国','对','外','直','接','投','资','流','量','China','China’s','FDI','outflows'],
            active: false
          },
          {
            name: "outstocks",
            ch: "中国对外直接投资存量",
            en: "China’s FDI stocks",
            splitList:['中','国','对','外','直','接','投','资','存','量','China','China’s','FDI','stocks'],
            active: false
          },
          {
            name: "outstocksByDestination",
            ch: "中国对外直接投资存量按国家和地区统计",
            en: "China’s FDI stocks by destination",
            splitList:['中','国','对','外','直','接','投','资','存','量','按','国','家','和','地','区','统','计','China','China’s','FDI','stocks','by','destination'],
            active: false
          },
          {
            name: "outflowsByDestination",
            ch: "中国对外直接投资流量按国家和地区统计",
            en: "China’s FDI outflows by destination",
            splitList:['中','国','对','外','直','接','投','资','流','量','按','国','家','和','地','区','统','计','China','China’s','FDI ','outflows','by','destination'],
            active: false
          },
          {
            name: "outflowsByIndustry",
            ch: "中国对外直接投资流量行业分布情况",
            en: "China’s FDI outflows by industry",
            splitList:['中','国','对','外','直','接','投','资','流','量','行','业','分','布','情','况','China','China’s','FDI','outflows','by','industry'],
            active: false
          },
          {
            name: "outflowsBeltAndRoad",
            ch: "中国对“一带一路”沿线国家投资情况",
            en:"China’s FDI outflows in Belt and Road Initiative (BRI) countries",
            splitList:['中','国','对','一','带','一','路','沿','线','国','家','投','资','情','况','China','China’s','FDI','outflows','in','Belt ','and','Road','Initiative','BRI','countries'],
            active: false
          },
          {
            name: "overseasProjects",
            ch: "中国对外承包工程",
            en: "China’s overseas projects",
            splitList:['中','国','对','外','承','包','工','程','China','China’s','overseas','projects'],
            active: false
          },
          {
            name: "internationalLabor",
            ch: "中国对外劳务合作",
            en: "China’s international labor",
            splitList:['中','国','对','外','劳','务','合','作','China’s','China','international','labor'],
            active: false
          },
        //   外商投资中国
        {
            name: "inflows",
            ch: "实际使用外资",
            en: "China’s FDI inflows",
            splitList:['实','际','使','用','外','资','China','China’s','FDI','inflows'],
            active: false
          },
          {
            name: "majorForeignInvestors",
            ch: "主要对华投资国家/地区",
            en: "Major foreign investors of China",
            splitList:['主','要','对','华','投','资','国','家','地','区','Major','foreign','investors','of','China'],
            active: false
          },
          {
            name: "foreignInvestIndustry",
            ch: "外商直接投资主要行业",
            en: "Foreign investment to China by industry",
            splitList:['外','商','直','接','投','资','主','要','行','业','Foreign','investment','to','China',' by',' industry'],
            active: false
          },
          {
            name: "foreignInvestTax",
            ch: "外商投资企业税收统计",
            en: "Tax revenue from foreign investment enterprises",
            splitList:['外','商','投','资','企','业','税','收','统','计','Tax','revenue','from','foreign ','investment','enterprises'],
            active: false
          },
          {
            name: "beltAndRoadInvest",
            ch: "“一带一路”沿线国家对华投资情况",
            en: "Investment from Belt and Road Initiative (BRI) countries",
            splitList:['一','带','一','路','沿','线','国','家','对','华','投','资','情','况','Investment','from','Belt','and','Road','Initiative','BRI','countries'],
            active: false
          },
        //   双向直接投资
        {
        name: "outflowsVsInflows",
        ch: "双向直接投资",
        en: "China’s FDI outflows vs. inflows",
        splitList:['双','向','直','接','投','资','China','China’s','FDI','outflows','vs','inflows'],
        active: false
        }

  ]

  export {foreignCapitalMenuLists,searchMenuLists};