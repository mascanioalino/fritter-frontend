<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div v-if="this.admin" class="modal-container">
        <div class="modal-header">
          <h3>Requests</h3>
        </div>

        <div class="modal-body">
          <div class="names" v-for="req in requests">
            <h3 class="author">
              <a v-if="$store.state.username === req" :href="`/#/profile`"
                >@{{ member }}</a
              >
              <a v-else :href="`/#/${req}`">@{{ req }}</a>
            </h3>
            <div>
              <button v-on:click="respond(req, true)">Accept</button>
              <button v-on:click="respond(req, false)">Reject</button>
            </div>
          </div>
        </div>
        <button class="modal-default-button" @click="$emit('close')">OK</button>
      </div>
      <div v-else class="modal-container">
        <div class="modal-header">
          <h3>Members</h3>
        </div>

        <div class="modal-body">
          <div class="names" v-for="member in members">
            <h3 class="author">
              <a v-if="$store.state.username === member" :href="`/#/profile`"
                >@{{ member }}</a
              >
              <a v-else :href="`/#/${member}`">@{{ member }}</a>
            </h3>
            <div>
              <p v-if="admins.includes(member)">Admin</p>
              <button
                v-else-if="admins.includes($store.state.username)"
                v-on:click="makeAdmin(member)"
              >
                Make Admin
              </button>
              <button
                v-if="
                  owner === $store.state.username &&
                  member !== $store.state.username
                "
                v-on:click="makeOwner(member)"
              >
                Make Owner
              </button>
            </div>
          </div>
          <button class="modal-default-button" @click="$emit('close')">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MembersModal",
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
    fetchData() {
      this.admins = this.group.admins;
      this.members = this.group.members;
      this.requests = this.group.requests;
      this.owner = this.group.owner;
    },
    makeAdmin(username) {
      const params = {
        method: "PUT",
        body: JSON.stringify({
          groupName: this.group.groupName,
          username: username,
        }),
        url: `/api/groups/admins`,
        callback: () => {
          this.$store.commit("alert", {
            message: `Successfully ${
              response ? "approved" : "rejected"
            } ${req} to join group!`,
            status: "success",
          });
        },
      };
      this.request(params);
    },
    makeOwner(username) {
      const params = {
        method: "PUT",
        body: JSON.stringify({
          groupName: this.group.groupName,
          username: username,
        }),
        url: `/api/groups/owner`,
        callback: () => {
          this.$store.commit("alert", {
            message: `Successfully ${
              response ? "approved" : "rejected"
            } ${req} to join group!`,
            status: "success",
          });
        },
      };
      this.request(params);
    },
    respond(req, response) {
      const params = {
        method: "PUT",
        body: JSON.stringify({
          groupName: this.group.groupName,
          username: req,
          response: true,
          accept: response,
        }),
        url: `/api/groups`,
        callback: () => {
          this.$store.commit("alert", {
            message: `Successfully ${
              response ? "approved" : "rejected"
            } ${req} to join group!`,
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
.names {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 30px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
