import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import mixin from 'js/mixin.js'
import axios from 'axios'
import url from 'js/api.js'

new Vue({
    el:'.container',
    data:{
        lists:null,
    },
    created(){
        this.getLists()
    },
    methods:{
        getLists(){
            axios.post(url.cartLists).then(res=>{
                
                //先赋值后添加属性无法实现响应式
                let lists=res.data.cartLists
                lists.forEach(shop=>{
                    shop.checked=true
                    shop.goodsList.forEach(good=>{
                        good.checked=true
                    })
                })
                //先处理后赋值
                this.lists=lists
            })
        },

        selectGood(shop,good){
            good.checked=!good.checked
            shop.checked=shop.goodsList.every(good=>{
                return good.checked
            })
        },
        selectedShop(shop){
            shop.checked=!shop.checked
            shop.goodsList.forEach(good=>{
                good.checked=shop.checked
            })
        },
        selectAll(){
            this.allSelected=!this.allSelected
        }
    },
    computed:{
        allSelected:{
            get(){
                if(this.lists&&this.lists.length){
                    return this.lists.every(shop=>{
                        return shop.checked
                    })
                }
                return false
            },
            set(newVal){
                this.lists.forEach(shop=>{
                    shop.checked=newVal
                    shop.goodsList.forEach(good=>{
                        good.checked=newVal
                    })
                })
            }
        }
    }
})