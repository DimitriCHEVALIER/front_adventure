<template>
  <v-footer color="transparent" fixed>
    <v-row justify="center" no-gutters>
      <v-btn
        color="secondary text-transform-none"
        dark
        rounded
        class="my-2 mr-2 text-transform-none"
        @click="cancel"
      >
        {{ cancelMessage }}
      </v-btn>
      <v-btn
        color="primary text-transform-none"
        dark
        rounded
        :loading="loading"
        class="my-2 text-transform-none"
        @click="save"
        :disabled="isDisabled"
      >
        {{ confirmMessage }}
      </v-btn>
    </v-row>
  </v-footer>
</template>
<script>
export default {
  name: "footer-action",
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    cancelMessage: {
      type: String,
      default: "Cancel"
    },
    confirmMessage: {
      type: String,
      default: "Save"
    }
  },
  methods: {
    save() {
      this.$emit("save");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
