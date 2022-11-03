<!-- Form for creating freets (block style) -->
<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateFreetForm",
  mixins: [BlockForm],
  data() {
    return {
      url: "/api/freets",
      method: "POST",
      hasBody: true,
      fields: [{ id: "content", label: "Content", value: ""}],
      options: ["Myself"],
      title: "Create a freet",
      refreshFreets: true,
      selected: "Myself",
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
  },
};
</script>
