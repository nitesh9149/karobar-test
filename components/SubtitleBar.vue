<template>
  <section class="section is-subtitle-bar">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <ul>
            <li v-for="(title, index) in titleSub" :key="index">
              {{ title }}
            </li>
          </ul>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
        	<ul  v-for="(title, index) in titleSub" :key="index">
        		<li>Home</li>
        		<li>{{ title }}</li>
        	</ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SubtitleBar',
  props: {
    titleSub: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
