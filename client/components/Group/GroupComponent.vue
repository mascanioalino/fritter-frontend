<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article v-if="selected.group">
    <div
      :class="
        selected.group.groupName === group.groupName
          ? 'group-selected'
          : 'group'
      "
    >
      <div class="groupName" v-on:click="select">
        {{ group.groupName }}
      </div>
      <div>
        <button
          v-if="this.group.owner === $store.state.username"
          v-on:click="deleteGroup"
        >
          Delete
        </button>
      </div>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>
          {{ alert }}
        </p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: "GroupComponent",
  props: {
    // Data from the stored freet
    group: {
      type: Object,
      required: true,
    },
    selected: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    deleteGroup() {
      const params = {
        method: "DELETE",
        body: JSON.stringify({ groupName: this.group.groupName }),
        url: `/api/groups`,
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted group!",
            status: "success",
          });
          this.$emit("deletion");
        },
      };
      this.request(params);
    },
    async select(event) {
      this.$emit("selection", this.group);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }
      try {
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$store.commit("alert", {
          message: e,
          status: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
.groupName {
  height: 80px;
  flex-grow: 9;
  padding: 30px;
}
.group {
  border: 1px solid #111;
  padding-right: 5px;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.group-selected {
  border: 1px solid #111;
  padding-right: 5px;
  position: relative;
  border-right: 4px solid #a5dfb1;
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
