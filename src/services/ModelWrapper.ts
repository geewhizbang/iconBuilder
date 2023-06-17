import { computed } from "vue";
export function useModelWrapper(
  props: { [x: string]: any },
  emit: (arg0: string, arg1: any) => void,
  name = "modelValue"
) {
  return computed({
    get: () => {
      return props[name];
    },
    set: (value: string) => {
      return emit("update:" + name, value)
    }
  });
}