<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <section v-if="this.freets.length">
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
  name: "Freets",
  components: { FreetComponent },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return { alerts: {}, freets: {} };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const url = `/api/freets?author=${this.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        const freets = res;
        this.freets = freets;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
