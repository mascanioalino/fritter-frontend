<template>
  <div>
    <div>
      <div class="dropdown">
        <button class="dropbtn">
          <img
            v-if="this.bookmarked.length"
            :src="require('@/public/assets/Bookmarked.svg')"
          />
          <img v-else :src="require('@/public/assets/Bookmark.svg')" />
        </button>
        <div class="dropdown-content">
          <button
            class="dropdown-option"
            :class="{ chosen: checkBookmark(bookmark) }"
            v-for="bookmark in bookmarks"
            v-on:click="setFolder"
          >
            {{ bookmark.folder }}
          </button>
          <button
            v-if="!this.bookmarks.length"
          >
            You have no folders, you have to create one.
          </button>
        </div>
      </div>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "Bookmark",
  props: {
    freetId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      alerts: {},
      bookmarks: {},
      clicked: false,
      bookmarked: [],
    }; // Displays success/error messages encountered during freet modification
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
        this.bookmarked = [];
        for (var bookmark of this.bookmarks) {
          // console.log(bookmark);
          if (bookmark.freets.includes(this.freetId)) {
            this.bookmarked.push(bookmark.folder);
          }
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    checkBookmark(bookmark) {
      return this.bookmarked.includes(bookmark.folder);
    },
    setFolder(event) {
      const url = `/api/bookmarks`;
      const params = {
        method: "PUT",
        message: "Successfully editted bookmark!",
        body: JSON.stringify({
          folder: event.target.innerText,
          freetId: this.freetId,
        }),
        url: url,
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
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

        this.fetchData();

        this.$emit("bookmark");
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.like {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.like button {
  height: 50%;
  margin: 10px;
}
.dropbtn {
  background-color: transparent;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
}
.dropdown {
  position: relative;
  display: inline-block;
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
.chosen {
  background-color: rgb(77, 145, 89);
}

.chosen:hover {
  background-color: rgb(77, 145, 89);
}
</style>
