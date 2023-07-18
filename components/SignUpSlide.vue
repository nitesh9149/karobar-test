<template>
  <b-carousel class="carousel-signup" :arrow="false" :repeat="false">
    <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
      <section :class="`hero is-medium is-${carousel.color}`">
        <div class="hero-body has-text-centered">
          <img :src="carousel.image" alt="loign Image" />
        </div>
      </section>
      <div class="slide-bottom">
        <h1>Business on Your Mobile</h1>
        <p>
          Now you can add customer and add their credit transection directly in
          the app and find them easily in the future.
        </p>
      </div>
    </b-carousel-item>
  </b-carousel>
</template>

<script>
import image1 from "@/img/Group1264.png";
import image2 from "@/img/Group6789.png";
import image3 from "@/img/3227390-01.png";
import image4 from "@/img/Group6791.png";
import image5 from "@/img/signup.png";
export default {
  data() {
    return {
      carousels: [
        { text: "Slide 1", image: image1, color: "#34a77f08" },
        { text: "Slide 1", image: image2, color: "#34a77f08" },
        { text: "Slide 1", image: image3, color: "#34a77f08" },
        { text: "Slide 1", image: image4, color: "#34a77f08" },
        { text: "Slide 1", image: image5, color: "#34a77f08" },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.carousel-signup {
  .carousel-indicator.is-inside {
    position: absolute;
    left: 0;
  }
  .carousel-indicator.is-inside.is-bottom {
    bottom: 8rem;
  }
  .carousel-indicator .indicator-item.is-active .indicator-style,
  .carousel .carousel-indicator .indicator-item .indicator-style:hover {
    background: #34a77f;
  }
  .carousel-indicator .indicator-item .indicator-style {
    border: 1px solid #34a77f;
  }
  .carousel-item {
    .hero-body {
      width: 26rem;
      margin: auto;
      padding-bottom: 0;
      padding-top: 7rem;
      height: 28rem;
    }
    img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
    }
  }
  .slide-bottom {
    text-align: center;
    padding: 0 2rem 2rem;
    h1 {
      font-weight: bold;
      padding-bottom: 1rem;
      color: #03014c;
      padding-top: 1rem;
      font-size: 25px;
    }
    p {
      color: #092c4cab;
    }
  }
}
</style>