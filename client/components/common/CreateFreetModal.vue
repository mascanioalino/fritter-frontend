<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Create a Freet</h3>
          <button @click="$emit('close')">
            <img :src="require('@/public/assets/Close.svg')" />
          </button>
        </div>
        <div class="modal-body">
          <CreateFreetForm v-on:close="() => this.$emit('close')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
export default {
  name: "CreateFreetModal",
  components: {
    CreateFreetForm,
  },
  props: {
    group: {
      required: true,
      type: Object,
    },
    admin: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return { alerts: {}, owner: {}, admins: {}, members: {}, requests: {} };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
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
        const res = await r.json();
        this.$emit("update", res.group);
        this.fetchData();
      } catch (e) {
        this.$store.commit("alert", {
          message: e,
          status: "error",
        });
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
/* .modal-default-button {
    background-color: rgb(185, 185, 185);
    border-radius: 10%;
    border: 0;
    cursor: pointer;
    float: right;
    padding: 5px 10px;
  } */

button {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
</style>
