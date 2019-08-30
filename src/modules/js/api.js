let url = {
    hotLists: '/index/hotLists',
    banner: '/index/banner',
    topLists: '/category/topLists',
    subLists: '/category/subLists',
    rank: '/category/rank',
    searchLists: '/search/list',
    details: '/goods/details',
    deal: '/goods/deal',
    addCart: '/cart/add',
    cartLists: '/cart/list',
    cartReduce: '/cart/reduce',
    cartRemove: '/cart/remove',
    cartMremove: '/cart/mremove',
    cartAdd: '/cart/add',
    cartReduce: '/cart/reduce',
    cartUpdate: '/cart/update',
    addressLists: '/address/list',
    addressAdd: '/address/add',
    addressRemove: '/address/remove',
    addressUpdate: 'address/update',
    addressSetDefault: '/address/setDefault'

}

//开发环境和真是环境的切换
let host = 'https://mockapi.eolinker.com/GYx5mS96d079826f9913e75ceb3606e774a72480c695c48'
for (let key in url) {
    if (url.hasOwnProperty(key)) {
        url[key] = host + url[key]
    }
}

export default url