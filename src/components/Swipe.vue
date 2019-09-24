<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swp-page swiper-slide" v-for="list in lists">
        <a class="js-no-follow" :href="list.clickUrl">
          <img class="goods-main-photo fadeIn" :src="list.image" />
        </a>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
//swipe对dom节点进行操作的，dom节点在mounted时候生成
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";

export default {
  name: "swipe",
  props: {
    lists: {
      //type:Array,
      required: true
    },
    name: {}
  },
  methods: {
    createSwipe() {
      new Swiper(".swiper-container", {
        loop: true,
        pagination: {
          el: ".swiper-pagination"
        },
        autoplay: {
          delay: 4000
        },
        speed: 800
      });
    }
  },
  mounted() {
    if (this.lists) {
      this.createSwipe();
    } else {
      this.$watch("lists", (newVal, oldVal) => {
        this.createSwipe();
      });
    }
  }
};
</script>
<style>
.swiper-slide img {
  height: 100%;
  width: 100%;
}
.swiper-container .swiper-pagination-bullet {
  width: 5px;
  height: 5px;
  
}
.swiper-pagination.swiper-pagination-bullets{
  text-align: center;
}
</style>

