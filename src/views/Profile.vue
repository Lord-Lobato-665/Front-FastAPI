<template>
<ProfileForm />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProfileForm from '../components/Profile.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    ProfileForm
  }
})
</script>
