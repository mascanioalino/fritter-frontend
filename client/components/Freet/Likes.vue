<template>
  <div>
    <div class="like">
      <button v-if="this.likes.liked" @click="deleteLike">Dislike</button>
      <button v-else @click="like">Like</button>
      <p>{{ this.likes.public_likes }}</p>
      <button v-if="this.likes.hidden_liked" @click="deleteLike">
        Dishiddenlike
      </button>
      <button v-else @click="hiddenLike">Hidden Like</button>
      <p>{{ this.likes.hidden_likes }}</p>
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
  name: "Likes",
  props: {
    freetId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      alerts: {},
      likes: {},
    }; // Displays success/error messages encountered during freet modification
  },
  mounted() {
  this.fetchData();
  },
  methods: {
    async fetchData() {
      const url = `/api/likes?freetId=${this.freetId}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        const likes = res;
        this.likes = likes;
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    deleteLike() {
        const url = `/api/likes`;
        const params = {
            method: "DELETE",
            message: "Successfully disliked freet!",
            body: JSON.stringify({freetId: this.freetId}),
            url: url,
            callback: () => {
                this.$set(this.alerts, params.message, "success");
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            },
        };
        this.request(params);
    },
    like() {
        const url = `/api/likes`;
        const params = {
            method: "POST",
            message: "Successfully liked freet!",
            body: JSON.stringify({freetId: this.freetId, hidden: false}),
            url: url,
            callback: () => {
                this.$set(this.alerts, params.message, "success");
                setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            },
        };
        this.request(params);
    },
    hiddenLike() {
        const url = `/api/likes`;
        const params = {
            method: "POST",
            message: "Successfully hidden liked freet!",
            body: JSON.stringify({freetId: this.freetId, hidden: true}),
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
.like {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.like button {
  height: 50%;
  margin: 10px;
}
</style>
