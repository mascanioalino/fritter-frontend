<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>&{{ this.group.groupName }}</h2>
      </header>
      <!-- <button v-if="!this.username" onClick="location.href='/#/account'">Settings</button> -->
      <button @click="showMembers = true">Members</button>
      <MembersModal
        v-if="showMembers"
        :group="this.group"
        @close="showMembers = false"
        :admin="false"
      />
      <button
        v-if="
          !this.group.members.includes($store.state.username) &&
          !this.group.requests.includes($store.state.username)
        "
        v-on:click="requestJoin"
      >
        Request to join
    </button>
      <button
        v-else-if="this.group.requests.includes($store.state.username)"
        v-on:click="requestJoin"
      >
        Remove Request
      </button>
      <button
        v-if="this.group.admins.includes($store.state.username)"
        @click="showRequests = true"
      >
        Requests
      </button>
      <MembersModal
        v-if="showRequests"
        :group="this.group"
        @close="showRequests = false"
        :admin="true"
      />
      <h3>Owner: {{ this.group.owner }}</h3>
      <div class="selection">
        <button class="selected">Freets</button>
      </div>
      <!-- <Freets
          :username="this.username ? this.username : $store.state.username"
        /> -->
    </section>
  </main>
</template>
<script>
import Freets from "@/components/Profile/Freets.vue";
import MembersModal from "@/components/Group/MembersModal.vue";
export default {
  name: "AccountPage",
  components: {
    Freets,
    MembersModal,
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showMembers: false,
      showRequests: false,
    };
  },
  methods: {
    requestJoin() {
      const params = {
        method: "PUT",
        body: JSON.stringify({ groupName: this.group.groupName }),
        url: `/api/groups`,
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully requested to join group!",
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
      console.log(params);
      try {
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
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

<style>
.selection {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-evenly;
}
.selection button {
  border: none;
  background-color: #f9f9f9;
  min-width: 260px;
  height: 20px;
  z-index: 1;
}
.selection button:hover {
  background-color: #a5dfb1;
}
.selection .selected {
  background-color: #79c588;
}
</style>
