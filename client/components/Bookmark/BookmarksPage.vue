<template>
  <main>
    <section v-if="$store.state.username" >
      <header>
        <h1>Bookmarks</h1>
        <h3>@{{ $store.state.username }}</h3>
      </header>
      <section class="bookmarks">
        <div class="folders">
          <FolderComponent
            @click.native="select"
            v-for="bookmark in bookmarks"
            :key="bookmark._id"
            :bookmark="bookmark"
            :selected="selected.folder === bookmark.folder"
          />
        </div>
        <BookmarkComponent v-if="selected.folder" ref="bookmarkComponent" :selected="selected" />
      </section>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login"> Sign in </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import FolderComponent from "@/components/Bookmark/FolderComponent.vue";
import BookmarkComponent from "@/components/Bookmark/BookmarkComponent.vue";
export default {
  name: "BookmarkPage",
  components: { FolderComponent, BookmarkComponent },
  data() {
    return { alerts: {}, bookmarks: {}, selected: {} };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const url = "/api/bookmarks";
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.bookmarks = res;
        this.$set(this.selected, "folder", res[0].folder);
        console.log(this.selected);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async select(event) {
      await this.$set(this.selected, "folder", event.target.innerText);
      await this.$refs.bookmarkComponent.fetchData();
    },
  },
};
</script>

<style scoped>
.bookmarks {
  flex-direction: row;
}
.folders {
    width: 33%
}
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  flex-direction: column;
  margin: 5px;
  align-items: left;
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
