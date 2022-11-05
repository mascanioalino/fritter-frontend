<!-- Form for creating freets (block style) -->
<template>
  <div class="commentForm">
    <textarea
      class="commentContent"
      name="content"
      :value="this.fields[0].value"
      @input="(e) => change(e)"
    />
    <button @click="() => submit()" class="commentButton">
      Comment
    </button>
  </div>
</template>

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateCommentForm",
  mixins: [BlockForm],
  props: {
    commentId: {
      type: String,
      required: false,
    },
    freetId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      url: "/api/comments",
      method: "POST",
      hasBody: true,
      fields: [
        { id: "content", label: "Content", value: "" },
        this.commentId
          ? { id: "commentId", label: "Comment", value: this.commentId }
          : {},
        this.freetId
          ? { id: "freetId", label: "Freet", value: this.freetId }
          : {},
      ],
      title: "Create a comment",
      refreshFreets: true,
      // value: " ",
      callback: () => {
        const message = "Successfully created a comment!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
  methods: {
    change(e) {
      this.fields[0].value = e.target.value;
    },
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const optionsForm = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      const entries = this.fields.map((field) => {
        if (field.label) {
          const { id, value } = field;
          field.value = "";
          return [id, value];
        }
        return [];
      });
      if (this.hasBody) {
        optionsForm.body = JSON.stringify(Object.fromEntries(entries));
      }

      try {
        const r = await fetch(this.url, optionsForm);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      this.$emit('update');
    },
  },
};
</script>

<style scoped>
.commentButton {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.commentContent {
  flex-grow: 2;
  border-radius: 5%;
}

.commentForm {
  display: flex;
  border-bottom: 0.5px solid rgb(185, 185, 185);;
  padding: 20px;
}
</style>
