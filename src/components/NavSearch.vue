<template>
<div class="nav-search">
  <div class="input-block">
    <input
        v-model="name"
        type="text"
        placeholder="Keywords 关键词"
    />
    <div class="iconfont icon-search">&#xe6a6;</div>
</div>
<section class="result" v-if="name.replace(/(^\s*)/g,'')!=''">
 <template v-for="tem in menuFileList">
    <div :key="tem.name" v-if="tem.active" @click="gotoPage(tem)" class="menu-link">
        <p>{{tem.en}}</p> 
        <p>{{tem.ch}}</p> 
    </div>
 </template>
 <div v-if="name.replace(/(^\s*)/g,'')!=''&&noData">暂无数据</div>
</section>
</div>
</template>

<script>
import {searchMenuLists} from '@/utils/menuSearchConfigs.js'
export default {
    data() {
        return {
           noData:false,
           name:'',
           menuFileList:searchMenuLists,
           timer:null
        }
    },
    watch:{
        name: {
            handler(){
                clearTimeout(this.timer);
                this.timer=setTimeout(()=>{
                   this.fileDataList();
                },500);
            },
            immediate:true,
            deep:true
            
        }
    },
    methods:{
        fileDataList() {
            if(this.name.replace(/(^\s*)/g,"")==''){
                  for(let i=0; i<this.menuFileList.length; i++){
                      this.menuFileList[i].active=false;
                  }
            }else {
                // 中文两端家空格
                let p1=/([A-Za-z])((<[^<]*>)*[\u4e00-\u9fa5]+)/gi;
                this.name=this.name.replace(p1, "$1 $2");
                let p2=/([\u4e00-\u9fa5]+(<[^<]*>)*)([A-Za-z])/gi;
                this.name=this.name.replace(p2, "$1 $3");

                  //输入的字符串中文英文拆分 中文匹配到字 英文匹配到词
                 let regz=/[\u4e00-\u9fa5]/gi;
                 let reg=/\s+/;
                 let ch=this.name.match(regz)?this.name.match(regz):[];
                 let en=this.name.replace(regz,'');
                 let arr=en.split(reg);
                let arrName=Array.from(new Set([...arr,...ch]));
                // 去掉数组中的空字符串
                for(var i = 0;i<arrName.length;i++){
                    if(arrName[i]==''||arrName[i]==null||typeof(arrName[i])==undefined){
                        arrName.splice(i,1);
                        i=i-1;
                    }
                }
                 let show=true;
                for(let i=0; i<this.menuFileList.length; i++){
                      let splitList=this.menuFileList[i].splitList.join(',').toLowerCase().split(',');
                      let active=true;
                      for(let k=0;k<arrName.length;k++){
                           if(!splitList.includes(arrName[k].toLowerCase())){
                               active=false;
                           }
                      }
                      this.menuFileList[i].active=active;
                      if(this.menuFileList[i].active==true){
                          show=false;
                      }
                }
                this.noData=show;
            }
       },
       gotoPage(tem) {
             this.$router.push({name:tem.name});
             this.name='';
       }
    }
}
</script>

<style lang="less" scoped>
.nav-search{
    position: relative;
    .input-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 1.5625rem;
      height: 0.197917rem;
      font-size: 0.09375rem;
      color: #999;
      background-color: #fff;
      input {
        flex: 1;
        border: none;
        outline: none;
        padding-left: 0.05rem;
        box-sizing: border-box;
        &::-webkit-input-placeholder { /* WebKit browsers */ 
            color: #999999; 
            font-size:18px;
        } 
      }
      .icon-search {
        padding: 0 0.05rem;
      }
    }
    .result{
       background:#fff;
       position: absolute;
       right:0;
       padding:0.133333rem;
       top:0.21rem;
       min-width: 2rem;
       max-height: 4rem;
       overflow-y: auto;
       border:1px solid #eee;
       color:#999999;
       z-index: 10;
       .menu-link{
           p{   font-size: 0.104167rem;
                white-space: nowrap;
                margin-bottom:0.026667rem;
            }
            p:first-child{
               font-family:Calibri;
            }
            p:last-child{
                font-size: 0.0625rem;
               font-family:SimHei,'黑体';
            }
            &:hover{
                color:#186497;
            }
       }
       .menu-link:not(:last-child){
            border-bottom:1px solid #eee;
            margin-bottom:0.026667rem;
            cursor: pointer;
        }
       
    }
}
  
</style>