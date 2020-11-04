import Parse from '../request'
export default {
    // 获取年度最大值最小值
    getMaxMinDate: async  (tableName)=> {
        let res = await Parse.Cloud.run('getMinMaxYears', {tableName});
        console.log(res)
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
        console.log(sourceData,range)
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
    }
}
