<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 z-20" v-show="visible"></div>
  <div class="inline-block relative"  >
    <!-- 内置组件slot 它的作用是对你传递的子标签的引用 指定渲染位置 -->
    <span class="inline-block" @click.stop="show"><slot></slot></span>

    <!-- 下拉菜单 -->
    <div v-show="visible"
      ref="close"
      class="absolute w-[160px] border-[1px] border-[#454545] rounded-sm bg-[#252526] flex flex-col z-30">
      <div v-for="(item, index) in attrs.data" :key="index" @click.stop="triggerEvent(index,item)" 
      :class="['text-[12px] flex-1 m-[2px]  flex items-center gap-2 min-h-[28px]',
        { 'text-[#686868]': item.disable },
        { 'hover:bg-[#007ACC]': !item.disable },
        { 'cursor-not-allowed': item.disable }]">
        <div class="w-[16px] h-[16px]">
          <Icon icon="si:check-duotone" v-show="iconVisible[index]" width="16" height="16" style="color: #eee"
          class="ml-[5px]" />
        </div>
        <div>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup>

// useAttrs 自定义组件
// defineEmits 自定义组件事件
import { ref, useAttrs ,defineEmits} from "vue"
import {useclickOutside} from "@/hooks/index";
import { Icon } from "@iconify/vue";
// script setup属性的作用：可以直接使用组合式API

const attrs = useAttrs();
const visible = ref(false);
const close = ref(null);
const iconVisible = ref( attrs.data.map(() => true));


const show = ()=> {
  visible.value = true
}
const hide = ()=> {
  visible.value = false
}

const emit = defineEmits('[checked]')

const triggerEvent = (index,item) =>{
  // 自定义事件 defineEmits
  emit('checked',item)
  if(!item.disable){
    hide();
  }
  iconVisible.value[index] = !iconVisible.value[index];
}

useclickOutside(close,hide)
</script>