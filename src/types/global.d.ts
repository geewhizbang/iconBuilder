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

export type HsvColorKeys = | 'h' | 's' | 'v';

export type HsvColor = { 
  [key in HsvColorKeys]: number;
}

export type RgbColorKeys = | 'r' | 'g' | 'b';

export type RgbColor = {
  [key in RgbColorKeys]: number;
}

export type AccordionPanelConfigKeys = | "open" | "disabled";

export type AccordionPanelConfig = {
  [key in AccordionPanelConfigKeys]: boolean;
};

export type AccordionConfig = {
  [key: string]: AccordionPanelConfig;
}

export type AccordionPropKeys = | 'isVert' | 'allOpen'
export type AccordionProps = {
  [key in AccordionPropKeys]: boolean;
}

export type AccordionSizeHandler = (height: string) => void;

export type AccordionPanelChange = (open: boolean, disabled: boolean, height: string) => {};

export type AccordionData = {
  config: AccordionConfig;
  props: AccordionProps;
  parentRef: HTMLElement;
  childCount: number;
}

export type AccordionAction = () => void;

export type AccordionPanelData = {
  headerRef: HTMLElement;
  changeHandler: AccordionPanelChange;
}

export type AccordionStates = {
  [key: string]: AccordionData;
}

export type AccordionChildMap = {
  [key: string]: string;
}


