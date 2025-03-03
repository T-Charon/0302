<template>
  <div ref="elementRef" class="w-screen h-screen overflow-hidden flex flex-col">
    <!-- 首行栏 -->
    <div class="w-full h-[35px] bg-[#3c3c3c] flex items-center justify-between">
      <div class="h-[35px] w-[20px]"></div>
      <div class="flex gap-2">
        <div class="h-[35px] flex items-center justify-center">
          <Icon icon="mdi-light:arrow-left" width="22" height="22" style="color: #858585" />
        </div>
        <div class="h-[35px] flex items-center justify-center">
          <Icon icon="lets-icons:arrow-right-light" width="22" height="22" style="color: #858585" />
        </div>

        <!-- 顶部搜索栏 -->
        <div class="flex items-center justify-center">
          <input type="text" v-bind:placeholder="reponame" readonly
            class="outline-none w-[421px] h-[24px] bg-[#4b4b4b] border-[1px] border-[#737373] rounded-md text-[12px] text-center cursor-pointer" />

          <!-- 弹窗 -->
          <div v-show="false"
            class="w-[586px] h-[222px] bg-[#303031] flex flex-col absolute top-1 rounded-md shadow-md z-30">
            <div class="h-[35px] flex items-center justify-center">
              <input type="text" placeholder=" Search files by name (append : to go to line or @ to go to symbol)  "
                class="w-[570px] h-[26px] bg-[#3C3C3C] outline-none border-[1px] border-[#007FD4] text-[12px] caret-[#FFFFFF] pl-2" />
            </div>
            <div class="flex-1 flex flex-col mx-1 text-[12px] text-[#FFFFFF] rounded-md">
              <div class="flex-1 bg-[#04395E] rounded-md indent-3 leading-[22px] font-light">
                <span>Go to files</span>
              </div>
              <div class="flex-1 rounded-md indent-3 hover:bg-[#2A2D2E] leading-[22px] font-light"
                v-for="item in searchTabList" v-bind:key="item">
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 首行右侧布局切换 -->
      <div class="h-[35px] w-[150px] flex justify-end items-center relative pr-2">
        <div class="h-[25px] w-[25px] flex items-center justify-center cursor-pointer hover:bg-[#464646] rounded-md"
          @mouseleave="leftBarTextHidden()" @mouseenter="leftBarTextShow(0)">
          <Icon icon="lucide:layout-panel-left" width="18" height="18" style="color: #cccccc" />
        </div>

        <!-- left -->
        <div class="h-[25px] w-[25px] flex items-center justify-center cursor-pointer hover:bg-[#464646] rounded-md"
          @click.stop="
            updateLayoutSetting({
              leftSideBar: { visible: !setting?.layout.leftSideBar.visible },
            })
            " @mouseleave="leftBarTextHidden()" @mouseenter="leftBarTextShow(1)">
          <Icon v-if="setting?.layout.leftSideBar.visible" icon="ri:layout-column-fill" width="18" height="18"
            style="color: #cccccc" />
          <Icon v-else icon="mingcute:layout-left-line" width="18" height="18" style="color: #cccccc" />
        </div>
        <!-- bottom -->
        <div class="h-[25px] w-[25px] flex items-center justify-center cursor-pointer hover:bg-[#464646] rounded-md"
          @click.stop="
            updateLayoutSetting({
              bottomSideBar: { visible: !setting?.layout.bottomSideBar.visible },
            })
            " @mouseleave="leftBarTextHidden()" @mouseenter="leftBarTextShow(2)">
          <Icon v-if="setting?.layout.bottomSideBar.visible" icon="tabler:layout-bottombar-filled" width="18"
            height="18" style="color: #cccccc" />
          <Icon v-else icon="tabler:layout-bottombar" width="18" height="18" style="color: #cccccc" />
        </div>
        <!-- right -->
        <div class="h-[25px] w-[25px] flex items-center justify-center cursor-pointer hover:bg-[#464646] rounded-md"
          @click.stop="
            updateLayoutSetting({
              rightSideBar: { visible: !setting?.layout.rightSideBar.visible },
            })
            " @mouseleave="leftBarTextHidden()" @mouseenter="leftBarTextShow(3)">
          <Icon v-if="setting?.layout.rightSideBar.visible" icon="tabler:layout-sidebar-right-filled" width="18"
            height="18" style="color: #cccccc" />
          <Icon v-else icon="fluent:layout-column-one-third-right-16-regular" width="18" height="18"
            style="color: #cccccc" />
        </div>

        <div v-show="textVisible" v-text="rightlabText"
          class="absolute h-[25px] border-[1px] rounded-md border-[#454545] bg-[#2d2d2d] text-[12px] text-[#eee] leading-[25px] mr-[0px] px-5 top-8 whitespace-nowrap">
        </div>
      </div>
    </div>

    <div class="flex-1 flex">
      <!-- 左侧图标 -->
      <div class="w-[48px] bg-[#333] flex flex-col items-center">
        <div class="w-[48px] h-[48px] flex justify-center items-center cursor-pointer">
          <Icon icon="garden:github-stroke-12" width="24" height="24" style="color: #eeeeee" />
        </div>

        <!-- 动态渲染部分 -->
        <VueDraggable ref="el" v-model="leftIconList" @end="handleDragEnd" ghost-class="dragging-border"
          :animation="500">
          <div class="w-[48px] h-[48px] flex justify-center items-center cursor-pointer" v-for="item in leftIconList"
            :key="item.id" @click="leftIconIndex = item.id" :class="{ 'border-l-2': leftIconIndex === item.id }">
            <Icon width="24" height="24" :icon="item.name" :class="[
              'text-[#858585] hover:text-[#ffffff]',
              { 'text-[#ffffff]': leftIconIndex === item.id },
            ]" />
          </div>
        </VueDraggable>

        <!-- 底部设置及账号部分 -->
        <div class="w-[48px] flex flex-1 items-center flex-wrap justify-end flex-col">
          <div class="w-[48px] h-[48px] flex justify-center items-center">
            <Icon icon="codicon:account" width="26" height="26" style="color: #858585" />
          </div>
          <div class="w-[48px] h-[48px] flex justify-center items-center">
            <Icon icon="lets-icons:setting-line" width="28" height="28" style="color: #858585" />
          </div>
        </div>
      </div>
      <!-- 目录树 -->
      <div class="w-[307px] bg-[#252526] flex flex-col" v-show="setting?.layout.leftSideBar.visible">
        <div class="flex justify-between items-center text-[#eee] p-2">
          <span class="text-[12px]">EXPLORER</span>

          <div class="inline-block w-[20px] h-[20px] rounded-md hover:bg-[#3C3C3C] cursor-pointer relative"
            v-on:mouseenter="showtip" v-on:mouseleave="hiddentip">
            <DropDown :data="dropdownList" @checked="moreActionCallack">
              <Icon icon="proicons:more" width="22" height="22" style="color: #eeeeee" />
            </DropDown>


            <!-- 提示框 -->
            <div v-show="tipVisible"
              class="w-[170px] h-[22px] border-[1px] rounded-md border-[#454545] text-[12px] indent-2 ml-[-60px] absolute">
              Views and More Actions...
            </div>

          </div>
        </div>
        <div class="flex-1">
          <div class="px-4">
            <li class="text-[#ffffff] text-[13px] mb-[5px] list-none cursor-pointer" @click="item.isOpen = !item.isOpen"
              v-for="item in data">
              <div class="flex items-center">
                <Icon v-if="item.type === '目录'" :icon="item.isOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'
                  " width="14" height="14" style="color: #717783" />
                <Icon v-else icon="lucide:cat" width="14" height="14" style="color: #717783" />
                <span>{{ item.name }}</span>
              </div>

              <ul v-if="item.children" class="pl-10" v-show="item.isOpen">
                <li v-for="children in item.children">
                  <div class="flex items-center">
                    <Icon v-if="children.type === '目录'" :icon="item.isOpen
                      ? 'lucide:chevron-down'
                      : 'lucide:chevron-right'
                      " width="14" height="14" style="color: #717783" />
                    <Icon v-else icon="lucide:cat" width="14" height="14" style="color: #717783" />
                    <span>{{ children.name }}</span>
                  </div>
                </li>
              </ul>
            </li>
          </div>
        </div>
      </div>

      <!-- content -->
      <div class="flex-1 bg-[#1e1e1e] flex flex-col">
        <div class="flex-1 min-h-3"></div>
        <div class=" border-t border-[#414141] flex " v-show="setting?.layout.bottomSideBar.visible"
          :style="{ height: setting?.layout.bottomSideBar.height + 'px' }">
          <div class="h-[3px] w-[100%] hightlight-delay cursor-row-resize">
          </div>
        </div>
      </div>
      <div class="w-[300px] bg-[#252526]" v-show="setting?.layout.rightSideBar.visible">
        <DropDown :data="dropdownList">
          <Icon icon="proicons:more" width="22" height="22" style="color: #eeeeee" />
        </DropDown>
      </div>
    </div>
    <div class="w-full min-h-[22px] bg-[#007acc]"></div>
  </div>
