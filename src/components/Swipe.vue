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
  create() {},
  mounted() {
    new Swiper(".swiper-container", {
      loop: true,
      pagination: {
        el: ".swiper-pagination"
      },
      autoplay: {
        delay: 4000
      },
      speed: 2000
    });
  }
};
</script>
<style>
.swiper-slide img {
  height: 100%;
  width: 100%;
}
.swiper-pagination-bullet {
  width: 5px;
  height: 5px;
}
</style>

