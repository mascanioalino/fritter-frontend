<template>
  <main>
    <section v-if="$store.state.username" class="groupPage">
      <div class="groups">
        <div class="title">
          <h1>Groups</h1>
          <button @click="toggle">
            <img
              style="width: 40px; height: 40px"
              :src="require('@/public/assets/Plus.svg')"
            />
          </button>
        </div>

        <h3 style="margin: 5px; color: rgb(100, 100, 100)">
          @{{ this.username ? this.username : $store.state.username }}
        </h3>
        <CreateGroup
          v-if="this.open"
          v-on:creation="fetchData"
          class="createGroup"
        />
        <div class="group">
          <GroupComponent
            v-on:selection="select"
            v-on:deletion="fetchData"
            v-for="group in groups"
            :key="group._id"
            :group="group"
            :selected="selected"
            ref="groupComponent"
          />
        </div>
      </div>

      <GroupProfile
        v-if="selected.group"
        class="freets"
        ref="groupProfile"
        :group="selected.group"
        v-on:update="(g) => this.update(g)"
        v-on:deletion="fetchData"
      />
    </section>
    <!-- </section> -->
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login"> Sign in </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import GroupProfile from "@/components/Group/GroupProfile.vue";
import GroupComponent from "@/components/Group/GroupComponent.vue";
import CreateGroup from "@/components/Group/CreateGroup.vue";

export default {
  name: "GroupsPage",
  props: {
    username: {
      required: false,
      type: String,
    },
  },
  components: { GroupComponent, CreateGroup, GroupProfile },
  data() {
    return { alerts: {}, groups: {}, selected: {}, open: false };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    async update(g) {
      this.fetchData().then(this.select(g));
    },
    async fetchData() {
      const url = `/api/groups?username=${
        this.username ? this.username : this.$store.state.username
      }`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.groups = res;
        this.$set(
          this.selected,
          "group",
          this.groups[0] ? this.groups[0] : null
        );
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async select(g) {
      await this.$set(this.selected, "group", g);
      await this.$refs.groupProfile.fetchData();
    },
  },
};
</script>

<style scoped>
.groupPage {
  flex-direction: row;
}
.groups {
  width: 33%;
  border-right: 1px solid;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  height: 100vmax;
}

section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  flex-direction: column;
  margin: 5px;
  align-items: left;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.title {
  display: flex;
  justify-content: space-between;
}
.title button {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
.freets {
  width: 70%;
}
.createGroup {
  width: 90%;
  align-self: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
