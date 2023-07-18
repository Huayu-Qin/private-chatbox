<template>
  <div class="upload-section">
    <h2>Upload Documents</h2>
    <q-file v-model="files" label="Choose documents" multiple />
    <q-btn label="Upload" @click="uploadFiles" />
    <q-btn label="Delete" @click="deleteFiles" :disabled="!uploadedFiles.length" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: null,
      uploadedFiles: []
    }
  },
  methods: {
    uploadFiles() {
      // Upload logic here
      this.uploadedFiles.push(...this.files);
      this.$emit('upload', this.files.length);
      this.files = null;
    },
    deleteFiles() {
      this.$emit('delete', this.uploadedFiles.length);
      this.uploadedFiles = [];
    }
  }
}
</script>
