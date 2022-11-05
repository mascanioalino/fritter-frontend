<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="comment">
    <header class="commentHeader">
      <h3 class="author">@{{ comment.userId }}</h3>
      <div v-if="$store.state.username === comment.userId" class="dropdown">
        <button class="dropbtn">
          <img :src="require('@/public/assets/Three Dots.svg')" />
        </button>
        <div class="dropdown-content">
          <button class="dropdown-option" @click="deleteComment">
            🗑️ Delete
          </button>
        </div>
      </div>
      <div
        v-if="$store.state.username === comment.userId"
        class="actions"
      ></div>
    </header>

    <div class="commentContent">
      <p class="content">
        {{ comment.content }}
      </p>
      <button v-on:click="toggle" class="commentButton">
        <img
          style="
             {
              height: 20px;
              width: 20px;
            }
          "
          :src="require('@/public/assets/Comment.svg')"
        />
      </button>
    </div>

    <CommentSection
      v-if="this.open"
      :parentId="comment._id"
      :name="comment._id"
      :post="'comment'"
    />
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import Likes from "@/components/Freet/Likes.vue";
import Bookmark from "@/components/Bookmark/Bookmark.vue";
import CommentSection from "@/components/Comment/CommentSection.vue";
export default {
  name: "Comment",
  components: {
    Likes,
    Bookmark,
    CommentSection: () => import("./CommentSection"),
  },
  props: {
    // Data from the stored freet
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: false,
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    deleteComment() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted freet!",
            status: "success",
          });
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
        const r = await fetch(`/api/comments/${this.comment._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshFreets");

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
.commentContent {
  display: flex;
}
button {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
.comment {
  border-top: 0.5px solid rgb(185, 185, 185);

  /* padding: 20px; */
  position: relative;
  width: 100%;
}
.content {
  margin-left: 20px;
  flex-grow: 5;
}

.author {
  margin-top: 10px;
  padding: 0;
  justify-self: flex-start;
  flex-grow: 5;
}
.commentHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown {
  position: relative;
  display: inline-block;
}
.dropbtn {
  background-color: transparent;
  color: white;
  /* padding: 16px; */
  font-size: 16px;
  border: none;
  justify-self: flex-end;
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
