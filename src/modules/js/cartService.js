import fetch from 'js/fetch.js'
import url from 'js/api.js'

class Cart {
    static add(id) {
        return fetch(url.cartAdd, {
            id,
            number: 1
        })
    }
    static reduce(id) {
        return fetch(url.cartReduce, {
            id,
            number: 1
        })
    }
    static update(id, number) {
        return fetch(url.cartUpdate, {
            id,
            number
        })
    }
    static remove(id) {
        return fetch(url.cartRemove, {
            id
        })
    }
    static mremove(ids) {
        return fetch(url.cartMremove, {
            ids
        })
    }
}

export default Cart