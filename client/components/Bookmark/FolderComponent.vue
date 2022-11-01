<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <div :class="selected.folder===bookmark.folder ? 'folder-selected' : 'folder'">
      <div class="folderName" v-on:click="select">
        {{ bookmark.folder }}
      </div>
      <div>
        <button  v-on:click="deleteFolder">Delete</button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "FolderComponent",
  props: {
    // Data from the stored freet
    bookmark: {
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
    deleteFolder() {
      const params = {
        method: "DELETE",
        body: JSON.stringify({folder: this.bookmark.folder }),
        url: `/api/bookmarks`,
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted folder!",
            status: "success",
          });
          this.$emit("deletion");

        },
      };
      this.request(params);
    },
    async select(event) {
      this.$emit("selection", this.bookmark.folder);
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
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.folder-name {
  height: 100%;
  flex-grow: 5;
}
.folder {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.folder-selected {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-right: 4px solid #a5dfb1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
</style>
