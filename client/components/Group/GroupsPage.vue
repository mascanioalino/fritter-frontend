<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h1>Groups</h1>
        <h3>@{{ this.username ? this.username : $store.state.username }}</h3>
      </header>
      <CreateGroup v-on:creation="fetchData" />
      <section class="groups">
        <div class="group">
          <GroupComponent
            v-on:selection="select"
            v-on:deletion="fetchData"
            v-for="group in groups"
            :key="group._id"
            :group="group"
            :selected="selected"
          />
        </div>
        <GroupProfile
          v-if="selected.group"
          ref="groupProfile"
          :group="selected.group"
        />
      </section>
    </section>
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
    return { alerts: {}, groups: {}, selected: {} };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
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
        console.log(res);
        this.$set(this.selected, "group", res[0]);
        console.log(this.selected);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async select(g) {
      await this.$set(this.selected, "group", g);
      await this.$refs.groupProfile.fetchData();
      // await this.$refs.fetchData();
    },
  },
};
</script>

<style scoped>
.groups {
  flex-direction: row;
}
.group {
  width: 33%;
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
</style>
