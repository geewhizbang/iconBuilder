
      import type { 
        AccordionChildMap,
        AccordionData,
        AccordionConfig,
        AccordionPanelChange,
        AccordionPanelData,
        AccordionPanelConfigKeys,
        
      } from '@/types/global';

      class AccordionServiceInstance {
        #childMap: AccordionChildMap;
        #accordionDatas: { [key: string]: AccordionData };
        #accordionPanelDatas: { [key: string]: AccordionPanelData }
        #accordionNameIndex: number;
        
        constructor() {
          this.#childMap = {};
          this.#accordionDatas = {};
          this.#accordionPanelDatas = {};
          this.#accordionNameIndex = 0;
        }

        registerParent(config: AccordionConfig, isVert: boolean, allOpen: boolean, parentRef: HTMLElement) : string {
          
          const parentName = "accordion" + this.#accordionNameIndex++;
          this.#accordionDatas[parentName] = {
            config: config,
            props: {
              isVert: isVert,
              allOpen: allOpen
            },
            parentRef: parentRef,
            childCount: 0,
          } 
          return parentName;
        }

        getParentProps(childName: string) {
          return this.#accordionDatas[this.#childMap[childName]].props;
        }

        registerChild(childName: string, changeHandler: AccordionPanelChange, headerRef: HTMLElement) : string {
          
          let foundParent = "";
          
          const keys = Object.keys(this.#accordionDatas)
          for (let i=0; i < keys.length && foundParent == ""; i++) {
            const key = keys[i];
            const childKeys = Object.keys(this.#accordionDatas[key].config);
            if (childKeys.indexOf(childName) > -1) {
              foundParent = key;
              this.#accordionDatas[key].childCount++;
              this.#childMap[childName] = key;
              this.#accordionPanelDatas[childName] = {
                changeHandler: changeHandler,
                headerRef: headerRef,
              };
              const data = this.#accordionDatas[key];
              if (data.childCount == Object.keys(data.config).length) {
                this.resize(foundParent);
              }
            } else {
              console.log("AccordionService could not find parent for: " + childName);
            }
          }
          return foundParent;
        }

        resize(parentKey: string) {
          const data = this.#accordionDatas[parentKey];
    
          let height = 0;
          Object.keys(data.config).forEach(key => {
            const element = this.#accordionPanelDatas[key].headerRef;
            height += element.getBoundingClientRect().height;
            const style = window.getComputedStyle(element)
            height += (parseFloat(style.marginTop) + parseFloat(style.marginBottom));
            height += (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
          });
          
          Object.keys(data.config).forEach(childName => {
            const childConfig = data.config[childName];
            const element = this.#accordionPanelDatas[childName].headerRef;
            const childHeight = (childConfig.disabled ||  !childConfig.open) ? "0" :
              data.props.allOpen ? "auto" : 
                (data.parentRef.getBoundingClientRect().height - height +
                 element.getBoundingClientRect().height + "px");
            
            this.#accordionPanelDatas[childName].changeHandler(childConfig.open, childConfig.disabled, childHeight);
          });
        }

        getData(parentName: string) : AccordionData {
          return this.#accordionDatas[parentName];
        }

        changeChildConfig(childName : string, property: AccordionPanelConfigKeys, value: boolean) : void {
          const parentName = this.#childMap[childName];
          const data = this.#accordionDatas[parentName];
          const config = data.config;
          const props = data.props;
          if (!props.allOpen && property == "open" && value) {
            Object.keys(config).forEach( (x) => {
              if (x == childName) {
                config[x].open = true;
              } else {
                config[x].open = false;
              }
            });
          } else {
            config[childName].open = value;
          }
          this.resize(parentName);
        }

        clear(parentName: string) {
          const childKeys = Object.keys(this.#accordionDatas[parentName]);
          childKeys.forEach(childKey => {
            delete this.#childMap[childKey];
            delete this.#accordionPanelDatas[childKey];
          });
          
          delete this.#accordionDatas[parentName];

        }
      }

      export const AccordionService = new AccordionServiceInstance();


