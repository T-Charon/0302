import { ref, watchEffect, watch, reactive, toRef, toRaw ,onMounted} from "vue";
import { merge } from "lodash";

import store from "store";
import defaultSetting from "../../config/setting.json"

export function useclickOutside(domRef, callback) {
  onMounted(function () {
    //执行的时机是在template挂载到页面之后
    //引用数据类型 value属性是null 异步获取节点然后赋值给value
    document.addEventListener("click", (e) => {
      if (!domRef.value?.contains(e.target)) {
        callback();
      }
    })
  })
}
// 发送请求
export function useApi(api, option = {}) {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(option.defalutData ?? null);
  const run = () => {
    api()
      .then((res) => {
        data.value = res.data;
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 手动
  if (option.manual) {
    return {
      data,
      error,
      loading,
      run,
    };
  }
  run();
  return { data, error, loading };
}

export function useSetting(key) {
  const config = reactive({ setting: null });
  const settingFromCache = store.get('setting');
  if (!settingFromCache) {
    config.setting = defaultSetting;
    store.set('setting', defaultSetting)
  } else {
    config.setting = settingFromCache;
  }

  const updateSetting = (parmas) => {
    const updateData = merge(config.setting, { layout: { ...parmas } })
    config.setting = updateData;
    store.set('setting', updateData)
  };
  return { setting: toRef(config, "setting"), updateSetting };
}
