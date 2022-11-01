<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateCommentForm',
  mixins: [BlockForm],
  props: {
    commentId: {
      type: String,
      required: false,
    },
    freetId: {
        type: String,
        required: false
      }
  },
  data() {
    return {
      url: '/api/comments',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        this.commentId ? {id: 'commentId', label: '', value: this.commentId} : {},
        this.freetId ? {id: 'freetId', label: '', value: this.freetId} : {}
      ],
      title: 'Create a comment',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
