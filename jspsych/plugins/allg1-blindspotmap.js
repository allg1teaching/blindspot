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

        divs = [];
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
            divs.push(targDiv);

            switch (responses[i].responseVisible){
                case 1:
                    targDiv.innerHTML = "<img src='jspsych/target_blue.png'></img>";  // draw visible target
                    break;
                case 0:
                    targDiv.innerHTML = "<img src='jspsych/target_black.png'></img>";  // draw non visible target
                    break;
            }
        }

        var dlBut = document.createElement("div");
        dlBut.style.position = "absolute";
        dlBut.style.left     = cutAway / 2 - 0.25 * cutAway + "px";
        dlBut.style.top      = screenH / 2 +  - 0.04 * screenH + "px";
        dlBut.style.width    = 0.5 * cutAway + "px";
        dlBut.style.height   = 0.08 * screenH + "px";


        dlBut.innerHTML = "<input id='clickMe' type='button' value='Download in CSV format' onclick='downloadData();' />";
        display_element.appendChild(dlBut);


        var next = function(){
            for (var i=0; i<responses.length; i++){
                display_element.removeChild(divs[i]);
            }
            jsPsych.finishTrial({});
        }

        jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: next,
            valid_responses: ['space'],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

    };
  
    return plugin;
  })();
  