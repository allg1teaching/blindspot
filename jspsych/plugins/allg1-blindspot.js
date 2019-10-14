/* ALLG1 TEACHING ONLINE EXPERIMENTS
 * mapping the blindspot
  * 2019
  */

 jsPsych.plugins["allg1-blindspot"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "allg1-blindspot",
      parameters: {
        x: {
          type: jsPsych.plugins.parameterType.INT, // x grid position of target, relative to target area
          default: undefined
        },
        y: {
          type: jsPsych.plugins.parameterType.INT, // y grid position of target
          default: undefined
        },
        sizeX: {
            type: jsPsych.plugins.parameterType.INT, // grid size in x dimension
            default: undefined
        },
        sizeY: {
            type: jsPsych.plugins.parameterType.INT, // grid size in y dimension
            default: undefined
        },
        trialNumber: {
            type: jsPsych.plugins.parameterType.INT, // current trial
            default: undefined
        },
        totalTrials: {
            type: jsPsych.plugins.parameterType.INT, // total amount of trials
            default: undefined
        }
      }
    }
  
    plugin.trial = function(display_element, trial) {

        var targetX     = trial.x;
        var targetY     = trial.y;
        var gridSizeX   = trial.sizeX;
        var gridSizeY   = trial.sizeY;
        var trialNumber = trial.trialNumber;
        var totalTrials = trial.totalTrials;

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
            targetX:        targetX,
            targetY:        targetY,
            gridSizeX:      gridSizeX,
            gridSizeY:      gridSizeY,
            screenX:        screenW,
            screenY:        screenH,
            targetAreaSize: screenH - 2 * innerMargin
        };

        // create divs to draw stims in
        divs = {}
        // div for fix spot
        var fixLeft = targetOrigX -  (0.3 * cutAway) - (fixSize / 2);
        var fixTop  = (screenH / 2) - (fixSize / 2);
        divs['fix'] = document.createElement("div");
        divs['fix'].style.position = "absolute";
        divs['fix'].style.left = fixLeft + "px";
        divs['fix'].style.top =  fixTop  + "px";
        divs['fix'].setAttribute("class", "centered");
        display_element.appendChild(divs['fix']);
    
        // div for feedback text
        divs['text'] = document.createElement("div");
        divs['text'].style.position = "absolute";
        divs['text'].style.left     = fixLeft - 0.05 * window.innerWidth + "px";
        divs['text'].style.top      = 0.45 * window.innerHeight - textHeight/2 + "px";
        divs['text'].style.height   = textHeight + "px";
        divs['text'].style.width    = 0.1 * window.innerWidth + "px";
        divs['text'].setAttribute("class", "centered");
        display_element.appendChild(divs['text']);        
        
        // div for prgress text
        divs['prog'] = document.createElement("div");
        divs['prog'].style.position = "absolute";
        divs['prog'].style.left     = fixLeft - 0.05 * window.innerWidth + "px";
        divs['prog'].style.top      = 0.55 * window.innerHeight - textHeight/2 + "px";
        divs['prog'].style.height   = textHeight + "px";
        divs['prog'].style.width    = 0.1 * window.innerWidth + "px";
        divs['prog'].setAttribute("class", "centered");
        display_element.appendChild(divs['prog']);
    
        // div for target
        var targLeft = targetOrigX + (targetX * targetRange / gridSizeX);
        var targTop  = targetOrigY + (targetY * targetRange / gridSizeY);
        divs['targ'] = document.createElement("div");
        divs['targ'].style.position = "absolute";
        divs['targ'].style.left = targLeft + "px";
        divs['targ'].style.top = targTop - targSize/2 + "px";
        divs['targ'].setAttribute("class", "centered");
        display_element.appendChild(divs['targ']);


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
                case 78:  // n
                    trialData.responseVisible = 1;
                    drawText('Seen');
                    break;
                case 77:  // m
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
  