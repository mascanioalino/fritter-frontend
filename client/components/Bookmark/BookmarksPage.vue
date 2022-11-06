<template>
  <main>
    <section v-if="$store.state.username">
      <section class="bookmarks">
        <div class="folders">
          <div class="title">
            <h1>Bookmarks</h1>
            <button @click="toggle">
              <img
                style="width: 40px; height: 40px"
                :src="require('@/public/assets/Plus.svg')"
              />
            </button>
          </div>
          <h3 style="margin: 5px; color: rgb(100, 100, 100)">
            @{{ $store.state.username }}
          </h3>
          <CreateFolder
            v-if="this.open"
            class="createFolder"
            v-on:creation="fetchData"
          />
          <FolderComponent
            v-on:selection="select"
            v-on:deletion="fetchData"
            v-for="bookmark in bookmarks"
            :key="bookmark._id"
            :bookmark="bookmark"
            :selected="selected"
          />
        </div>
        <BookmarkComponent
          class="freets"
          v-if="selected.folder"
          ref="bookmarkComponent"
          :selected="selected"
        />
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
import CreateFolder from "@/components/Bookmark/CreateFolder.vue";

export default {
  name: "BookmarkPage",
  components: { FolderComponent, BookmarkComponent, CreateFolder },
  data() {
    return { open: false, alerts: {}, bookmarks: {}, selected: {} };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
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
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async select(f) {
      await this.$set(this.selected, "folder", f);
      await this.$refs.bookmarkComponent.fetchData();
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
}
.title button {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
.bookmarks {
  flex-direction: row;
}
.folders {
  width: 33%;
  border-right: 1px solid;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  height: 100vmax
}
section {
  display: flex;
  flex-direction: column;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.freets {
  width: 70%;
}

.createFolder {
  width: 90%;
  align-self: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
