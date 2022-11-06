<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="vertical">
      <div class="top">
        <img src="../../public/logo.svg" />
        <h1 class="title">Fritter</h1>
      </div>
      <div class="right">
        <div class="link">
          <img :src="require('@/public/assets/Home.svg')" />
          <router-link to="/">Home </router-link>
        </div>
        <div class="link" v-if="$store.state.username">
          <img :src="require('@/public/assets/Bookmarked.svg')" />
          <router-link to="/bookmark"> Bookmarks </router-link>
        </div>
        <div class="link">
          <img :src="require('@/public/assets/Person.svg')" />
          <router-link v-if="$store.state.username" to="/profile">
            Profile
          </router-link>
          <router-link v-else to="/login"> Login </router-link>
        </div>
      </div>
      <button @click="toggle">Freet</button>
      <CreateFreetModal v-if="this.open" v-on:close="toggle" />
    </div>
  </nav>
</template>

<script>
import CreateFreetModal from "@/components/common/CreateFreetModal.vue";

export default {
  data() {
    return {
      open: false,
    };
  },
  components: {
    CreateFreetModal,
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
  },
};
</script>

<style scoped>
nav {
  padding: 1vw 2vw;
  background-color: transparent;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-right: 1px solid;
  z-index: 9999;
}

.title {
  font-size: 32px;
  margin: 0 5px;
}

img {
  height: 32px;
}

.top {
  display: flex;
  align-items: center;
}

.right {
  font-size: 20px;
  display: flex;
  gap: 16px;
  flex-direction: column;
}

.alerts {
  width: 25%;
}

.vertical {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  position: fixed;
}
.link {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  text-size-adjust: auto;
}
button {
  border-radius: 50px;
  border: 0;
  background-color: #d9d9d9;
  padding: 10px;
  align-content: center;
  cursor: pointer;
}
</style>
