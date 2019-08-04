import './category.css'
import 'css/common.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import Foot from 'components/Foot.vue'

new Vue({
    el:'#app',
    data:{
        topLists:null,
        subData:null,
        topIndex:0,
        rankData:null,
    },
    created(){
        this.getTopList()
        this.getSubLists(0)
        this.getRank()
    },
    methods:{
        getTopList(){
            axios.post(url.topLists).then(res=>{
                this.topLists=res.data.lists
            }).catch(res=>{

            })
        },
        getSubLists(index,id){
            this.topIndex=index
            if(index===0){

            }else{
                axios.post(url.subLists,{id}).then(res=>{
                    this.subData=res.data
                }).catch(res=>{

                })
            }

        },
        getRank(){
            axios.post(url.rank).then(res=>{
                this.rankData=res.data
            }).catch(res=>{

            })
        }
    },
    components:{
        Foot
    },
    filters:{
        number(price){
            return price+'.00'
        }
    }
})



