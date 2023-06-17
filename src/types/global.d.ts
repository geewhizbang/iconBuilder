declare global {
  type JSONPrimitive = string | number | boolean | null
  type JSONValue = JSONPrimitive | JSONObject | JSONArray
  type JSONObject = { [member: string]: JSONValue }

  //example of custom interface
  interface JSONArray extends Array<JSONValue> {}

}

export interface ScrollElement {
  width: number;
  height: number;
}

export interface ScrollRuler {
  start: number;
  end: number;
}

export interface ScrollData {
  scrollArea: ScrollElement;
  drawingPane: ScrollElement;
  rulerHorz: ScrollRuler;
  rulerVert: ScrollRuler;
  majorTickWidth: number;
  scale: number;
  hatches: number;
  scrollX: number;
  scrollY: number;
  debug: string;
}

export interface ActionHandlerKeyMap {
  [key: string]: {[key: string]: string};
};

export interface KeyHandlerError { 
  keyCode: string;
  message: string; 
};

export interface KeyHandlerMap {
  states: { [index: string] };
  actions: { [index: string] };
}

export interface ChangeValue {
  name: string;
  value: number;
}

export type ActionHandlerExec = (a, b : actionHandler) => void;

export type HslColorKeys = | 'h' | 's' | 'l';

export type HslColor = { 
  [key in HslColorKeys]: number;
}
export type RgbColorKeys = | 'r' | 'g' | 'b';

export type RgbColor = {
  [key in RgbColorKeys]: number;
}

export type AccordionKeys = | "open" | "disabled";

export type AccordionPanelState = {
  [key in AccordionKeys]: boolean; 
};

export type AccordionState = {
  [key: string]: AccordionPanelState;
}

export type AccordionData = {
  state: AccordionState;
  height: number,
  headerHeight: number,
}

export type AccordionStates = {
  [key: string]: AccordionData;
}

export type AccordionChildMap = {
  [key: string]: string;
}

export type AccordionPropKeys = | 'isVert' | 'allOpen'
export type AccordionProps = {
  [key in AccordionPropKeys]: boolean;
}

export type ActionHandler = () => void;

export type AccordionAction = (open: boolean, disabled: boolean) => {};

