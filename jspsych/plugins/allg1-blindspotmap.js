/* ALLG1 TEACHING ONLINE EXPERIMENTS
 * mapping the blindspot  --  post-experiment blindspot map
  * 2019
  */

 jsPsych.plugins["allg1-blindspotmap"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "allg1-blindspotmap",
      parameters: {
        sizeX: {
            type: jsPsych.plugins.parameterType.INT, // grid size in x dimension
            default: undefined
        },
        sizeY: {
            type: jsPsych.plugins.parameterType.INT, // grid size in y dimension
            default: undefined
        }
      }
    }
  
    plugin.trial = function(display_element, trial) {

        var gridSizeX   = trial.sizeX;
        var gridSizeY   = trial.sizeY;

        var fixSize        = 10;   // px
        var targSize       = 20;   // px
        var marginFixLeft  = 0.1;  // left margin of fix spot relative to screen width
        var marginTargVert = 0.1;  // vertical margin of targets
        var marginTargLeft = 0.2;  // left margin of targets
        var textHeight     = 20;

        // make sure screen X > screen Y

        var screenW = window.innerWidth;
        var screenH = window.innerHeight;
        // restrict target area to center square - a margin of 5%
        var innerMargin = screenH * 0.05;
        var cutAway     = (screenW - screenH) / 2;      // area that is cut away on left/right margin
        var targetOrigX = cutAway + innerMargin;        // X coordinate of target area origin (top left)
        var targetOrigY = innerMargin;                  // Y coordinate of target area origin (top left)
        var targetRange = (screenH - 2 * innerMargin);  // edge length of square containing targets

        // data saving
        var trialData = {
            targetX:        trial.targetX,
            targetY:        trial.targetY,
            gridSizeX:      gridSizeX,
            gridSizeY:      gridSizeY,
            screenX:        screenW,
            screenY:        screenH,
            targetAreaSize: screenH - 2 * innerMargin
        };

        // create divs to draw stims in
        divs = {}
    
        responses = jsPsych.data.get().filter({trial_type: 'allg1-blindspot'}).values()

        for (var i=0; i<responses.length; i++){
            var targetX = responses[i].targetX;
            var targetY = responses[i].targetY;
            // div for target
            var targLeft = targetOrigX + (targetX * targetRange / gridSizeX);
            var targTop  = targetOrigY + (targetY * targetRange / gridSizeY);
            var targDiv = document.createElement("div");
            targDiv.style.position = "absolute";
            targDiv.style.left = targLeft + "px";
            targDiv.style.top = targTop - targSize/2 + "px";
            targDiv.setAttribute("class", "centered");
            display_element.appendChild(targDiv);

            switch (responses[i].responseVisible){
                case 1:
                    targDiv.innerHTML = "<img src='jspsych/target_blue.png'></img>";  // draw visible target
                    break;
                case 0:
                    targDiv.innerHTML = "<img src='jspsych/target_black.png'></img>";  // draw non visible target
                    break;
            }
        }



        var drawFix = function(color){
            // color: blue/green
            divs['fix'].innerHTML = "<img src='jspsych/fix_"+ color + ".png'></img>";  // draw blue/green fix spot
        }

        var drawTarget = function(){
            divs['targ'].innerHTML = "<img src='jspsych/target.png'></img>";  // draw target
        }

        var drawText = function(text){
            divs['text'].innerHTML = text;
        }

        var drawProg = function(){
            divs['prog'].innerHTML = trialNumber + "/" + totalTrials;
        }

        var endTrial = function(){
            display_element.removeChild(divs['fix']);
            display_element.removeChild(divs['targ']);
            display_element.removeChild(divs['text']);
            display_element.removeChild(divs['prog']);

            jsPsych.finishTrial(trialData);
        }

        var response = function(info){
            drawFix('blue');
            drawProg();
            switch (info.key){
                case 77:  // m
                    trialData.responseVisible = 1;
                    drawText('Seen');
                    break;
                case 78:  // n
                    trialData.responseVisible = 0;
                    drawText('Not seen');
                    break;
            }
            
            jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: endTrial,
                valid_responses: ['space'],
                rt_method: 'performance',
                persist: false,
                allow_held_key: false
            });
        }

        drawFix('green');
        drawTarget();

        jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: response,
            valid_responses: ['n', 'm'],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

    };
  
    return plugin;
  })();
  