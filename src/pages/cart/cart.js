import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import mixin from 'js/mixin.js'
import axios from 'axios'
import url from 'js/api.js'
import Volecity from 'velocity-animate'
import Cart from 'js/cartService.js'


new Vue({
    el: '.container',
    data: {
        lists: null,
        total: 0,
        totalNum: 0,
        editingShop: null,
        editingShopIndex: -1,
        removePopup: false,
        removeData: null,
        removeMsg: '确定要删除该商品吗？'
    },
    created() {
        this.getLists()
    },
    computed: {
        allSelected: {
            get() {
                if (this.lists && this.lists.length) {
                    return this.lists.every(shop => {
                        return shop.checked
                    })
                }
                return false
            },
            set(newVal) {
                this.lists.forEach(shop => {
                    shop.checked = newVal
                    shop.goodsList.forEach(good => {
                        good.checked = newVal
                    })
                })
            }
        },
        allRemoveSelected: {
            get() {
                if (this.editingShop) {
                    return this.editingShop.removeChecked
                }
                return false
            },
            set(newVal) {
                if (this.editingShop) {
                    this.editingShop.removeChecked = newVal
                    this.editingShop.goodsList.forEach(good => {
                        good.removeChecked = newVal
                    })
                }

            }
        },
        selectLists() {
            if (this.lists && this.lists.length) {
                let arr = []
                let total = 0
                let totalNum = 0
                this.lists.forEach(shop => {
                    shop.goodsList.forEach(good => {
                        if (good.checked) {
                            arr.push(good)
                            total += good.price * good.number
                            totalNum += 1
                        }
                    })
                })
                this.total = total
                this.totalNum = totalNum
                return arr
            }
            return []
        },
        removeLists() {
            if (this.editingShop) {
                let arr = []
                this.editingShop.goodsList.forEach(good => {
                    if (good.removeChecked) {
                        arr.push(good)

                    }
                })
                return arr
            }
            return []
        }
    },
    methods: {
        getLists() {
            axios.post(url.cartLists).then(res => {

                //先赋值后添加属性无法实现响应式
                let lists = res.data.cartLists
                lists.forEach(shop => {
                        shop.checked = true
                        shop.removeChecked = false
                        shop.editing = false
                        shop.editingMsg = '编辑'
                        shop.goodsList.forEach(good => {
                            good.checked = true
                            good.removeChecked = false
                        })
                    })
                    //先处理后赋值
                this.lists = lists
            })
        },

        selectGood(shop, good) {
            let attr = this.editingShop ? 'removeChecked' : 'checked'
            good[attr] = !good[attr]
            shop[attr] = shop.goodsList.every(good => {
                return good[attr]
            })
        },
        selectedShop(shop) {
            let attr = this.editingShop ? 'removeChecked' : 'checked'
            shop[attr] = !shop[attr]
            shop.goodsList.forEach(good => {
                good[attr] = shop[attr]
            })
        },
        selectAll() {
            let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected'
            this[attr] = !this[attr]
        },
        edit(shop, shopIndex) {
            shop.editing = !shop.editing
            shop.editingMsg = shop.editing ? '完成' : '编辑'
            this.lists.forEach((item, i) => {
                if (shopIndex !== i) {
                    item.editing = false
                    item.editingMsg = shop.editing ? '' : '编辑'
                }
            })
            this.editingShop = shop.editing ? shop : null
            this.editingShopIndex = shop.editing ? shopIndex : -1

        },
        inputNum(e, shopIndex, good, goodIndex) {
            //禁止输入非法字符
            if ('0123456789'.indexOf(e.key) === -1 && e.key !== 'Backspace') {
                return e.returnValue = false
            }
        },
        changeNum(shopIndex, good, goodIndex) {
            let num = good.number
            if (num === '0' || num === '') {
                num = 1
            }
            //如果第一个数字是0，把他删除掉
            while (num.charAt(0) === '0') {
                num = num.substring(1)
            }

            Cart.update(good.id, num).then(res => {
                good.number = num
            })

        },
        //增加和减少都是先修改数据库的内容，成功后再修改本地页面的内容
        add(good) {
            Cart.add(good.id).then(res => {
                good.number++
            })
        },
        reduce(good) {
            if (good.number === 1) return
            Cart.reduce(good.id).then(res => {
                good.number--
            })
        },
        remove(shop, shopIndex, good, goodIndex) {
            this.removePopup = true
            document.body.style = "height:100%;overflow:hidden;"
            this.removeData = { shop, shopIndex, good, goodIndex }
        },
        removeList() {
            this.removePopup = true
            document.body.style = "height:100%;overflow:hidden;"
            this.removeMsg = `确定将所选${this.removeLists.length}个商品删除？`

        },
        removeConfirm() {
            if (this.removeMsg === `确定要删除该商品吗？`) {
                let { shop, shopIndex, good, goodIndex } = this.removeData
                Cart.remove(good.id).then(res => {
                    shop.goodsList.splice(goodIndex, 1)
                    if (shop.goodsList.length === 0) {
                        this.lists.splice(shopIndex, 1)
                            //切换到正常显示状态
                        this.removeShop()
                        Volecity(this.$refs[`goods-${shopIndex}-${goodIndex}`], {
                            left: '0px'
                        }, 300)
                    }
                    this.removePopup = false
                    document.body.style = "height:auto;overflow:auto;"
                        //Volecity(this.$refs[`goods-${shopIndex}-${goodIndex}`])[0].style.left = '0px'
                })
            } else {
                //删除多个商品
                let ids = []
                this.removeLists.forEach(good => {
                    ids.push(good.id)
                })
                Cart.mremove(ids).then(res => {
                    let arr = []

                    this.editingShop.goodsList.forEach(good => {
                        let index = this.removeLists.findIndex(item => {
                            return item.id === good.id
                        })
                        if (index === -1) {
                            arr.push(good)
                        }
                    })
                    if (arr.length) {
                        this.editingShop.goodList = arr
                    } else {
                        this.lists.splice(this.editingShopIndex, 1)
                        this.removeShop()
                    }
                    this.removePopup = false
                    document.body.style = "height:auto;overflow:auto;"
                })
            }

        },
        removeCancel() {
            this.removePopup = false
            document.body.style = "height:auto;overflow:auto;"
            this.removeData = null
        },
        removeShop() {
            this.editingShop = null
            this.editingShopIndex = -1
            this.lists.forEach(shop => {
                shop.editing = false
                shop.editingMsg = '编辑'
            })
        },
        start(e, good) {
            good.startX = e.changedTouches[0].clientX
        },
        end(e, shopIndex, good, goodIndex) {
            let endX = e.changedTouches[0].clientX
            let left = '0'
            if (good.startX - endX > 100) {
                left = '-60px'
            }
            if (endX - good.startX > 100) {
                left = '0px'
            }
            Volecity(this.$refs[`goods-${shopIndex}-${goodIndex}`], {
                left
            }, 300)
        }
    },

    mixins: [mixin]
})