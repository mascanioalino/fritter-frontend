<!-- Form for creating freets (block style) -->
<template>
  <div>
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <textarea
          placeholder="What's happening?"
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
          class="freetContent"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <div class="postFreet">
      <div style="display: flex; align-items: center">
        Post on behalf of:
        <SelectGroup
          :selected="this.selected"
          :groups="this.options"
          v-on:selection="select"
        />
      </div>
      <button class="postButton" @click="submit">
        {{ title }}
      </button>
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
import BlockForm from "@/components/common/BlockForm.vue";
import SelectGroup from "@/components/Group/SelectGroup.vue";

export default {
  name: "CreateFreetForm",
  mixins: [BlockForm],
  components: { SelectGroup },
  data() {
    return {
      url: "/api/freets",
      method: "POST",
      hasBody: true,
      fields: [{ id: "content", label: "Content", value: "" }],
      options: [this.$store.state.username],
      title: "Freet",
      refreshFreets: true,
      selected: this.$store.state.username,
      callback: () => {
        const message = "Successfully created a freet!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    select(x) {
      this.selected = x;
    },
    async fetchData() {
      const url = `/api/groups?username=${this.$store.state.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.options = this.options.concat(res);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
      });

      if (this.selected) {
        if (this.selected !== this.$store.state.username) {
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

<style>
.freetContent {
  border: 1px solid rgb(185, 185, 185);
}
.postFreet {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.postButton {
  border: 0;
  background-color: rgb(185, 185, 185);
  border-radius: 10%;
  height: min-content;
  padding: 5px;
  margin-left: 10px;
}
</style>
