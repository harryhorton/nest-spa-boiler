<template>
  <v-card :loading="submitting">
    <v-card-title>Login</v-card-title>
    <form @submit.prevent="submit">
      <v-card-text>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-text-field label="Email" v-model="formData.email"></v-text-field>
        <v-text-field
          label="Password"
          v-model="formData.password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text data-cy="">Sign Up</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" large>Log In</v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      submitting: false,
      error: null,
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async submit() {
      this.submitting = true
      this.error = null
      try {
        await this.$auth.loginWith('local', { data: this.formData })
      } catch (e) {
        this.error = e.message
      }
      this.submitting = false
    }
  }
})
</script>
