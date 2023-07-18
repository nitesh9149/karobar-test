<template>
  <div class="custom-select" :tabindex="tabindex" @blur="open = false">
    <div class="selected" :class="{ open: open }" @click="open = !open">
      {{ selected }}
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="
          selected = option.text;
          valueBusiness(option.value);
          open = false;
          $emit('input', option);
        "
      >
        {{ option.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0].text
        : null,
      open: false,
    };
  },
  methods: {
    valueBusiness(a) {
      this.$emit("valueBusiness", a);
    },
  },
};
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  line-height: 2.3;
  height: 2.5em;
}

.custom-select .selected {
  border-radius: 4px;
  border: 1px solid #dedede;
  padding-left: 0.5em;
  cursor: pointer;
  user-select: none;
  height: 2.5em;
}

.custom-select .selected.open {
  border: 1px solid #dedede;
  border-radius: 6px 6px 0px 0px;
}

.custom-select .selected:after {
  position: absolute;
  content: "";
  top: 22px;
  right: 1em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: #fff transparent transparent transparent;
}

.custom-select .items {
  box-shadow: 0 0.5em 1em -0.125em hsla(0deg, 0%, 4%, 0.1),
    0 0 0 1px hsla(0deg, 0%, 4%, 0.02);
  border-radius: 0px 0px 6px 6px;
  color: #363636;
  position: absolute;
  background-color: white;
  left: 0;
  right: 0;
  z-index: 1;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.custom-select .items div {
  color: #363636;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
}

.custom-select .items div:hover {
  background-color: whitesmoke;
}

.selectHide {
  display: none;
}
.select:not(.is-multiple):not(.is-loading)::after {
  border-color: #363636 !important;
}
.select:not(.is-multiple):not(.is-loading)::after,
.navbar-link:not(.is-arrowless)::after {
  border-width: 2px;
  height: 0.5em;

  top: 55%;

  width: 0.5em;
  z-index: 0;
}
</style>

