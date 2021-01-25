import dayjs from 'dayjs';
import Parse from '../request'
import store from '@/vuexStore'
import {
  foreignCapitalMenuLists,
  foreignTradeMenuLists,
  economicIndicatorsMenuLists
} from '@/utils/menuSearchConfigs'
export default {
  // 获取年度最大值最小值
  getMaxMinDate: async (tableName,flag=undefined) => {
    let res = await Parse.Cloud.run('getMinMaxYears', {
      tableName,
      flag
    });
    // console.log(res)
    if (res.code == 200) {
      // return `${res.data[0].min}_${res.data[0].max}`
      return {Y:`${res.data[0].min}_${res.data[0].max}`,M:`${res.data[0].minMonth}_${res.data[0].maxMonth}`}
    }
  },
  //计算有月份时数据库最大最小季度和月度
  getQMDefaultTime(currentY = dayjs().format('YYYY'),currentM=dayjs().format('M'), beforeY = 1) {
    currentY = currentY.toString();
    let dateRes = {
      Q: {
        start: '',
        end: ''
      },
      M: {
        start: '',
        end: ''
      }
    }
    let currentTime = new Date();
    // 计算当前月份对应的季度月份
    let currentQ = Math.ceil(currentM / 3) * 3;
    if (currentQ < 10) {
      currentQ = '0' + currentQ;
    }
    let current0M=dayjs().set('month',currentM-1).format('MM');
    console.log(current0M)
    dateRes.Q.start = dayjs(currentY).format('YYYY') - beforeY + '-' + currentQ;
    dateRes.Q.end = dayjs(currentY).format('YYYY') + '-' + currentQ;
    dateRes.M.start = dayjs(currentY).format('YYYY') - beforeY + '-' + current0M;
    dateRes.M.end = dayjs(currentY).format('YYYY') + '-' + current0M;
    let end = dayjs().set('year', dayjs(currentY).format('YYYY'))
    end = end.set('month', current0M - 6)
    dateRes.M.start_beforeSix = end.format('YYYY-MM')
    return dateRes;
  },
  //没月份时计算数据库最大季度和最小季度  数据库季度是按1234记录
  async getQNoMonthDefaultTime(tableName) {
       let res = await Parse.Cloud.run('getMinMaxYears', {
      tableName
    });
      res = res.data[0];
      let qMax = new Parse.Query(tableName);
      let limiCcount = await qMax.count();
      qMax.limit(limiCcount);
      qMax.equalTo('year', res.max)
      qMax.descending('quarter');
      let max = await qMax.find()
      max = max.map(v => v.toJSON())
      // 
      let qMin = new Parse.Query(tableName);
      let limtMincount = await qMin.count();
      qMin.limit(limtMincount);
      qMin.equalTo('year', res.min)
      qMin.ascending('quarter');
      let min = await qMin.find()
      min = min.map(v => v.toJSON())
      return {
        max: res.max,  //最大年
        min: res.min,  //最小年
        maxQuarter: max[0].quarter, //最大季度
        minQuarter: min[0].quarter,  //最小季度
        minQM:min[0].quarter*3,  //最小季度对应的月份（不带前缀0）
        maxQM:max[0].quarter*3,  ////最大季度对应的月份（不带前缀0）
        maxQuarterMonth: max[0].quarter*3>10?`${max[0].quarter*3}`:`0${max[0].quarter*3}`,//最大季度对应的月份（带前缀0的情况）
        minQuarterMonth:min[0].quarter*3>10?`${min[0].quarter*3}`:`0${min[0].quarter*3}`//最小季度对应的月份（带前缀0的情况）
      }
  },
  objArrtransArr: async (arr, oldname, oldnum) => { //处理熟路获取echarts格式数据 //横轴名称数组 纵轴数据数组
    // nameArr内部存储柱状图折线图y轴名称信息
    var nameArr = [];
    //numArr为柱状图折线图serice的data数据
    var numArr = [];
    arr.forEach(item => {
      nameArr.push(item[oldname]);
      numArr.push(item[oldnum]);
    });
    return {
      nameArr,
      numArr
    };
  },
  getXRangeMC: async (aug) => { //创建横轴名称
    let newXName = [];
    for (let i = 0; i <= Number(aug.end) - Number(aug.start); i++) {
      if (aug.type == 'yearly') {
        newXName.push(Number(aug.start) + i);
      } else if (aug.type == 'quarterly') {
        for (let u = 1; u <= 4; u++) {
          newXName.push(`${Number(aug.start) + i}.Q${u}`);
        }
      } else if (aug.type == 'monthly') {
        for (let u = 1; u <= 12; u++) {
          //原来是2020.01、2020.02    // newXName.push(`${Number(aug.start) + i}.${String(u).length == 1 ? '0' + u : u}`);
          // newXName.push(`${Number(aug.start) + i}.1-${u}`); // 现在是2020.1-1 ，2020.1-2
          let uu = u < 10 ? `0${u}` : u
          newXName.push(`${Number(aug.start) + i}.${uu}`); // 现在是2020.01 ，2020.12
        }
      }
    }
    if (aug.type == 'quarterly') { // 删除季度多余部分
      newXName = newXName.slice(aug.startQuarter - 1, newXName.length - (4 - aug.endQuarter));
    }
    if (aug.type == 'monthly') { // 删除月多余部分
      newXName = newXName.slice(aug.startMonth - 1, newXName.length - (12 - aug.endMonth));
    }
    return newXName;
  },
  addOtherCategoryMC: async (data) => { //添加合并成新的字段  季度时Q   月度M
    data.forEach(item => {
      item.Q = `${item['year']}.Q${item.quarter}`;
      item.M = `${item['year']}.${item['month']<10?'0'+item['month']:item['month']}`;
      // item.M = `${item['year']}.1-${item['month']}`;
    });
  },
  getXRange: async (aug) => { //创建横轴名称
    let newXName = [];
    for (let i = 0; i <= Number(aug.end) - Number(aug.start); i++) {
      if (aug.type == 'yearly') {
        newXName.push(Number(aug.start) + i);
      } else if (aug.type == 'quarterly') {
        for (let u = 1; u <= 4; u++) {
          newXName.push(`${Number(aug.start) + i}.Q${u}`);
        }
      } else if (aug.type == 'monthly') {
        for (let u = 1; u <= 12; u++) {
          //原来是2020.01、2020.02    // newXName.push(`${Number(aug.start) + i}.${String(u).length == 1 ? '0' + u : u}`);
          newXName.push(`${Number(aug.start) + i}.1-${u}`); // 现在是2020.1-1 ，2020.1-2
        }
      }
    }
    if (aug.type == 'quarterly') { // 删除季度多余部分
      newXName = newXName.slice((aug.startMonth / 3) - 1, newXName.length - (4 - (aug.endMonth / 3)));
    }
    if (aug.type == 'monthly') { // 删除月多余部分
      newXName = newXName.slice(aug.startMonth - 1, newXName.length - (12 - aug.endMonth));
    }
    return newXName;
  },
  getXRangeCurrentMonth: async (aug) => { //创建横轴名称
    let newXName = [];
    for (let i = 0; i <= Number(aug.end) - Number(aug.start); i++) {
      if (aug.type == 'yearly') {
        newXName.push(Number(aug.start) + i);
      } else if (aug.type == 'quarterly') {
        for (let u = 1; u <= 4; u++) {
          newXName.push(`${Number(aug.start) + i}.Q${u}`);
        }
      } else if (aug.type == 'monthly') {
        for (let u = 1; u <= 12; u++) {
          let uu = u < 10 ? `0${u}` : u
          newXName.push(`${Number(aug.start) + i}.${uu}`); // 现在是2020.01 ，2020.12
        }
      }
    }
    if (aug.type == 'quarterly') { // 删除季度多余部分
      newXName = newXName.slice((aug.startMonth / 3) - 1, newXName.length - (4 - (aug.endMonth / 3)));
    }
    if (aug.type == 'monthly') { // 删除月多余部分
      newXName = newXName.slice(aug.startMonth - 1, newXName.length - (12 - aug.endMonth));
    }
    return newXName;
  },
  addOtherCategory: async (data) => { //添加合并成新的字段  季度时Q   月度M
    data.forEach(item => {
      if (item['month'] % 3 == 0) {
        item.Q = `${item['year']}.Q${item['month'] / 3}`;
      }
      //原来是2020.01、2020.02    // item.M = `${item['year']}.${String(item['month']).length == 1 ? '0' + item['month'] : item['month']}`
      item.M = `${item['year']}.1-${item['month']}` // 现在是2020.1-1 ，2020.1-2
    });
  },
  addOtherCategoryCurrentMonth: async (data) => { //添加合并成新的字段  季度时Q   月度M
    data.forEach(item => {
      if (item['month'] % 3 == 0) {
        item.Q = `${item['year']}.Q${item['month'] / 3}`;
      }
      //原来是2020.01、2020.02    // item.M = `${item['year']}.${String(item['month']).length == 1 ? '0' + item['month'] : item['month']}`
      let m = item['month'] < 10 ? `0${item['month']}` : item['month']
      item.M = `${item['year']}.${m}` // 现在是2020.1-1 ，2020.1-2
    });
  },
  completionDate: async (sourceData, range) => { //补全数据
    // console.log(sourceData,range)
    let newDate = [];
    for (let i = 0; i < range.length; i++) {
      if (sourceData.nameArr.indexOf(range[i]) > -1) {
        let index = sourceData.nameArr.indexOf(range[i]);
        // || sourceData.numArr[index]=='0'  新加当数据库数据是0时展示0
        newDate.push(sourceData.numArr[index] || sourceData.numArr[index]=='0' ? sourceData.numArr[index] : '');
      } else {
        newDate.push('');
      }
    }
    return newDate;
  },
  randomColor(num) { //随机生成颜色
    let colors = []
    for (let i = 0; i < num; i++) {
      let r = Math.floor(Math.random() * 255)
      let g = Math.floor(Math.random() * 255)
      let b = Math.floor(Math.random() * 255)
      colors.push("rgb(" + r + ',' + g + ',' + b + ")");
    }
    return colors;
  },
  industry: () => { //固定的18个行业
    let industrys = [{
        en: 'Education',
        ch: '教育'
      },
      {
        en: 'Manufacturing',
        ch: '制造业'
      },
      {
        en: 'Agriculture',
        ch: '农林牧渔业'
      },
      {
        en: 'Mining',
        ch: '采矿业'
      },
      {
        en: 'Energy',
        ch: '能源业'
      },
      {
        en: 'Construction',
        ch: '建筑业'
      },
      {
        en: 'Retail & wholesale',
        ch: '批发和零售业'
      },
      {
        en: 'Transportation',
        ch: '运输业'
      },
      {
        en: 'Hospitality',
        ch: '住宿和餐饮业'
      },
      {
        en: 'IT',
        ch: '信息技术'
      },
      {
        en: 'Finance',
        ch: '金融业'
      },
      {
        en: 'Real estate',
        ch: '房地产业'
      },
      {
        en: 'Business service',
        ch: '商务服务业'
      },
      {
        en: 'Science & technology',
        ch: '科学技术'
      },
      {
        en: 'Environment',
        ch: '环境'
      },
      {
        en: 'Residential services',
        ch: '居民服务业'
      },
      {
        en: 'Healthcare',
        ch: '医疗卫生'
      },
      {
        en: 'Entertainment ',
        ch: '文娱业'
      },
      {
        en: 'Social work',
        ch: '社会组织'
      }
    ]
    industrys = industrys.map(item => {
      item.searchArr = [...item.ch.split(''), ...item.en.split(' ')];
      item.checked = false;
      item.show = true;
      return item;
    });
    return industrys;
  },
  // 获取行业
  getServerIndustry: async () => {
    let industrys = new Parse.Query('Industry');
    industrys = await industrys.map(item => {
      item = item.toJSON();
      item.ch = item.industryZH;
      item.en = item.industryEN;
      item.searchArr = [...item.industryZH.split(''), ...item.industryEN.split(' ')];
      item.checked = false;
      item.show = true;
      return item;
    });
    return industrys;
  },
  // 获取表中最新更新时间
  getLatestTime: async (tableName) => {
    let q = new Parse.Query('News');
    q.equalTo('tableName', tableName);
    let res = await q.find();
    if (res.length) {
      res = res.map(item => {
        item = item.toJSON();
        return item;
      });
      store.commit('saveLatestTime', dayjs(res[0].checkDate.iso).format('YYYY-MM-DD HH:mm:ss'));
      return res[0].checkDate.iso;
    } else {
      store.commit('saveLatestTime', '');
      return ''
    }
    // return dayjs(res[0].checkDate.iso).format('YYYY-MM-DD HH:mm:ss');
  },
  //获取News表中三天内的更新数据
  getInThreeDays: async function (p_count) {
    let q = new Parse.Query('News');
    q.descending('checkDate');
    let dd = new Date();
    dd.setDate(dd.getDate() + p_count);
    let beforexDaysTime = dd.getTime();
    let res = await q.find();
    res = res.map((item) => {
      item = item.toJSON();
      return item;
    });
    res = res.filter((it) => {
      return dayjs(it.checkDate.iso).valueOf() > beforexDaysTime;
    });

    let classArr = await this.produceNewArray(res);
    let minix = JSON.parse(JSON.stringify(await this.getAllMenuItem()));
    //  存放所有已经加入到最新通知里的菜单
    let allreadySetMenus = [];
    for (let i = 0; i < classArr.length; i++) {
      let menuItems = [];
      let calssNames = classArr[i].childrenList;
      for (let p = 0; p < minix.length; p++) {
        let ev = minix[p];
        for (let k = 0; k < ev.cloudFun.length; k++) {
          let t = ev.cloudFun[k];
          if (calssNames.includes(t)) {
            // 判断当前菜单是否已经存在最新通知里了不存在才插入到最新通知的菜单里
            let haveThis = false;
            allreadySetMenus.forEach((op) => {
              if (op.name == ev.name) {
                haveThis = true;
              }
            });
            if (!haveThis) {
              menuItems.push(ev);
              allreadySetMenus.push(ev);
              break;
            }
          }
        }
      }
      classArr[i].menus = menuItems;
    }
    classArr.allreadySetMenus = allreadySetMenus;
    store.commit('saveLatestNews', classArr);
    return classArr;
  },
  // 纵向二级菜单合并
  getAllMenuItem: async function () {
    let arr = [];
    // 外资抽离二级菜单
    foreignCapitalMenuLists.forEach((item) => {
      if (item.children) {
        arr = [...arr, ...item.children]
      }
    });
    // 外贸抽离二级菜单
    foreignTradeMenuLists.forEach((item) => {
      if (item.children) {
        arr = [...arr, ...item.children]
      }
    });
    // 合并宏观经济的二级菜单
    arr = [...arr, ...economicIndicatorsMenuLists];
    return arr;
  },
  // 更新的表按天分组
  produceNewArray: async function (arr) {
    let newArr = []
    arr && arr.forEach((item, i) => {
      let index = -1
      let alreadyExists = newArr.some((newItem, j) => {
        if (dayjs(item.checkDate.iso).format('YYYY-MM-DD') === dayjs(newItem.activityTime).format('YYYY-MM-DD')) {
          index = j
          return true
        }
      })
      if (!alreadyExists) {
        newArr.push({
          activityTime: dayjs(item.checkDate.iso).format('YYYY-MM-DD'),
          childrenList: [
            item.tableName
          ]
        })
      } else {
        newArr[index].childrenList.push(item.tableName)
      }
    });
    return newArr;
  },
  // 导出excel
  exportData: async function (fileName, tHeader, filterVal, tableData) {
    let {
      export_json_to_excel
    } = require('@/vendor/Export2Excel');
    let data = await this.formatJson(filterVal, tableData);
    export_json_to_excel({
      header: tHeader,
      data,
      filename: fileName
    });
  },
  formatJson: async function (filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  },
  // 转表格所需格式
  formatNum(value) {
    // let strs = value.toFixed(1);
    let strs = (Math.round(value*10)/10).toFixed(1)
    return strs && strs.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ",");
  },
  formatPer(value) {
    // let strs = value.toFixed(1);
    let strs = (Math.round(value*10)/10).toFixed(1)
    let res = strs + '%'
    return res;
  },
  //转换成整数
  formatInt(value) {
    return value && value.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  },
  conversionTable: function (tableTitle, tableData) {
    let res = [];
    tableData.forEach(item => {
      let itemObj = {};
      for (let i in tableTitle) {
        if ('formatNum' in tableTitle[i]) {
          itemObj[i] = {
            text: item[i]||item[i]=='0' ? (this.formatNum(item[i])) + '_' : '',
            width: tableTitle[i].width
          }
        } else if ('formatPer' in tableTitle[i]) {
          itemObj[i] = {
            text: item[i]||item[i]=='0' ? (this.formatPer(item[i])) + '_' : '',
            width: tableTitle[i].width
          }
        } else if ('formatInt' in tableTitle[i]) {
          itemObj[i] = {
            text: item[i]||item[i]=='0' ? (this.formatInt(item[i])) + '_' : '',
            width: tableTitle[i].width
          }
        } else {
          itemObj[i] = {
            text: item[i]||item[i]=='0' ? item[i] + '_' : '',
            width: tableTitle[i].width
          }
        }
      }
      res.push(itemObj);
    });
    return res;
  },
  category: () => { // 外贸 商品类别
    let category = [{
        en: 'Animal products',
        ch: '动物产品'
      },
      {
        en: 'Vegetable products',
        ch: '植物产品'
      },
      {
        en: 'Animal & vegetable oils, fats, waxes',
        ch: '动植物油、脂、蜡'
      },
      {
        en: 'Prepared food, beverages & tobacco',
        ch: '食品、饮料、烟草'
      },
      {
        en: 'Mineral products',
        ch: '矿产品'
      },
      {
        en: 'Chemical products',
        ch: '化工产品'
      },
      {
        en: 'Plastics & rubber',
        ch: '塑料及橡胶制品'
      },
      {
        en: 'Leather products',
        ch: '皮革制品'
      },
      {
        en: 'Wood & straw products',
        ch: '木与编结品'
      },
      {
        en: 'Paper products',
        ch: '纸制品'
      },
      {
        en: 'Textiles',
        ch: '纺织品'
      },
      {
        en: 'Footware, headgear, umbrellas & feather products',
        ch: '鞋、帽、伞、羽毛制品'
      },
      {
        en: 'Stone & glass products',
        ch: '石头与玻璃制品'
      },
      {
        en: 'Pearls, precious stones & metals',
        ch: '珍珠、宝石、贵金属制品'
      },
      {
        en: 'Base metal products',
        ch: '贱金属制品'
      },
      {
        en: 'Machinery & appliances',
        ch: '机械设备'
      },
      {
        en: 'Transport equipment',
        ch: '车船航空设备'
      },
      {
        en: 'Optical instruments, clocks & musical instruments ',
        ch: '光学设备、钟表、乐器'
      },
      {
        en: 'Arms & ammunition',
        ch: '武器弹药'
      },
      {
        en: 'Miscellaneous',
        ch: '杂项制品'
      },
      {
        en: 'Art & antiques',
        ch: '艺术收藏品'
      },
      {
        en: 'Unclassified commedities',
        ch: '未分类商品'
      },
    ]
    return category;
  },
  enterpriseType: () => { // 外贸 商品类别
    return [{
        en: 'State-owned enterprises',
        ch: '国有企业',
        id: 1
      },
      {
        en: 'Foreign-invested enterprises',
        ch: '外商投资企业',
        id: 2
      },
      {
        en: 'Private-owned enterprises',
        ch: '私营企业',
        id: 3
      },
      {
        en: 'Other enterprises',
        ch: '其他',
        id: 4
      }
    ]
  },
  customRegime: () => { // 外贸 贸易方式
    return [{
        en: 'Ordinary trade',
        ch: '一般贸易',
      },
      {
        en: 'International aid',
        ch: '国家间、国际组织无偿援助和赠送的物资',
      },
      {
        en: 'Other donation',
        ch: '其他捐赠物资',
      },
      {
        en: 'Processing & assembling',
        ch: '来料加工装配贸易',
      },
      {
        en: 'Processing with imported materials',
        ch: '进料加工贸易',
      },
      {
        en: 'Border trade',
        ch: '边境小额贸易 ',
      },
      {
        en: 'Equipment for processing trade',
        ch: '加工贸易进口设备 ',
      },
      {
        en: 'Contracting projects',
        ch: '对外承包工程出口货物',
      },
      {
        en: 'Goods on lease',
        ch: '租赁贸易',
      },
      {
        en: 'Equipment or materials imported as investment by foreign-invested enterprises',
        ch: '外商投资企业作为投资进口的设备、物品',
      },
      {
        en: 'Duty-free Goods',
        ch: '免税品',
      }, {
        en: 'Customs warehousing trade',
        ch: '保税监管场所进出境货物 ',
      }, {
        en: 'Logistics goods by customs special control area',
        ch: '海关特殊监管区域物流货物',
      }, {
        en: 'Equipment imported into customs special control area',
        ch: '海关特殊监管区域进口设备',
      }, {
        en: 'Other',
        ch: '其他',
      }
    ]
  },
  tradeServiceIndustry: () => { // 外贸 行业
    return [{
        en: 'Manufacturing services',
        ch: '实物投入的制造服务',
      },
      {
        en: 'Maintenance & repair',
        ch: '维护与修理',
      },
      {
        en: 'Transport',
        ch: '运输业',
      },
      {
        en: 'Travel',
        ch: '旅游业',
      },
      {
        en: 'Construction',
        ch: '建筑业',
      },
      {
        en: 'Insurance & pension',
        ch: '保险业',
      },
      {
        en: 'Financial services',
        ch: '金融业',
      },
      {
        en: 'Intellectual property',
        ch: '知识产权费用',
      },
      {
        en: 'Telecommunications & IT',
        ch: '电信、计算机与信息服务',
      },
      {
        en: 'Business services',
        ch: '商务服务',
      },
      {
        en: 'Culture & recreation',
        ch: '个人、文化和娱乐服务',
      }, {
        en: 'Government goods & services',
        ch: '政府服务与货物',
      }, {
        en: 'Services not allocated',
        ch: '其他服务',
      },
    ]
  }
}
