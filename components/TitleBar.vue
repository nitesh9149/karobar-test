<template>
  <section class="section is-title-bar">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <ul>
            <li v-for="(title, index) in titleStack" :key="index">
              {{ title }}
            </li>
          </ul>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div v-if="globalHelper('createSale')" class="buttons is-right">
            <nuxt-link @click.native="createTransaction" v-for="(title, index) in nuxtLink" :key="index" :to="link" class="button is-primary">
              <b-icon icon="plus" custom-size="default" />
              <span>{{title}}</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'TitleBar',
  props: {
    titleStack: {
      type: Array,
      default: () => [],
    },
    nuxtLink:{
      type: Array,
      default: () => [],
    },
    link:{type:String}
  },
  methods:{
    createTransaction() {
      localStorage.removeItem("party_details");
    },
  }
}

</script>
<style lang="scss">
.button{
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  &.is-primary {
  background-color: #34a77f;
  border-color: transparent;
  color: white;
  &:hover{
    background-color:#34a77f;
  };
}
}
section.section.is-title-bar {
    border-bottom: 0;
}

</style>
