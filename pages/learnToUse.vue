<template>
  <div>
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li style="font-weight: 500">Learn to Use Karobar App</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="learn-section">
      <b-tabs class="learn-tab" v-model="activeTab">
        <b-tab-item label="Web App">
          <div class="columns is-multiline">
            <div
              v-for="video in learn_web"
              :key="video.id"
              class="column is-3-desktop is-4-tablet"
            >
              <div @click="showVideo(video.link_embed)" class="learn-card">
                <img
                  v-if="video.thumbnail"
                  :src="video.thumbnail"
                  :alt="video.english_title"
                />
                <div class="play-empty" v-else>
                  <b-icon size="is-large" icon="play-circle-outline"></b-icon>
                </div>
                <h2>{{ video.english_title }}</h2>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item label="Mobile App">
          <div class="columns is-multiline">
            <div
              v-for="video in learn_mobile"
              :key="video.id"
              class="column is-3-desktop is-4-tablet"
            >
              <div @click="showVideo(video.link_embed)" class="learn-card">
                <img
                  v-if="video.thumbnail"
                  :src="video.thumbnail"
                  :alt="video.english_title"
                />
                <div class="play-empty" v-else>
                  <b-icon size="is-large" icon="play-circle-outline"></b-icon>
                </div>
                <h2>{{ video.english_title }}</h2>
              </div>
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeTab: 0,
      learn_web: [],
      learn_mobile: [],
    };
  },
  async mounted() {
    let learn = await this.$axios.get("/core/tutorials/?platform=all");
    learn.data.forEach((element) => {
      let ytId = this.getId(element.link);
      element.link_embed = "https://www.youtube.com/embed/" + ytId;
      if (element.platform == "web") {
        this.learn_web.push(element);
      } else if (element.platform == "mobile") {
        this.learn_mobile.push(element);
      }
    });
  },
  methods: {
    showVideo(embed) {
      let video = `<div class="video">
        <iframe
          width="100%"
          src="${embed}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>;`;
      this.$buefy.modal.open({
        content: video,
      });
    },
    getId(url) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      return match && match[2].length === 11 ? match[2] : null;
    },
  },
  head() {
    return {
      title: "Learn to use - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
.learn-section {
  padding: 0 1.5rem;
  .learn-tab {
    .tab-content {
      padding-top: 2rem;
      overflow-y: auto;
    }
    .tabs a {
      font-weight: 500;
      border-bottom-width: 2px;
      padding: 0.75rem 1.5rem;
      border-color: transparent;
    }
    .tabs ul {
      border-bottom-width: 1px;
    }
    .tabs li.is-active a {
      border-bottom-color: $green;
      color: $green;
      border-bottom-width: 2px;
      font-weight: 500;
    }
    .tabs a:hover {
      border-bottom-color: $green;
      border-bottom-width: 2px;
    }
    .learn-card {
      cursor: pointer;
      border: 1px solid #d5dae1;
      border-radius: 8px;
      padding: 1rem;
      height: 100%;
      img {
        width: 100%;
        height: 10rem;
        object-fit: cover;
        margin-bottom: 0.5rem;
      }
      .play-empty {
        width: 100%;
        height: 10rem;
        background-color: #d1d1d1;
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        .icon {
          margin: auto;
          color: $green;
        }
      }
      h2 {
        font-weight: 500;
      }
    }
  }
}
.video {
  iframe {
    height: 61vh;
  }
}
@media screen and (max-width: 768px) {
  .video {
    padding: 1rem;
    iframe {
      height: 35vh;
    }
  }
}
</style>