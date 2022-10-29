<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freets">
    <FreetComponent v-for="freet in freets" :key="freet._id" :freet="freet" />
    <p v-if="freets.length===0">No freets in this folder</p>
  </article>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
  name: "BookmarkComponent",
  components: { FreetComponent },
  props: {
    // Data from the stored freet
    selected: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.fetchData();
  },
  data() {
    return {
      freets: [],
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    async fetchData() {
      const url = `/api/bookmarks?folder=${this.selected.folder}`;
      this.freets = [];
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        for (var freetId of res.freets) {
          const r = await fetch(`/api/freets?freetId=${freetId}`);
          const response = await r.json();
          this.freets.push(response);
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.freets {
  width: 66%
}
p {
    margin-left:10px;
}
</style>
