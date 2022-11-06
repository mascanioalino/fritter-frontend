<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet">
    <header>
      <div class="freet-info">
        <h3 v-if="$store.state.username === freet.author" class="author">
          <a :href="`/#/profile`">@{{ freet.author }}</a>
        </h3>
        <h3 v-else class="author">
          <a :href="`/#/${freet.author}`">@{{ freet.author }}</a>
        </h3>
        <div v-if="$store.state.username === freet.author" class="dropdown">
          <button class="dropbtn">
            <img :src="require('@/public/assets/Three Dots.svg')" />
          </button>
          <div class="dropdown-content">
            <button class="dropdown-option" v-if="editing" @click="submitEdit">
              ✅ Save changes
            </button>
            <button class="dropdown-option" v-if="editing" @click="stopEditing">
              🚫 Discard changes
            </button>
            <button
              class="dropdown-option"
              v-if="!editing"
              @click="startEditing"
            >
              ✏️ Edit
            </button>
            <button class="dropdown-option" @click="deleteFreet">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
      <div class="freet-info">
        <h4 v-if="freet.group">On behalf of &{{ freet.group }}</h4>

        <p class="info">
          Posted at {{ freet.dateModified }}
          <i v-if="freet.edited">(edited)</i>
        </p>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p v-else class="content">
      {{ freet.content }}
    </p>
    <div class="reactions">
      <Likes
        v-if="$store.state.username"
        :key="freet._id"
        :freetId="freet._id"
      />
      <Bookmark
        v-if="$store.state.username"
        :freetId="freet._id"
        v-on:bookmark="$emit('bookmark')"
      />
      <button v-on:click="toggle" class="commentButton">
        <img :src="require('@/public/assets/Comment.svg')" />
      </button>
    </div>
    <CommentSection
      v-if="$store.state.username && this.open"
      :parentId="freet._id"
      :name="freet._id"
      :post="'freet'"
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
  name: "FreetComponent",
  components: { Likes, Bookmark, CommentSection },
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: false,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
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
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error =
          "Error: Edited freet content should be different than current freet content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited freet!",
        body: JSON.stringify({ content: this.draft }),
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
.author {
  margin: 5px;
}
.info {
  color: rgb(145, 143, 143);
}

button {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
.reactions {
  display: flex;
  align-content: center;
  align-items: center;
}
.freet {
  border: 1px solid rgb(185, 185, 185);
  padding: 20px;
  position: relative;
  width: 60%;
  border-radius: 2%;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
.freet-info {
  display: flex;
  justify-content: space-between;
  justify-items: flex-start;
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
