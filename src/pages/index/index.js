import 'css/common.css'
import './index.css'
import { InfiniteScroll } from 'mint-ui';
import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'


Vue.use(InfiniteScroll);

new Vue({
    el:'#app',
    data:{
        lists:null,
        pageNum:1,
        pageSize:6,
        loading:false,
        allLoaded:false
    },
    created(){
        this.getLists()
    },
    methods:{
        getLists(){
            if(this.allLoaded)return //如果所有数据加载完毕，不再执行下去
            this.loading=true //加载数据时防止反复请求数据
            axios.post(url.hotLists,{
                pageNum:this.pageNum,
                pageSize:this.pageSize
            }).then(res=>{
                let curLists=res.data.lists
                if(curLists.length<this.pageSize){
                    //判断是否所有数据都已经加载完毕
                    this.allLoaded=true
                }

                if(this.lists){
                    this.lists=this.lists.concat(curLists)
                }else{
                    //第一次请求数据
                    this.lists=curLists
                }
                this.loading=false
                this.pageNum++   
            })          
        }
    }
})