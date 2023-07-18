<template>
  <div>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Notices</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <div class="cloumns">
        <div class="column is-8">
          <div class="card">
            <div class="columns">
              <div class="column is-1">
                <b-icon icon="bullhorn-outline"></b-icon>
              </div>
              <div class="coulmn is-11">
                <div class="card-body">
                  <h1>New Update</h1>
                  <small>Magh 10, 2077</small>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <img src="@/img/Image_1.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="columns">
              <div class="column is-1">
                <b-icon icon="bullhorn-outline"></b-icon>
              </div>
              <div class="coulmn is-11">
                <div class="card-body">
                  <h1>New Update</h1>
                  <small>Magh 10, 2077</small>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <img src="@/img/Image_1.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="columns">
              <div class="column is-1">
                <b-icon icon="bullhorn-outline"></b-icon>
              </div>
              <div class="coulmn is-11">
                <div class="card-body">
                  <h1>New Update</h1>
                  <small>Magh 10, 2077</small>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <img src="@/img/Image_1.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="columns">
              <div class="column is-1">
                <b-icon icon="bullhorn-outline"></b-icon>
              </div>
              <div class="coulmn is-11">
                <div class="card-body">
                  <h1>New Update</h1>
                  <small>Magh 10, 2077</small>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <img src="@/img/Image_1.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import image_1 from "@/img/Image_1.png";
export default {
  components: {
    image_1,
  },
  head() {
    return {
      title: "Notices - Karobar",
    };
  },
};
</script>
<style lang="scss" scoped>
.card {
  padding: 2rem 1rem;
  cursor: pointer;
  .card-body{
      img{
          padding: 2rem 2rem 2rem 0;
      }
  }
  h1 {
    font-weight: 600;
    font-size: 16px;
    color: #092c4c;
    margin-bottom: 0.5rem;
    margin-top: 0.75rem;
  }
  .icon {
    color: #3ab98d;
    width: max-content;
    margin: auto;
  }
  p {
    color: #092c4c;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
  small {
    color: #676767;
  }
}
</style>
