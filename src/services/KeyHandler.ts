import type { ActionHandler, KeyHandlerError, KeyHandlerMap } from "@/types/global";

class KeyHandlerService {

  #context: { [key: string]: boolean } = { 'ctrl': false, 'shift': false, 'alt': false };
  #keyOrder: Array<string> = ["ctrl", "shift", "alt"];
  #stateMap: { [key: string]: string } = {};
  #states: { [key: string]: boolean } = {};
  #actions: { [key: string]: Array<{context: Array<string>, action: number}>} = {};
  #active = false;
  #actionHandler: ActionHandler;
  #isRunning = false;
  #contextModes: Array<string> = [];
  #contextModeStates: { [key: string]: boolean } = {};
  #keyCodeLookup: { [key: string]: string } = {};
  #keyMap: { [key: string]: Array<number> } = {
    'a': [65],
    'b': [66],
    'c': [67],
    'd': [68],
    'e': [69],
    'f': [70],
    'g': [71],
    'h': [72],
    'i': [73],
    'j': [74],
    'k': [75],
    'l': [76],
    'm': [77],
    'n': [78],
    'o': [79],
    'p': [80],
    'q': [81],
    'r': [82],
    's': [83],
    't': [84],
    'u': [85],
    'v': [86],
    'w': [87],
    'x': [88],
    'y': [89],
    'z': [90],
    'alt': [18],
    'backspace': [8],
    'ctrl': [17],
    'delete': [46, 40],
    'down': [34, 40],
    'end': [35],
    'enter': [13],
    'esc': [27],
    'f1': [112],
    'f2': [113],
    'f3': [114],
    'f4': [115],
    'f5': [116],
    'f6': [117],
    'f7': [118],
    'f8': [119],
    'f9': [120],
    'f10': [121],
    'f11': [122],
    'f12': [123],
    'home': [36],
    'insert': [45],
    'left': [37],
    'right': [39],
    'shift': [16],
    'space': [32],
    'up': [33, 38],
    'windows': [91]
  };
  
  constructor() {
    // this.#actionHandler  = () => void 
  }
  
  init(map : KeyHandlerMap, handler: ActionHandler) {

    this.#states = {};
    this.#active = true;
    this.#stateMap = map.states;
    Object.keys(map.states).forEach((state, key) =>{
      this.#states[key] = false;
    });

    this.#actions = {};
      Object.keys(map).forEach((keyContext, action) => {
        const s = keyContext.split(".");
        const key = s.pop() as string;
        if (! this.#actions[key]) {
          this.#actions[key] = [];
        }
        this.#actions[key].push({ context: s, action: action });
      });
      
    this.#actionHandler = handler;
    this.run(true);
  };

	#keyHandlerError(message: string, keyCode: string) : {error?: KeyHandlerError} {
		return {error: {keyCode: keyCode, message: message}};
	}
  
  #getKey(event : KeyboardEvent) : string {
  	const keyCode = event.key;
    if (this.#keyCodeLookup[keyCode]) {
      return this.#keyCodeLookup[keyCode];
    } else {
      throw this.#keyHandlerError("Unexpected keyCode", keyCode);
    }
  }

  #getKeyState(key: number) : string {
    const result = new Array<string|number>;
    this.#keyOrder.forEach((keyName: string) => {
      if (this.#context[keyName]) {
        result.push(keyName);
      } 
    });
    result.push(key);
    return result.join(".");
  }

	#getKeyContext(contextState: string) : string {
		const result = [];
		Object.keys(this.#contextModes).forEach((contextName) => {
			if (this.#contextModeStates[contextName]) {
					result.push(contextName);
			};
		});
		result.push(contextState);
		return result.join(".");
	}

  #setKeyContext(event: KeyboardEvent, isTrue: boolean) : string {
    const key = this.#getKey(event);
		Object.keys(this.#stateMap).forEach((stateKey: string, index: number) => {
			if (stateKey === key) {
				this.#states[index] = isTrue;
			}
		});

    if (typeof this.#context[key] !== "undefined") {
      this.#context[key] = isTrue;
      return "";
    }
    return key;
  }

  #keyDownHandler(event : KeyboardEvent) {

    const key = this.#setKeyContext(event, true);

    if (key !== null && typeof this.#actions[key] !== "undefined") {

      this.#context.ctrl = event.ctrlKey;
      this.#context.shift = event.shiftKey;
      this.#context.alt = event.altKey;

      let match = false;
      for (let i = 0; i < this.#actions[key].length && !match; i++) {
        let isMatch = true;
        const keyContext = this.#actions[key][i].context;
        for (let j = 0; j < keyContext.length && isMatch; j++) {
          isMatch = this.#context[keyContext[j]] || this.#contextModeStates[keyContext[j]];
        };
        match = isMatch;
        if (isMatch) {
          return this.#handleEvent(event, this.#actions[key][i].action);
        }
      }
    }
    return true;
  }

  #handleEvent(event: KeyboardEvent, action: number) {
    event.preventDefault();
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    if (this.#active) {
      this.#active = false;
      this.#context.ctrl = false;
      this.#context.shift = false;
      this.#context.alt = false;
      this.#actionHandler(action, () => { this.#active = true });
    }
    return false;
  }

  #keyUpHandler(event : KeyboardEvent) {
    this.#setKeyContext(event, false);
  }

  run(turnOn: boolean) {
    if (turnOn) {
      if (!this.#isRunning) {
        document.body.addEventListener("keydown", this.#keyDownHandler);
        document.body.addEventListener("keyup", this.#keyUpHandler);
        this.#isRunning = true;
      }
    } else if (this.#isRunning) {
      document.body.removeEventListener("keydown", this.#keyDownHandler);
      document.body.removeEventListener("keyup", this.#keyUpHandler);
      this.#isRunning = false;
    }
  }

  getState(state: string) {
    return this.#states[state];
  }

  setContext(key: string, on: boolean) {
    if (typeof this.#contextModeStates[key] == "undefined") {
      throw this.#keyHandlerError("Unexpected context: " + this.#context, key) as KeyHandlerError;
    } else {
      this.#contextModeStates[key] = on;
    }
    this.#active = true;
  }

  setContextModes(newModes: string) {
    const modes = newModes.split(".");
    this.#contextModes = [];
    this.#contextModeStates = {};
    modes.forEach((mode: string) => {
      const isTrue = mode.substring(0, 1) === "+";
      mode = mode.replace("+", "");
      this.#contextModes.push(mode);
      this.#contextModeStates[mode] = isTrue;
    });
  }
};

const KeyHandler = new KeyHandlerService();


class ActionMapper {

	#actions: {[key: string]: ActionHandler } = {};

	registerActions(newActions: {[index: string]: string}) {
		Object.keys(newActions).forEach((action, key: number) => {
			this.#actions[key] = action;
		});
	}

	exec(actionKey: number, onComplete: ActionHandler) {
			this.#actions[actionKey](onComplete);
	}
	
}

export {ActionMapper, KeyHandler}
