<template>
  <div>
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <input
          class="groupName"
          placeholder="Group name"
          type="text"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <div class="postGroup">
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

export default {
  name: "CreateGroup",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/groups",
      method: "POST",
      hasBody: true,
      setUsername: false,
      fields: [{ id: "groupName", label: "Group name", value: "" }],
      title: "Create group",
      callback: () => {
        const message = "Successfully created a group!";
        this.$emit("creation");
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>

<style>
.groupName {
  border: 1px solid rgb(185, 185, 185);
}
.postGroup {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.postButton {
  border: 0;
  cursor: pointer;
  background-color: rgb(185, 185, 185);
  border-radius: 10%;
  height: min-content;
  padding: 5px;
  margin-left: 10px;
}
</style>
