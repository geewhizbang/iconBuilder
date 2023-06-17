
import type { 
  AccordionChildMap,
  AccordionStates,
  AccordionData,
  AccordionProps,
  AccordionKeys,
  AccordionAction,
  AccordionPanelState,
} from '@/types/global';

class AccordionServiceInstance {
  #childMap: AccordionChildMap;
  #datas: AccordionStates;
  #props: { [key: string] : AccordionProps };
  #actionHandlers: { [key: string] : AccordionAction }
  #nameIndex: number;
   
  constructor() {
    this.#childMap = {};
    this.#datas = {};
    this.#props = {};
    this.#nameIndex = 0;
    this.#actionHandlers = {};
  }

  registerParent(data: AccordionData, isVert: boolean, allOpen: boolean) : string {
    console.log("ParentHeight: " + data.height);
    const parentName = "accordion" + this.#nameIndex++;
    this.#props[parentName] = {
      isVert: isVert,
      allOpen: allOpen,
    } 
    this.#datas[parentName] = data;
    return parentName;
  }

  registerChild(childName: string, onChange: AccordionAction, headerHeight: number) : string {
    
    let foundParent = "";
    console.log("set headerHeight: " + headerHeight);
    
    const keys = Object.keys(this.#datas)
    for (let i=0; i < keys.length && foundParent == ""; i++) {
      const key = keys[i];
      const parentKeys = Object.keys(this.#datas[key].state);
      if (parentKeys.indexOf(childName) > -1) {
        foundParent = key;
        this.#childMap[childName] = key;
        this.#actionHandlers[childName] = onChange;
        this.#datas[foundParent].headerHeight = headerHeight;
      } else {
        console.log("AccordionService could not find parent for: " + childName);
      }
    }
    return foundParent;
  }

  getPanelHeight(childName: string) : string {
    const stateName = this.#childMap[childName];
    const data = this.#datas[stateName]
    const state = data.state;
    const props = this.#props[stateName];
    const childState = state[childName];
    const childCount = Object.keys(state).length;
    return (childState.disabled || 
      !childState.open) ? "0" :
        props.allOpen ? "auto" : (data.height - childCount * (data.headerHeight + 8) + "px");
  }

  getChildState(childName: string) : AccordionPanelState {
    const stateName = this.#childMap[childName];
    return this.#datas[stateName].state[childName];
  }

  getChildProps(childName: string) : AccordionProps {
    const stateName = this.#childMap[childName];
    return this.#props[stateName];
  }

  getData(parentName: string) : AccordionData {
    return this.#datas[parentName];
  }

  setHeight(parentName: string, height: number) : void {
    console.log("set height: " + height);
    this.#datas[parentName].height = height;
    const state = this.#datas[parentName].state;

    Object.keys(state).forEach( (x) => {
      console.log(x + "| open:" + state[x].open + "| disabled:" + state[x].disabled)
      this.#actionHandlers[x](state[x].open, state[x].disabled);
    });
  }

  changeChildState(childName : string, property: AccordionKeys, value: boolean) : void {
    const stateName = this.#childMap[childName];
    const props = this.#props[stateName];
    const state = this.#datas[stateName].state;
    if (!props.allOpen && property == "open" && value) {
      Object.keys(state).forEach( (x) => {
        if (x == childName) {
          state[x].open = true;
        } else {
          state[x].open = false;
        }
      });
    } else {
      state[childName].open = value;
    }
    Object.keys(state).forEach( (x) => {
      console.log(x + "| open:" + state[x].open + "| disabled:" + state[x].disabled)
      this.#actionHandlers[x](state[x].open, state[x].disabled);
    });
  }
 }

 export const AccordionService = new AccordionServiceInstance();


