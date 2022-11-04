<template>
  <div>
    <button @click="toggle">
      <img :src="require('@/public/assets/Comment.svg')" />
    </button>
    <div class="comments" v-if="this.open">
      <Comment v-for="comment in comments" :comment="comment" />
      <!-- <CreateCommentForm/> -->
    </div>
  </div>
</template>

<script>
import Comment from "@/components/Comment/Comment.vue";
import CreateCommentForm from "@/components/Comment/CreateCommentForm.vue";
export default {
  name: "CommentSection",
  components: { Comment, CreateCommentForm },
  props: {
    parentId: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      open: false,
      alerts: {},
      comments: {},
    }; // Displays success/error messages encountered during freet modification
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const url =
        this.post === "freet"
          ? `/api/comments?freetId=${this.parentId}`
          : `/api/comments?commentId=${this.parentId}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        const comments = res;
        this.comments = comments;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    toggle() {
      this.open = !this.open;
    },
    like() {
      const url = `/api/likes`;
      const params = {
        method: "POST",
        message: "Successfully liked freet!",
        body: JSON.stringify({ freetId: this.freetId, hidden: false }),
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

        // params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
button {
  background-color: transparent;
  border: 0;
}
.comments {
  display: flex;
  width: 100%;
}
.comment button {
  height: 50%;
  margin: 10px;
}
</style>
