<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="comment">
    <header>
      <h3 class="author">@{{ comment.userId }}</h3>
      <div v-if="$store.state.username === comment.userId" class="actions">
        <button @click="deleteComment">🗑️ Delete</button>
      </div>
    </header>

    <p class="content">
      {{ comment.content }}
    </p>
    <CommentSection
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
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
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
.comment {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  width:100%;
}
</style>
