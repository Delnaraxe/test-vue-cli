<template>
  <v-container>
    Hello focking world ! 
    <div>
      <p>Variable 'test' dans le .env du front = {{ test }}</p>
      <p>Variable 'TEST_CONFIG' dans un dossier /config.js = {{ TEST_CONFIG }}</p>
      <p>Computed variable = {{ varExempleComputed }}</p>
    </div>
  </v-container>
</template>

<script>
import { TEST_CONFIG } from '../config/config.js';

export default {
  name: 'HelloWorld',

  data() {
    return {
      test: process.env.VUE_APP_GLOBAL_TEST,
      TEST_CONFIG: TEST_CONFIG
    }
  },

  computed: {
    varExempleComputed() {
      return 'une variable computed !';
    },
  },

  created() {
    console.log(" Voici le 'test' dans '.env' appelé par 'process.env.' =>", this.test);
    console.log(" Voici le 'TEST_CONFIG' dans 'config.js' ", TEST_CONFIG);
  },
}
</script>

<style>

</style>