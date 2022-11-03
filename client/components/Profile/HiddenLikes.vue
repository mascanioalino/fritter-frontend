<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <section v-if="this.likes.length">
        <FreetComponent
          v-for="freet in this.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "HiddenLikes",
  components: { FreetComponent },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return { alerts: {}, likes: {}, freets: {} };
  },
  mounted() {
    this.fetchLikes().then(()=>this.fetchFreets());
  },
  methods: {
    async fetchLikes() {
      const url = `/api/likes?username=${this.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        const likes = res.hidden;
        this.likes = likes;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async fetchFreets() {
      const freets = [];
      for (var like of this.likes) {
        const url = `/api/freets?freetId=${like.freet}`;
        try {
          const r = await fetch(url);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          freets.push(res);
        } catch (e) {
          this.$set(this.alerts, e, "error");
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
      this.freets = freets;
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
