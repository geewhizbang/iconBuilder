getOverlay(): string {
    console.log(this.wheel.d);
    const result: Array<string> = [];
    let x = this.wheel.d;
    let mode = "init";
    const svgPairs: Array<svgXY> = []
    let svgPair = {before: "", x: "", between: "", y: "", after: ""} as svgXY;
    for (let i=0; i < x.length; i++) {
    console.log("mode:" + mode);
    let char = x.substring(i, i+1);
    if (('0123456789.').indexOf(char) > -1) {
        if (mode !== "x" && mode !=="y") {
        switch (mode) {
            case "b4":
            svgPair.x = char;
            mode = "x";
            break;
            case "between":
            svgPair.y = char;
            mode = "y";
            break;
            case "after":
            svgPair = {before: "", x: char, between: "", y: "", after: ""} as svgXY;
            svgPairs.push(svgPair);
            mode = "x";
            break;
            default: 
            console.log("Unexpected mode A:" + mode);
            break;
        }
        } else {
        switch (mode) {
            case "x":
            svgPair.x += char;
            break;
            case "y":
            svgPair.y += char;
            break;
            default: 
            console.log("Unexpected mode B:" + mode);
            break;
        }
        }
    } else {
        if (mode !== "x" && mode !=="y") {
        switch (mode) {
            case "b4": 
            svgPair.before += char;
            break;
            case "after":
            svgPair.after += char;
            break;
            case "between":
            svgPair.between += char;
            break;
            case "init":
            svgPair = {before: char, x: "", between: "", y: "", after: ""} as svgXY;
            svgPairs.push(svgPair);
            mode = "b4";
            break;
            default: 
            console.log("Unexpected mode C:" + mode);
            break;
        }
        } else {
        switch (mode) {
            case "y":
            svgPair.after = char;
            mode="after";
            break;
            case "x":
            svgPair.between = char;
            mode="between"
            break;
            default: 
            console.log("Unexpected mode D:" + mode);
            break;
        }
        }
    }
    console.log(JSON.stringify(svgPair, null, '  '))
    }

    let scale = 400 / 283;
    svgPairs.forEach(pair => {
    result.push(pair.before);
    result.push(Math.round((parseFloat(pair.x) * scale * 100) / 100).toString());
    result.push(pair.between);
    result.push(Math.round((parseFloat(pair.y) * scale * 100) / 100).toString());
    result.push(pair.after);
    })
    console.log(result.join('') + '\n');
    return result.join('');
},

<!-- <div class="hslPicker">
<div class="sliders">
    <ValueScroller
    :model-value="state.currentColor.h"
    v-on:change="change"
    :maxValue="1"
    label="Hue"
    name="h"
    />
    <ValueScroller
    :model-value="state.currentColor.s"
    :maxValue="1"
    v-on:change="change"
    label="Saturation"
    name="s"
    />
    <ValueScroller
    :model-value="state.currentColor.l"
    :maxValue="1"
    label="Lightness"
    v-on:change="change"
    name="l"
    />
</div>
</div> -->