

class HomeAutomationEngine {



    constructor() {

        this.devices = {}
        this.rules = []
        this.history = {}

    }

// add_device()

add_device(device_id, name, type, room) {
        if(this.devices[device_id]){
            throw new Error('device already exist...')
        }

        this.devices[device_id]= {
            device_id, 
            name, 
            type, 
            room,
            current_state : {},
            last_updated  : new Date   
        }

        this.history[device_id] = []
}


// update_device()
update_device(device_id, new_state_dict){
    const device = this.devices[device_id];

    if(!device){
        throw  new Error ('device not found...')
    }

    const oldState = {
        ...device.current_state
    }
    device.current_state = {
        ...device.current_state,
        ...new_state_dict
    }

    device.last_updated = new Date()

    this.history[device_id].push ( {
        last_updated: device.last_updated,
        old_state: oldState,
        new_state:{
            ...device.current_state
        }
    })

}


add_rule(rule) {

   const requiredFields = [
    "rule_id",
    "priority",
    "trigger_device",
    "condition",
    "target_device",
    "action"
];

    for (const field of requiredFields) {
        if (!(field in rule)) {
            throw new Error(`${field} is missing`);
        }
    }

    if (!["on", "off"].includes(rule.condition)) {
    throw new Error(
        "Condition must be on or off"
    );
}

    if (!["on", "off", "set"].includes(rule.action)) {
    throw new Error(
        "Action must be on, off or set"
    );
}

   // Add rule 
   this.rules.push
   ({ 
    ...rule 
    });
}


triggerRules(triggerDeviceId) {

    const device = this.devices[triggerDeviceId];

    if (!device) {
        return;
    }

    // Get current status
    const currentStatus = device.current_state.status;

    console.log("Current status:", currentStatus);

    // Find matching rules
    const matchingRules = this.rules.filter((rule) => {

        return (
            rule.trigger_device === triggerDeviceId &&
            rule.condition === currentStatus
        );

    });

    console.log("Matching rules:", matchingRules);

    if (matchingRules.length === 0) {
        return;
    }

    // Group rules by target device
    const rulesByTarget = {};

    for (const rule of matchingRules) {

        const target = rule.target_device;

        if (!rulesByTarget[target]) {
            rulesByTarget[target] = [];
        }

        rulesByTarget[target].push(rule);
    }

    console.log("Rules by target:", rulesByTarget);

    // Resolve rules
    for (const targetDevice in rulesByTarget) {

        this.resolveRules(
            targetDevice,
            rulesByTarget[targetDevice]
        );
    }
}


resolveRules(targetDevice, rules) {
    // Sort rules from highest priority to lowest
    rules.sort((a, b) => b.priority - a.priority);

    const highestPriority = rules[0].priority;

    // Get all rules having the highest priority
    const highestPriorityRules = rules.filter(
        (rule) => rule.priority === highestPriority
    );

    // Check for conflicting actions
    const actions = new Set(
        highestPriorityRules.map(
            (rule) => rule.action
        )
    );

    // Same priority + different actions
    if (actions.size > 1) {
        console.warn(
            `Conflict for ${targetDevice}: same priority`
        );

        return;
    }

    // Highest priority rule wins
    const winningRule = highestPriorityRules[0];

    this.executeRule(winningRule);
}


executeRule(rule) {
    const targetDevice = this.devices[rule.targetDevice];

    if (!targetDevice) {
        console.warn(
            `Target device ${rule.targetDevice} not found`
        );

        return;
    }

    if (rule.action === "on") {
        targetDevice.current_state.status = "on";
    }

    else if (rule.action === "off") {
        targetDevice.current_state.status = "off";
    }

    else if (rule.action === "set") {
        targetDevice.currentState = {
            ...targetDevice.current_state,
            ...rule.state
        };
    }

    targetDevice.last_updated = new Date();
}




getAllDevices(){

    return Object.values(this.devices);

}

get_device_history(device_id){

    if (!this.devices[device_id]) { 

            throw new Error( `Device ${device_id} not found` ); 
        }
        return this.history[device_id].slice(-10);

}

}

const engine = new HomeAutomationEngine();

engine.add_device("motion1", "Living Motion", "sensor", "Living")
engine.add_device("light1", "Living Light", "light", "Living")
engine.add_device("ac1", "Living AC", "ac", "Living")



// # Rule 1: Motion ON → Light ON (Priority 8)
engine.add_rule({
    "rule_id": "r1", "priority": 8,
    "trigger_device": "motion1", "condition": "on",
    "target_device": "light1", "action": "on"
})

// # Rule 2: Motion ON → Light OFF (Priority 5) → Should be ignored
engine.add_rule({
    "rule_id": "r2", "priority": 5,
    "trigger_device": "motion1", "condition": "on",
    "target_device": "light1", "action": "off"
})


engine.update_device("motion1", {"status": "on"})


console.log("Fretching all device....", engine.getAllDevices())


// Print light history 
console.log( "\nLight History:" ); 
console.log( engine.get_device_history("light1") );