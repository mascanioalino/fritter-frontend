<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateFolder",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/bookmarks",
      method: "POST",
      hasBody: true,
      setUsername: false,
      fields: [{ id: "folder", label: "Folder name", value: "" }],
      title: "Create folder",
      callback: () => {
        const message = "Successfully created a folder!";
        this.$router.push({ name: "Bookmark" });
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>
