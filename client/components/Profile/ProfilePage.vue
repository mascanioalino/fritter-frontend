<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>@{{ $store.state.username }}</h2>
      </header>
      <button>Settings</button>
      <Freets v-if="this.selected==='freets'" :username="$store.state.username" />
      <HiddenLikes v-else-if="selected==='hidden'" :username="$store.state.username"/>
      <Likes v-else :username="$store.state.username"/>
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
    Likes
  },
  data() {
    return {
        selected: "dd"
    }
  },
};
</script>
