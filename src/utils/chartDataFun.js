import dayjs from 'dayjs';
import Parse from '../request'
import store from '@/vuexStore'
import {foreignCapitalMenuLists} from '@/utils/menuSearchConfigs'
export default {
    // 获取年度最大值最小值
    getMaxMinDate: async  (tableName)=> {
        let res = await Parse.Cloud.run('getMinMaxYears', {tableName});
        // console.log(res)
        if (res.code == 200) {
            return `${res.data[0].min}_${res.data[0].max}`
        }
    },
    objArrtransArr:async (arr, oldname, oldnum)=> { //处理熟路获取echarts格式数据 //横轴名称数组 纵轴数据数组
        // nameArr内部存储柱状图折线图y轴名称信息
        var nameArr = [];
        //numArr为柱状图折线图serice的data数据
        var numArr = [];
        arr.forEach(item => {
          nameArr.push(item[oldname]);
          numArr.push(item[oldnum]);
        });
        return { nameArr, numArr };
      },
    getXRange:async (aug)=> { //创建横轴名称
        let newXName = [];
        for (let i = 0; i <= Number(aug.end) - Number(aug.start); i++) {
            if(aug.type=='yearly'){
                newXName.push(Number(aug.start) + i);
            }else if (aug.type=='quarterly'){
                for(let u=1; u<=4;u++){
                    newXName.push(`${Number(aug.start) + i}.Q${u}`);   
                }
            }else if(aug.type=='monthly') {
                   for(let u=1; u<=12;u++){
                    newXName.push(`${Number(aug.start) + i}.${String(u).length==1?'0'+u:u}`);   
                } 
            }
        }
        if(aug.type=='quarterly'){ // 删除季度多余部分
            newXName=newXName.slice((aug.startMonth/3)-1,newXName.length-(4-(aug.endMonth/3)));
        }
        if(aug.type=='monthly'){ // 删除月多余部分
            newXName=newXName.slice(aug.startMonth-1,newXName.length-(12-aug.endMonth));
        }
        return newXName;
    },
     addOtherCategory:async (data)=> { //添加合并成新的字段  季度时Q   月度M
         data.forEach(item => {
             if(item['month']%3==0){
                item.Q=`${item['year']}.Q${item['month']/3}`; 
             }
            item.M=`${item['year']}.${String(item['month']).length==1?'0'+item['month']:item['month']}`
         });
    },
    completionDate:async (sourceData, range)=> {  //补全数据
        // console.log(sourceData,range)
        let newDate = [];
        for (let i = 0; i < range.length; i++) {
            if(sourceData.nameArr.indexOf(range[i])>-1){
                let index=sourceData.nameArr.indexOf(range[i]);
                newDate.push(sourceData.numArr[index]);
            }else{
                newDate.push('');
            }
        }
        return newDate;
    },
    randomColor(num) { //随机生成颜色
        let colors=[]
            for (let i = 0; i < num; i++) {
                let r = Math.floor(Math.random()*255)
                let g = Math.floor(Math.random()*255)
                let b = Math.floor(Math.random()*255)
                colors.push("rgb("+r+','+g+','+b+")");
            }
            return colors;
    },
    industry:()=> { //固定的18个行业
       let industrys=[
            {en:'Education',ch:'教育'},
            {en:'Manufacturing',ch:'制造业'},
            {en:'Agriculture',ch:'农林牧渔业'},
            {en:'Mining',ch:'采矿业'},
            {en:'Energy',ch:'能源业'},
            {en:'Construction',ch:'建筑业'},
            {en:'Retail & wholesale',ch:'批发和零售业'},
            {en:'Transportation',ch:'运输业'},
            {en:'Hospitality',ch:'住宿和餐饮业'},
            {en:'IT',ch:'信息技术'},
            {en:'Finance',ch:'金融业'},
            {en:'Real estate',ch:'房地产业'},
            {en:'Business service',ch:'商务服务业'},
            {en:'Science & technology',ch:'科学技术'},
            {en:'Environment',ch:'环境'},
            {en:'Residential services',ch:'居民服务业'},
            {en:'Healthcare',ch:'医疗卫生'},
            {en:'Entertainment ',ch:'文娱业'},
            {en:'Social work',ch:'社会组织'}
           ]
           industrys = industrys.map( item=>{
            item.searchArr= [...item.ch.split(''),...item.en.split(' ')];
            item.checked=false;
            item.show=true;
            return item;
        });
           return industrys;
    },
    // 获取行业
    getServerIndustry:async ()=> {
        let industrys = new Parse.Query('Industry');
        industrys = await industrys.map( item=>{
            item=item.toJSON();
            item.ch=item.industryZH;
            item.en=item.industryEN;
            item.searchArr= [...item.industryZH.split(''),...item.industryEN.split(' ')];
            item.checked=false;
            item.show=true;
            return item;
        });
        return industrys;
    },
    // 获取表中最新更新时间
    getLatestTime:async (tableName)=> {
        let q = new Parse.Query('News');
            q.equalTo('tableName',tableName);
            let res=await q.find();
            if(res.length){
                res = res.map( item=>{
                    item=item.toJSON();
                    return item;
                });
                store.commit('saveLatestTime',dayjs(res[0].checkDate.iso).format('YYYY-MM-DD HH:mm:ss'));
                return res[0].checkDate.iso;
            }else{
                store.commit('saveLatestTime','');
                return ''
            }
        // return dayjs(res[0].checkDate.iso).format('YYYY-MM-DD HH:mm:ss');
    },
    //获取News表中三天内的更新数据
    getInThreeDays:async function(p_count) {
        let q = new Parse.Query('News');
        q.descending('checkDate');
         let dd = new Date();
         dd.setDate(dd.getDate()+p_count);
        let beforexDaysTime=dd.getTime();
        let res=await q.find();
            res=res.map( (item)=>{
                 item=item.toJSON();
                 return item;
            });
            res=res.filter((it)=>{
                return dayjs(it.checkDate.iso).valueOf()>beforexDaysTime;
            });
        
             let classArr=await this.produceNewArray(res);
             let minix= JSON.parse(JSON.stringify(await this.getAllMenuItem()));
            //  存放所有已经加入到最新通知里的菜单
             let allreadySetMenus=[];
             for(let i=0; i<classArr.length;i++){
                 let menuItems=[];
                 let calssNames=classArr[i].childrenList;
                for(let p=0;p<minix.length;p++){
                    let ev=minix[p];
                    for(let k=0;k<ev.cloudFun.length;k++){
                        let t=ev.cloudFun[k];
                        if(calssNames.includes(t)){
                          // 判断当前菜单是否已经存在最新通知里了不存在才插入到最新通知的菜单里
                            let haveThis=false;
                            allreadySetMenus.forEach((op)=>{
                                if(op.name==ev.name){
                                    haveThis=true;
                                }
                            });
                            if(!haveThis){
                                menuItems.push(ev);
                                allreadySetMenus.push(ev);
                                break; 
                            }
                        }
                    }
                }
                 classArr[i].menus=menuItems;
             }
             classArr.allreadySetMenus=allreadySetMenus;
             store.commit('saveLatestNews',classArr);
            return classArr;
    },
    // 纵向二级菜单合并
    getAllMenuItem:async function() {
        let arr=[];
         foreignCapitalMenuLists.forEach((item)=>{
               if(item.children){
                   arr=[...arr,...item.children]
               }
         });
         return arr;
    },
    // 更新的表按天分组
    produceNewArray : async function(arr){
        let newArr = []
        arr && arr.forEach((item, i) => {
                let index = -1
                let alreadyExists = newArr.some((newItem, j) => {
                    if(dayjs(item.checkDate.iso).format('YYYY-MM-DD') === dayjs(newItem.activityTime).format('YYYY-MM-DD')) {
                        index = j
                        return true
                    }
                })
                if(!alreadyExists) {
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
    exportData:async function(fileName,tHeader,filterVal,tableData){
                let { export_json_to_excel } = require('@/vendor/Export2Excel');
                let data = await this.formatJson(filterVal, tableData);
                export_json_to_excel({header:tHeader, data, filename:fileName});
        },
    formatJson:async function(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 转表格所需格式
    conversionTable: function(tableTitle,tableData) {
        let res=[];
        tableData.forEach(item => {
            let itemObj={};
            for(let i in tableTitle){
                itemObj[i]={
                       text:item[i]?item[i]+'_':'',
                       width:tableTitle[i].width
                     }
            } 
            res.push(itemObj);
        });
        return res;
    }
}
