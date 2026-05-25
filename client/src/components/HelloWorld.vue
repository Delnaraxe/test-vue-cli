<template>
  <v-container>

    <v-card>
      <v-card-title >
      "Hello focking world !" This is a v-card-title 
      </v-card-title>
      <div class="text-center">
        <p>Variable 'test' dans le .env du front => {{ test }}</p>
        <p>Variable 'TEST_CONFIG' dans un dossier /config.js => {{ TEST_CONFIG }}</p>
        <p>Retour BackEnd + Computed variable => {{ varExempleComputed }}</p>
      </div>
    </v-card>

    <v-card class="text-center display-flex align-center">
      <div>
        <p>Appuye pour envoyer une requete HTTP</p>
        <v-btn @click="getInformations()">method : getInformations()</v-btn>
      </div>
      <div>
        <p>Retour requete HTTP : "response.data"</p>
        <p>{{ this.informations }}</p>
      </div>
    </v-card>

  </v-container>
</template>

<script>
/** Dossier : * ./-> courant, ../-> parent, ../../-> parent du parent, @/-> src/ */ 
import HelloWorldServices from '../services/HelloWorldServices.js';
import { TEST_CONFIG } from '../config/config.js';

export default {
  name: 'HelloWorld',

  data() {
    return {
      test: process.env.VUE_APP_GLOBAL_TEST, // @.env
      TEST_CONFIG: TEST_CONFIG, // @config/config.js
      informations: {}, // Fetch via method getInformation()
    }
  },

  computed: {
    varExempleComputed() {
      return ">>This is a computed Data !<<";
    },
  },

  methods: {
    async getInformations() {
      const response = await HelloWorldServices.getInfo();
      this.informations = response.data
      console.log("response de getInfo()",response);
    },
  },

  created() {
    console.log(" Variable 'test' appelé par 'process.env.' dans '.env'  =>", this.test);
    console.log(" Variable 'TEST_CONFIG' dans 'config.js' ", TEST_CONFIG);
  },
}
</script>

<style>

</style>