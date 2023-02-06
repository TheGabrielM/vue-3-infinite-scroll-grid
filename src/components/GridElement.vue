<script lang="ts" setup>

import { Ref, ref, inject, onMounted, onUnmounted, PropType } from 'vue';

import { getHexOpacity } from '../js/utils'

export interface GridElementStyle {
    backgroundColor?: string;
    animation?: string;
    spanRow?: number;
    spanColumn?: number;
}

export interface GridElementHover {
    disableHover?: boolean;
    backgroundColor?: string;
    opacity?: number;
    textColor?: string;
    textFontSize?: string;
}

export interface GridElementOptions {
    textContent?: string;
    imagePath?: string;
    imageAlt?: string;
    style?: GridElementStyle;
    hover?: GridElementHover;
}

const props = defineProps({
    options: {
        type: Object as PropType<GridElementOptions>,
        default: () => ({}) as GridElementOptions,
    }
});

// Variables
const options : GridElementOptions = getOptions();

const style : GridElementStyle = getStyle();

const hover : GridElementHover = getHover();

let gridTemplate : string = inject('grid-template') as string;

let gridWidth : Ref<number> = inject('grid-width') as Ref<number>;

let gridGap : string = inject('grid-gap') as string;

let frUnitValue : Ref<string> = inject('fr-unit-value') as Ref<string>;

let spanRow = getSpanRow();

let spanColumn : Ref<number> = ref(getSpanColumn());

let maxHeight = getMaxHeight();

let hoverBackgroundColor = hover.backgroundColor + getHexOpacity(hover.opacity);
// *****************

onMounted(async () => {

    // Add max span column calculation on window resize
    window.addEventListener('resize', () => {
        spanColumn.value = getSpanColumn();
    });
})

onUnmounted(() => {

    // Remove max span column calculation on window resize
    window.removeEventListener('resize', () => {
        spanColumn.value = getSpanColumn();
    });
})

// Set options default value
function getOptions() {

    // Gets options object except for the nested object properties
    var { style, hover, ...options } = props.options as GridElementOptions;

    // Allow default values for nested properties
    return {
        ...{
            textContent: '',
            imagePath: '',
            imageAlt: '',
        },
        ...options
    }

}

// Set style default value
function getStyle() {

    var styleProps = props.options.style || {} as GridElementStyle;

    // Allow default values for nested properties
    return { 
        ...{
            backgroundColor: '#000000',
            animation: '',
            spanRow: 1,
            spanColumn: 1,
        },
        ...styleProps
    }
}

// Set hover default value
function getHover() {

    var hoverProps = props.options.hover || { disableHover: true } as GridElementHover;

    // Allow default values for nested properties
    return { 
        ...{
            backgroundColor: '',
            opacity: 0.5,
            textColor: '#ffffff',
            textFontSize: '1rem'
        },
        ...hoverProps
    }
}


// Treat span row
function getSpanRow() {

    if(gridTemplate === 'standard')
        return 0;

    return style.spanRow;
}

// Treat span column
function getSpanColumn() {

    if(gridTemplate === 'standard' || gridTemplate === 'free-height')
        return 0;

    // Removes all non-numeric characters except dots from frUnitValue in order to remove the unit
    // then parses it to float
    var absoluteFrUnitValue : number = parseFloat(frUnitValue.value.replace(/[^\d.-]/g, ''));

    // Estimates the number of grid columns currently appearing on viewport
    // it possibly breaks with a very large gap, as it does not sums it yet
    var gridMaxColumns = Math.floor(gridWidth.value / absoluteFrUnitValue);

    // Avoids trying to fit the column span beyond the column limit, which would break the layout
    return Math.min(Number(style.spanColumn), gridMaxColumns);
}

// Only necessary for all-free template to be able to ignore default aspect ratio 
// and set column span without streching the height
function getMaxHeight(){
    if(gridTemplate === 'standard' || gridTemplate === 'free-height')
        return '';

    // Sums gap value proportionally to the amount of rows in the grid
    var gapProportionalValue = `(${gridGap} * ${spanRow} - 1 / ${spanRow})`;

    // Set max height equal to the row span height considering CSS fr unit's default value
    return `calc((${frUnitValue.value} * ${spanRow}) + ${gapProportionalValue})`;
}

</script>

<template>
    <article class="vue-grid-content-item">
        <img :src="options.imagePath" :alt="options.imageAlt" />

        <div v-if="!hover.disableHover" class="vue-grid-hover-template">
            <p>{{ options.textContent }}</p>
            
            <div class="vue-grid-hover-button-list">
                <slot name="hover-buttons"></slot>
            </div>
        </div>
    </article>
</template>

<style scoped>

.vue-grid-content-item {
    --vue-grid-background-color: v-bind('style.backgroundColor');

    --vue-grid-hover-background-color: v-bind('hoverBackgroundColor');

    --vue-grid-hover-text-color: v-bind('hover.textColor');

    --vue-grid-hover-text-font-size: v-bind('hover.textFontSize');

    grid-row: span v-bind('spanRow');

    grid-column: span v-bind('spanColumn');

    max-height: v-bind('maxHeight');

    height: 100%;
}
</style>

<style>

@keyframes pulse {
    0% {background-color: #d3d3d3;}
    50% {background-color: #a8a5a5;}
    100% {background-color: #d3d3d3;}
}

.vue-grid-content-item {
    animation-duration: 2s;

    animation-name: v-bind('style.animation');

    animation-iteration-count: infinite;
}
</style>