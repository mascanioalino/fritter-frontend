<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>@{{ this.username ? this.username : $store.state.username }}</h2>
        <button v-if="!this.username" onClick="location.href='/#/account'">
          <img
            style="width: 30px; height: 40px"
            :src="require('@/public/assets/Settings.svg')"
          />
        </button>
      </header>
      <div class="groups">
        <button v-if="!this.username" onClick="location.href='/#/groups'">
          Groups
        </button>
        <button v-else :onClick="`location.href='/#/groups/${this.username}'`">
          Groups
        </button>
      </div>
      <div class="content">
        <div class="selection">
          <button
            @click="() => (this.selected = 'freets')"
            :class="{ selected: this.selected === 'freets' }"
          >
            Freets
          </button>
          <button
            @click="() => (this.selected = 'likes')"
            :class="{ selected: this.selected === 'likes' }"
          >
            Likes
          </button>
          <button
            @click="() => (this.selected = 'hidden')"
            :class="{ selected: this.selected === 'hidden' }"
            v-if="!this.username"
          >
            Hidden Likes
          </button>
        </div>
        <div>
          <Freets
            v-if="this.selected === 'freets'"
            :username="this.username ? this.username : $store.state.username"
          />
          <HiddenLikes
            v-else-if="selected === 'hidden'"
            :username="this.username ? this.username : $store.state.username"
          />
          <Likes
            v-else
            :username="this.username ? this.username : $store.state.username"
          />
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import Freets from "@/components/Profile/Freets.vue";
import HiddenLikes from "@/components/Profile/HiddenLikes.vue";
import Likes from "@/components/Profile/Likes.vue";

export default {
  name: "AccountPage",
  components: {
    Freets,
    HiddenLikes,
    Likes,
  },
  props: {
    username: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      selected: "freets",
    };
  },
};
</script>

<style scoped>
button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
}
header {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid rgb(185, 185, 185);
}
.selection {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
}
.selection button {
  border: none;
  background-color: #f9f9f9;
  min-width: 260px;
  height: 20px;
  z-index: 1;
  border-bottom: 1px solid black;
}
.selection button:hover {
  background-color: #a5dfb1;
}
.selection .selected {
  background-color: #79c588;
}
.groups {
  padding: 0px 10px 20px 10px;
  border-bottom: 1px solid rgb(185, 185, 185);
}
.groups button {
  background-color: rgb(185, 185, 185);
  border-radius: 10%;
  height: 30px;
  width: 80px;
}
.content {
  flex-direction: column;
  display: flex;
  align-items: center;
}
</style>
