<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <div>
    <form @submit.prevent="submit">
      <h3>{{ title }}</h3>
      <article v-if="fields.length">
        <div v-for="field in fields" :key="field.id">
          <label v-if="field.id" :for="field.id">{{ field.label }}:</label>
          <textarea
            v-if="field.id === 'content'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
          />
          <input
            v-else
            :type="field.id === 'password' ? 'password' : 'text'"
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
          />
        </div>
      </article>
      <article v-else>
        <p>{{ content }}</p>
      </article>
      <button type="submit">
        {{ title }}
      </button>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </form>
  </div>
</template>

<script>
export default {
  name: "BlockForm",
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      options: null,
    };
  },
  methods: {
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
      });

      if (this.selected) {
        if (this.selected !== "Myself") {
          entries.push(["groupId", this.selected._id]);
        }
      }
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

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit(
            "setUsername",
            res.user ? res.user.username : null
          );
        }

        if (this.refreshFreets) {
          this.$store.commit("refreshFreets");
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
form {
  border: 1px solid rgb(185, 185, 185);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  border: 1px solid rgb(185, 185, 185);
  font-family: inherit;
  font-size: inherit;
}
input {
  border: 1px solid rgb(185, 185, 185);
}

button {
  border: 0;
  background-color: #d9d9d9;
  border-radius: 10px;
  height: min-content;
  padding: 5px;
  margin-left: 10px;
}
</style>
