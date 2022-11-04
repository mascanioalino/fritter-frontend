<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>@{{ this.username ? this.username : $store.state.username }}</h2>
      </header>
      <button v-if="!this.username" onClick="location.href='/#/account'">Settings</button>
      <button v-if="!this.username" onClick="location.href='/#/groups'">Groups</button>
      <button v-else :onClick="`location.href='/#/groups/${this.username}'`">Groups</button>
      <div class="selection">
        <button @click="()=>this.selected='freets'" :class="{selected: this.selected==='freets'}">Freets</button>
        <button @click="()=>this.selected='likes'" :class="{selected: this.selected==='likes'}">Likes</button>
        <button @click="()=>this.selected='hidden'" :class="{selected: this.selected==='hidden'}" v-if="!this.username">Hidden Likes</button>
      </div>
      <Freets
        v-if="this.selected === 'freets'"
        :username="this.username ? this.username : $store.state.username"
      />
      <HiddenLikes
        v-else-if="selected === 'hidden'"
        :username="this.username ? this.username : $store.state.username"
      />
      <Likes v-else :username="this.username ? this.username : $store.state.username" />
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
.selection {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-evenly;
}
.selection button {
  border: none;
  background-color: #f9f9f9;
  min-width: 260px;
  height: 20px;
  z-index: 1;
}
.selection button:hover {
  background-color: #a5dfb1;
}
.selection .selected {
    background-color: #79c588;
}
</style>
