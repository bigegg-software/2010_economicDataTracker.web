import Parse from '../index'

function toJson(data) {
    return JSON.parse(JSON.stringify(data))
}

function changeData() {

}
export default {
    getXRange(maxmindate) {
        let arrmaxmin = maxmindate.split('_');
        let newXName = [];
        for (let i = 0; i <= Number(arrmaxmin[1]) - Number(arrmaxmin[0]); i++) {
            newXName.push(Number(arrmaxmin[0]) + i);
        }
        return newXName;
    },
    // 获取年度最大值最小值
    getMaxMinDate: async function () {
        let FDIOutflow = await Parse.Cloud.run('getMinMaxYears', { tableName: 'FDIOutflow' });
        console.log(FDIOutflow)
        if (FDIOutflow.code == 200) {
            return `${FDIOutflow.data[0].min}_${FDIOutflow.data[0].max}`
        }
    },
    getChartsData: async function (aug) {
        let FDIOutflow = await Parse.Cloud.run('getFDIOutflowInfo', { type: aug.type, start: aug.start, end: aug.end });
        if (FDIOutflow.code == 200) {
            // this.completionDate(FDIOutflow.data.allIndustry,range);
            return FDIOutflow.data;
        }

        // return res;
    },
    completionDate(sourceData, range) {
        let newDate = [];
        for (let i = 0; i < range.length; i++) {
            for (let v = 0; v < sourceData.nameArr.length; v++) {
                let item = sourceData.nameArr[v];
                if (range[i] == item) {
                    newDate.push(sourceData.numArr[v]);
                } else {
                    newDate.push(0);
                }
            }
        }
        console.log(newDate)
    }
}
