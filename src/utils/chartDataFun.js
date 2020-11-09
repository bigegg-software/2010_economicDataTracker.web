import Parse from '../request'
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
    exportData:async function(fileName,tHeader,filterVal,tableData){
                let { export_json_to_excel } = require('@/vendor/Export2Excel');
                let data = await this.formatJson(filterVal, tableData);
                export_json_to_excel({header:tHeader, data, filename:fileName});
        },
        formatJson:async function(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        }
}
