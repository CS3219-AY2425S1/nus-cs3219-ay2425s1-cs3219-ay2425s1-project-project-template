<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.params.sessionId;
const questionId = route.params.questionId;



</script>

<template>
    {{ sessionId }}
    {{ questionId }}
    TEST
</template>
