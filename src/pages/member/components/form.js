import Address from 'js/addressService.js'
export default {
    data() {
        return {
            name: '',
            tel: '',
            provinceValue: -1,
            cityValue: -1,
            districtValue: -1,
            address: '',
            id: '',
            type: '',
            instance: '',
            addressData: require('js/address.json'),
            cityList: null,
            districtList: null
        }
    },
    computed: {
        lists() {
            return this.$store.state.lists
        }
    },
    created() {
        let query = this.$route.query
        this.type = query.type
        this.instance = query.instance

        if (this.type === 'edit') {
            let ad = this.instance
            this.provinceValue = parseInt(ad.provinceValue)
            this.name = ad.name
            this.tel = ad.tel
            this.address = ad.address
            this.id = ad.id
        }
    },
    methods: {
        add() {
            //需要做非空和合法性校验
            let { name, tel, provinceValue, cityValue, districtValue, address } = this
            //根据value找出省市区的名称
            let provinceName, cityName, districtName
            this.addressData.list.forEach(p => {
                if (p.value === provinceValue) {
                    provinceName = p.label
                    p.children.forEach(c => {
                        if (c.value === cityValue) {
                            cityName = c.label
                            c.children.forEach(d => {
                                if (d.value === districtValue) {
                                    districtName = d.label
                                }
                            })
                        }
                    })
                }
            })
            let data = { name, tel, provinceValue, cityValue, districtValue, provinceName, cityName, districtName, address }
            if (this.type === 'add') {
                // Address.add(data).then(res => {
                //     this.$router.go(-1)
                // })
                this.$store.dispatch('addAction', data)
            }
            if (this.type === 'edit') {
                data.id = this.id
                    // Address.update(data).then(res => {
                    //     this.$router.go(-1)
                    // })
                this.$store.dispatch('updateAction', data)
            }

        },
        remove() {
            if (window.confirm('确认删除？')) {
                // Address.remove(this.id).then(res => {
                //     this.$router.go(-1)
                // })
                this.$store.dispatch('removeAction', this.id)
            }
        },
        setDefault() {
            // Address.setDefault(this.id).then(res => {
            //     this.$router.go(-1)
            // })
            this.$store.dispatch('setDefaultAction', this.id)
        }
    },
    watch: {
        lists: {
            handler() {
                this.$router.go(-1)
            },
            deep: true
        },
        provinceValue(val) {
            if (val === -1) return

            let list = this.addressData.list
            let index = list.findIndex(item => {
                return item.value === val
            })
            this.cityList = list[index].children
            this.cityValue = -1
            this.districtValue = -1
                //编辑状态下
            if (this.type === 'edit') {
                //在编辑状态下实现联动选择
                let city = this.cityList.find(item => {
                    return parseInt(this.instance.cityValue) === item.value
                })
                if (city) {
                    this.cityValue = parseInt(this.instance.cityValue)
                } else {
                    this.cityValue = -1
                }
            }
        },
        cityValue(val) {
            if (val === -1) return
            let list = this.cityList
            let index = list.findIndex(item => {
                return item.value === val
            })
            this.districtList = list[index].children
            this.districtValue = -1
                //编辑状态下
            if (this.type === 'edit') {
                //在编辑状态下实现联动选择
                let district = this.districtList.find(item => {
                    return parseInt(this.instance.districtValue) === item.value
                })
                if (district) {
                    this.districtValue = parseInt(this.instance.districtValue)
                } else {
                    this.districtValue = -1
                }
            }
        }
    }

}