<script lang="ts" setup>

import { ref, onMounted, onUnmounted, Ref, provide, PropType } from 'vue'

import { getOffsetTop } from '../js/utils'

import '../assets/styles/GridComponent.css'

import GridLoading from './GridLoading.vue';

export interface GridComponentStyle {
    gap?: string;
    minColumns?: number;
    maxColumns?: number;
    minColumnWidth?: string;
    autoFitFill?: string;
    elementAspectRatio?: string;
    elementBorderRadius?: string;
}

export interface GridComponentLoadingStyle {
    numberOfElements: Number;
}

export interface GridComponentOptions {
    template?: string;
    style?: GridComponentStyle;
    disableInfiniteScroll?: boolean;
    disableInfiniteScrollAnimation?: boolean;
    loadingStyle?: GridComponentLoadingStyle;
}

const props = defineProps({
    options: {
        type: Object as PropType<GridComponentOptions>,
        default: () => ({}) as GridComponentOptions,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['scroll']);

// Variables
const options : GridComponentOptions = getOptions();

const style : GridComponentStyle = getStyle();

const loadingStyle : GridComponentLoadingStyle = getLoadingStyle();

let component : HTMLElement;

let componentWidth : Ref<number> = ref(0);

let frUnitValue : Ref<string> = ref('');

const windowResizeFunctions = () => {
    getFrUnitValue();
    getGridWidth();
}
// *********************

onMounted(() => {

    // Get itself as HTMLElement to access size props, etc
    component = document.querySelector('.vue-grid-content-grid') as HTMLElement;

    // Gets #vue-grid-grid-fr-fixer element height for CSS fr unit default value then hides it
    getFrUnitValue();

    // Gets grid width for limiting horizontal span that could break the layout
    getGridWidth();

    // Add infinite scroll event to window
    if(!options.disableInfiniteScroll)
        window.addEventListener('scroll', reachBottom);

    // Keep grid proportions by updating CSS fr unit when resizing window
    window.addEventListener('resize', windowResizeFunctions);
})

onUnmounted(() => {

    // Remove infinite scroll event from window
    window.removeEventListener('scroll', reachBottom);

    // Remove CSS fr unit update when resizing window
    window.addEventListener('resize', windowResizeFunctions);
})

// Set options default value
function getOptions() {

    // Gets options object except for the nested object properties
    var { style, loadingStyle, ...options } = props.options as GridComponentOptions;

    // Allow default values for nested properties
    return {
        ...{
            template: 'standard',
            disableInfiniteScroll: false,
            disableInfiniteScrollAnimation: false,
        },
        ...options
    }

}

// Set style default value
function getStyle() {

    var styleProps = props.options.style || {} as GridComponentStyle;

    // Prevents bug that breaks the layout when auto-fit is set
    if(styleProps.autoFitFill && options.template != 'standard')
        styleProps.autoFitFill = 'auto-fill';

    // Allow default values for nested properties
    return { 
        ...{
            gap: '1rem',
            minColumns: 1,
            maxColumns: 4,
            minColumnWidth: '12.5rem',
            elementAspectRatio: '1 / 1',
            elementBorderRadius: '5px',
            autoFitFill: 'auto-fill',
        },
        ...styleProps
    }
}

// Set loadingStyle default value
function getLoadingStyle(){
    
    var loadingStyleProps = props.options.loadingStyle || {} as GridComponentLoadingStyle;

    // Allow default values for nested properties
    return { 
        ...{
            numberOfElements: 10,
        },
        ...loadingStyleProps
    }
}

// Function for detecting the scrolling has reached the bottom of the component
function reachBottom(){ 

    // Avoid lots of triggers when at the bottom of the component
    if(props.loading)
        return;

    // Adds relative positioned parents which element.offsetTop does not consider
    let offsetTop = getOffsetTop(component);

    // Bottom pixel of viewport >= bottom pixel of component
    if(window.scrollY + window.innerHeight >= offsetTop + component.scrollHeight)
        emit('scroll');
}

function getFrUnitValue(){

    // Get reference element in the DOM
    var hiddenElement : HTMLElement | null = document.getElementById('vue-grid-grid-fr-fixer');

    if(!hiddenElement)
        return;

    // Shows element if hidden for it to take space in the DOM (window resize event listener only)
    hiddenElement.style.display = '';

    // Set default CSS fr unit's value to reference element's height
    frUnitValue.value = hiddenElement.scrollHeight + 'px';

    // Hides default element so it doesn't take up space in the DOM
    hiddenElement.style.display = 'none';
}

function getGridWidth(){
    // Get own width
    componentWidth.value = component.offsetWidth;
}

function showElements(){
    if(!frUnitValue.value)
        return false;

    return true;
}

provide('grid-template', options.template);
provide('grid-width', componentWidth);
provide('grid-max-columns', style.maxColumns);
provide('grid-gap', style.gap);
provide('fr-unit-value', frUnitValue);

</script>

<template>
    <div class="vue-grid-content-grid" :data-layout="options.template">
        <slot name="grid-elements" v-if="showElements()"></slot>

        <!-- Grants value of CSS fr unit is equal to a 'grid-row: span 1' element height -->
        <article id="vue-grid-grid-fr-fixer" class="vue-grid-content-item"></article>

        <!-- Loading elements animation -->
        <GridLoading 
            v-if="props.loading && !options.disableInfiniteScrollAnimation"
            :options="loadingStyle"
        ></GridLoading>
    </div>
</template>

<style scoped>
.vue-grid-content-grid {
  --vue-grid-min-columns: v-bind('style.minColumns');
  
  --vue-grid-max-columns: v-bind('style.maxColumns');

  --vue-grid-min-column-width: v-bind('style.minColumnWidth');

  --vue-grid-gap: v-bind('style.gap');

  --vue-grid-auto-fit-fill: v-bind('style.autoFitFill');

  --vue-grid-aspect-ratio: v-bind('style.elementAspectRatio');

  --vue-grid-border-radius: v-bind('style.elementBorderRadius');

  --vue-grid-fr: v-bind('frUnitValue');
}

#vue-grid-grid-fr-fixer {
    visibility: hidden;
}

</style>