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
