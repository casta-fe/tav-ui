<script setup lang="ts">
import { ref } from 'vue'
import { TaEditor } from '@tav-ui/components/editor'

const editorValue = ref<string>('dasda')
</script>

<template>
  <section class="ta-editor-test" style="width: 80%; height: 100%; margin: 20px auto">
    <TaEditor v-model:value="editorValue" />
    <br />

    <section>
      <h2>Editor content(string) :</h2>
      <br />
      <div>
        {{ editorValue }}
      </div>
    </section>
  </section>
</template>