</template>

<script setup>
// 取消dom操作 转而使用指令来间接实现DOM操作
// 在vue.js中指令是操作DOM的唯一方法
// 指令是以v-开头的一种特殊的标签的自定义属性，它具备操作DOM的能力
// vue.js中数据变化（响应式数据） =》 视图更新
// 响应式API的作用 将js数据转换为响应式数据

// v-text 给元素绑定内容文本
// v-on 给元素绑定事件
// v-show 控制元素显示/隐藏 原理是display:none
// v-for 循环渲染 注意点： v-for指令一定要搭配v-band:key="" 当前列表中唯一不变的值 一般绑定id 提升循环渲染效率
// v-band 是给所有标签属性（官方、自定义）绑定值

// 组合式函数需要有组合式API（ref onMounted watchEffect.... ） 的参与
// 为什么要封装组合式函数 为了对状态的复用
// 组合式函数如何正确使用
// 组合式函数只能使用在两个位置：组件的srcipt标签的顶层。其他组合式函数中

import { ref, watchEffect, isRef, unref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import axios from "axios";
import { useApi, useSetting } from "@/hooks/index";
import { VueDraggable } from "vue-draggable-plus";
import DropDown from "@/components/dropdown.vue"

function moreActionCallack({code}) {

  console.log(code)
}
// 左侧菜单栏
const leftIconList = ref([
  { name: "uil:bars", id: 1 },
  { name: "prime:copy", id: 2 },
  { name: "line-md:search", id: 3 },
  { name: "ion:git-branch-outline", id: 4 },
  { name: "codicon:debug-alt", id: 5 },
  { name: "codicon:extensions", id: 6 },
  { name: "icon-park-outline:robot-one", id: 7 },
]);


const dropdownList = [
  { name: "Open Editors", disable: false, code: 1 },
  { name: "Folder", disable: true, code: 2  },
  { name: "Outerline", disable: false , code: 3 },
  { name: "Timeline", disable: false, code: 4  }
];


const righttabList = [
  { iconname: "lucide:layout-panel-left", text: "Customize Layout" },
  {
    iconname: "ri:layout-column-fill",
    text: "Toggle Primary Side Bar(Ctrl+B)",
  },
  { iconname: "gravity-ui:layout-footer", text: "Toggle Panel(Ctrl+J)" },
  {
    iconname: "ri:layout-right-line",
    text: "Toggle Secondary Side Bar(Ctrl+Alt+B)",
  },
];
const searchTabList = [
  "Show and Run Commands",
  "Search for Text %",
  "Go to Symbol in Editor @",
  "Start Debugging debug",
  "Run Task task",
  "More ?",
  "Walkthrough: Setup vs Code Web recently opened",
];

const reponame = ref("T-Charon/bilibili");
const tipVisible = ref(false);

const textVisible = ref(false);

let rightlabText = ref(righttabList[0].text);

function showtip() {
  tipVisible.value = true;
}
function hiddentip() {
  tipVisible.value = false;
}

function leftBarTextShow(index) {
  rightlabText.value = righttabList[index].text;
  textVisible.value = true;
}
function leftBarTextHidden() {
  textVisible.value = false;
}
// 左侧菜单栏
function actionMenu(callback) {
  const leftIconIndex = ref(2);
  watchEffect(function () {
    callback(leftIconIndex.value);
  });
  return { leftIconList, leftIconIndex };
}
const { leftIconIndex } = actionMenu(function (key) {
  switch (key) {
    case 0:
      console.log(0);
      break;
    case 1:
      console.log(1);
      break;
    case 2:
      console.log(2);
      break;
    case 3:
      console.log(3);
      break;
    case 4:
      console.log(4);
      break;
    case 5:
      console.log(5);
      break;
    case 6:
      console.log(6);
      break;
    case 7:
      console.log(7);
      break;

    default:
      break;
  }
});
// 左侧菜单栏拖拽
const handleDragEnd = (event) => {
  // 获取拖拽后的元素新索引
  const newIndex = event.newIndex;
  // 更新高亮索引为当前项的 id
  leftIconIndex.value = leftIconList.value[newIndex].id;
};




// 组合下拉菜单
function useDropDownMenu(option = {}) {
  const visible = ref(false);
  // 点击打开或关闭
  const open = () => {
    if (option.againOpen) visible.value = !visible.value;
    else visible.value = true;
  };
  // 点击下拉菜单时是否关闭自身
  const close = () => {
    if (option.currentClose) {
      visible.value = false;
    }
  };
  return { visible, open, close };
}
const {
  visible: navSearchVisiable,
  open: openNavSearch,
  close: closeNavSearch,
} = useDropDownMenu({ againOpen: false }, { currentClose: false });
// const { visible: moreActionMenuVisible, open: opendMoreActionMenu } =
//   useDropDownMenu({ againOpen: true }, { currentClose: true });

// 发送请求
const { loading, error, data } = useApi(() => axios.get("/api/tree"), {
  defalutData: [],
  // manual:true,
});

// 更改页面布局

//reactive 和 ref
//都是来初始化响应数据的
//开发中能用ref解决就使用ref解决 否则使用reactive
//reactive可以转换为ref
//reactive参数只接受对象 ref参数是任意类型
//reactive在使用时，无论是在script块中还是在template块中，都可以直接通过属性名访问
//ref在使用时，在script块中需要通过.value后跟属性名取值,在template块中可以直接通过属性名访问
//注意：reactive数据可以通过toRef、toRefs这两个API转换为ref响应式数据
//reactive还原原始数据 使用toRaw
//ref还原原始数据  JSON.parse(JSON.stringify(toValue(ref数据)))
const { setting, updateSetting: updateLayoutSetting } =
  useSetting("layout");

function useMoveDistance(elementRef) {
  const distanceX = ref(0);
  const distanceY = ref(0);
  onMounted(() => {
    if (!(isRef(elementRef) && unref(elementRef) instanceof HTMLElement))
      throw new Error("elementRef 不是一个HTML对象");
    unref(elementRef).addEventListener(
      "mousedown",
      ({ x: startX, y: startY }) => {
        const onMousemove = ({ x: currentX, y: currentY }) => {
          distanceX.value = currentX - startX;
          distanceY.value = currentY - startY;
        };
        document.addEventListener("mousemove", onMousemove);
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", onMousemove);
        });
      }
    );
  });

  return { distanceX, distanceY };
}

const elementRef = ref(null);
const { distanceX, distanceY } = useMoveDistance(elementRef);
const currentHeight = setting.value.layout.bottomSideBar.height;
watch([distanceY], () => {
  updateLayoutSetting({
    bottomSideBar: { height: currentHeight - distanceY.value },
  });

});
</script>

<style lang="scss" scoped>
/* 拖拽时顶部边框线 */
.dragging-border {
  border-top: 2px solid #ffffff;
  opacity: 0.5;
}

.hightlight-delay:hover {
  animation: delay 0.8s ease forwards;
}

@keyframes delay {
  0% {
    background-color: transparent;
  }

  50% {
    background-color: transparent;
  }

  100% {
    background-color: #007acc;
  }
}
</style>
