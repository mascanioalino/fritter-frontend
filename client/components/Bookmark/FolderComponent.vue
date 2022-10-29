<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <div v-if="selected" class="folder-selected">
      <header>
        <h3 class="folderName">{{ bookmark.folder }}</h3>
      </header>
    </div>
    <div v-else class="folder">
      <header>
        <h3 class="folderName">{{ bookmark.folder }}</h3>
      </header>
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
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
};
</script>

<style scoped>
.folder {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
.folder-selected {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-right: 4px solid #a5dfb1;
}
</style>
