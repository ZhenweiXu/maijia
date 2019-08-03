let url={
    hotLists:'/index/hotLists'

}

//开发环境和真是环境的切换
let host='https://mockapi.eolinker.com/GYx5mS96d079826f9913e75ceb3606e774a72480c695c48'
for(let key in url){
    if(url.hasOwnProperty(key)){
        url[key]=host+url[key]
    }
}

export default url 