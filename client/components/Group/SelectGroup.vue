<template>
  <div>
    <div>
      <div class="dropdown">
        <button class="dropbtn">
          {{ this.selected.groupName || this.selected }}
        </button>
        <div class="dropdown-content">
          <button
            class="dropdown-option"
            v-for="opt in this.groups"
            v-on:click="select(opt)"
          >
            {{ opt.groupName ? opt.groupName : opt }}
          </button>
        </div>
      </div>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "SelectGroup",
  props: {
    groups: {
      required: true,
      type: Array,
    },
    selected: {
      required: true,
      type: Object | String,
    },
  },
  data() {
    return {
      alerts: {},
    }; // Displays success/error messages encountered during freet modification
  },
  methods: {
    select(option) {
      this.$emit("selection", option);
    },
  },
};
</script>

<style scoped>
.dropbtn {
  background-color: #79c588;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 10%;
  height: 50%;
  padding: 5px;
}
.dropdown {
  margin-left: 10px;
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  flex-direction: column;
  position: absolute;
  border: none;
  background-color: #f9f9f9;
  min-width: min-content;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.dropdown:hover .dropdown-content {
  display: flex;
}
.dropdown-option {
  background-color: white;
  color: black;
  font-size: 16px;
  padding: 10px;
  border: none;
  cursor: pointer;
}
.dropdown-option:hover {
  background-color: #a5dfb1;
}
</style>
