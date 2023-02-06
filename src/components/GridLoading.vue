<script lang="ts" setup>

import GridElement from './GridElement.vue'

const props = defineProps({
    options: {
        type: Object,
        default: (() => {}),
    }
});

function randomSpan(min : number, max: number){

    let span = Math.floor(Math.random() * max) + min;

    return span;
}

</script>

<template>
    <GridElement 
        v-for="n in options.numberOfElements"
        :options="{ 
            style: {
                backgroundColor: '#d3d3d3',
                animation: 'pulse',
                spanRow: randomSpan(1, 2),
                spanColumn: randomSpan(1, 2),
            },
        }"
    >
    </GridElement>
</template>