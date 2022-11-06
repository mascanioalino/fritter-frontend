<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <div
      class="folder"
      :class="selected.folder === bookmark.folder ? 'selected' : ''"
    >
      <div class="folderName" v-on:click="select">
        {{ bookmark.folder }}
      </div>
      <div class="dropdown">
        <button class="dropbtn">
          <img :src="require('@/public/assets/Three Dots.svg')" />
        </button>
        <div class="dropdown-content">
          <button class="dropdown-option" @click="deleteFolder">
            🗑️ Delete
          </button>
        </div>
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
        body: JSON.stringify({ folder: this.bookmark.folder }),
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
.folderName {
  height: 80px;
  flex-grow: 9;
  padding: 30px;
  border: 0;
}
.folder {
  border-top: 1px solid rgb(185, 185, 185);
  padding-right: 5px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.folder.selected {
  border-top: 1px solid rgb(185, 185, 185);
  padding-right: 5px;
  position: relative;
  border-right: 4px solid #a5dfb1;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropbtn {
  background-color: transparent;
  color: white;
  font-size: 16px;
  border: none;
}

.dropdown:hover .dropdown-content {
  display: flex;
}
.dropdown-option {
  background-color: white;
  color: black;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
.dropdown-option:hover {
  background-color: #a5dfb1;
}

.dropdown-content {
  display: none;
  flex-direction: column;
  position: absolute;
  border: none;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>
